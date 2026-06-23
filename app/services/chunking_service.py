import logging
from typing import Any, List
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings

logger = logging.getLogger(__name__)

class ChunkingService:
    @staticmethod
    def split_pages(db_pages: List[Any], file_name: str) -> List[Document]:
        """Converts database page objects to LangChain Documents and splits them into chunks.

        Args:
            db_pages: List of DBPage database instances.
            file_name: Original file name (to include in chunk metadata).

        Returns:
            A list of split Document objects with metadata attached.
        """
        # Load parameters from central settings
        chunk_size = settings.CHUNK_SIZE
        chunk_overlap = settings.CHUNK_OVERLAP

        logger.info(f"Starting chunking for {file_name} (pages: {len(db_pages)}, chunk_size: {chunk_size}, overlap: {chunk_overlap})")

        # 1. Map SQLite DBPage records to LangChain Document format
        documents = []
        for page in db_pages:
            doc = Document(
                page_content=page.content,
                metadata={
                    "document_id": page.document_id,
                    "source": file_name,
                    "page": page.page_number
                }
            )
            documents.append(doc)

        # 2. Perform text splitting
        try:
            splitter = RecursiveCharacterTextSplitter(
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
                length_function=len,
                is_separator_regex=False
            )
            
            chunks = splitter.split_documents(documents)
            logger.info(f"Successfully generated {len(chunks)} chunks from {file_name}.")
            return chunks
        except Exception as e:
            logger.error(f"Error during chunking process: {str(e)}", exc_info=True)
            raise RuntimeError(f"Text chunking failed: {str(e)}")
