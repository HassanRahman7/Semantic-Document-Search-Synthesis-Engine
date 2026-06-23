import os
import shutil
import tempfile
import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup environment variables for testing before importing application modules
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["GEMINI_API_KEY"] = "mock-api-key-for-testing"
os.environ["CHUNK_SIZE"] = "500"
os.environ["CHUNK_OVERLAP"] = "50"

from app.main import app
from app.storage.database import get_db, Base
from app.services.vector_store_service import VectorStoreService

# Create test SQLite engine using a temp file on disk (to survive connection lifetimes)
temp_db_fd, temp_db_path = tempfile.mkstemp(suffix=".db")
# Close file descriptor to allow create_engine to write to it later
os.close(temp_db_fd)

test_engine = create_engine(f"sqlite:///{temp_db_path}", connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="session", autouse=True)
def clean_db_file():
    """Cleans up the temporary database file after the test session completes."""
    yield
    try:
        if os.path.exists(temp_db_path):
            os.remove(temp_db_path)
    except Exception:
        pass

@pytest.fixture(scope="session", autouse=True)
def temp_chroma_dir():
    """Sets up an isolated, temporary ChromaDB persist directory for test session."""
    temp_dir = tempfile.mkdtemp()
    os.environ["CHROMA_DB_DIR"] = temp_dir
    
    # Override settings attributes directly to override values evaluated at import-time
    from app.core.config import settings
    settings.CHROMA_DB_DIR = temp_dir
    settings.DATABASE_URL = f"sqlite:///{temp_db_path}"
    
    # Force singleton reset
    VectorStoreService._vector_store = None
    yield temp_dir
    # Cleanup temp chroma files
    try:
        shutil.rmtree(temp_dir)
    except Exception:
        pass

@pytest.fixture(scope="session", autouse=True)
def clean_uploads():
    """Cleans up any uploads created in the uploads folder during testing."""
    uploads_dir = "uploads"
    initial_files = set()
    if os.path.exists(uploads_dir):
        initial_files = set(os.listdir(uploads_dir))
    
    yield
    
    if os.path.exists(uploads_dir):
        current_files = set(os.listdir(uploads_dir))
        new_files = current_files - initial_files
        for f in new_files:
            file_path = os.path.join(uploads_dir, f)
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception:
                pass

@pytest.fixture(scope="session", autouse=True)
def mock_embeddings():
    """Mocks Hugging Face embeddings to prevent heavy downloads or API hits."""
    with patch("app.services.embedding_service.EmbeddingService.get_embeddings") as mock_get:
        class FakeEmbeddings:
            def embed_documents(self, texts):
                # Return standard mock vector of dimension 384
                return [[0.1] * 384 for _ in texts]
            
            def embed_query(self, text):
                return [0.1] * 384
                
        mock_get.return_value = FakeEmbeddings()
        yield mock_get

@pytest.fixture(scope="session", autouse=True)
def mock_gemini():
    """Mocks Gemini LLM content generation."""
    with patch("google.generativeai.GenerativeModel") as mock_model_class:
        mock_instance = MagicMock()
        mock_response = MagicMock()
        mock_response.text = "This is a synthesized test answer based on context [1]."
        mock_instance.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_instance
        yield mock_model_class

@pytest.fixture(scope="function")
def db_session():
    """Provides a fresh database session for each test function."""
    from app.storage import db_models  # Register models before create_all
    Base.metadata.create_all(bind=test_engine)
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(scope="function", autouse=True)
def clean_chromadb():
    """Clears all vectors in ChromaDB before each test function runs to ensure isolation."""
    try:
        # Reset singleton cache
        VectorStoreService._vector_store = None
        store = VectorStoreService.get_vector_store()
        collection = store._collection
        existing_data = collection.get()
        if existing_data and "ids" in existing_data and existing_data["ids"]:
            collection.delete(ids=existing_data["ids"])
    except Exception as e:
        print(f"Failed to clear ChromaDB: {e}")
    yield

@pytest.fixture(scope="function", autouse=True)
def override_db(db_session):
    """Overrides the get_db dependency in the FastAPI application."""
    def get_db_override():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = get_db_override
    yield
    app.dependency_overrides.pop(get_db, None)

@pytest.fixture(scope="module")
def client():
    """Provides a FastAPI test client."""
    with TestClient(app) as c:
        yield c
