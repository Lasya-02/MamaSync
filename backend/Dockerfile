# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system deps (optional but common)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install first (for better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
