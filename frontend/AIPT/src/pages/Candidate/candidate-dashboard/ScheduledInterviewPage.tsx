import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../../components/Candidate/CandidateSidebar';
import Header from '../../../components/Candidate/CandidateHeader';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Calendar, Clock, Video, AlertCircle, Timer, CheckCircle2 } from 'lucide-react';

interface NonTechnicalSchedule {
  _id: string;
  userId: string;
  userName: string;
  interviewDate: string;
  interviewTime: string;
  media: string;
  status: string;
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
}

const ScheduledInterviewPage: React.FC = () => {
  const [technicalSchedules, setTechnicalSchedules] = useState<TechnicalSchedule[]>([]);
  const [nonTechnicalSchedules, setNonTechnicalSchedules] = useState<NonTechnicalSchedule[]>([]);
  const userId = '60a7b8b9a5c0f0845e123456';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const [technicalRes, nonTechnicalRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/t-interviews/schedule/user/${userId}`),
          axios.get(`http://localhost:5000/api/non-t-interviews/schedule/user/${userId}`)
        ]);

        setTechnicalSchedules(technicalRes.data?.schedules || []);
        setNonTechnicalSchedules(nonTechnicalRes.data?.schedules || []);
      } catch (error) {
        console.error('Error fetching interview schedules:', error);
      }
    };

    fetchInterviews();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const getStepStatus = (technicalStatus: string | undefined, nonTechnicalStatus: string | undefined) => {
    if (!technicalStatus) return 'pending';
    if (technicalStatus.toLowerCase() === 'completed') return 'completed';
    if (technicalStatus.toLowerCase() === 'scheduled') return 'current';
    return 'pending';
  };

  return (
    <div className="mt-20 flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Interview Process" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10" />
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-blue-500 -z-10" 
                     style={{ width: getStepStatus(technicalSchedules[0]?.status, nonTechnicalSchedules[0]?.status) === 'completed' ? '100%' : '50%' }} />
                
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${getStepStatus(technicalSchedules[0]?.status, undefined) === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : getStepStatus(technicalSchedules[0]?.status, undefined) === 'current'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'}`}>
                    {getStepStatus(technicalSchedules[0]?.status, undefined) === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                  </div>
                  <span className="mt-2 font-medium">Technical Interview</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${getStepStatus(technicalSchedules[0]?.status, nonTechnicalSchedules[0]?.status) === 'completed' 
                      ? 'bg-green-500 text-white'
                      : getStepStatus(technicalSchedules[0]?.status, nonTechnicalSchedules[0]?.status) === 'current' 
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'}`}>
                    {getStepStatus(technicalSchedules[0]?.status, nonTechnicalSchedules[0]?.status) === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                  </div>
                  <span className="mt-2 font-medium">Non-Technical Interview</span>
                </div>
              </div>
            </div>

            {/* Technical Interview Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-6">Technical Assessment</h2>
              {technicalSchedules.length > 0 ? (
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-600">{formatDate(technicalSchedules[0].testDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-600">{technicalSchedules[0].testTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Timer className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-600">{technicalSchedules[0].duration} minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(technicalSchedules[0].status)}`}>
                          {technicalSchedules[0].status}
                        </span>
                        {technicalSchedules[0].status.toLowerCase() !== 'completed' && (
                          <Button 
                            onClick={() => window.open(technicalSchedules[0].testLink, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Start Assessment
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-50">
                  <CardContent className="p-6">
                    <div className="text-center text-gray-500">
                      No technical assessment scheduled yet
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Non-Technical Interview Section */}
            <div className={technicalSchedules[0]?.status.toLowerCase() !== 'completed' ? 'opacity-50' : ''}>
              <h2 className="text-xl font-semibold mb-6">HR Interview</h2>
              {nonTechnicalSchedules.length > 0 ? (
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-600">{formatDate(nonTechnicalSchedules[0].interviewDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-600">{nonTechnicalSchedules[0].interviewTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Video className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-600">{nonTechnicalSchedules[0].media}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(nonTechnicalSchedules[0].status)}`}>
                          {nonTechnicalSchedules[0].status}
                        </span>
                        {technicalSchedules[0]?.status.toLowerCase() === 'completed' && (
                          <Button 
                            onClick={() => navigate('/join-interview')}
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
                  <CardContent className="p-6">
                    <div className="text-center text-gray-500">
                      HR interview will be scheduled after technical assessment
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScheduledInterviewPage;