import os
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from torchvision import models, transforms
import io
import requests  # To send the result to Node.js

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Define device and load the model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the trained model
model_path = './model/final_trained_model.pth'
model = models.resnet18(weights=None)  # My model is initiating to learning architecture from this ResNet18 architecture
model.fc = torch.nn.Linear(model.fc.in_features, 4)  # Adjust for 4 classes
model.load_state_dict(torch.load(model_path, map_location=device, weights_only=True))
model = model.to(device)
model.eval()

# Define class names
class_names = ["clean_casual", "clean_formal", "messy_casual", "messy_formal"]

# Define image transformations (same as in training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Prediction function
def predict_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))  # Load image from bytes
    image = transform(image).unsqueeze(0).to(device)  # Apply transformation and add batch dimension
    with torch.no_grad():
        outputs = model(image)
        _, predicted = torch.max(outputs, 1)  # Get the predicted class
    return class_names[predicted.item()]

# Create route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        image_bytes = file.read()  # Read the file content as bytes
        prediction = predict_image(image_bytes)  # Get prediction
        
        # Send the result to the Node.js backend (assuming API expects prediction and email)
        user_email = request.form.get("email")
        if user_email:
            response = requests.post(
                'http://localhost:5000/api/savePrediction',  # Adjust the URL to your Node.js server
                json={'prediction': prediction, 'email': user_email}
            )
            if response.status_code == 200:
                return jsonify({"prediction": prediction, "status": "Prediction saved"})
            else:
                return jsonify({"error": "Failed to save prediction in database"}), 500
        else:
            return jsonify({"error": "Email is required"}), 400
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
