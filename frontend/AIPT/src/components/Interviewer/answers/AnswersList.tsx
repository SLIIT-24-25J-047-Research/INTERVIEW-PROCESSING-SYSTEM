import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, ChevronRight } from 'lucide-react';
import { SubmissionGroup } from '../../types/admin';

interface AnswersListProps {
  onSelectInterview: (interviewId: string) => void;
}

export const AnswersList: React.FC<AnswersListProps> = ({ onSelectInterview }) => {
  const [submissions, setSubmissions] = useState<SubmissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/techAnswers/answers/grouped');
        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }
        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Technical Interview Submissions</h1>
      <div className="grid gap-6">
        {submissions.map((group) => (
          <div key={group._id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Interview Session {group._id}
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {group.answers.map((submission) => (
                <div
                  key={submission._id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onSelectInterview(submission._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          User: {submission.userId}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(submission.submittedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {submission.answers.length} answers submitted
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};