import React from 'react';

interface Candidate {
  userId: string;
  jobId: string;
  totalScore: number;
  maxPossibleScore: number;
}

interface SortedCandidatesTabProps {
  candidates: Candidate[];
}

export const SortedCandidatesTab: React.FC<SortedCandidatesTabProps> = ({ candidates }) => {
  // Sort candidates by totalScore in descending order
  const sortedCandidates = [...candidates].sort((a, b) => b.totalScore - a.totalScore);
  const bestCandidate = sortedCandidates[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Sorted Candidates</h1>

      {/* Best Candidate Suggestion */}
      {bestCandidate && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Best Candidate</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-700">
              <span className="font-semibold">User ID:</span> {bestCandidate.userId} <br />
              <span className="font-semibold">Total Score:</span> {bestCandidate.totalScore}/{bestCandidate.maxPossibleScore}
            </p>
          </div>
        </div>
      )}

      {/* Table for Sorted Candidates */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCandidates.map((candidate, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.jobId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.totalScore}/{candidate.maxPossibleScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};