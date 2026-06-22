import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship
from app.storage.database import Base

class DBDocument(Base):
    __tablename__ = "documents"

    # We store the UUID as a string of length 36
    document_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(1024), nullable=False)
    file_size = Column(Integer, nullable=False)
    total_pages = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime, default=func.now(), nullable=False)
    status = Column(String(50), default="uploaded", nullable=False)

    # Relationship to access pages belonging to this document
    pages = relationship("DBPage", back_populates="document", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<DBDocument(id={self.document_id}, name={self.file_name}, status={self.status})>"

class DBPage(Base):
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(String(36), ForeignKey("documents.document_id", ondelete="CASCADE"), nullable=False)
    page_number = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)

    # Relationship to link back to the document
    document = relationship("DBDocument", back_populates="pages")

    def __repr__(self) -> str:
        return f"<DBPage(doc_id={self.document_id}, page={self.page_number})>"
