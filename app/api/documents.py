import os
import uuid
import logging
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from app.storage.database import get_db
from app.storage.db_models import DBDocument
from app.services.pdf_service import PDFService
from app.services.vector_store_service import VectorStoreService
from app.core.config import settings

# Pydantic schemas for document management responses
class DocumentResponse(BaseModel):
    document_id: str
    file_name: str
    file_path: str
    file_size: int
    total_pages: Optional[int] = None
    uploaded_at: datetime
    status: str

    class Config:
        from_attributes = True

class DocumentListResponse(BaseModel):
    documents: List[DocumentResponse]

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/documents", tags=["documents"])

# Load file size limits from settings
MAX_FILE_SIZE_MB = settings.MAX_FILE_SIZE_MB
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...), db: Session = Depends(get_db)
) -> dict:
    """Uploads a PDF document, validates it, and triggers text extraction.

    Args:
        file: The uploaded PDF file.
        db: Database session.

    Returns:
        JSON response with the document ID and processing status.
    """
    logger.info(f"Received upload request for file: {file.filename}")

    # 1. Validate file presence
    if not file or not file.filename:
        logger.warning("Upload request missing file")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file uploaded."
        )

    # 2. Validate file extension (must be PDF)
    filename = file.filename
    if not filename.lower().endswith(".pdf"):
        logger.warning(f"Invalid file extension uploaded: {filename}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    try:
        # 3. Validate file size (avoiding loading entire file into memory)
        file.file.seek(0, 2)  # Seek to the end of the file
        file_size = file.file.tell()
        file.file.seek(0)  # Reset cursor to the beginning

        if file_size == 0:
            logger.warning(f"Empty file uploaded: {filename}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty."
            )

        if file_size > MAX_FILE_SIZE_BYTES:
            logger.warning(f"File size {file_size} bytes exceeds limit of {MAX_FILE_SIZE_BYTES} bytes")
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_MB}MB."
            )

        # 4. Save file locally in configured uploads directory
        uploads_dir = settings.UPLOADS_DIR
        os.makedirs(uploads_dir, exist_ok=True)
        
        # Generate a unique filename to prevent collisions
        unique_id = str(uuid.uuid4())
        safe_filename = f"{unique_id}_{filename}"
        file_path = os.path.join(uploads_dir, safe_filename)

        logger.info(f"Saving uploaded file to: {file_path}")
        with open(file_path, "wb") as f:
            while content := await file.read(1024 * 1024):  # Read in 1MB chunks
                f.write(content)

        # 5. Extract text and populate SQLite database
        logger.info(f"Initiating PDF processing for: {filename}")
        db_doc = PDFService.process_pdf(
            db=db,
            file_path=file_path,
            file_name=filename,
            file_size=file_size
        )

        return {
            "status": "success",
            "document_id": db_doc.document_id,
            "message": "Document indexed successfully"
        }

    except HTTPException as he:
        # Re-raise HTTP exceptions directly
        raise he
    except Exception as e:
        logger.error(f"Error occurred during upload and indexing of {filename}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing the PDF: {str(e)}"
        )

@router.get("", response_model=DocumentListResponse)
def list_documents(db: Session = Depends(get_db)) -> DocumentListResponse:
    """Lists all uploaded documents and their status.

    Args:
        db: Database session.

    Returns:
        JSON object containing a list of document metadata.
    """
    logger.info("Retrieving all documents from the metadata database")
    try:
        documents = db.query(DBDocument).order_by(DBDocument.uploaded_at.desc()).all()
        return DocumentListResponse(documents=documents)
    except Exception as e:
        logger.error(f"Failed to list documents: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve documents: {str(e)}"
        )

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document_metadata(document_id: str, db: Session = Depends(get_db)) -> DocumentResponse:
    """Retrieves metadata details for a specific document ID.

    Args:
        document_id: UUID of the document.
        db: Database session.

    Returns:
        JSON document metadata details.
    """
    logger.info(f"Retrieving metadata details for document: {document_id}")
    db_doc = db.query(DBDocument).filter(DBDocument.document_id == document_id).first()
    if not db_doc:
        logger.warning(f"Document {document_id} not found in database")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )
    return db_doc

@router.delete("/{document_id}")
def delete_document(document_id: str, db: Session = Depends(get_db)) -> dict:
    """Deletes a document's database metadata, database pages, ChromaDB vector chunks, and local uploaded file.

    Args:
        document_id: UUID of the document to delete.
        db: Database session.

    Returns:
        Confirmation status response.
    """
    logger.info(f"Initiating full deletion sequence for document: {document_id}")
    
    # 1. Query document in SQLite
    db_doc = db.query(DBDocument).filter(DBDocument.document_id == document_id).first()
    if not db_doc:
        logger.warning(f"Deletion failed: Document {document_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    file_path = db_doc.file_path

    # 2. Delete local PDF file if it exists
    if file_path:
        try:
            if os.path.exists(file_path):
                logger.info(f"Removing local file: {file_path}")
                os.remove(file_path)
            else:
                logger.warning(f"Local file not found on disk at: {file_path}. Proceeding with database cleanup.")
        except Exception as e:
            logger.error(f"Failed to remove local file {file_path}: {str(e)}", exc_info=True)
            # Proceeding anyway to keep DB and vector store clean

    # 3. Delete vector embeddings from ChromaDB
    try:
        logger.info(f"Removing vector chunks from ChromaDB for document: {document_id}")
        VectorStoreService.delete_document(document_id)
    except Exception as e:
        logger.error(f"Failed to remove vector chunks from ChromaDB: {str(e)}", exc_info=True)
        # Proceeding to ensure SQLite state can be cleaned up

    # 4. Delete document metadata record from SQLite (pages will cascade delete)
    try:
        logger.info(f"Removing document metadata record from SQLite: {document_id}")
        db.delete(db_doc)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to delete database metadata record: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete document from database: {str(e)}"
        )

    logger.info(f"Document {document_id} deletion sequence completed successfully.")
    return {
        "status": "success",
        "message": "Document deleted successfully"
    }
