from fastapi import FastAPI

app = FastAPI(title="Semantic Document Search & Synthesis Engine", version="1.0")

@app.get("/api/health")
def health_check() -> dict:
    """Health check endpoint to verify server is running."""
    return {"status": "running"}
