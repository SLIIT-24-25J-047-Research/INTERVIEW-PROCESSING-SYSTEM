import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

const allQuestions: Question[] = [
  { id: 1, text: "What is React?", options: ["React is a JavaScript library for building user interfaces.", "React is a CSS framework.", "React is a programming language.", "React is a database."], correctAnswer: "React is a JavaScript library for building user interfaces." },
  { id: 2, text: "What are React components?", options: ["React components are reusable pieces of UI.", "React components are database schemas.", "React components are stylesheets.", "React components are browser APIs."], correctAnswer: "React components are reusable pieces of UI." },
  { id: 3, text: "What is JSX?", options: ["JSX is a syntax extension for JavaScript.", "JSX is a library.", "JSX is a backend framework.", "JSX is a CSS property."], correctAnswer: "JSX is a syntax extension for JavaScript." },
  { id: 4, text: "What are React hooks?", options: ["React hooks are functions that let you use state and lifecycle features in function components.", "React hooks are database queries.", "React hooks are styling methods.", "React hooks are JavaScript frameworks."], correctAnswer: "React hooks are functions that let you use state and lifecycle features in function components." },
  { id: 5, text: "Explain useState in React.", options: ["useState is a hook that lets you add state to function components.", "useState is a CSS property.", "useState is a JavaScript library."], correctAnswer: "useState is a hook that lets you add state to function components." },
  { id: 6, text: "Explain useEffect in React.", options: ["useEffect is a hook for performing side effects in function components.", "useEffect is a styling method."], correctAnswer: "useEffect is a hook for performing side effects in function components." },
  { id: 7, text: "What is React Router?", options: ["React Router is a library for managing navigation and routing in React applications.", "React Router is a backend framework."], correctAnswer: "React Router is a library for managing navigation and routing in React applications." },
  { id: 8, text: "What is Redux?", options: ["Redux is a state management library.", "Redux is a CSS framework."], correctAnswer: "Redux is a state management library." },
  { id: 9, text: "What is the Virtual DOM?", options: ["A lightweight copy of the real DOM.", "A type of JavaScript function."], correctAnswer: "A lightweight copy of the real DOM." },
  { id: 10, text: "What is the purpose of props?", options: ["To pass data between components.", "To store local state."], correctAnswer: "To pass data between components." },
  { id: 11, text: "What is Next.js?", options: ["A React framework for server-side rendering.", "A database system."], correctAnswer: "A React framework for server-side rendering." },
  { id: 12, text: "What is Tailwind CSS?", options: ["A utility-first CSS framework.", "A JavaScript library.", "A type of React hook."], correctAnswer: "A utility-first CSS framework." },
  { id: 13, text: "What is TypeScript?", options: ["A strongly typed superset of JavaScript.", "A frontend framework."], correctAnswer: "A strongly typed superset of JavaScript." },
  { id: 14, text: "What is API in React?", options: ["A set of functions for data fetching.", "A CSS property."], correctAnswer: "A set of functions for data fetching." },
  { id: 15, text: "What is Firebase?", options: ["A cloud-based backend solution.", "A frontend library."], correctAnswer: "A cloud-based backend solution." },
  { id: 16, text: "What is the purpose of React's key prop?", options: ["To help React identify which items have changed, are added, or are removed.", "To define a component's unique identity.", "To style components uniquely.", "To store data within a component."], correctAnswer: "To help React identify which items have changed, are added, or are removed." },
  { id: 17, text: "What is the difference between a class component and a functional component in React?", options: ["Class components have lifecycle methods, while functional components do not.", "Functional components are slower than class components.", "Class components can only have state.", "Functional components cannot accept props."], correctAnswer: "Class components have lifecycle methods, while functional components do not." },
  { id: 18, text: "What is the useEffect hook used for?", options: ["To handle side effects in functional components.", "To manage state in a functional component.", "To add style to a component.", "To handle user input."], correctAnswer: "To handle side effects in functional components." },
  { id: 19, text: "What is the purpose of the useContext hook?", options: ["To share state between components.", "To handle side effects in functional components.", "To modify the DOM directly.", "To add styling to a component."], correctAnswer: "To share state between components." },
  { id: 20, text: "Which of the following is a benefit of using Redux in a React app?", options: ["Global state management.", "Improved component styling.", "Better routing capabilities.", "Faster rendering of components."], correctAnswer: "Global state management." },
  { id: 21, text: "What is a React component lifecycle?", options: ["The series of methods a component goes through from creation to destruction.", "The process of adding styles to a component.", "The process of managing props in a component.", "The way React interacts with the Virtual DOM."], correctAnswer: "The series of methods a component goes through from creation to destruction." },
  { id: 22, text: "What is the purpose of React's render() method?", options: ["To return JSX to be displayed in the UI.", "To manage component state.", "To handle user inputs.", "To perform side effects."], correctAnswer: "To return JSX to be displayed in the UI." },
  { id: 23, text: "What is the purpose of React.memo?", options: ["To memoize a component to prevent unnecessary re-renders.", "To handle side effects.", "To update the component state.", "To style components dynamically."], correctAnswer: "To memoize a component to prevent unnecessary re-renders." },
  { id: 24, text: "What is the purpose of the useReducer hook?", options: ["To manage more complex state logic in functional components.", "To manage lifecycle methods in functional components.", "To manage routing in React.", "To handle side effects."], correctAnswer: "To manage more complex state logic in functional components." },
  { id: 25, text: "What does the useRef hook return?", options: ["A mutable object that persists for the lifetime of the component.", "A component's props.", "A style object for the component.", "A function to trigger a re-render."], correctAnswer: "A mutable object that persists for the lifetime of the component." },
  { id: 26, text: "What is the role of Webpack in React applications?", options: ["To bundle JavaScript files and other assets.", "To manage component state.", "To handle HTTP requests.", "To add animations to a page."], correctAnswer: "To bundle JavaScript files and other assets." },
  { id: 27, text: "What is the purpose of React.StrictMode?", options: ["To highlight potential problems in an application.", "To render components faster.", "To handle state changes.", "To provide styling to components."], correctAnswer: "To highlight potential problems in an application." },
  { id: 28, text: "What does the useLayoutEffect hook do?", options: ["It is like useEffect but it runs synchronously after all DOM mutations.", "It handles user input.", "It manages component state.", "It changes the styles of a component."], correctAnswer: "It is like useEffect but it runs synchronously after all DOM mutations." },
  { id: 29, text: "What is the difference between useState and useReducer?", options: ["useState is for simple state, useReducer is for more complex state logic.", "useState handles side effects, useReducer doesn't.", "useState is used for routing, useReducer is used for component rendering.", "useState is for styling components."], correctAnswer: "useState is for simple state, useReducer is for more complex state logic." },
  { id: 30, text: "What does the componentDidMount lifecycle method do in class components?", options: ["It is called once after the component is mounted to the DOM.", "It handles state updates.", "It is used to define props.", "It is used to delete a component."], correctAnswer: "It is called once after the component is mounted to the DOM." }
];

const MockupQuestion: React.FC<{ onEndTest: (score: number) => void }> = ({ onEndTest }) => {
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number>(0);
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
  const [shuffledOptions, setShuffledOptions] = useState<{ [key: number]: string[] }>({});

  // Function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = (array: string[]): string[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    // Select 10 random questions
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizQuestions(shuffledQuestions);
    
    // Create shuffled options for each question
    const initialShuffledOptions: { [key: number]: string[] } = {};
    shuffledQuestions.forEach(question => {
      initialShuffledOptions[question.id] = shuffleArray(question.options);
    });
    setShuffledOptions(initialShuffledOptions);

    // Set timeout for end button visibility
    setTimeout(() => {
      setIsButtonVisible(true);
    }, 30000);
  }, []);

  const handleOptionSelect = (questionId: number, option: string) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionId]: option };
      return updatedAnswers;
    });
  };

  const handleNextQuestion = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id];
    const correctAnswer = currentQuestion.correctAnswer;

    // If the answer is correct, add 1 to the score
    if (selectedAnswer === correctAnswer) {
      setScore((prevScore) => Math.min(prevScore + 1, quizQuestions.length));
    }

    // Move to next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    
    // Reset visibility timer if not on last question
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setIsButtonVisible(false);
      setTimeout(() => {
        setIsButtonVisible(true);
      }, 30000);
    }
  };

  const handleFinishTest = () => {
    onEndTest(score);
  };

  // Handle the case where quiz questions haven't loaded yet
  if (quizQuestions.length === 0) {
    return <div className="text-center p-4">Loading questions...</div>;
  }

  return (
    <div className="mockup-container p-4 bg-gradient-to-r from-blue-300 to-blue-500 rounded-lg shadow-lg">
      {currentQuestionIndex < quizQuestions.length ? (
        <div className="question-box bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Question {currentQuestionIndex + 1}</h2>
          <p className="text-lg text-gray-700">{quizQuestions[currentQuestionIndex].text}</p>
          <div className="options mt-4">
            {shuffledOptions[quizQuestions[currentQuestionIndex].id] && 
             shuffledOptions[quizQuestions[currentQuestionIndex].id].map((option, index) => (
              <div key={index} className="option mb-2">
                <label className="block text-gray-800">
                  <input
                    type="radio"
                    name={`question-${quizQuestions[currentQuestionIndex].id}`}
                    value={option}
                    checked={selectedAnswers[quizQuestions[currentQuestionIndex].id] === option}
                    onChange={() => handleOptionSelect(quizQuestions[currentQuestionIndex].id, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          <button 
            onClick={handleNextQuestion} 
            disabled={!selectedAnswers[quizQuestions[currentQuestionIndex].id]}
            className={`mt-4 py-2 px-4 ${
              selectedAnswers[quizQuestions[currentQuestionIndex].id] 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-blue-300 cursor-not-allowed"
            } text-white rounded-lg transition duration-300`}
          >
            Next
          </button>
        </div>
      ) : (
        <div className="text-center bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-green-500">Test Finished!</h2>
          <p className="text-xl mt-2">Your score: {score} / 10</p>
          {isButtonVisible && (
            <button onClick={handleFinishTest} className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
              End Test
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MockupQuestion;