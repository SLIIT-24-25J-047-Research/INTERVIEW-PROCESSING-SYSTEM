import os
import numpy as np
import tensorflow as tf
import cv2
from flask import Flask, request, jsonify
from tensorflow.keras.preprocessing import image
from PIL import Image

# Initialize Flask app
app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('./models/my_model.h5')

# Define the function to preprocess the image for the model
def preprocess_image(img):
    # Resize the image to match the model's input dimensions (48x48)
    img = img.resize((48, 48))  
    # Convert to grayscale (if the model expects a single channel)
    img = np.array(img.convert('L'))  
    # Normalize pixel values between 0 and 1
    img = img / 255.0  
    # Reshape to match the model's input (batch size, height, width, channels)
    img = np.reshape(img, (1, 48, 48, 1))  
    return img

# Map of emotions based on your dataset
emotions = ['Sad', 'Disgust', 'Fear', 'Happy', 'Surprise', 'Angry', 'Neutral']

# Define stress detection based on the emotions
def get_stress_level(prediction):
    # Print raw prediction output for debugging
    print(f"Raw prediction scores: {prediction}")
    
    # Get the index of the highest probability
    predicted_index = np.argmax(prediction)
    emotion = emotions[predicted_index]  # Get the emotion corresponding to the highest score
    confidence = prediction[0][predicted_index]  # Confidence of the prediction

    # Debugging: Print the predicted emotion and confidence
    print(f"Predicted emotion: {emotion} with confidence: {confidence}")

    # Check if confidence is below threshold
    if confidence < 0.01:
        return "Uncertain", emotion  # If the confidence is too low, return uncertain

    # Stress detection logic
    stress_emotions = ['Angry', 'Fear']  # Emotions considered as stress indicators
    no_stress = ['Happy', 'Neutral']  # Emotions considered as no-stress indicators

    if emotion in stress_emotions:
        return "Stress Detected", emotion  # Stress detected
    elif emotion in no_stress:
        return "No Stress Detected", emotion  # No stress detected
    else:
        return "Normal", emotion  # Other emotions are considered normal

# Simple route for testing the server
@app.route('/')
def home():
    return "Flask app is running and ready for stress detection!"

# Route to predict stress based on an uploaded image
@app.route('/predict', methods=['POST'])
def predict():
    # Check if the file is provided in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Open the uploaded image and preprocess it
    img = Image.open(file.stream)
    img = preprocess_image(img)

    # Predict the emotion using the trained model
    prediction = model.predict(img)
    
    # Get the stress level based on the predicted emotion
    stress_level, emotion = get_stress_level(prediction)
    
    # Return the stress level and emotion in JSON format
    return jsonify({'stress_level': stress_level, 'emotion': emotion})

# Route to capture an image from the webcam and predict stress
@app.route('/capture', methods=['GET'])
def capture_and_predict():
    # Initialize webcam
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        return jsonify({'error': 'Could not open webcam'})

    # Capture a frame from the webcam
    ret, frame = cap.read()
    if not ret:
        return jsonify({'error': 'Failed to capture image'})

    # Process the captured frame
    img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    img = preprocess_image(img)

    # Predict the emotion from the webcam frame
    prediction = model.predict(img)
    
    # Get the stress level based on the predicted emotion
    stress_level, emotion = get_stress_level(prediction)

    # Release the webcam
    cap.release()
    
    # Return the stress level and emotion in JSON format
    return jsonify({'stress_level': stress_level, 'emotion': emotion})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
