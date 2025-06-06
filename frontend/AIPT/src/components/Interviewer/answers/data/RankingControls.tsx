import React from 'react';
import { RankingCriteria } from '../types';

interface RankingControlsProps {
  currentCriteria: RankingCriteria;
  onChangeCriteria: (criteria: RankingCriteria) => void;
}

const RankingControls: React.FC<RankingControlsProps> = ({ 
  currentCriteria, 
  onChangeCriteria 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Ranking Criteria</h2>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onChangeCriteria('score')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            currentCriteria === 'score'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Score
        </button>
        
        <button
          onClick={() => onChangeCriteria('stress')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            currentCriteria === 'stress'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Stress Level
        </button>
        
        <button
          onClick={() => onChangeCriteria('confidence')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            currentCriteria === 'confidence'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Confidence
        </button>
      </div>
      
      <div className="mt-3 text-sm text-gray-600">
        {currentCriteria === 'score' && (
          <p>Ranking candidates by their overall interview performance score</p>
        )}
        {currentCriteria === 'stress' && (
          <p>Prioritizing candidates with lower stress levels during interviews</p>
        )}
        {currentCriteria === 'confidence' && (
          <p>Prioritizing more confident candidates based on interview assessment</p>
        )}
      </div>
    </div>
  );
};

export default RankingControls;