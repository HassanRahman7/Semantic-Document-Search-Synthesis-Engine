import logging
from langchain_huggingface import HuggingFaceEmbeddings
from app.core.config import settings

logger = logging.getLogger(__name__)

class EmbeddingService:
    _embeddings: HuggingFaceEmbeddings = None

    @classmethod
    def get_embeddings(cls) -> HuggingFaceEmbeddings:
        """Loads and returns the local embedding model configured in settings.
        Uses a class-level singleton cache to avoid loading the model weights multiple times.
        """
        if cls._embeddings is None:
            model_name = settings.EMBEDDING_MODEL
            logger.info(f"Loading local embedding model: {model_name}")
            try:
                cls._embeddings = HuggingFaceEmbeddings(
                    model_name=model_name,
                    model_kwargs={"device": "cpu"},  # Force CPU for local simplicity
                    encode_kwargs={"normalize_embeddings": True}
                )
                logger.info(f"Successfully loaded embedding model: {model_name}")
            except Exception as e:
                logger.error(f"Failed to load embedding model {model_name}: {str(e)}", exc_info=True)
                raise RuntimeError(f"Error loading embedding model: {str(e)}")
        return cls._embeddings
