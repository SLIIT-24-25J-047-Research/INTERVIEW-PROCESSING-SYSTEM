import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../../components/Candidate/CandidateSidebar';
import Header from '../../../components/Candidate/CandidateHeader';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Calendar, Clock, Video, AlertCircle } from 'lucide-react';

interface Schedule {
  _id: string;
  userId: string;
  userName: string;
  interviewDate: string;
  interviewTime: string;
  media: string;
  status: string;
}

const ScheduledInterviewPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const userId = '6759439c7cf33b13b125340e';
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/non-t-interviews/schedule/user/${userId}`)
      .then((response) => {
        if (response.data?.schedules) {
          setSchedules(response.data.schedules);
        }
      })
      .catch((error) => {
        console.error("Error fetching interview schedules:", error);
      });
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden mt-20">
        <Header title="Scheduled Interviews" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {schedules.length === 0 ? (
              <Card className="mt-8">
                <CardContent className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No Scheduled Interviews
                    </h3>
                    <p className="mt-2 text-gray-500">
                      You don't have any interviews scheduled at the moment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schedules.map((schedule) => (
                  <Card key={schedule._id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {new Date(schedule.interviewDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
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
                          
                          <Button
                            onClick={() => navigate(schedule.media === 'Zoom' ? '/zoom-interview' : '/non-tech-interview')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Join Interview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScheduledInterviewPage;