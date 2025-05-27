import os
import numpy as np
import tensorflow as tf
import cv2
from flask import Flask, request, jsonify
from tensorflow.keras.preprocessing import image
from PIL import Image


app = Flask(__name__)
model = tf.keras.models.load_model('./models/my_model.h5')


def preprocess_image(img):
    img = img.resize((48, 48))  
    img = np.array(img.convert('L'))  
    img = img / 255.0  
    img = np.reshape(img, (1, 48, 48, 1))  
    return img

# Map of emotions based on your dataset
emotions = ['Sad', 'Disgust', 'Fear', 'Happy', 'Surprise', 'Angry', 'Neutral']


def get_stress_level(prediction):
    print(f"Raw prediction scores: {prediction}")
    prediction_values = prediction[0]

    predicted_index = np.argmax(prediction_values)
    emotion = emotions[predicted_index]  
    confidence = prediction_values[predicted_index]
    
    print(f"Predicted emotion: {emotion} with confidence: {confidence}")


    if confidence < 0.01:
        return "Uncertain", emotion  

    # Stress detection logic
    stress_emotions = ['Angry', 'Fear']  
    no_stress = ['Happy', 'Neutral']  
    
    if emotion in stress_emotions:
        return "Stress Detected", emotion, prediction_values
    elif emotion in no_stress:
        return "No Stress Detected", emotion, prediction_values
    else:
        return "Normal", emotion, prediction_values

# Simple route for testing the server
@app.route('/')
def home():
    return "Flask app is running and ready for stress detection!"


@app.route('/predict', methods=['POST'])
def predict():
   
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

   
    img = Image.open(file.stream)
    img = preprocess_image(img)
    prediction = model.predict(img)

    stress_level, emotion, prediction_values = get_stress_level(prediction)

    return jsonify({
        'stress_level': stress_level,
        'emotion': emotion,
        'prediction_values': prediction_values.tolist()  # Convert the prediction to a list
    })

@app.route('/capture', methods=['GET'])
def capture_and_predict():

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
    app.run(debug=True, host='0.0.0.0', port=3001)