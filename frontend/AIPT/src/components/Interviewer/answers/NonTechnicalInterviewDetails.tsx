import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Loader2, BarChart, BookOpen, Users } from 'lucide-react';
import { NonTechnicalResponse, SkillGroup } from '../../types/admin';

interface NonTechnicalAnswerDetailsProps {
  submissionId: string;
  onBack: () => void;
}

export const NonTechnicalAnswerDetails: React.FC<NonTechnicalAnswerDetailsProps> = ({
  submissionId,
  onBack,
}) => {
  const [submission, setSubmission] = useState<{
    _id: string;
    responses: NonTechnicalResponse[];
    createdAt: string;
  } | null>(null);
  const [questionDetails, setQuestionDetails] = useState<
    Record<string, { text: string; skillGroupId?: string | { _id: string }; answers?: string[] }>
  >({});

  const [skillGroups, setSkillGroups] = useState<Record<string, SkillGroup>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch submission data
        const response = await fetch(`http://localhost:5000/api/answers/${submissionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch submission details');
        }
        const data = await response.json();

        if (!data.success) {
          throw new Error('Failed to fetch submission data');
        }

        setSubmission(data.data);

        // Fetch full question details for each question ID
        const questionIds = new Set<string>();
        data.data.responses.forEach((response: NonTechnicalResponse) => {
          if (response.questionId && response.questionId._id) {
            questionIds.add(response.questionId._id);
          }
        });

        const questionDetailsMap: Record<
          string,
          { text: string; skillGroupId?: string | { _id: string }; answers?: string[] }
        > = {};

        const skillGroupIds = new Set<string>();

        // Fetch full question details
        for (const questionId of questionIds) {
          try {
            const questionResponse = await fetch(`http://localhost:5000/api/questions/${questionId}`);
            if (questionResponse.ok) {
              const questionData = await questionResponse.json();
              questionDetailsMap[questionId] = {
                text: questionData.text,
                skillGroupId: questionData.skillGroupId,
                answers: questionData.answers || [], // Ensure answers is included
              };

              // Check if this question has a skill group ID
              if (questionData.skillGroupId) {
                const skillGroupId = typeof questionData.skillGroupId === 'string'
                  ? questionData.skillGroupId
                  : questionData.skillGroupId._id;

                if (skillGroupId) {
                  skillGroupIds.add(skillGroupId);
                }
              }
            }
          } catch (err) {
            console.error(`Failed to fetch question details for ${questionId}:`, err);
          }
        }

        setQuestionDetails(questionDetailsMap);

        // Fetch skill group details
        const skillGroupsMap: Record<string, SkillGroup> = {};

        for (const skillGroupId of skillGroupIds) {
          try {
            const skillGroupResponse = await fetch(`http://localhost:5000/api/skillGroups/${skillGroupId}`);
            if (skillGroupResponse.ok) {
              const skillGroupData = await skillGroupResponse.json();
              skillGroupsMap[skillGroupId] = skillGroupData.data || skillGroupData;
            }
          } catch (err) {
            console.error(`Failed to fetch skill group details for ${skillGroupId}:`, err);
          }
        }

        setSkillGroups(skillGroupsMap);

        // Calculate overall score
        if (data.data.responses && data.data.responses.length > 0) {
          const validResponses = data.data.responses.filter(
            (response: NonTechnicalResponse) =>
              response.prediction &&
              typeof response.prediction.confidence_score === 'number'
          );

          if (validResponses.length > 0) {
            const totalConfidence = validResponses.reduce(
              (sum: number, response: NonTechnicalResponse) =>
                sum + response.prediction.confidence_score,
              0
            );
            setOverallScore(totalConfidence / validResponses.length);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error("Error in fetchData:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [submissionId]);

  const renderConfidenceBar = (confidence: number) => {
    const percentage = (confidence * 100).toFixed(1);
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${confidence >= 0.7 ? 'bg-green-600' :
              confidence >= 0.4 ? 'bg-yellow-500' :
                'bg-red-600'
            }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error || 'No submission data found'}</div>
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
        <h1 className="text-2xl font-bold text-gray-900">Non-Technical Interview Details</h1>
        <div className="text-lg font-semibold flex items-center">
          <BarChart className="w-5 h-5 mr-2 text-blue-600" />
          Overall Confidence: {(overallScore * 100).toFixed(1)}%
        </div>
      </div>

      <div className="space-y-8">
        {submission.responses.map((response, index) => {
          // Get the question ID from the response
          const questionId = response.questionId?._id;

          // Get the full question details using the question ID
          const fullQuestionDetails = questionId ? questionDetails[questionId] : null;

          // Get the skill group ID from the full question details
          const skillGroupId = typeof fullQuestionDetails?.skillGroupId === 'object'
            ? fullQuestionDetails.skillGroupId._id
            : fullQuestionDetails?.skillGroupId;

          // Get the skill group details using the skill group ID
          const skillGroup = skillGroupId ? skillGroups[skillGroupId] : null;

          return (
            <div key={response._id || index} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {response.questionId?.text || fullQuestionDetails?.text || 'Question text unavailable'}
                    </h2>
                    {response.isCorrect !== undefined && (
                      response.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )
                    )}
                  </div>
                </div>

                {skillGroup && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-2">
                    <div className="flex items-start space-x-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <BookOpen className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{skillGroup.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <div className="flex flex-wrap gap-2">
                            {skillGroup.skills && skillGroup.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Focus: {skillGroup.focus || 'N/A'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Expected Answers:</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="list-disc pl-5 space-y-1">
                      {fullQuestionDetails && fullQuestionDetails.answers && fullQuestionDetails.answers.length > 0 ? (
                        fullQuestionDetails.answers.map((answer: string, i: number) => (
                          <li key={i} className="text-gray-700">{answer}</li>
                        ))
                      ) : (
                        <li className="text-gray-700">No expected answers available</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Candidate's Response:</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800">{response.transcription || 'No transcription available'}</p>
                  </div>
                </div>

                {response.prediction && typeof response.prediction.confidence_score === 'number' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Confidence Score:</h3>
                    <div className="space-y-2">
                      {renderConfidenceBar(response.prediction.confidence_score)}
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Score: {(response.prediction.confidence_score * 100).toFixed(1)}%</span>
                        <span>Level: {response.prediction.confidence_level || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {response.similarityScores && response.similarityScores.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Similarity Scores:</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {response.similarityScores.map((score, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-gray-600">Metric {i + 1}</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {(score * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};