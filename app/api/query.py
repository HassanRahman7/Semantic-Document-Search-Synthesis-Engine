import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, field_validator
from app.services.rag_service import RAGService

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/search", tags=["query"])

# Request validation schema
class QueryRequest(BaseModel):
    question: str = Field(..., description="The query question string")
    document_id: Optional[str] = Field(None, description="Optional document UUID filter")

    @field_validator("question")
    @classmethod
    def validate_question(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Question cannot be empty")
        if len(stripped) <= 2:
            raise ValueError("Question length must be > 2 characters")
        return stripped

# Response validation schemas
class Citation(BaseModel):
    file: str = Field(..., description="Source PDF filename")
    page: int = Field(..., description="Source page number (1-indexed)")

class QueryResponse(BaseModel):
    answer: str = Field(..., description="Synthesized answer text from Gemini")
    sources: List[Citation] = Field(..., description="List of source file citations used for context")


@router.post("/query", response_model=QueryResponse, status_code=status.HTTP_200_OK)
def query_documents(request: QueryRequest) -> dict:
    """Answers a user question based on semantic search retrieval and Gemini 2.5 Flash synthesis.

    Args:
        request: Validated query payload.

    Returns:
        QueryResponse containing answer text and page citations.
    """
    logger.info(f"Received query request: '{request.question}'")
    
    try:
        result = RAGService.generate_answer(
            question=request.question,
            document_id=request.document_id
        )
        return result
    except ValueError as ve:
        # Configuration issues or invalid input parameters
        logger.warning(f"Validation or configuration warning: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Query API synthesis execution failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred synthesizing answer: {str(e)}"
        )
