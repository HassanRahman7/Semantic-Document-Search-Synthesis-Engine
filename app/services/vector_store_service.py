import os
import logging
from typing import List
from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from app.services.embedding_service import EmbeddingService

load_dotenv()

logger = logging.getLogger(__name__)

class VectorStoreService:
    _vector_store: Chroma = None

    @classmethod
    def get_vector_store(cls) -> Chroma:
        """Initializes and returns the local Chroma database wrapper.
        Uses a class-level singleton cache to preserve connection.
        """
        if cls._vector_store is None:
            persist_dir = os.getenv("CHROMA_DB_DIR", "chroma_db")
            logger.info(f"Connecting to ChromaDB at directory: {persist_dir}")
            try:
                embeddings = EmbeddingService.get_embeddings()
                cls._vector_store = Chroma(
                    persist_directory=persist_dir,
                    embedding_function=embeddings,
                    collection_name="documents"
                )
                logger.info("ChromaDB connection initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize ChromaDB: {str(e)}", exc_info=True)
                raise RuntimeError(f"Error connecting to ChromaDB: {str(e)}")
        return cls._vector_store

    @classmethod
    def add_documents(cls, documents: List[Document]) -> None:
        """Adds a list of LangChain document chunks (with metadata) to the vector store.

        Args:
            documents: List of chunk Document objects.
        """
        if not documents:
            logger.warning("No documents provided to add to ChromaDB.")
            return

        doc_id = documents[0].metadata.get("document_id", "unknown")
        logger.info(f"Adding {len(documents)} chunks to ChromaDB for document: {doc_id}")
        
        try:
            vector_store = cls.get_vector_store()
            vector_store.add_documents(documents)
            
            # Explicit persist call if supported in the installed version of langchain-community
            if hasattr(vector_store, "persist"):
                vector_store.persist()
                
            logger.info(f"Successfully added and persisted {len(documents)} chunks to ChromaDB.")
        except Exception as e:
            logger.error(f"Failed to add chunks to ChromaDB: {str(e)}", exc_info=True)
            raise RuntimeError(f"Error saving to vector store: {str(e)}")

    @classmethod
    def delete_document(cls, document_id: str) -> None:
        """Deletes all vector embeddings and chunks associated with a specific document ID.

        Args:
            document_id: UUID of the document to delete.
        """
        logger.info(f"Request to delete document chunks from ChromaDB: {document_id}")
        try:
            vector_store = cls.get_vector_store()
            # Access the underlying collection directly to perform metadata filtering delete
            collection = vector_store._collection
            collection.delete(where={"document_id": document_id})
            
            if hasattr(vector_store, "persist"):
                vector_store.persist()
                
            logger.info(f"Successfully deleted all chunks for document {document_id} from ChromaDB.")
        except Exception as e:
            logger.error(f"Failed to delete document {document_id} from ChromaDB: {str(e)}", exc_info=True)
            raise RuntimeError(f"Error deleting from vector store: {str(e)}")
