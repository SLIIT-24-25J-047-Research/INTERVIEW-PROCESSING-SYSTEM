import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Award, Brain, UserCheck } from 'lucide-react';
import mockTechnicalResults from '../Interviewer/answers/data/technicalResults';
import mockNonTechnicalResults from '../Interviewer/answers/data/nonTechnicalResults';

interface Score {
  score: number;
  maxScore: number;
}

interface TechnicalInterview {
  _id: { $oid: string };
  userId: { $oid: string } | string;
  createdAt: { $date: string } | string;
  totalScore: number;
  maxPossibleScore: number;
  scores: Score[];
  sttresslevel: string;
}

interface NonTechnicalInterview {
  _id: { $oid: string };
  userId: string;
  createdAt: { $date: string } | string;
  responses: {
    marks: number;
  }[];
  prediction: string;
  sttresslevel: string;
}

interface CandidateViewProps {
  userId?: string;
}

const CandidateView: React.FC<CandidateViewProps> = ({ userId }) => {
  const [technicalInterviews, setTechnicalInterviews] = useState<TechnicalInterview[]>([]);
  const [nonTechnicalInterviews, setNonTechnicalInterviews] = useState<NonTechnicalInterview[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch candidate's interviews
    const fetchInterviews = () => {
      try {
        let technical: TechnicalInterview[] = [];
        let nonTechnical: NonTechnicalInterview[] = [];
        
        if (userId) {
          technical = mockTechnicalResults.filter(result => 
            (typeof result.userId === 'object' ? result.userId.$oid : result.userId) === userId
          );
          
          nonTechnical = mockNonTechnicalResults.filter(
            result => result.userId === userId
          );
        } else {
          // If no userId provided, show all interviews (or handle differently)
          technical = [...mockTechnicalResults];
          nonTechnical = [...mockNonTechnicalResults];
        }
        
        setTechnicalInterviews(technical);
        setNonTechnicalInterviews(nonTechnical);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [userId]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateObj: { $date: string } | string) => {
    try {
      const dateString = typeof dateObj === 'object' ? dateObj.$date : dateObj;
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Invalid date format:', dateObj);
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading interview results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">My Interview Results</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {technicalInterviews.length === 0 && nonTechnicalInterviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <Award className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Interviews Found</h2>
            <p className="text-gray-600">
              {userId ? "You haven't participated in any interviews yet." : "No interviews available."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Technical Interviews */}
            {technicalInterviews.map((interview, index) => (
              <div key={interview._id.$oid} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection(`tech-${interview._id.$oid}`)}
                >
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-blue-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Technical Interview #{index + 1}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {formatDate(interview.createdAt)}
                      </p>
                    </div>
                  </div>
                  {expandedSections[`tech-${interview._id.$oid}`] ? 
                    <ChevronUp className="w-5 h-5 text-gray-600" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  }
                </div>
                
                {expandedSections[`tech-${interview._id.$oid}`] && (
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">Overall Score</span>
                        <span className={`font-bold ${getScoreColor(interview.totalScore, interview.maxPossibleScore)}`}>
                          {interview.totalScore}/{interview.maxPossibleScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 rounded-full h-2"
                          style={{ width: `${(interview.totalScore / interview.maxPossibleScore) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {interview.scores.map((score: Score, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Question {idx + 1}</span>
                          <span className={`font-medium ${getScoreColor(score.score, score.maxScore)}`}>
                            {score.score}/{score.maxScore}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Stress Level:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${interview.sttresslevel === 'low' ? 'bg-green-100 text-green-800' :
                            interview.sttresslevel === 'high' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'}`}>
                          {interview.sttresslevel}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Non-Technical Interviews */}
            {nonTechnicalInterviews.map((interview, index) => (
              <div key={interview._id.$oid} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection(`nontech-${interview._id.$oid}`)}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Non-Technical Interview #{index + 1}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {formatDate(interview.createdAt)}
                      </p>
                    </div>
                  </div>
                  {expandedSections[`nontech-${interview._id.$oid}`] ? 
                    <ChevronUp className="w-5 h-5 text-gray-600" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  }
                </div>
                
                {expandedSections[`nontech-${interview._id.$oid}`] && (
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">Total Score</span>
                        <span className={`font-bold ${getScoreColor(
                          interview.responses.reduce((sum: number, r: any) => sum + r.marks, 0),
                          interview.responses.length * 10
                        )}`}>
                          {interview.responses.reduce((sum: number, r: any) => sum + r.marks, 0)}/
                          {interview.responses.length * 10}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 rounded-full h-2"
                          style={{ 
                            width: `${(interview.responses.reduce((sum: number, r: any) => sum + r.marks, 0) / 
                              (interview.responses.length * 10)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {interview.responses.map((response: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Question {idx + 1}</span>
                          <span className={`font-medium ${getScoreColor(response.marks, 10)}`}>
                            {response.marks}/10
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Confidence:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${interview.prediction === 'confident' ? 'bg-green-100 text-green-800' :
                            interview.prediction === 'nervous' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'}`}>
                          {interview.prediction}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Stress Level:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${interview.sttresslevel === 'low' ? 'bg-green-100 text-green-800' :
                            interview.sttresslevel === 'high' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'}`}>
                          {interview.sttresslevel}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CandidateView;