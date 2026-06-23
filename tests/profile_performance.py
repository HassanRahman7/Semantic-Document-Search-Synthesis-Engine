import os
import time
import pytest
from fastapi.testclient import TestClient
from app.main import app

# We want to measure real performance, so we don't mock unless there's no API key
has_gemini_key = bool(os.getenv("GEMINI_API_KEY"))

def test_performance_benchmarks():
    """Profiles the system latency for upload processing and query synthesis to ensure performance targets are met."""
    client = TestClient(app)
    
    # 1. Profile Upload Processing
    # Use the test PDF if it exists, otherwise generate a dummy byte stream
    test_pdf_path = "Backend_dev_certificate.pdf"
    if os.path.exists(test_pdf_path):
        with open(test_pdf_path, "rb") as f:
            file_data = f.read()
    else:
        file_data = b"%PDF-1.4 mock content " * 1000  # Generate mock PDF structure
    
    print("\n=== PERFORMANCE PROFILE ===")
    
    start_time = time.time()
    response = client.post(
        "/api/v1/documents/upload",
        files={"file": ("profile_target.pdf", file_data, "application/pdf")}
    )
    upload_latency = time.time() - start_time
    
    assert response.status_code == 201
    doc_id = response.json()["document_id"]
    
    print(f"Upload Processing Latency: {upload_latency:.4f} seconds (Target: < 30s)")
    assert upload_latency < 30.0, f"Upload processing took too long: {upload_latency:.2f}s"
    
    # 2. Profile Similarity Search
    start_time = time.time()
    search_response = client.post(
        "/api/v1/documents/search",
        json={"query": "development certificate", "document_id": doc_id}
    )
    search_latency = time.time() - start_time
    
    assert search_response.status_code == 200
    print(f"Similarity Search Latency: {search_latency:.4f} seconds")
    
    # 3. Profile RAG Query Synthesis
    # If no real GEMINI_API_KEY is configured, the call might fail or take extra time, so we check
    if not has_gemini_key:
        print("Skipping real RAG Query Synthesis profiling (No GEMINI_API_KEY configured in environment).")
    else:
        start_time = time.time()
        query_response = client.post(
            "/api/v1/search/query",
            json={"question": "What is the uploaded document about?", "document_id": doc_id}
        )
        query_latency = time.time() - start_time
        
        assert query_response.status_code == 200
        print(f"RAG Query Latency: {query_latency:.4f} seconds (Target: < 5s)")
        # Note: LLM network response latency can vary depending on Google API, but core target is < 5s.
        assert query_latency < 5.0, f"Query synthesis took too long: {query_latency:.2f}s"

    # Cleanup the profile document to leave system clean
    delete_response = client.delete(f"/api/v1/documents/{doc_id}")
    assert delete_response.status_code == 200
    print("Cleanup successful. Performance profiling complete.\n")

if __name__ == "__main__":
    test_performance_benchmarks()
