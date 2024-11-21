import React, { useEffect, useState } from 'react';
import axios from 'axios';


const AnswerQuestions = () => {
    interface Question {
        _id: string;
        text: string;
    }

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [uploadedAudio, setUploadedAudio] = useState<File | null>(null); // For uploaded audio
    const [inputText, setInputText] = useState(''); // For sending text

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/questions/random');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        }
    };

    // Start recording audio
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);

            recorder.ondataavailable = (event) => {
                setAudioBlob(event.data); // Save the recorded audio blob
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    // Stop recording audio
    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop(); // Stop the recording, triggering `ondataavailable`
            setIsRecording(false);
        }
    };

    // Handle the file upload input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('audio')) {
            setUploadedAudio(file);
            setAudioBlob(null); // Reset recorded audio if file is uploaded
        }
    };
    

// Send either recorded or uploaded audio to backend
const handleNextQuestion = async () => {
    const audioToSend = uploadedAudio || audioBlob; // Prefer uploaded audio if available
    if (audioToSend) {
        const formData = new FormData();
        formData.append('audio', audioToSend, `answer_${currentQuestionIndex}.wav`);
        formData.append('questionId', questions[currentQuestionIndex]._id);

        try {
            const response = await axios.post('http://localhost:5000/api/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const response2 = await axios.post('http://localhost:5000/api/audio/audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if ( response.status ! == 200 || response2.status !== 200) {
                throw new Error('Failed to send audio');
            }
        } catch (error) {
            console.error('Error sending audio to backend:', error);
        }

        setUploadedAudio(null); // Reset after sending
        setAudioBlob(null);     // Reset recorded audio
    }

    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
};

// Send text input to backend
const handleSendText = async () => {
    if (inputText) {
        const formData = new FormData();
        formData.append('text', inputText); // Send text data to the same API
        formData.append('questionId', questions[currentQuestionIndex]._id);

        try {
            const response = await axios.post('http://localhost:5000/api/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status !== 200) {
                throw new Error('Failed to send text');
            }
        } catch (error) {
            console.error('Error sending text to backend:', error);
        }

        setInputText(''); // Reset text input after sending
    }
};

    return (
        <div>
            <h1>Answer Questions</h1>
            {questions.length > 0 ? (
                <div>
                    <h2>{questions[currentQuestionIndex].text}</h2>

                    {/* Audio Recording Section */}
                    <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
                    <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
                    
                    {/* Audio File Upload Section */}
                    {/* <input 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleFileChange} 
                    /> */}
                    <button 
                        onClick={handleNextQuestion} 
                        disabled={!audioBlob && !uploadedAudio}
                    >
                        Next Question
                    </button>
                    
                    {/* Text Input Section */}
                    {/* <div>
                        <input 
                            type="text" 
                            value={inputText} 
                            onChange={(e) => setInputText(e.target.value)} 
                            placeholder="Type your answer..." 
                        />
                        <button onClick={handleSendText}>Send Text</button>
                    </div> */}
                </div>
            ) : (
                <p>Loading questions...</p>
            )}
        </div>
    );
};

export default AnswerQuestions;
