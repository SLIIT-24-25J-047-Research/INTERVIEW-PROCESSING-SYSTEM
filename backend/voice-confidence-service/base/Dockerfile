FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install the necessary Python dependencies (but not Whisper)
RUN pip install --no-cache-dir \
    torch \
    numpy \
    librosa

# Keep the base image lightweight and reusable
