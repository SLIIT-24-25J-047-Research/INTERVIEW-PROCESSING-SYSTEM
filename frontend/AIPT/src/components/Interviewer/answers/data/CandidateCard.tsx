import React from 'react';
import { Candidate } from '../types/index';

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, index }) => {
  const { userId, technicalResult, nonTechnicalResult, overallScore, confidenceLevel, stressLevel } = candidate;
  
  const formattedScore = overallScore ? overallScore.toFixed(1) : 'N/A';
  
  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getConfidenceBadgeColor = (level?: string) => {
    if (level === 'confident') return 'bg-green-100 text-green-800';
    if (level === 'nervous') return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };
  
  const getStressBadgeColor = (level?: string) => {
    if (level === 'low') return 'bg-green-100 text-green-800';
    if (level === 'high') return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm mr-3">
            {index + 1}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Candidate {userId.substring(0, 8)}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {confidenceLevel && (
                <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceBadgeColor(confidenceLevel)}`}>
                  {confidenceLevel}
                </span>
              )}
              {stressLevel && (
                <span className={`text-xs px-2 py-1 rounded-full ${getStressBadgeColor(stressLevel)}`}>
                  Stress: {stressLevel}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xl font-bold ${getScoreColor(overallScore)}`}>
            {formattedScore}%
          </div>
          <div className="text-xs text-gray-500">Overall Score</div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`rounded-full h-2 ${overallScore && overallScore >= 70 ? 'bg-green-500' : overallScore && overallScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${overallScore || 0}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2">Technical ({technicalResult?.totalScore || 0}/{technicalResult?.maxPossibleScore || 0})</h4>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2">
            Non-Technical ({nonTechnicalResult?.responses.reduce((sum, r) => sum + r.marks, 0) || 0}/
            {(nonTechnicalResult?.responses.length || 0) * 10})
          </h4>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;