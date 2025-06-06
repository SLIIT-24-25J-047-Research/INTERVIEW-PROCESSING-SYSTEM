import React, { useState } from 'react';
import { Job, RankingCriteria } from '../types';
import CandidateCard from './CandidateCard';
import { rankCandidates } from '../utils/rankingUtils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface JobResultsCardProps {
  job: Job;
  rankingCriteria: RankingCriteria;
}

const JobResultsCard: React.FC<JobResultsCardProps> = ({ job, rankingCriteria }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Rank candidates based on the current criteria
  const rankedJob = rankCandidates(job, rankingCriteria);
  
  // Calculate job stats
  const candidateCount = rankedJob.candidates.length;
  const avgScore = rankedJob.candidates.reduce((sum, candidate) => 
    sum + (candidate.overallScore || 0), 0) / candidateCount || 0;

  // Format job ID for display
  const shortJobId = job.jobId.substring(0, 8);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 transition-all duration-300">
      {/* Job Header */}
      <div 
        className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="text-xl font-bold text-gray-800">Job ID: {shortJobId}</h2>
          <div className="flex gap-4 mt-1 text-sm text-gray-600">
            <span>{candidateCount} Candidates</span>
            <span>Avg. Score: {avgScore.toFixed(1)}%</span>
          </div>
        </div>
        <div className="bg-white p-2 rounded-full shadow-sm">
          {isExpanded ? (
            <ChevronUp size={20} className="text-blue-600" />
          ) : (
            <ChevronDown size={20} className="text-blue-600" />
          )}
        </div>
      </div>
      
      {/* Candidates List */}
      {isExpanded && (
        <div className="p-4 bg-gray-50">
          {rankedJob.candidates.length > 0 ? (
            <div className="space-y-4">
              {rankedJob.candidates.map((candidate, index) => (
                <CandidateCard 
                  key={candidate.userId}
                  candidate={candidate}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No candidates found for this job.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobResultsCard;