# prebuilt base image with large dependencies
FROM python-base:latest

# working directory
WORKDIR /app

# Install ffmpeg and required system packages
RUN apt-get update && apt-get install -y ffmpeg libsndfile1 && rm -rf /var/lib/apt/lists/*

# Create the uploads directory
RUN mkdir -p /app/uploads

# Copy only the requirements.txt first to leverage Docker's cache
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code (excluding models first to leverage cache)
COPY . .

# Copy the models directory into the container
COPY models /app/models


EXPOSE 3000


CMD ["python", "app.py"]
