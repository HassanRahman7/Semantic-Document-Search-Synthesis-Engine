import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.services.vector_store_service import VectorStoreService

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/documents", tags=["search"])

# Request validation schema
class SearchRequest(BaseModel):
    query: str = Field(..., description="Semantic search query string")
    document_id: Optional[str] = Field(None, description="Optional document UUID filter")
    top_k: Optional[int] = Field(5, ge=1, le=20, description="Max number of items to return")

# Response validation schemas
class ChunkMetadata(BaseModel):
    document_id: str = Field(..., description="Document ID of the parent file")
    source: str = Field(..., description="Original filename of the parent file")
    page: int = Field(..., description="Page number of the original file (1-indexed)")

class SearchResult(BaseModel):
    chunk_id: str = Field(..., description="Unique hash identifier for the chunk")
    content: str = Field(..., description="Extracted text chunk content")
    score: float = Field(..., description="Distance similarity score (lower indicates closer match)")
    metadata: ChunkMetadata = Field(..., description="Chunk source citation metadata")

class SearchResponse(BaseModel):
    results: List[SearchResult] = Field(..., description="List of matching text chunks")


@router.post("/search", response_model=SearchResponse, status_code=status.HTTP_200_OK)
def search_documents(request: SearchRequest) -> dict:
    """Retrieves document chunks matching the query using semantic search.

    Args:
        request: The validated search payload.

    Returns:
        SearchResponse listing the matching chunks and relevance scores.
    """
    logger.info(f"Received search request for query: '{request.query}'")
    
    try:
        results = VectorStoreService.search(
            query=request.query,
            document_id=request.document_id,
            top_k=request.top_k
        )
        return {"results": results}
    except Exception as e:
        logger.error(f"Search API execution failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred executing semantic search: {str(e)}"
        )
