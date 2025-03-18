import React, { useState, useEffect } from 'react';
import { Calendar, User, ChevronRight, Code, Mic, AlertCircle, Briefcase } from 'lucide-react';
import {
  TechnicalSubmissionGroup,
  NonTechnicalSubmissionGroup,
  CombinedSubmission
} from '../../types/admin';
import { useNavigate } from 'react-router-dom';

interface AnswersListProps {
  onSelectInterview: (technicalId?: string, nonTechnicalId?: string) => void;
}

interface InterviewMarks {
  [key: string]: number;
}

export const AnswersList: React.FC<AnswersListProps> = ({ onSelectInterview }) => {
  const [combinedSubmissions, setCombinedSubmissions] = useState<CombinedSubmission[]>([]);
  const [interviewMarks, setInterviewMarks] = useState<InterviewMarks>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'submissions' | 'ranking'>('submissions');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Fetch both technical and non-technical submissions
        const [technicalResponse, nonTechnicalResponse] = await Promise.all([
          fetch('http://localhost:5000/api/techAnswers/answers/grouped'),
          fetch('http://localhost:5000/api/answers/grouped')
        ]);

        if (!technicalResponse.ok || !nonTechnicalResponse.ok) {
          throw new Error('Failed to fetch submissions');
        }

        const technicalData: TechnicalSubmissionGroup[] = await technicalResponse.json();
        const nonTechnicalData = await nonTechnicalResponse.json();

        // new data structure
        const nonTechnicalGroups: NonTechnicalSubmissionGroup[] = nonTechnicalData.success ? nonTechnicalData.data : [];

        // Create a map of all unique jobId + userId combinations
        const submissionMap = new Map<string, CombinedSubmission>();

        // Process technical submissions
        technicalData.forEach(group => {
          group.answers.forEach(submission => {
            const userId = submission.userId;
            const jobId = submission.jobId;
            const key = `${userId}-${jobId}`;

            submissionMap.set(key, {
              userId,
              jobId,
              technical: submission,
              nonTechnical: undefined
            });
          });
        });

        // Process non-technical submissions
        nonTechnicalGroups.forEach(group => {
          if (!group.responses || !group.responses.length) return;

          group.responses.forEach(submission => {
            const userId = submission.userId;
            const jobId = submission.jobId;

            if (!userId || !jobId) return;

            const key = `${userId}-${jobId}`;

            if (submissionMap.has(key)) {
              const existingSubmission = submissionMap.get(key)!;
              existingSubmission.nonTechnical = submission;
            } else {
              submissionMap.set(key, {
                userId,
                jobId,
                technical: undefined,
                nonTechnical: submission
              });
            }
          });
        });

        // Convert map to array
        const submissionsArray = Array.from(submissionMap.values());
        setCombinedSubmissions(submissionsArray);

        // Fetch marks for each technical interview
        const marks: InterviewMarks = {};
        for (const submission of submissionsArray) {
          if (submission.technical) {
            const response = await fetch(`http://localhost:5000/api/results/${submission.technical._id}`);
            if (response.ok) {
              const data = await response.json();
              marks[submission.technical._id] = data.totalScore;
            }
          }
        }
        setInterviewMarks(marks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Group by jobId
  const getSubmissionsByJobId = () => {
    const jobGroups = new Map<string, CombinedSubmission[]>();

    combinedSubmissions.forEach(submission => {
      const jobId = submission.jobId;
      if (!jobGroups.has(jobId)) {
        jobGroups.set(jobId, []);
      }
      jobGroups.get(jobId)!.push(submission);
    });

    return Array.from(jobGroups.entries());
  };

  // Sort candidates by marks
  const getSortedCandidates = () => {
    return combinedSubmissions
      .filter(submission => submission.technical && interviewMarks[submission.technical._id] !== undefined)
      .map(submission => ({
        userId: submission.userId,
        jobId: submission.jobId,
        technicalId: submission.technical!._id,
        totalScore: interviewMarks[submission.technical!._id]
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
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

  const jobGroups = getSubmissionsByJobId();
  const sortedCandidates = getSortedCandidates();
  const bestCandidate = sortedCandidates.length > 0 ? sortedCandidates[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Interview Submissions</h1>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'submissions' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
        >
          Submissions
        </button>
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'ranking' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
        >
          Ranking
        </button>
      </div>
      {activeTab === 'submissions' ? (
        <div className="grid gap-6">
          {jobGroups.map(([jobId, submissions]) => (
            <div key={jobId} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center">
                <Briefcase className="w-5 h-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Job ID: {jobId}
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {submissions.map((submission, index) => (
                  <div key={`${submission.userId}-${index}`} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            User ID: {submission.userId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Technical Interview  */}
                      <div>
                        {submission.technical ? (
                          <button
                            onClick={() => onSelectInterview(submission.technical?._id)}
                            className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <div className="flex items-center">
                              <Code className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="font-medium text-blue-700">Technical Interview</span>
                              {interviewMarks[submission.technical._id] !== undefined && (
                                <span className="ml-2 text-blue-600">
                                  ({interviewMarks[submission.technical._id]} marks)
                                </span>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-blue-600" />
                          </button>
                        ) : (
                          <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                              <span className="font-medium text-gray-700">Technical Interview Not Yet Attended</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Non-Technical Interview  */}
                      <div>
                        {submission.nonTechnical ? (
                          <button
                            onClick={() => onSelectInterview(undefined, submission.nonTechnical?._id)}
                            className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                          >
                            <div className="flex items-center">
                              <Mic className="w-5 h-5 text-purple-600 mr-2" />
                              <span className="font-medium text-purple-700">Non-Technical Interview</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-purple-600" />
                          </button>
                        ) : (
                          <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                              <span className="font-medium text-gray-700">Non-Technical Interview Not Yet Attended</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Candidate Ranking</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {sortedCandidates.map((candidate, index) => (
              <div key={candidate.userId} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                    <span className="font-medium text-gray-700">User ID: {candidate.userId}</span>
                    <span className="text-sm text-gray-500">Job ID: {candidate.jobId}</span>
                  </div>
                  <span className="text-sm text-gray-700">{candidate.totalScore} marks</span>
                </div>
              </div>
            ))}
          </div>
          {bestCandidate && (
            <div className="px-6 py-4 bg-green-50">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-green-700">Best Candidate:</span>
                <span className="text-sm text-gray-700">User ID: {bestCandidate.userId}</span>
                <span className="text-sm text-gray-500">Job ID: {bestCandidate.jobId}</span>
                <span className="text-sm text-gray-700">{bestCandidate.totalScore} marks</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};