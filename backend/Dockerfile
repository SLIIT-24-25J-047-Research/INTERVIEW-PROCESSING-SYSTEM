# Base image
FROM node:18

#  working directory
WORKDIR /app

# Install ffmpeg 
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*



# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
