import React, { useEffect, useState } from "react";
import axios from "axios";

const NonTechInterview = () => {
  interface Question {
    _id: string;
    text: string;
  }

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/questions/random");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        setAudioBlob(event.data);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleNextQuestion = async () => {
    const audioToSend = uploadedAudio || audioBlob;
    if (audioToSend) {
      // Create FormData for both requests
      const confidenceFormData = new FormData();
      const transcribeFormData = new FormData();
      
      // Append the same audio file to both FormData objects
      confidenceFormData.append("audio", audioToSend, `answer_${currentQuestionIndex}.wav`);
      confidenceFormData.append("questionId", questions[currentQuestionIndex]._id);
      
      transcribeFormData.append("audio", audioToSend, `answer_${currentQuestionIndex}.wav`);
      transcribeFormData.append("questionId", questions[currentQuestionIndex]._id);
  
      try {
        // Make both API calls concurrently using Promise.all
        const [confidenceResponse, transcribeResponse] = await Promise.all([
          axios.post("http://localhost:5000/api/predict", confidenceFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          axios.post("http://localhost:5000/api/audio/audio", transcribeFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        ]);
  
        // Handle the responses
        console.log("Confidence Response:", confidenceResponse.data);
        console.log("Transcribe Response:", transcribeResponse.data);
  
        // Clear the audio states
        setUploadedAudio(null);
        setAudioBlob(null);
  
        // You might want to store the responses in state
        // setConfidenceResult(confidenceResponse.data);
        // setTranscribeResult(transcribeResponse.data);
  
      } catch (error) {
        console.error("Error processing audio:", error);
        // You might want to show an error message to the user
        // setError("Failed to process audio. Please try again.");
      }
    }
  
    // Move to next question if not at the end
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="flex flex-col items-center font-sans mt-8 p-5">
      <h1 className="text-2xl font-bold mb-6">Answer Questions</h1>
      {questions.length > 0 ? (
        <div className="w-4/5 max-w-2xl bg-gray-100 rounded-lg p-5 shadow-lg text-center">
          <p className="text-2xl text-gray-700 mb-5">
            {questions[currentQuestionIndex].text}
          </p>
          <div className="flex justify-center gap-4 mb-4">
            <button
              className={`px-5 py-2.5 text-base rounded-md ${
                isRecording
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              onClick={startRecording}
              disabled={isRecording}
            >
              Start Recording
            </button>
            <button
              className={`px-5 py-2.5 text-base rounded-md ${
                !isRecording
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
              onClick={stopRecording}
              disabled={!isRecording}
            >
              Stop Recording
            </button>
          </div>
          <button
            className={`px-5 py-2.5 text-base rounded-md ${
              !audioBlob && !uploadedAudio
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            onClick={handleNextQuestion}
            disabled={!audioBlob && !uploadedAudio}
          >
            Next Question
          </button>
        </div>
      ) : (
        <p className="text-xl text-gray-600">Loading questions...</p>
      )}
    </div>
  );
};

export default NonTechInterview;
