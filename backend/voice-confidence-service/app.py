
# venv\Scripts\activate
from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import librosa
import numpy as np
import os
import whisper  # For speech-to-text transcription

from transformers import (
    AutoTokenizer, 
    AutoModel,
    T5Tokenizer, 
    T5ForConditionalGeneration
)
from difflib import SequenceMatcher
import torch
import spacy
from sentence_transformers import SentenceTransformer
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

app = Flask(__name__)

# Load the trained model
# model = joblib.load(r'/app/models/confidence_model.pkl')
model = joblib.load('D:\\personel\\3y2s\\4Y\\INTERVIEW-PROCESSING-SYSTEM\\backend\\voice-confidence-service\\models\\confidence_model.pkl')

# D:\personel\3y2s\4Y\INTERVIEW-PROCESSING-SYSTEM\backend\voice-confidence-service\models\confidence_model.pkl

# Whisper model
whisper_model = whisper.load_model("tiny")
print("Whisper model loaded successfully!")
print("Model loaded successfully in VS Code!")

sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
nlp = spacy.load('en_core_web_lg')

# Load T5 model for paraphrase generation
t5_tokenizer = T5Tokenizer.from_pretrained('t5-base')
t5_model = T5ForConditionalGeneration.from_pretrained('t5-base')

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


def preprocess_text(text):
    """
    Preprocess text by removing stopwords, lemmatizing, and cleaning
    """
    # Tokenize
    tokens = word_tokenize(text.lower())
    
    # Remove stopwords and lemmatize
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    
    processed_tokens = [
        lemmatizer.lemmatize(token) 
        for token in tokens 
        if token not in stop_words and token.isalnum()
    ]
    
    return ' '.join(processed_tokens)

def generate_paraphrases(text, num_paraphrases=3):
    """
    Generate paraphrases of the input text using T5
    """
    input_text = f"paraphrase: {text}"
    input_ids = t5_tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
    
    paraphrases = []
    for _ in range(num_paraphrases):
        outputs = t5_model.generate(
            input_ids,
            max_length=512,
            num_return_sequences=1,
            num_beams=5,
            temperature=0.7,
            do_sample=True
        )
        paraphrase = t5_tokenizer.decode(outputs[0], skip_special_tokens=True)
        paraphrases.append(paraphrase)
    
    return paraphrases

def get_semantic_similarity(text1, text2):
    """
    Get semantic similarity using multiple methods
    """
    # SpaCy similarity
    doc1 = nlp(text1)
    doc2 = nlp(text2)
    spacy_similarity = doc1.similarity(doc2)
    
    # Sentence-BERT similarity
    embeddings1 = sentence_model.encode([text1])
    embeddings2 = sentence_model.encode([text2])
    sbert_similarity = cosine_similarity(embeddings1, embeddings2)[0][0]
    
    # Combine similarities with weights
    combined_similarity = (spacy_similarity * 0.4 + sbert_similarity * 0.6)
    
    return combined_similarity

def extract_key_information(text):
    """
    Extract key information using SpaCy
    """
    doc = nlp(text)
    
    # Extract named entities
    entities = [ent.text for ent in doc.ents]
    
    # Extract main noun phrases
    noun_phrases = [chunk.text for chunk in doc.noun_chunks]
    
    # Extract main verbs
    main_verbs = [token.lemma_ for token in doc if token.pos_ == "VERB"]
    
    return {
        'entities': entities,
        'noun_phrases': noun_phrases,
        'main_verbs': main_verbs
    }
    
    
    

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



def compare_answers(candidate_answer, actual_answers):
    """
    Enhanced answer comparison using multiple techniques
    """
    # Preprocess answers
    processed_candidate = preprocess_text(candidate_answer)
    processed_actuals = [preprocess_text(answer) for answer in actual_answers]
    
    # Generate paraphrases for candidate answer
    candidate_paraphrases = generate_paraphrases(candidate_answer)
    
    # Calculate similarities for original and paraphrased answers
    max_similarity = 0
    best_match_info = None
    
    # Compare with original and paraphrased versions
    all_candidate_versions = [processed_candidate] + candidate_paraphrases
    
    for actual_answer in processed_actuals:
        for candidate_version in all_candidate_versions:
            # Get semantic similarity
            similarity = float(get_semantic_similarity(candidate_version, actual_answer))
            
            # Extract and compare key information
            candidate_info = extract_key_information(candidate_version)
            actual_info = extract_key_information(actual_answer)
            
            # Calculate information overlap
            entity_overlap = len(set(candidate_info['entities']) & set(actual_info['entities']))
            noun_overlap = len(set(candidate_info['noun_phrases']) & set(actual_info['noun_phrases']))
            verb_overlap = len(set(candidate_info['main_verbs']) & set(actual_info['main_verbs']))
            
            # Calculate weighted information score
            info_score = float(
                (entity_overlap * 0.4 +
                noun_overlap * 0.3 +
                verb_overlap * 0.3
            ) / (
                max(len(candidate_info['entities'] + actual_info['entities']), 1)
            ))
            
            # Combine semantic similarity with information score
            combined_score = float(similarity * 0.7 + info_score * 0.3)
            
            if combined_score > max_similarity:
                max_similarity = combined_score
                best_match_info = {
                    'semantic_similarity': float(similarity),
                    'info_score': float(info_score),
                    'combined_score': float(combined_score),
                    'key_matches': {
                        'entities': list(set(candidate_info['entities']) & set(actual_info['entities'])),
                        'noun_phrases': list(set(candidate_info['noun_phrases']) & set(actual_info['noun_phrases'])),
                        'main_verbs': list(set(candidate_info['main_verbs']) & set(actual_info['main_verbs']))
                    }
                }
    
    # Define thresholds for different confidence levels
    high_threshold = 0.85
    medium_threshold = 0.70
    
    # Determine confidence level and correctness
    if max_similarity >= high_threshold:
        confidence = "high"
        is_correct = True
    elif max_similarity >= medium_threshold:
        confidence = "medium"
        is_correct = True
    else:
        confidence = "low"
        is_correct = False
    
    return {
        'is_correct': is_correct,
        'confidence': confidence,
        'similarity_score': float(max_similarity),
        'match_details': best_match_info,
        'feedback': generate_feedback(best_match_info) if best_match_info else "Unable to analyze answer"
    }

def generate_feedback(match_info):
    """
    Generate detailed feedback based on the matching results
    """
    feedback = []
    
    if match_info['semantic_similarity'] >= 0.85:
        feedback.append("The answer demonstrates excellent understanding of the concept.")
    elif match_info['semantic_similarity'] >= 0.70:
        feedback.append("The answer shows good understanding but could be more precise.")
    else:
        feedback.append("The answer may need improvement in terms of accuracy and completeness.")
    
    if match_info['key_matches']['entities']:
        feedback.append(f"Correctly mentioned key terms: {', '.join(match_info['key_matches']['entities'][:3])}")
    
    if match_info['info_score'] < 0.5:
        feedback.append("Consider including more specific details and key concepts in your answer.")
    
    return " ".join(feedback)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        audio_file_path = os.path.join('uploads', 'audio_file.wav')
        audio_file.save(audio_file_path)

        result = whisper_model.transcribe(audio_file_path, fp16=False)
        transcribed_text = result['text']
        
        os.remove(audio_file_path)
        
        return jsonify({
            'success': True,
            'candidate_answer': transcribed_text
        })

    except Exception as e:
        print(f"Error in /transcribe route: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/compare', methods=['POST'])
def compare():
    try:
        data = request.json
        candidate_answer = data.get('candidate_answer')
        actual_answers = data.get('actual_answer')
        
        if not candidate_answer or not actual_answers:
            return jsonify({'error': 'Missing required fields'}), 400
        
        result = compare_answers(candidate_answer, actual_answers)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
   app.run(host='0.0.0.0', port=3000)
