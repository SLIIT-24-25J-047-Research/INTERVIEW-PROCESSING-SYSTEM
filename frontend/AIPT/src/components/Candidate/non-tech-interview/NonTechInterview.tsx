import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, ChevronRight, Loader2, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

interface Question {
  _id: string;
  skillGroupId: string;
  text: string;
  answers: string[];
  createdAt: string;
  __v: number;
}

const QUESTION_TIMEOUT = 60; // 60 seconds per question

function App() {
  const [searchParams] = useSearchParams();
  const interviewId = searchParams.get("id");
  const [recording, setRecording] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMEOUT);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/questions/random');
      const data = await response.json();
      setQuestions(data);
      startQuestionTimer();
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startQuestionTimer = () => {
    setTimeLeft(QUESTION_TIMEOUT);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return QUESTION_TIMEOUT;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = async () => {
    if (recording) {
      stopRecording();
    }
    
    // Send "no answer provided" response
    try {
      const noAnswerFormData = new FormData();
      noAnswerFormData.append("questionId", questions[currentQuestionIndex]._id);
      noAnswerFormData.append("noAnswer", "true");
      
      await Promise.all([
        axios.post("http://localhost:5000/api/predict", noAnswerFormData),
        axios.post("http://localhost:5000/api/audio/audio", noAnswerFormData)
      ]);
    } catch (error) {
      console.error("Error sending no-answer response:", error);
    }

    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAudioBlob(null);
      startQuestionTimer();
    } else {
      completeInterview();
    }
  };

  const completeInterview = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsInterviewComplete(true);
    
    try {
      await axios.post(`http://localhost:5000/api/non-t-interviews/update-status/${interviewId}`, {
        status: 'completed'
      });
    } catch (error) {
      console.error('Error updating interview status:', error);
    }
  };

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
        await Promise.all([
          axios.post("http://localhost:5000/api/predict", confidenceFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          axios.post("http://localhost:5000/api/audio/audio", transcribeFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        ]);
      } catch (error) {
        console.error("Error processing audio:", error);
      } finally {
        setProcessing(false);
        moveToNextQuestion();
      }
    } else {
      moveToNextQuestion();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isInterviewComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full mx-4">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Interview Complete
          </h1>
          <p className="text-center text-gray-600">
            Thank you for completing the interview. Your responses have been recorded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Technical Interview
          </h1>
          <p className="text-lg text-gray-600">
            Please answer the questions clearly into your microphone
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 relative">
          <div className="absolute top-4 right-4 flex items-center space-x-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className={`font-mono ${timeLeft <= 10 ? 'text-red-500 font-bold' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

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
                  <div className="mt-4 space-y-2">
                    {currentQuestion.answers.map((answer, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {answer}
                      </div>
                    ))}
                  </div>
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
            disabled={loading || recording || processing}
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

        <div className="mt-8 flex justify-between items-center text-sm text-gray-500">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          {timeLeft <= 10 && (
            <span className="flex items-center text-red-500">
              <AlertCircle className="w-4 h-4 mr-1" />
              Time running out!
            </span>
          )}
          {audioBlob && !recording && !processing && (
            <span className="text-green-600">Answer recorded - ready to proceed</span>
          )}
        </div>

        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Speak clearly and take your time to answer each question thoroughly</p>
          <p className="mt-2">You have {QUESTION_TIMEOUT} seconds per question</p>
        </div>
      </div>
    </div>
  );
}

export default App;