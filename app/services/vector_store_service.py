import logging
import hashlib
from typing import List, Optional
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from app.services.embedding_service import EmbeddingService
from app.core.config import settings

logger = logging.getLogger(__name__)

class VectorStoreService:
    _vector_store: Chroma = None

    @classmethod
    def get_vector_store(cls) -> Chroma:
        """Initializes and returns the local Chroma database wrapper.
        Uses a class-level singleton cache to preserve connection.
        """
        if cls._vector_store is None:
            persist_dir = settings.CHROMA_DB_DIR
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

    @classmethod
    def search(
        cls, query: str, document_id: Optional[str] = None, top_k: int = 5
    ) -> List[dict]:
        """Performs semantic similarity search in ChromaDB with optional document_id filtering.

        Args:
            query: The text query to search for.
            document_id: Optional UUID to search exclusively in.
            top_k: Number of matching chunks to retrieve.

        Returns:
            A list of dictionary results matching the SearchResponse schema.
        """
        logger.info(f"Initiating search: query='{query}', document_id={document_id}, top_k={top_k}")
        try:
            vector_store = cls.get_vector_store()

            search_filter = None
            if document_id:
                search_filter = {"document_id": document_id}

            # Executing similarity search with score
            results_with_scores = vector_store.similarity_search_with_score(
                query,
                k=top_k,
                filter=search_filter
            )

            formatted_results = []
            for doc, score in results_with_scores:
                # Retrieve document ID from langchain doc if available, or generate from metadata
                chunk_id = getattr(doc, "id", None)
                if not chunk_id:
                    # Fallback to MD5 hash of chunk content to maintain schema consistency
                    chunk_id = hashlib.md5(doc.page_content.encode("utf-8")).hexdigest()

                formatted_results.append({
                    "chunk_id": chunk_id,
                    "content": doc.page_content,
                    "score": float(score),
                    "metadata": {
                        "document_id": doc.metadata.get("document_id"),
                        "source": doc.metadata.get("source"),
                        "page": int(doc.metadata.get("page", 1))
                    }
                })

            logger.info(f"Search successfully retrieved {len(formatted_results)} matching chunks.")
            return formatted_results

        except Exception as e:
            logger.error(f"Search query execution failed: {str(e)}", exc_info=True)
            raise e

