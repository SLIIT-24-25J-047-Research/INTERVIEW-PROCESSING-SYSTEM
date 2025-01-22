import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Candidate/CandidateSidebar";
import Header from "../../../components/Candidate/CandidateHeader";
import CodeEditor from "../../../components/Candidate/CodeEditor";
import { Timer } from "lucide-react";

interface InterviewState {
  interviewId: string;
  testLink: string;
  duration: number;
}

const CandidateTest: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewId, testLink, duration } = (location.state as InterviewState) || {};

  // Keep the existing questions structure
  const questions = [
    "Question 1: Solve the following problem...",
    "Question 2: Implement the given algorithm...",
    "Question 3: Debug the code snippet below...",
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [submittedStatus, setSubmittedStatus] = useState<boolean[]>(Array(questions.length).fill(false));
  const [userId, setUserId] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Initialize user ID and timer
  useEffect(() => {
    // Check if we have interview data
    if (!interviewId || !testLink || !duration) {
      navigate('/scheduled-interviews');
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserId(user.id || "6738cd63339fff5ad4245b97");
    setTimeRemaining(duration * 60); // Convert duration to seconds
  }, [interviewId, testLink, duration, navigate]);

  // Timer functionality
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmission(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (code: string | undefined) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = code || "";
    setAnswers(updatedAnswers);
  };

  const handleNavigateToQuestion = (index: number) => {
    if (answers[currentQuestionIndex].trim()) {
      const updatedStatus = [...submittedStatus];
      updatedStatus[currentQuestionIndex] = true;
      setSubmittedStatus(updatedStatus);
    }
    setCurrentQuestionIndex(index);
  };

  const handleFinalSubmission = async (isAutoSubmit: boolean = false) => {
    const unansweredQuestions = submittedStatus.filter((status) => !status).length;

    if (!isAutoSubmit && unansweredQuestions > 0) {
      const confirm = window.confirm(
        `You have ${unansweredQuestions} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirm) return;
    }

    try {
      const responses = await Promise.all(
        answers.map((answer, index) => {
          const questionId = "67380880f1637de88de029e9"; // Using the existing questionId
          const requestData = {
            userId,
            interviewId, // Add the interview ID to the submission
            questionId,
            code: answer,
            language: "JavaScript",
          };

          console.log("Request data for submission:", requestData);

          return fetch("http://localhost:5000/api/CodeSubmissions/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(requestData),
          });
        })
      );

      const allSuccessful = responses.every((response) => response.ok);
      if (allSuccessful) {
        // Update interview status
        await fetch(`http://localhost:5000/api/t-interviews/complete/${interviewId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        alert(isAutoSubmit ? "Time's up! Your answers have been submitted." : "All answers have been submitted successfully!");
        navigate('/scheduled-interviews');
      } else {
        alert("Some answers could not be submitted.");
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("An error occurred while submitting answers.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header title="Technical Assessment" />
        <div className="p-6 mt-28">
          {/* Timer Display */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Test 01</h2>
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded">
              <Timer className="h-5 w-5" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
              {timeRemaining <= 300 && (
                <span className="text-red-600 font-medium ml-2">
                  Less than {Math.ceil(timeRemaining / 60)} minutes remaining!
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-6 mt-6">
            {/* Question Navigation Bar */}
            <div className="w-1/5 flex flex-col gap-4">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 text-sm font-medium rounded border transition-colors ${
                    currentQuestionIndex === index
                      ? "bg-blue-500 text-white border-blue-500"
                      : submittedStatus[index]
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => handleNavigateToQuestion(index)}
                >
                  Q{index + 1}
                </button>
              ))}

              <button
                className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
                onClick={() => handleFinalSubmission(false)}
              >
                Submit All Answers
              </button>
            </div>

            {/* Code Editor Section */}
            <div className="flex-1 flex flex-col gap-4">
              <p className="text-lg font-medium">{questions[currentQuestionIndex]}</p>
              <div className="relative w-full h-[60vh] border rounded shadow bg-gray-800">
                <CodeEditor
                  key={currentQuestionIndex}
                  onCodeChange={handleCodeChange}
                  initialCode={answers[currentQuestionIndex]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateTest;