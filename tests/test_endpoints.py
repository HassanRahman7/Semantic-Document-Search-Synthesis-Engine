import pytest
from unittest.mock import MagicMock, patch

def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "running"}

@patch("app.services.pdf_service.PyPDFLoader")
def test_document_management_lifecycle(mock_loader_class, client):
    # Setup mock pdf loader to return 1 page
    mock_loader = MagicMock()
    mock_doc = MagicMock(page_content="FastAPI is a modern web framework for Python.", metadata={"page": 0})
    mock_loader.load.return_value = [mock_doc]
    mock_loader_class.return_value = mock_loader

    # 1. List documents (initially empty in in-memory test DB)
    response = client.get("/api/v1/documents")
    assert response.status_code == 200
    assert len(response.json()["documents"]) == 0

    # 2. Upload document
    pdf_content = b"%PDF-1.4 mock content"
    response = client.post(
        "/api/v1/documents/upload",
        files={"file": ("framework_docs.pdf", pdf_content, "application/pdf")}
    )
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["status"] == "success"
    doc_id = res_data["document_id"]
    assert doc_id is not None

    # 3. List documents after upload
    response = client.get("/api/v1/documents")
    assert response.status_code == 200
    docs = response.json()["documents"]
    assert len(docs) == 1
    assert docs[0]["document_id"] == doc_id
    assert docs[0]["file_name"] == "framework_docs.pdf"
    assert docs[0]["status"] == "indexed"

    # 4. Get specific document metadata
    response = client.get(f"/api/v1/documents/{doc_id}")
    assert response.status_code == 200
    metadata = response.json()
    assert metadata["document_id"] == doc_id
    assert metadata["file_name"] == "framework_docs.pdf"
    assert metadata["total_pages"] == 1

    # Get non-existent document ID -> 404
    response = client.get("/api/v1/documents/non-existent-uuid")
    assert response.status_code == 404

    # 5. Semantic Search
    response = client.post(
        "/api/v1/documents/search",
        json={"query": "framework", "document_id": doc_id}
    )
    assert response.status_code == 200
    search_results = response.json()["results"]
    assert len(search_results) > 0
    assert "FastAPI" in search_results[0]["content"]

    # 6. RAG Query
    response = client.post(
        "/api/v1/search/query",
        json={"question": "What is FastAPI?", "document_id": doc_id}
    )
    assert response.status_code == 200
    query_res = response.json()
    assert "answer" in query_res
    assert "sources" in query_res
    assert len(query_res["sources"]) == 1
    assert query_res["sources"][0]["file"] == "framework_docs.pdf"

    # 7. Delete document
    response = client.delete(f"/api/v1/documents/{doc_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # Verify deletion side-effects
    response = client.get("/api/v1/documents")
    assert len(response.json()["documents"]) == 0

    response = client.get(f"/api/v1/documents/{doc_id}")
    assert response.status_code == 404

    response = client.post(
        "/api/v1/documents/search",
        json={"query": "framework", "document_id": doc_id}
    )
    assert len(response.json()["results"]) == 0
