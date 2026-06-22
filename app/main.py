import logging
from fastapi import FastAPI
from app.api.upload import router as upload_router
from app.api.search import router as search_router
from app.storage.database import init_db

# Configure logging format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize database tables
logger.info("Initializing SQLite database tables...")
init_db()

app = FastAPI(title="Semantic Document Search & Synthesis Engine", version="1.0")

# Register routes
app.include_router(upload_router, prefix="/api/v1")
app.include_router(search_router, prefix="/api/v1")

@app.get("/api/health")
def health_check() -> dict:
    """Health check endpoint to verify server is running."""
    return {"status": "running"}

