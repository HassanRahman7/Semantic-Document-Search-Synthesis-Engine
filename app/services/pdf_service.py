import logging
from typing import List
from sqlalchemy.orm import Session
from langchain_community.document_loaders import PyPDFLoader
from app.storage.db_models import DBDocument, DBPage

# Configure logging
logger = logging.getLogger(__name__)

class PDFService:
    @staticmethod
    def extract_pages(file_path: str) -> List[dict]:
        """Loads a PDF file and extracts text page by page.

        Args:
            file_path: Absolute path to the PDF file.

        Returns:
            A list of dicts, each containing 'page_number' and 'content'.
        """
        logger.info(f"Starting text extraction for file: {file_path}")
        try:
            loader = PyPDFLoader(file_path)
            docs = loader.load()
            
            extracted = []
            for doc in docs:
                # LangChain page metadata is 0-indexed, we convert it to 1-indexed
                page_num = doc.metadata.get("page", 0) + 1
                extracted.append({
                    "page_number": page_num,
                    "content": doc.page_content.strip()
                })
            
            logger.info(f"Successfully extracted {len(extracted)} pages from: {file_path}")
            return extracted
        except Exception as e:
            logger.error(f"Failed to extract pages from PDF: {str(e)}", exc_info=True)
            raise ValueError(f"Error parsing PDF file: {str(e)}")

    @classmethod
    def process_pdf(
        cls, db: Session, file_path: str, file_name: str, file_size: int
    ) -> DBDocument:
        """Processes a PDF file, saves its metadata and extracted pages in SQLite.

        Args:
            db: Database session.
            file_path: Local path where the file is stored.
            file_name: Original name of the file.
            file_size: Size of the file in bytes.

        Returns:
            The created DBDocument database object.
        """
        logger.info(f"Registering document metadata: {file_name}")
        
        # 1. Create document record with 'processing' status
        db_doc = DBDocument(
            file_name=file_name,
            file_path=file_path,
            file_size=file_size,
            status="processing"
        )
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)
        
        try:
            # 2. Extract text page-by-page
            pages_data = cls.extract_pages(file_path)
            
            # 3. Create page records
            db_pages = []
            for p in pages_data:
                db_page = DBPage(
                    document_id=db_doc.document_id,
                    page_number=p["page_number"],
                    content=p["content"]
                )
                db_pages.append(db_page)
                
            db.bulk_save_objects(db_pages)
            
            # 4. Update document metadata with status 'indexed'
            db_doc.total_pages = len(pages_data)
            db_doc.status = "indexed"
            db.commit()
            db.refresh(db_doc)
            
            logger.info(f"Document {db_doc.document_id} processed and indexed successfully.")
            return db_doc
            
        except Exception as e:
            # Update status to failed
            logger.error(f"Processing failed for document {db_doc.document_id}: {str(e)}")
            db_doc.status = "failed"
            db.commit()
            raise e
