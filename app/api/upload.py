import os
import uuid
import logging
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from app.storage.database import get_db
from app.services.pdf_service import PDFService

load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/documents", tags=["documents"])

# Load file size limits from .env (default to 50MB)
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", 50))
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

        # 4. Save file locally in 'uploads' directory
        uploads_dir = "uploads"
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
