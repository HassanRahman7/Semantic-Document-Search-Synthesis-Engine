import pytest
from unittest.mock import MagicMock, patch
from langchain_core.documents import Document
from app.storage.db_models import DBPage, DBDocument
from app.services.chunking_service import ChunkingService
from app.services.pdf_service import PDFService
from app.services.vector_store_service import VectorStoreService
from app.services.rag_service import RAGService

def test_chunking_service():
    # Setup mock DBPage instances
    pages = [
        DBPage(document_id="doc-123", page_number=1, content="This is page 1 content. " * 30),
        DBPage(document_id="doc-123", page_number=2, content="This is page 2 content. " * 30),
    ]
    
    chunks = ChunkingService.split_pages(pages, file_name="test.pdf")
    
    assert len(chunks) > 0
    # Check that metadata is correctly preserved
    for chunk in chunks:
        assert chunk.metadata["document_id"] == "doc-123"
        assert chunk.metadata["source"] == "test.pdf"
        assert chunk.metadata["page"] in [1, 2]

@patch("app.services.pdf_service.PyPDFLoader")
def test_pdf_service_extract_pages(mock_loader_class):
    # Mock load method of PyPDFLoader
    mock_loader = MagicMock()
    mock_doc1 = MagicMock(page_content="Content of page 1", metadata={"page": 0})
    mock_doc2 = MagicMock(page_content="Content of page 2", metadata={"page": 1})
    mock_loader.load.return_value = [mock_doc1, mock_doc2]
    mock_loader_class.return_value = mock_loader
    
    extracted = PDFService.extract_pages("dummy_path.pdf")
    
    assert len(extracted) == 2
    assert extracted[0]["page_number"] == 1
    assert extracted[0]["content"] == "Content of page 1"
    assert extracted[1]["page_number"] == 2
    assert extracted[1]["content"] == "Content of page 2"

@patch("app.services.pdf_service.PyPDFLoader")
def test_pdf_service_process_pdf(mock_loader_class, db_session):
    mock_loader = MagicMock()
    mock_doc = MagicMock(page_content="Sample text extracted.", metadata={"page": 0})
    mock_loader.load.return_value = [mock_doc]
    mock_loader_class.return_value = mock_loader
    
    # Process PDF
    db_doc = PDFService.process_pdf(
        db=db_session,
        file_path="dummy.pdf",
        file_name="dummy.pdf",
        file_size=1024
    )
    
    assert db_doc.file_name == "dummy.pdf"
    assert db_doc.status == "indexed"
    assert db_doc.total_pages == 1
    
    # Verify records exist in DB
    saved_doc = db_session.query(DBDocument).filter(DBDocument.document_id == db_doc.document_id).first()
    assert saved_doc is not None
    assert len(saved_doc.pages) == 1
    assert saved_doc.pages[0].content == "Sample text extracted."

def test_vector_store_service():
    # Clear and initialize vector store
    VectorStoreService._vector_store = None
    
    # Add dummy document chunks
    doc1 = Document(
        page_content="Semantic Search systems use embeddings.",
        metadata={"document_id": "doc-abc", "source": "search.pdf", "page": 1}
    )
    doc2 = Document(
        page_content="Recipe for baking apple pie.",
        metadata={"document_id": "doc-xyz", "source": "recipe.pdf", "page": 2}
    )
    
    VectorStoreService.add_documents([doc1, doc2])
    
    # Test general search
    results = VectorStoreService.search(query="embeddings")
    assert len(results) > 0
    # The first result should be the most relevant
    assert "embeddings" in results[0]["content"]
    
    # Test filtered search
    results_filtered = VectorStoreService.search(query="embeddings", document_id="doc-xyz")
    # Should not find the document since document_id doesn't match doc-abc
    assert len(results_filtered) == 1
    assert results_filtered[0]["metadata"]["document_id"] == "doc-xyz"
    
    # Delete document chunks
    VectorStoreService.delete_document("doc-abc")
    
    # Search again with doc-abc filter
    results_after_delete = VectorStoreService.search(query="embeddings", document_id="doc-abc")
    assert len(results_after_delete) == 0

def test_rag_service():
    # Setup mock chunks in vector database
    VectorStoreService._vector_store = None
    doc = Document(
        page_content="Antigravity is a coding assistant made by DeepMind.",
        metadata={"document_id": "doc-deep", "source": "deepmind.pdf", "page": 1}
    )
    VectorStoreService.add_documents([doc])
    
    rag_result = RAGService.generate_answer(question="What is Antigravity?")
    
    assert "answer" in rag_result
    assert "sources" in rag_result
    assert len(rag_result["sources"]) == 1
    assert rag_result["sources"][0]["file"] == "deepmind.pdf"
    assert rag_result["sources"][0]["page"] == 1
    assert "synthesized test answer" in rag_result["answer"]
