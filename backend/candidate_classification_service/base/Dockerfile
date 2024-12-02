# Use the slim Python image as the base
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Install necessary system packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies that are common for the service
RUN pip install --no-cache-dir \
    torch \
    torchvision \
    Pillow
