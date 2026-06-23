import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.documents import router as documents_router
from app.api.search import router as search_router
from app.api.query import router as query_router
from app.storage.database import init_db
from app.core.logging_config import setup_logging

# Configure structured or text-based console logging based on settings
setup_logging()
logger = logging.getLogger("app.main")

# Initialize database tables
logger.info("Initializing SQLite database tables...")
init_db()

# Premium API Description for Swagger & ReDoc
description = """
# Semantic Document Search & Synthesis Engine

An advanced Retrieval-Augmented Generation (RAG) backend supporting semantic document search, local PDF parsing, vector chunk indexing, and context-aware answer synthesis with precise inline citations.

## Features
* **Document Ingestion**: Upload, index, and list local PDF files.
* **Semantic Retrieval**: Execute top-k similarity searches on indexed document text chunks.
* **Context Synthesis**: Get synthesized answers from Gemini with bracketed citations mapping directly to source page numbers.
* **Metadata Store**: SQL database (SQLite) for metadata tracking, page indexing, and cascading document deletions.
"""

app = FastAPI(
    title="Semantic Document Search & Synthesis Engine",
    description=description,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Register routes
app.include_router(documents_router, prefix="/api/v1")
app.include_router(search_router, prefix="/api/v1")
app.include_router(query_router, prefix="/api/v1")

# Centralized Error Handlers

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Catches and formats HTTPExceptions (e.g., 404, 403, 400)."""
    logger.warning(f"HTTP exception occurred: {exc.detail} (Status: {exc.status_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Catches Pydantic validation errors and formats them into a clean client payload."""
    errors = exc.errors()
    logger.warning(f"Validation exception occurred: {errors}")
    # Extract clean human-readable details
    error_msg = "; ".join([f"Field '{'.'.join(str(p) for p in err['loc'])}' - {err['msg']}" for err in errors])
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": f"Validation failed: {error_msg}"}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catches any unhandled application errors, logs the stack trace, and returns a 500 error."""
    logger.error("Unhandled exception occurred inside application route:", exc_info=exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact system support."}
    )

@app.get("/api/health")
def health_check() -> dict:
    """Health check endpoint to verify server is running."""
    return {"status": "running"}
