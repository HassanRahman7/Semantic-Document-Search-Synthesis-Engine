import json
import logging
import sys
from datetime import datetime
from app.core.config import settings

class JSONFormatter(logging.Formatter):
    """Custom log formatter that outputs logs as structured JSON strings."""
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcfromtimestamp(record.created).isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "file": record.pathname,
            "line": record.lineno
        }
        
        # Include exception tracebacks if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_data)

def setup_logging() -> None:
    """Configures root logger handler with text or JSON formatting based on settings."""
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    
    # Clear existing handlers to prevent duplicate messages
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
        
    # Create console handler directing to stdout
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(log_level)
    
    # Select formatter based on LOG_FORMAT config
    if settings.LOG_FORMAT.lower() == "json":
        formatter = JSONFormatter()
    else:
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        
    handler.setFormatter(formatter)
    root_logger.addHandler(handler)
