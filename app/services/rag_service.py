import os
import logging
from typing import Any, Dict, List, Optional
import google.generativeai as genai
from app.services.vector_store_service import VectorStoreService

logger = logging.getLogger(__name__)

class RAGService:
    _initialized = False

    @classmethod
    def _init_gemini(cls) -> None:
        """Initializes the Gemini API client using the environment variable GEMINI_API_KEY.
        Raises configuration error if the key is missing.
        """
        if not cls._initialized:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                logger.error("GEMINI_API_KEY environment variable is missing.")
                raise ValueError("GEMINI_API_KEY is not configured in environment variables.")
            
            logger.info("Initializing Google Generative AI client.")
            genai.configure(api_key=api_key)
            cls._initialized = True

    @classmethod
    def generate_answer(cls, question: str, document_id: Optional[str] = None) -> Dict[str, Any]:
        """Queries ChromaDB to retrieve relevant context chunks and utilizes Gemini 2.5 Flash to synthesize a citation-aware answer.

        Args:
            question: User question string.
            document_id: Optional UUID to search exclusively in a specific document.

        Returns:
            A dictionary containing the generated "answer" and deduplicated source "sources".
        """
        cls._init_gemini()

        # 1. Retrieve the top 5 matching chunks from the vector database
        logger.info(f"Retrieving context for RAG: question='{question}', document_id={document_id}")
        retrieved_chunks = VectorStoreService.search(query=question, document_id=document_id, top_k=5)

        if not retrieved_chunks:
            logger.info("No matching document chunks found in ChromaDB.")
            return {
                "answer": "No relevant document context was found to answer this question.",
                "sources": []
            }

        # 2. Compile deduplicated citation list first to establish stable array indices
        sources = []
        seen_citations = set()
        for chunk in retrieved_chunks:
            source_file = chunk["metadata"]["source"]
            page_num = chunk["metadata"]["page"]
            citation_key = (source_file, page_num)
            if citation_key not in seen_citations:
                seen_citations.add(citation_key)
                sources.append({
                    "file": source_file,
                    "page": page_num
                })

        # 3. Build context blocks mapped to their 1-based source indices
        context_snippets = []
        for chunk in retrieved_chunks:
            source_file = chunk["metadata"]["source"]
            page_num = chunk["metadata"]["page"]
            content = chunk["content"]

            # Locate index in deduplicated sources list
            source_idx = sources.index({"file": source_file, "page": page_num}) + 1

            context_snippets.append(
                f"Snippet [{source_idx}]:\nSource: {source_file}\nPage: {page_num}\nContent:\n{content}\n---"
            )

        context_str = "\n\n".join(context_snippets)

        # 4. Construct prompt incorporating context constraints and inline index instructions
        prompt = (
            "You are a precise document synthesis assistant. Your task is to answer the user's question "
            "based strictly and ONLY on the provided document snippets. For every claim or fact you state, "
            "you MUST cite the source Snippet index inline using square brackets (e.g. [1], [2], or [1][3]). "
            "Place these citations at the end of the sentence or clause they support. If the snippets do not contain "
            "the answer or if you are unsure, state clearly that you cannot find the answer in the provided documents. "
            "Do not make up facts or extrapolate beyond the provided text.\n\n"
            f"Context Snippets:\n{context_str}\n\n"
            f"Question: {question}\n\n"
            "Answer:"
        )

        # 4. Generate content from Gemini API
        try:
            logger.info("Requesting answer synthesis from gemini-2.5-flash...")
            model = genai.GenerativeModel("gemini-2.5-flash")
            response = model.generate_content(prompt)
            answer_text = response.text.strip()
            
            logger.info("Successfully synthesized RAG answer.")
            return {
                "answer": answer_text,
                "sources": sources
            }
        except Exception as e:
            logger.error(f"Gemini API invocation failed: {str(e)}", exc_info=True)
            raise RuntimeError(f"Error generating answer from Gemini LLM: {str(e)}")
