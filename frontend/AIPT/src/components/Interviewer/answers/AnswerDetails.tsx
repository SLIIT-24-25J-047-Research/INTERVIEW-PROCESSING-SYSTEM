import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Answer, Question } from '../../types/admin';
import { CodeEditor } from '../../Candidate/tech-interview/CodeEditor';
import { ObjectMechanicQuestion } from '../../Candidate/tech-interview/ObjectMechanicQuestion';
import CodeComplexityDashboard from './CodeComplexityModel';


interface AnswerDetailsProps {
  submissionId: string;
  onBack: () => void;
}

interface AnswerValidation {
  isCorrect: boolean;
  feedback: string;
  points: number;
  testResults?: {
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
  }[];

  mechanicsValidation?: {
    behaviorMatched: boolean;
    physicsCorrect: boolean;
    collisionsHandled: boolean;
  };


}

interface PatternDefinition {
  patterns: RegExp[];
  required: number;
}

interface PatternGroup {
  [key: string]: PatternDefinition;
}


export const AnswerDetails: React.FC<AnswerDetailsProps> = ({ submissionId, onBack }) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions, setQuestions] = useState<Record<string, Question>>({});
  const [validations, setValidations] = useState<Record<string, AnswerValidation>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState(0);
  const [executingCode, setExecutingCode] = useState<Record<string, boolean>>({});
  interface EvaluationResult {
    evaluationResult: {
      cyclomatic_complexity?: number;
      maintainability_index?: {
        maintainability_index?: number;
      };
      coupling_between_classes?: number;
      single_value?: number;
    };
    submittedAt: string;
    _id: string;
  }

  const [evaluations, setEvaluations] = useState<Record<string, EvaluationResult[]>>({});
  const [showComplexityDashboard, setShowComplexityDashboard] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);


  const openComplexityDashboard = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setShowComplexityDashboard(true);
  };




  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the specific submission first
        const answersResponse = await fetch(`http://localhost:5000/api/techAnswers/answers/grouped`);
        if (!answersResponse.ok) {
          throw new Error('Failed to fetch submission details');
        }
        const groupedData = await answersResponse.json();
        const submission = groupedData
          .flatMap((group: { answers: Answer[] }) => group.answers)
          .find((sub: Answer) => sub._id === submissionId);

        if (!submission) {
          throw new Error('Submission not found');
        }

        setAnswers(submission.answers);

        // Fetch and validate each question
        const questionValidations: Record<string, AnswerValidation> = {};
        let totalPoints = 0;
        let maxPoints = 0;

        for (const answer of submission.answers) {
          try {
            const questionResponse = await fetch(`http://localhost:5000/api/techQuestions/${answer.questionId}`);
            if (!questionResponse.ok) {
              throw new Error(`Failed to fetch question ${answer.questionId}`);
            }
            const question = await questionResponse.json();

            setQuestions(prev => ({ ...prev, [question._id]: question }));
            maxPoints += question.points;

            if (question.type === 'code') {
              try {
                const evaluationResponse = await fetch(`http://localhost:5000/api/CodeSubmissions/question/${answer.questionId}`);

                if (evaluationResponse.ok) {
                  const evaluationData = await evaluationResponse.json();
                  console.log('eval', evaluationData);
                  setEvaluations(prev => ({ ...prev, [answer.questionId]: Array.isArray(evaluationData) ? evaluationData : [evaluationData] }));
                }
              } catch (evalErr) {
                console.error(`Error fetching evaluation for ${answer.questionId}:`, evalErr);
              }
              setExecutingCode(prev => ({ ...prev, [answer.questionId]: true }));
              const validation = await validateCodeAnswer(answer, question);
              questionValidations[answer.questionId] = validation;
              totalPoints += validation.points;
              setExecutingCode(prev => ({ ...prev, [answer.questionId]: false }));
            } else {
              const validation = validateAnswer(answer, question);
              questionValidations[answer.questionId] = validation;
              totalPoints += validation.points;
            }
          } catch (err) {
            console.error(`Error fetching question ${answer.questionId}:`, err);
            setExecutingCode(prev => ({ ...prev, [answer.questionId]: false }));
          }
        }
        setValidations(questionValidations);
        setTotalScore(totalPoints);
        setMaxPossibleScore(maxPoints);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [submissionId]);

  const validateObjectMechanicAnswer = (answer: Answer, question: Question): AnswerValidation => {
    try {
      const code = answer.response as string;
      const worldConfig = JSON.parse(question.content.mechanics?.worldConfig || '{}');

      const physicsPatterns: PatternGroup = {
        gravity: {
          patterns: [
            /velocity\s*\+=\s*gravity/i,
            /y\s*\+=\s*gravity/i,
            /position\.y\s*\+=\s*gravity/i,
            /gravity\s*\*\s*deltaTime/i
          ],
          required: 1
        },
        friction: {
          patterns: [
            /velocity\s*\*=\s*(0\.\d+)/,
            /speed\s*\*=\s*(0\.\d+)/,
            /friction\s*=\s*(0\.\d+)/,
            /drag\s*=\s*(0\.\d+)/
          ],
          required: 1
        },
        collision: {
          patterns: [
            /collision|collide/i,
            /bounds|boundary/i,
            /intersect|intersection/i,
            /distance\s*\(/,
            /radius|diameter/i,
            /boundingBox|bbox/i
          ],
          required: 2
        }
      };

      const behaviorPatterns: PatternGroup = {
        gameLoop: {
          patterns: [
            /requestAnimationFrame|setInterval/,
            /function\s+(?:update|animate|loop|tick)/i,
            /function\s+(?:draw|render|paint)/i
          ],
          required: 2
        },
        objectState: {
          patterns: [
            /class\s+\w+/,
            /constructor\s*\(/,
            /this\.(position|velocity|speed|x|y)/,
            /state\s*=\s*{/
          ],
          required: 2
        }
      };


      const evaluatePatterns = (patterns: PatternGroup): Record<string, boolean> => {
        return Object.entries(patterns).reduce((acc, [key, { patterns: patternList, required }]) => {
          const matchCount = patternList.filter(pattern => pattern.test(code)).length;
          acc[key] = matchCount >= required;
          return acc;
        }, {} as Record<string, boolean>);
      };

      const physicsResults = evaluatePatterns(physicsPatterns);
      const behaviorResults = evaluatePatterns(behaviorPatterns);

      const physicsCorrect = physicsResults.gravity && physicsResults.friction;
      const behaviorMatched = behaviorResults.gameLoop && behaviorResults.objectState;
      const collisionsHandled = physicsResults.collision;


      const weights = {
        physics: 0.4,
        behavior: 0.4,
        collisions: 0.2
      };

      const scoreComponents = {
        physics: physicsCorrect ? weights.physics : 0,
        behavior: behaviorMatched ? weights.behavior : 0,
        collisions: collisionsHandled ? weights.collisions : 0
      };

      const totalScore = Object.values(scoreComponents).reduce((sum, score) => sum + score, 0);
      const normalizedScore = totalScore;

      const feedback = generateDetailedFeedback(
        physicsResults,
        behaviorResults,
        Object.keys(physicsPatterns),
        Object.keys(behaviorPatterns)
      );

      return {
        isCorrect: normalizedScore >= 0.7,
        feedback,
        points: Math.round(question.points * normalizedScore),
        mechanicsValidation: {
          behaviorMatched,
          physicsCorrect,
          collisionsHandled
        }
      };
    } catch (error) {
      console.error('Object mechanics validation error:', error);
      return {
        isCorrect: false,
        feedback: 'Error validating mechanics implementation',
        points: 0,
        mechanicsValidation: {
          behaviorMatched: false,
          physicsCorrect: false,
          collisionsHandled: false
        }
      };
    }
  };


  const generateDetailedFeedback = (
    physicsResults: Record<string, boolean>,
    behaviorResults: Record<string, boolean>,
    physicsAspects: string[],
    behaviorAspects: string[]
  ): string => {
    const feedback = [];

    // Physics 
    feedback.push('Physics Implementation:');
    physicsAspects.forEach(aspect => {
      const passed = physicsResults[aspect];
      const symbol = passed ? '✓' : '✗';
      const message = getAspectFeedback(aspect, passed);
      feedback.push(`${symbol} ${message}`);
    });

    // Behavior 
    feedback.push('\nObject Behavior:');
    behaviorAspects.forEach(aspect => {
      const passed = behaviorResults[aspect];
      const symbol = passed ? '✓' : '✗';
      const message = getAspectFeedback(aspect, passed);
      feedback.push(`${symbol} ${message}`);
    });

    return feedback.join('\n');
  };

  const getAspectFeedback = (aspect: string, passed: boolean): string => {
    const feedbackMap: Record<string, { success: string; failure: string }> = {
      gravity: {
        success: 'Gravity implementation detected',
        failure: 'No gravity implementation found'
      },
      friction: {
        success: 'Friction/drag forces implemented',
        failure: 'Missing friction/drag implementation'
      },
      collision: {
        success: 'Collision detection system present',
        failure: 'Collision detection needs implementation'
      },
      gameLoop: {
        success: 'Game loop properly structured',
        failure: 'Game loop implementation incomplete'
      },
      objectState: {
        success: 'Object state management implemented',
        failure: 'Object state management needs improvement'
      }
    };

    return passed ? feedbackMap[aspect].success : feedbackMap[aspect].failure;
  };


  const validateCodeAnswer = async (answer: Answer, question: Question): Promise<AnswerValidation> => {
    try {
      const response = await fetch('http://localhost:5000/api/techCodeExecution/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: {
            content: {
              language: question.content.language,
              testCases: question.content.testCases,
            },
            _id: question._id,
            type: 'code',
            points: question.points,
          },
          answer: {
            answers: [{
              answers: [{
                questionId: answer.questionId,
                response: answer.response,
                _id: answer._id,
              }]
            }]
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Code execution failed');
      }

      const result = await response.json();

      // Access the nested testResults
      const testResults = result.results.testResults;
      const allTestsPassed = testResults.every((test: { passed: boolean }) => test.passed);

      return {
        isCorrect: allTestsPassed,
        feedback: allTestsPassed ? 'All test cases passed!' : 'Some test cases failed',
        points: allTestsPassed ? question.points : 0,
        testResults: testResults.map((test: { passed: boolean; output: string | object; expectedOutput: string | object }) => ({
          passed: test.passed,
          input: JSON.stringify(test.output), // Using output as input since input isn't in response
          expectedOutput: JSON.stringify(test.expectedOutput),
          actualOutput: JSON.stringify(test.output)
        }))
      };
    } catch (error) {
      console.error('Code execution error:', error);
      return {
        isCorrect: false,
        feedback: 'Failed to execute code',
        points: 0,
      };
    }
  };

  const validateAnswer = (answer: Answer, question: Question): AnswerValidation => {
    switch (question.type) {
      case 'dragDrop': {
        const dragDropCorrect = JSON.stringify(answer.response) === JSON.stringify(question.content.correctOrder);
        return {
          isCorrect: dragDropCorrect,
          feedback: dragDropCorrect ? 'Correct order' : 'Incorrect order',
          points: dragDropCorrect ? question.points : 0
        };
      }

      case 'multipleChoice': {
        const isCorrect = (answer.response as number) === question.content.correctAnswer;
        const selectedOption = question.content.options[answer.response as number];
        const correctOption = question.content.options[question.content.correctAnswer];
        return {
          isCorrect,
          feedback: isCorrect
            ? 'Correct answer'
            : `Incorrect. Selected: "${selectedOption}". Correct answer: "${correctOption}"`,
          points: isCorrect ? question.points : 0
        };
      }

      case 'objectMechanic': {
        return validateObjectMechanicAnswer(answer, question);
      }

      default:
        return {
          isCorrect: false,
          feedback: 'Unknown question type',
          points: 0
        };
    }
  };

  const renderAnswer = (answer: Answer, question: Question, validation: AnswerValidation) => {
    switch (question.type) {

      case 'objectMechanic':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Implementation Analysis:</h3>
              <div className="space-y-2">
                {validation.mechanicsValidation && (
                  <>
                    <div className="flex items-center space-x-2">
                      {validation.mechanicsValidation.physicsCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span>Physics Implementation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {validation.mechanicsValidation.behaviorMatched ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span>Object Behavior</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {validation.mechanicsValidation.collisionsHandled ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span>Collision Detection</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <CodeEditor
                language="javascript"
                code={answer.response as string}
                onChange={() => { }}
                readOnly={true}
              />
            </div>
            {question.content.mechanics && (
              <ObjectMechanicQuestion
                worldConfig={question.content.mechanics.worldConfig}
                onChange={() => { }}
                disabled={true}
              />
            )}

          </div>
        );


      case 'code':
        return (
          <div className="space-y-4">
            {executingCode[answer.questionId] ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 text-gray-600">Executing code...</span>
              </div>
            ) : (
              <>
                <CodeEditor
                  language={question.content.language || 'javascript'}
                  code={answer.response as string}
                  onChange={() => { }}
                  readOnly={true}
                />
                {evaluations[answer.questionId] && evaluations[answer.questionId].length > 0 ? (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Code Quality Metrics:</h3>

                    <button
                      onClick={() => openComplexityDashboard(answer.questionId)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      View Detailed Analysis
                    </button>
                    {(() => {
                      const latestEval = evaluations[answer.questionId][evaluations[answer.questionId].length - 1];

                      if (!latestEval.evaluationResult) {
                        return (
                          <div className="p-3 bg-white rounded border border-gray-200 text-center">
                            <p className="text-sm text-gray-500">No score available</p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-white rounded border border-gray-200">
                            <p className="text-xs text-gray-500">Cyclomatic Complexity</p>
                            <p className="text-lg font-semibold">{latestEval.evaluationResult.cyclomatic_complexity || 'N/A'}</p>
                          </div>
                          <div className="p-3 bg-white rounded border border-gray-200">
                            <p className="text-xs text-gray-500">Maintainability Index</p>
                            <p className="text-lg font-semibold">
                              {latestEval.evaluationResult.maintainability_index?.maintainability_index?.toFixed(2) || 'N/A'}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded border border-gray-200">
                            <p className="text-xs text-gray-500">Coupling Between Classes</p>
                            <p className="text-lg font-semibold">{latestEval.evaluationResult.coupling_between_classes || 'N/A'}</p>
                          </div>
                          <div className="p-3 bg-white rounded border border-gray-200">
                            <p className="text-xs text-gray-500">Quality Score</p>
                            <p className="text-lg font-semibold">
                              {latestEval.evaluationResult.single_value?.toFixed(2) || 'N/A'}
                            </p>
                          </div>

                          {/* Only show submission history if there's more than one submission */}
                          {evaluations[answer.questionId].length > 1 && (
                            <div className="col-span-2 mt-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Submission History:</h4>
                              <div className="max-h-40 overflow-y-auto">
                                {evaluations[answer.questionId].map((evaluation, index) => (
                                  <div key={evaluation._id} className="p-2 mb-2 bg-white rounded border border-gray-200 text-sm">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">Submission {index + 1}</span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(evaluation.submittedAt).toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="text-xs mt-1">
                                      Quality Score: {evaluation.evaluationResult?.single_value?.toFixed(2) || 'N/A'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">No code quality metrics available</p>
                  </div>
                )}

                {validation.testResults && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-700">Test Results:</h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          Passed: {validation.testResults.filter(r => r.passed).length}/{validation.testResults.length}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {validation.testResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${result.passed
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              {result.passed ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                              )}
                              <span className={`font-medium ${result.passed ? 'text-green-700' : 'text-red-700'
                                }`}>
                                Test Case {index + 1}
                              </span>
                            </div>
                            {/* {result.executionTime && (
                        <span className="text-sm text-gray-500">
                          Time: {(result.executionTime * 1000).toFixed(2)}ms
                        </span>
                      )} */}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="col-span-2">
                              <p className="font-medium text-gray-700">Expected Output:</p>
                              <pre className="mt-1 p-2 bg-white rounded border border-gray-200 overflow-x-auto">
                                {typeof result.expectedOutput === 'object'
                                  ? JSON.stringify(result.expectedOutput, null, 2)
                                  : result.expectedOutput}
                              </pre>
                            </div>
                            <div className="col-span-2">
                              <p className="font-medium text-gray-700">Your Output:</p>
                              <pre className={`mt-1 p-2 bg-white rounded border ${result.passed ? 'border-green-200' : 'border-red-200'
                                } overflow-x-auto`}>
                                {typeof result.actualOutput === 'object'
                                  ? JSON.stringify(result.actualOutput, null, 2)
                                  : result.actualOutput}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {showComplexityDashboard && selectedQuestionId && (
              <CodeComplexityDashboard
                isOpen={showComplexityDashboard}
                onClose={() => setShowComplexityDashboard(false)}
                questionId={selectedQuestionId}
              />
            )}
          </div>

        );

      case 'dragDrop':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Submitted Order:</h3>
              {(answer.response as string[]).map((itemId, index) => {
                const item = question.content.items.find(i => i.id === itemId);
                return (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {item?.text || itemId}
                  </div>
                );
              })}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Correct Order:</h3>
              {question.content.correctOrder.map((itemId, index) => {
                const item = question.content.items.find(i => i.id === itemId);
                return (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {item?.text || itemId}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'multipleChoice':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Answer:</h3>
              <div className={`p-3 rounded-lg border ${validation.isCorrect
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                {question.content.options[answer.response as number]}
              </div>
            </div>
            {!validation.isCorrect && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</h3>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  {question.content.options[question.content.correctAnswer]}
                </div>
              </div>
            )}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">All Options:</h3>
              <div className="space-y-2">
                {question.content.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${index === question.content.correctAnswer
                      ? 'border-green-200 bg-green-50'
                      : index === (answer.response as number)
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                      }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            {JSON.stringify(answer.response)}
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Submissions
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Submission Details</h1>
        <div className="text-lg font-semibold">
          Total Score: {totalScore} / {maxPossibleScore}
        </div>
      </div>

      <div className="space-y-8">
        {answers.map((answer) => {
          const question = questions[answer.questionId];
          const validation = validations[answer.questionId];
          if (!question || !validation) return null;

          return (
            <div key={answer._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {question.title}
                    </h2>
                    {validation.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : question.type === 'code' ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Points: {validation.points} / {question.points}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Time taken: {answer.timeTaken}s
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">{question.description}</div>
                {validation.feedback && (
                  <div className={`mt-2 text-sm ${validation.isCorrect ? 'text-green-600' :
                    question.type === 'code' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {validation.feedback}
                  </div>
                )}
              </div>
              <div className="px-6 py-4">
                {renderAnswer(answer, question, validation)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};