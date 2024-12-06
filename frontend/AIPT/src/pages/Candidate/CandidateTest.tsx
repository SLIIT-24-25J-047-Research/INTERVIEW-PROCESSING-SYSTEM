import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Candidate/CandidateSidebar";
import Header from "../../components/Candidate/CandidateHeader";
import "../../components/Candidate/candidateLayout.css";
import CodeEditor from "../../components/Candidate/CodeEditor";

const CandidateTest: React.FC = () => {
  const questions = [
    "Question 1: Solve the following problem...",
    "Question 2: Implement the given algorithm...",
    "Question 3: Debug the code snippet below...",
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [submittedStatus, setSubmittedStatus] = useState<boolean[]>(Array(questions.length).fill(false));
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserId(user.id || "6738cd63339fff5ad4245b97"); // Replace with actual user ID
  }, []);

  const handleCodeChange = (code: string | undefined) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = code || "";
    setAnswers(updatedAnswers);
  };

  const handleNavigateToQuestion = (index: number) => {
    // Update submission status for the current question if something has been typed
    if (answers[currentQuestionIndex].trim()) {
      const updatedStatus = [...submittedStatus];
      updatedStatus[currentQuestionIndex] = true;
      setSubmittedStatus(updatedStatus);
    }
    // Navigate to the selected question
    setCurrentQuestionIndex(index);
  };

  const handleFinalSubmission = async () => {
    const unansweredQuestions = submittedStatus.filter((status) => !status).length;

    if (unansweredQuestions > 0) {
      const confirm = window.confirm(
        `You have ${unansweredQuestions} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirm) return;
    }

    try {
      const responses = await Promise.all(
        answers.map((answer, index) => {
          const questionId = "67380880f1637de88de029e9"; // Replace with actual question ID mapping
          const requestData = {
            userId,
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
        alert("All answers have been submitted successfully!");
        setAnswers(Array(questions.length).fill(""));
        setCurrentQuestionIndex(0);
      } else {
        alert("Some answers could not be submitted.");
      }
    } catch (error) {
      console.error("Error submitting all answers:", error);
      alert("An error occurred while submitting all answers.");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header title="Assignments" />
        <div className="content">
          <h2>Test 01</h2>
          <div className="test-layout">
            {/* Question Navigation Bar */}
            <div className="question-navigation">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`question-nav-button ${
                    currentQuestionIndex === index ? "active" : ""
                  } ${submittedStatus[index] ? "submitted" : ""}`}
                  onClick={() => handleNavigateToQuestion(index)}
                >
                  Q{index + 1}
                </button>
              ))}

              {/* Submit All Answers Button */}
              <button
                className="submit-all-button"
                onClick={handleFinalSubmission}
              >
                Submit All Answers
              </button>
            </div>

            {/* Code Editor Section */}
            <div className="code-editor-container">
              <p>{questions[currentQuestionIndex]}</p>
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
  );
};

export default CandidateTest;
