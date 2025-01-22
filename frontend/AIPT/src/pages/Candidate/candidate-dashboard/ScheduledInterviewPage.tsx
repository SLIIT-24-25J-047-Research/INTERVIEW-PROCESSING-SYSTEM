import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../../components/Candidate/CandidateSidebar';
import Header from '../../../components/Candidate/CandidateHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Calendar, Clock, Video, AlertCircle, Timer, CheckCircle2, Briefcase } from 'lucide-react';

interface NonTechnicalSchedule {
  _id: string;
  userId: string;
  userName: string;
  interviewDate: string;
  interviewTime: string;
  media: string;
  status: string;
  jobId: {
    _id: string;
    description: string;
  };
}

interface TechnicalSchedule {
  _id: string;
  userId: string;
  userName: string;
  testDate: string;
  testTime: string;
  duration: number;
  status: string;
  testLink: string;
  jobId: string;
}

interface JobApplication {
  jobId: string;
  jobDescription: string;
  technicalInterview: TechnicalSchedule | null;
  nonTechnicalInterview: NonTechnicalSchedule | null;
}

const ScheduledInterviewPage: React.FC = () => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const userId = '675932b49c1a60d97c147419';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const [technicalRes, nonTechnicalRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/t-interviews/schedule/user/${userId}`),
          axios.get(`http://localhost:5000/api/non-t-interviews/schedule/user/${userId}`)
        ]);

        const techSchedules = technicalRes.data?.schedules || [];
        const nonTechSchedules = nonTechnicalRes.data?.schedules || [];

        // Group interviews by jobId
        const applications = new Map<string, JobApplication>();

        techSchedules.forEach((tech: TechnicalSchedule) => {
          if (!applications.has(tech.jobId)) {
            applications.set(tech.jobId, {
              jobId: tech.jobId,
              jobDescription: '',
              technicalInterview: tech,
              nonTechnicalInterview: null
            });
          } else {
            applications.get(tech.jobId)!.technicalInterview = tech;
          }
        });

        nonTechSchedules.forEach((nonTech: NonTechnicalSchedule) => {
          if (!applications.has(nonTech.jobId._id)) {
            applications.set(nonTech.jobId._id, {
              jobId: nonTech.jobId._id,
              jobDescription: nonTech.jobId.description,
              technicalInterview: null,
              nonTechnicalInterview: nonTech
            });
          } else {
            const app = applications.get(nonTech.jobId._id)!;
            app.jobDescription = nonTech.jobId.description;
            app.nonTechnicalInterview = nonTech;
          }
        });

        setJobApplications(Array.from(applications.values()));
      } catch (error) {
        console.error('Error fetching interview schedules:', error);
      }
    };

    fetchInterviews();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'updated':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const getProgress = (application: JobApplication) => {
    if (!application.technicalInterview) return 0;
    if (application.technicalInterview.status.toLowerCase() === 'completed') return 50;
    if (application.nonTechnicalInterview?.status.toLowerCase() === 'completed') return 100;
    return 25;
  };

  return (
    <div className="mt-20 flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Interview Process" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {jobApplications.map((application) => (
              <Card key={application.jobId} className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-lg">
                      Job Application: {application.jobDescription || 'Position'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            Progress
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {getProgress(application)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex h-2 mb-4 overflow-hidden rounded bg-blue-200">
                        <div
                          className="flex flex-col justify-center overflow-hidden bg-blue-500"
                          role="progressbar"
                          style={{ width: `${getProgress(application)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Technical Interview Card */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Technical Assessment</h3>
                      {application.technicalInterview ? (
                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{formatDate(application.technicalInterview.testDate)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{application.technicalInterview.testTime}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Timer className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{application.technicalInterview.duration} minutes</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.technicalInterview.status)}`}>
                                  {application.technicalInterview.status}
                                </span>
                                {application.technicalInterview.status.toLowerCase() !== 'completed' && (
                                  <Button
                                    onClick={() => window.open(application.technicalInterview!.testLink, '_blank')}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    Start Test
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="bg-gray-50">
                          <CardContent className="p-4 text-center text-gray-500 text-sm">
                            Technical assessment not scheduled yet
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Non-Technical Interview Card */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">HR Interview</h3>
                      <div className={application.technicalInterview?.status.toLowerCase() !== 'completed' ? 'opacity-50' : ''}>
                        {application.nonTechnicalInterview ? (
                          <Card>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{formatDate(application.nonTechnicalInterview.interviewDate)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{application.nonTechnicalInterview.interviewTime}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Video className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{application.nonTechnicalInterview.media}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.nonTechnicalInterview.status)}`}>
                                    {application.nonTechnicalInterview.status}
                                  </span>
                                  {application.technicalInterview?.status.toLowerCase() === 'completed' && (
                                    <Button
                                      onClick={() => navigate('/join-interview')}
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      Join Interview
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="bg-gray-50">
                            <CardContent className="p-4 text-center text-gray-500 text-sm">
                              HR interview will be scheduled after technical assessment
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScheduledInterviewPage;