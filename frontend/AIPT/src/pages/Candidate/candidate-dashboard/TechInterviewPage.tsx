import Sidebar from "../../../components/Candidate/CandidateSidebar";
import Header from "../../../components/Candidate/CandidateHeader";
import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import {
  Trophy,
  Flag,
  Star,
  ChevronLeft,
  ChevronRight,
  Lock,
  Loader2
} from "lucide-react";
import { useInterviewStore } from "../../../components/store/InterviewStore";
import { Timer } from "../../../components/Candidate/tech-interview/Timer";
import { CodeEditor } from "../../../components/Candidate/tech-interview/CodeEditor";
import { Question } from "../../../components/types";
import { DragDropQuestion } from "../../../components/Candidate/tech-interview/DragDropQuestion";
import { FillBlanksQuestion } from "../../../components/Candidate/tech-interview/FillBlanksQuestion";
import { MultipleChoiceQuestion } from "../../../components/Candidate/tech-interview/MultipleChoiceQuestion";
import { DataVisualizationQuestion } from '../../../components/Candidate/tech-interview/DataVisualizationQuestion';
import { ObjectMechanicQuestion } from '../../../components/Candidate/tech-interview/ObjectMechanicQuestion';
import { LogicalPuzzleQuestion } from '../../../components/Candidate/tech-interview/LogicalPuzzleQuestion';
import { WebcamMonitor } from '../../../components/Candidate/tech-interview/WebcamMonitor';

interface LocationState {
  interviewId: string;
  testLink: string;
  duration: number;
}



const Techexam: React.FC = () => {
  // const location = useLocation();
  // const { interviewId, testLink, duration } = location.state as LocationState;


  const {
    currentQuestionIndex, 
    setCurrentQuestion, 
    isQuestionLocked,
    canNavigateToQuestion,
    questions,
    isLoading,
    error,
    fetchQuestions,
    startExam,
    isExamStarted,
    setAnswer,
    submitAllAnswers,
    submitCodeForComplexityAnalysis
  } = useInterviewStore();
  // const currentQuestion = mockQuestions[currentQuestionIndex];
  // const questions = getQuestions();
  // const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswerChange = (questionId: string, type: string, answer: string | string[] | number | number[] | boolean) => {
    setAnswer(questionId, type, answer);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading questions...</span>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="bg-red-50 text-red-800 p-4 rounded-lg">
  //         <h2 className="text-lg font-semibold">Error</h2>
  //         <p>{error}</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">No questions available</div>
      </div>
    );
  }

  if (!isExamStarted()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Technical Interview</h1>
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold">Important Instructions:</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You cannot pause the exam once started</li>
              <li>Each question has a specific time limit</li>
              <li>Switching windows/tabs will trigger warnings</li>
              <li>Three window switches will auto-submit the current question</li>
              <li>Ensure stable internet connection</li>
            </ul>
          </div>
          <button
            onClick={startExam}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];



  const handleTimeUp = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestion(currentQuestionIndex + 1);
    } else {
      // If this was the last question, submit all answers
      try {
        await submitAllAnswers();
        // Handle successful submission (e.g., show completion screen)
      } catch (error) {
        // Handle submission error
        console.error('Failed to submit answers:', error);
      }
    }
  };

  const renderQuestion = (question: Question) => {
    const isLocked = isQuestionLocked(question._id);

    if (isLocked) {
      return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-gray-50 rounded-lg">
          <Lock className="w-12 h-12 text-gray-400" />
          <p className="text-lg text-gray-600 font-medium">Time's up! This question has been submitted.</p>
        </div>
      );
    }

    switch (question.type) {
      case 'code':
        return (
          <CodeEditor
            language={question.content.language || 'javascript'}
            code={question.content.initialCode || ''}
            onChange={(value) => handleAnswerChange(question._id, 'code', value)}
            readOnly={isLocked}
          />
        );
      case 'fillBlanks':
        return (
          <FillBlanksQuestion
          text={question.content.text || ''}
          blanks={question.content.blanks}
          onChange={(answers) => handleAnswerChange(question._id, 'fillBlanks', Object.values(answers))}
          disabled={isLocked}
        />
        
        );
      case 'dragDrop':
        return (
          <DragDropQuestion
            items={question.content.items}
            onChange={(order) => handleAnswerChange(question._id, 'dragDrop', order)}
            disabled={isLocked}
          />
        );
      case 'multipleChoice':
        return (
          <MultipleChoiceQuestion
            options={question.content.options}
            onChange={(answer) => handleAnswerChange(question._id, 'multipleChoice', answer)}
            disabled={isLocked}
          />
        );
        case 'dataVisualization':
          return (
            <DataVisualizationQuestion
              dataset={question.content.dataset?.data || '{}'}
              onChange={(code) => handleAnswerChange(question._id, 'dataVisualization', code)}
              disabled={isLocked}
            />
          );
          case 'objectMechanic':
            return (
              <ObjectMechanicQuestion
                worldConfig={question.content.mechanics?.worldConfig || '{}'}
                onChange={(code) => handleAnswerChange(question._id, 'objectMechanic', code)}
                disabled={isLocked}
              />
            );
            case 'logicalPuzzle':
              return (
                <LogicalPuzzleQuestion
                  initialState={question.content.puzzle?.initialState || '{}'}
                  goalState={question.content.puzzle?.goalState || '{}'}
                  rules={question.content.puzzle?.rules || []}
                  onChange={(code) => handleAnswerChange(question._id, 'logicalPuzzle', code)}
                  disabled={isLocked}
                />
              );

      default:
        return null;
    }
  };


  // useEffect(() => {
  //   console.log("Interview ID:", interviewId);
  //   console.log("Test Link:", testLink);
  //   console.log("Duration:", duration);
  // }, [interviewId, testLink, duration]);

  // if (loading) {
  //   return <div className="flex justify-center items-center h-screen">Loading questions...</div>;
  // }

  // if (error) {
  //   return <div className="flex justify-center items-center h-screen text-red-600">Error: {error}</div>;
  // }

  // if (!questions.length) {
  //   return <div className="flex justify-center items-center h-screen">No questions available</div>;
  // }


  return (
    <div className="flex  bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-shrink-0">
          <Header title="Technical Assessment " />
          <div className="bg-white shadow-sm mt-20">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Technical Interview
                </h1>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <span className="font-semibold">Score: 0</span>
                  </div>
                  <Timer 
                duration={currentQuestion.timeLimit} 
                onTimeUp={handleTimeUp}
                questionId={currentQuestion._id}
              />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Questions</h2>
                <div className="space-y-3">
                  {questions.map((q, index) => {
                    const isNavigable = canNavigateToQuestion(index);
                    return (
                      <button
                      key={q._id}
                      onClick={() => isNavigable && setCurrentQuestion(index)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        currentQuestionIndex === index
                          ? 'bg-blue-50 text-blue-700'
                          : isNavigable
                          ? 'hover:bg-gray-50'
                          : 'opacity-50 cursor-not-allowed bg-gray-100'
                      }`}
                      disabled={!isNavigable}
                    >
                        <div className="flex items-center justify-between">
                          <span>Question {index + 1}</span>
                          <div className="flex items-center space-x-2">
                          {isQuestionLocked(q._id) && <Lock className="w-4 h-4 text-gray-400" />}
                          {q.difficulty === 'easy' && <Star className="w-4 h-4 text-green-500" />}
                          {q.difficulty === 'medium' && <Star className="w-4 h-4 text-yellow-500" />}
                          {q.difficulty === 'hard' && <Star className="w-4 h-4 text-red-500" />}
                          <Flag className="w-4 h-4 text-gray-400" />
                        </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-span-9">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {currentQuestion.title}
                      </h2>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Trophy className="w-4 h-4 mr-1" />
                          {currentQuestion.points} points
                        </span>
                        <span className="flex items-center">
                        <Timer 
                          duration={currentQuestion.timeLimit} 
                          onTimeUp={handleTimeUp}
                          questionId={currentQuestion._id}
                        />
                        {Math.floor(currentQuestion.timeLimit / 60)} minutes
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                  </div>
                  <p className="mt-2 text-gray-600">
                    {currentQuestion.description}
                  </p>
                </div>
                <div className="p-6">  {renderQuestion(currentQuestion)}</div>
                <div className="p-6 border-t bg-gray-50 flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestionIndex - 1))}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    canNavigateToQuestion(currentQuestionIndex - 1)
                      ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  }`}
                  disabled={!canNavigateToQuestion(currentQuestionIndex - 1)}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                  <button
                  onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    canNavigateToQuestion(currentQuestionIndex + 1)
                      ? 'text-white bg-blue-600 hover:bg-blue-700'
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  }`}
                  disabled={!canNavigateToQuestion(currentQuestionIndex + 1)}
                >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        {isExamStarted() && questions.length > 0 && (
        <WebcamMonitor questionId={questions[currentQuestionIndex]._id} />
      )}
      </div>
    </div>
  );
};

export default Techexam;
