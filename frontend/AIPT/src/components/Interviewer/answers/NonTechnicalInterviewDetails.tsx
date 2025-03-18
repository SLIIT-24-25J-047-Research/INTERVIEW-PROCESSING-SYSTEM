import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Loader2, BarChart } from 'lucide-react';
import { NonTechnicalResponse } from '../../types/admin';

interface NonTechnicalAnswerDetailsProps {
  submissionId: string;
  onBack: () => void;
}

interface NonTechnicalQuestion {
  _id: string;
  text: string;
}

interface LocalNonTechnicalResponse {
  _id: string;
  questionId: NonTechnicalQuestion;
  transcription: string;
  isCorrect: boolean;
  prediction: {
    confidence_score: number;
    confidence_level: string;
  };
  similarityScores?: number[];
}

export const NonTechnicalAnswerDetails: React.FC<NonTechnicalAnswerDetailsProps> = ({
  submissionId,
  onBack,
}) => {
  const [submission, setSubmission] = useState<{
    _id: string;
    responses: LocalNonTechnicalResponse[];
    createdAt: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/answers/${submissionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch submission details');
        }
        const data = await response.json();
        
        if (!data.success) {
          throw new Error('Failed to fetch submission data');
        }

        setSubmission(data.data);

        // Calculate overall score from confidence scores
        if (data.data.responses && data.data.responses.length > 0) {
          const totalConfidence = data.data.responses.reduce(
            (sum: number, response: LocalNonTechnicalResponse) => 
              sum + (response.prediction?.confidence_score || 0),
            0
          );
          setOverallScore(totalConfidence / data.data.responses.length);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
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
          className={`h-2.5 rounded-full ${
            confidence >= 0.7 ? 'bg-green-600' :
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
        {submission.responses.map((response) => (
          <div key={response._id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {response.questionId.text}
                  </h2>
                  {response.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Candidate's Response:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{response.transcription}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Confidence Score:</h3>
                <div className="space-y-2">
                  {renderConfidenceBar(response.prediction.confidence_score)}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Score: {(response.prediction.confidence_score * 100).toFixed(1)}%</span>
                    <span>Level: {response.prediction.confidence_level}</span>
                  </div>
                </div>
              </div>

              {response.similarityScores && response.similarityScores.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Similarity Scores:</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {response.similarityScores.map((score, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-600">Metric {index + 1}</div>
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
        ))}
      </div>
    </div>
  );
};