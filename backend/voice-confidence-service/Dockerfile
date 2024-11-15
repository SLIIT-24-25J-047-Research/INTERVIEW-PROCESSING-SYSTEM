# Use an official Python runtime as a base image
FROM python:3.8-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Copy the models directory into the container
COPY models /app/models

# Expose the port that Flask will run on
EXPOSE 3000

# Command to start Flask server
CMD ["python", "app.py"]
