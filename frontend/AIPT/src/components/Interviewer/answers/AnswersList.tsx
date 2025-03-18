import React, { useState, useEffect } from 'react';
import { Calendar, User, ChevronRight, Code, Mic, AlertCircle } from 'lucide-react';
import { 
  TechnicalSubmissionGroup, 
  NonTechnicalSubmissionGroup, 
  CombinedSubmission 
} from '../../types/admin';
import { useNavigate } from 'react-router-dom';
interface AnswersListProps {
  onSelectInterview: (technicalId?: string, nonTechnicalId?: string) => void;
}

export const AnswersList: React.FC<AnswersListProps> = ({ onSelectInterview }) => {
  const [combinedSubmissions, setCombinedSubmissions] = useState<CombinedSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
              // Update existing entry
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
        setCombinedSubmissions(Array.from(submissionMap.values()));
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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Interview Submissions</h1>
      <div className="grid gap-6">
        {combinedSubmissions.map((submission, index) => (
          <div key={`${submission.userId}-${submission.jobId}-${index}`} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Candidate Submission
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      User ID: {submission.userId}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Job ID: {submission.jobId}
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
          </div>
        ))}
      </div>
    </div>
  );
};