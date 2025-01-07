# prebuilt base image with large dependencies
FROM python-base:latest

# Working directory
WORKDIR /app

# Install system dependencies for PyTorch
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Create the uploads directory
RUN mkdir -p /app/uploads

# Copy only the requirements.txt to leverage Docker caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application code
COPY . .

# Expose the application port
EXPOSE 3003

# Command to run the Flask app
CMD ["python", "app.py"]
