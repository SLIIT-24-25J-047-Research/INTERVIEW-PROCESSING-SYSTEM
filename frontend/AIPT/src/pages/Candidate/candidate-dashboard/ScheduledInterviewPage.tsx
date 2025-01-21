import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../../components/Candidate/CandidateSidebar';
import Header from '../../../components/Candidate/CandidateHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Calendar, Clock, Video, AlertCircle, Timer } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';

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

  const renderEmptyState = (type: string) => (
    <Card className="mt-4">
      <CardContent className="flex items-center justify-center p-12">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No {type} Interviews</h3>
          <p className="mt-2 text-gray-500">
            You don't have any {type.toLowerCase()} interviews scheduled at the moment.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderTechnicalInterviews = () =>
    technicalSchedules.length ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicalSchedules.map((schedule) => (
          <Card key={schedule._id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{formatDate(schedule.testDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{schedule.testTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{schedule.duration} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                  <Button onClick={() => window.open(schedule.testLink, '_blank')} className="bg-blue-600 hover:bg-blue-700">
                    Start Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      renderEmptyState('Technical')
    );

  const renderNonTechnicalInterviews = () =>
    nonTechnicalSchedules.length ? (
      <div className=" mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nonTechnicalSchedules.map((schedule) => (
          <Card key={schedule._id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{formatDate(schedule.interviewDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{schedule.interviewTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{schedule.media}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                  <Button onClick={() => navigate('/join-interview')} className="bg-blue-600 hover:bg-blue-700">
                    Join Interview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      renderEmptyState('Non-Technical')
    );

  return (
    <div className="mt-20  flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Scheduled Interviews" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="technical" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="technical">Technical Interviews</TabsTrigger>
                <TabsTrigger value="nonTechnical">Non-Technical Interviews</TabsTrigger>
              </TabsList>
              <TabsContent value="technical">{renderTechnicalInterviews()}</TabsContent>
              <TabsContent value="nonTechnical">{renderNonTechnicalInterviews()}</TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScheduledInterviewPage;
