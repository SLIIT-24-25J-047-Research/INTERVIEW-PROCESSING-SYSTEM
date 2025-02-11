import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Question {
  _id: string;
  skillGroupId: string;
  text: string;
  answers: string[];
  createdAt: string;
  __v: number;
}

function App() {
  const [recording, setRecording] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/questions/random');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleNextQuestion = async () => {
    if (audioBlob) {
      setProcessing(true);
      const confidenceFormData = new FormData();
      const transcribeFormData = new FormData();
      
      confidenceFormData.append("audio", audioBlob, `answer_${currentQuestionIndex}.wav`);
      confidenceFormData.append("questionId", questions[currentQuestionIndex]._id);
      
      transcribeFormData.append("audio", audioBlob, `answer_${currentQuestionIndex}.wav`);
      transcribeFormData.append("questionId", questions[currentQuestionIndex]._id);

      try {
        const [confidenceResponse, transcribeResponse] = await Promise.all([
          axios.post("http://localhost:5000/api/predict", confidenceFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          axios.post("http://localhost:5000/api/audio/audio", transcribeFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        ]);

        console.log("Confidence Response:", confidenceResponse.data);
        console.log("Transcribe Response:", transcribeResponse.data);

        setAudioBlob(null);
      } catch (error) {
        console.error("Error processing audio:", error);
      } finally {
        setProcessing(false);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interview Questions
          </h1>
          <p className="text-lg text-gray-600">
            Please answer the questions clearly into your microphone
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : currentQuestion ? (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">Q</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-medium text-gray-900">
                    {currentQuestion.text}
                  </h2>
                  {/* <div className="mt-4 space-y-2">
                    {currentQuestion.answers.map((answer, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg text-gray-700"
                      >
                        {answer}
                      </div>
                    ))}
                  </div> */}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No questions available</p>
          )}
        </div>

        <div className="flex justify-center space-x-6">
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={loading || processing || !currentQuestion}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              recording
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {recording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
            <span>{recording ? 'Stop Recording' : 'Start Recording'}</span>
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={loading || recording || processing || !audioBlob}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next Question</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {processing && (
          <div className="mt-8 flex items-center justify-center text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Processing your answer...</span>
          </div>
        )}

        <div className="mt-8 flex justify-between text-sm text-gray-500">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          {audioBlob && !recording && !processing && (
            <span className="text-green-600">Answer recorded - ready to proceed</span>
          )}
        </div>

        <h2 className="mt-16 text-center text-gray-500 text-sm ">
          <p>Speak clearly and take your time to answer each question thoroughly</p>
        </h2>
      </div>
    </div>
  );
}

export default App;