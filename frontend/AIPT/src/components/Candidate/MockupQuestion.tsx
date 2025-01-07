import React, { useState } from "react";
import "../../Styles/MockupQuestion.css";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "What is React?",
    options: [
      "React is a JavaScript library for building user interfaces.",
      "React is a CSS framework.",
      "React is a programming language.",
      "React is a database.",
      "React is a backend framework.",
    ],
    correctAnswer: "React is a JavaScript library for building user interfaces.",
  },
  {
    id: 2,
    text: "What are React components?",
    options: [
      "React components are reusable pieces of UI.",
      "React components are database schemas.",
      "React components are stylesheets.",
      "React components are browser APIs.",
      "React components are server-side scripts.",
    ],
    correctAnswer: "React components are reusable pieces of UI.",
  },
  {
    id: 3,
    text: "What is JSX?",
    options: [
      "JSX is a syntax extension for JavaScript.",
      "JSX is a library.",
      "JSX is a backend framework.",
      "JSX is a CSS property.",
      "JSX is a database.",
    ],
    correctAnswer: "JSX is a syntax extension for JavaScript.",
  },
  {
    id: 4,
    text: "What are React hooks?",
    options: [
      "React hooks are functions that let you use state and lifecycle features in function components.",
      "React hooks are database queries.",
      "React hooks are styling methods.",
      "React hooks are JavaScript frameworks.",
      "React hooks are server functions.",
    ],
    correctAnswer:
      "React hooks are functions that let you use state and lifecycle features in function components.",
  },
  {
    id: 5,
    text: "Explain useState in React.",
    options: [
      "useState is a hook that lets you add state to function components.",
      "useState is a CSS property.",
      "useState is a JavaScript library.",
      "useState is a method for handling forms.",
      "useState is a data-fetching library.",
    ],
    correctAnswer: "useState is a hook that lets you add state to function components.",
  },
  {
    id: 6,
    text: "Explain useEffect in React.",
    options: [
      "useEffect is a hook for performing side effects in function components.",
      "useEffect is a styling method.",
      "useEffect is a backend framework.",
      "useEffect is a database query method.",
      "useEffect is a JavaScript API.",
    ],
    correctAnswer: "useEffect is a hook for performing side effects in function components.",
  },
  {
    id: 7,
    text: "What is React Router?",
    options: [
      "React Router is a library for managing navigation and routing in React applications.",
      "React Router is a backend framework.",
      "React Router is a styling library.",
      "React Router is a JavaScript function.",
      "React Router is a database query.",
    ],
    correctAnswer: "React Router is a library for managing navigation and routing in React applications.",
  },
  // Add the remaining questions and answers similarly
];

const MockupQuestion: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);

  const handleQuestionClick = (id: number) => {
    setCurrentQuestion(id);
  };

  const current = questions.find((q) => q.id === currentQuestion);

  return (
    <div className="mockup-container">
      <div className="question-box">
        <h2>Question {current?.id}</h2>
        <p>{current?.text}</p>
        <div className="options">
          {current?.options.map((option, index) => (
            <div key={index} className="option">
              <label>
                <input type="checkbox" /> {option}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="question-tab">
        {questions.map((q) => (
          <button
            key={q.id}
            className={`question-number ${
              currentQuestion === q.id ? "active" : ""
            }`}
            onClick={() => handleQuestionClick(q.id)}
          >
            {q.id}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MockupQuestion;
