
# venv\Scripts\activate

from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import librosa
import numpy as np
import os
import whisper  # For speech-to-text transcription
from transformers import BertTokenizer, BertModel
from difflib import SequenceMatcher
import torch

app = Flask(__name__)

# Load the trained model
model = joblib.load(r'/app/models/confidence_model.pkl')

# Whisper model
whisper_model = whisper.load_model("tiny")
print("Whisper model loaded successfully!")
print("Model loaded successfully in VS Code!")

# BERT model and tokenizer 
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
bert_model  = BertModel.from_pretrained('bert-base-uncased')


def preprocess_audio(file_path):
    audio, sr = librosa.load(file_path, sr=None)
    mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    mfccs_mean = np.mean(mfccs.T, axis=0)
    pitches, magnitudes = librosa.core.piptrack(y=audio, sr=sr)
    pitch_mean = np.mean(pitches[pitches > 0]) if np.any(pitches) else 0
    spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=audio, sr=sr))
    spectral_bandwidth = np.mean(librosa.feature.spectral_bandwidth(y=audio, sr=sr))
    chroma = np.mean(librosa.feature.chroma_stft(y=audio, sr=sr))
    features = np.hstack([mfccs_mean, pitch_mean, spectral_centroid, spectral_bandwidth, chroma])
    expected_feature_count = 19
    while len(features) < expected_feature_count:
        features = np.append(features, 0)
    return features

@app.route('/predict', methods=['POST'])
def predict():
    if 'audio' in request.files:
        audio_file = request.files['audio']
        audio_file.save('temp_audio.wav')  # Save the audio temporarily
        features = preprocess_audio('temp_audio.wav')
        features_reshaped = features.reshape(1, -1)
        predicted_class = model.predict(features_reshaped)
        predicted_label = predicted_class[0]  # Assuming binary classification
        predicted_proba = model.predict_proba(features_reshaped) 
        predicted_confidence = np.max(predicted_proba)
        os.remove('temp_audio.wav')
        
        return jsonify({
            'confidence_level': int(predicted_label),
            'confidence_score': float(predicted_confidence)  #
        })

    elif 'text' in request.json:
        text_message = request.json['text']
        print(f"Received text message: {text_message}")  
        return jsonify({'message': 'Text received successfully', 'received_text': text_message}), 200

    else: 
        return jsonify({'error': 'No audio file or text provided'}), 400

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    try:
        
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        # audio_file_path = 'C:\\Users\\Lenovo\\Downloads\\3y2s\\4Y\\INTERVIEW-PROCESSING-SYSTEM\\backend\\voice-confidence-service\\uploads\\audio_file.wav'
        audio_file_path = os.path.join('/app/uploads', 'audio_file.wav')

        audio_file.save(audio_file_path)

        #check
        if whisper_model is None:
          print("Whisper model not initialized!")
        else:
          print("Whisper model is initialized.")

        candidate_answer = transcribe_audio(audio_file_path)
        if candidate_answer is None:
            return jsonify({'error': 'Transcription failed'}), 500
        os.remove(audio_file_path)
        return jsonify({
            'success': True,
            'candidate_answer': candidate_answer
        })

    except Exception as e:
        print(f"Error in /transcribe route: {str(e)}")
        return jsonify({'error': str(e)}), 500


def transcribe_audio(file_path):
    try:
        if os.path.exists(file_path):
            print(f"File exists: {file_path}")
        else:
            print(f"File not found: {file_path}")


        print(f"Current working directory: {os.getcwd()}")
        print(f"Attempting to transcribe file: {file_path}")
        result = whisper_model.transcribe(file_path, fp16=False)
        return result['text']  
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        return None


def get_embedding(text):
    """
    This function takes a text and returns its BERT embedding.
    """
   
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = bert_model (**inputs)
    last_hidden_states = outputs.last_hidden_state 
    sentence_embedding = last_hidden_states.mean(dim=1).squeeze().numpy() 
    return sentence_embedding

def compare_answers(candidate_answer, actual_answers):
    """
    This function compares the candidate's answer with a list of actual answers
    using BERT-based embeddings and cosine similarity.
    """
    candidate_embedding = get_embedding(candidate_answer)  
    actual_embeddings = np.array([get_embedding(ans) for ans in actual_answers]) 
    similarities = cosine_similarity([candidate_embedding], actual_embeddings)   

    max_similarity = similarities.max()
    is_correct = max_similarity > 0.7  
    return {
        'similarity_scores': similarities.tolist(),  
        'is_correct': bool(is_correct)  
    }

@app.route('/compare', methods=['POST'])
def compare():
    data = request.json
    candidate_answer = data.get('candidate_answer')
    actual_answers = data.get('actual_answer')  #array
    
    result = compare_answers(candidate_answer, actual_answers)
    return jsonify(result)




if __name__ == '__main__':
   app.run(host='0.0.0.0', port=3000)
