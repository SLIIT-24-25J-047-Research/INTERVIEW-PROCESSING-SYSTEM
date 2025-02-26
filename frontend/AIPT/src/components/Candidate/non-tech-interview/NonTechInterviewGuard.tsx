import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';


const NonTechnicalInterviewGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  interface Interview {
    _id: string;
    userId: string;
    status: string;
    interviewDate: string;
    interviewTime: string;
    // other properties 
  }

  const [interview, setInterview] = useState<Interview | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  //auth context eka use karanna passe
  const userId = "675932b49c1a60d97c147419";


useEffect(() => {
    const validateInterviewAccess = async () => {
      const startTime = Date.now();
      try {
        setLoading(true);
        const startTime = Date.now();
        
        // Get current date and time
        const now = new Date();
        
        const response = await axios.get(
          `http://localhost:5000/api/non-t-interviews/schedule/user/${userId}`
        );
        
        const schedules = response.data?.schedules || [];
        console.log('schedules', schedules);
        
        if (schedules.length > 0) {
          // release period eka (within ±15 min)
          const activeInterview = schedules.find((interview: Interview) => {
            if (interview.status !== 'scheduled') return false;
    
            const interviewDate = new Date(interview.interviewDate);
            const timeMatch = interview.interviewTime.match(/(\d+):(\d+)\s+(AM|PM)/);
            
            if (!timeMatch) return false;
            
            const [_, hours, minutes, period] = timeMatch;
            
            // Convert to 24-hour format
            let hour = parseInt(hours);
            if (period === 'PM' && hour < 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
        
            interviewDate.setHours(hour, parseInt(minutes), 0, 0);
    
            const timeDiff = Math.abs(now.getTime() - interviewDate.getTime()) / (1000 * 60);
            return timeDiff <= 15;
          });
          
          console.log('activeInterview', activeInterview);
          
          if (activeInterview) {
            if (!id) {

              const elapsedTime = Date.now() - startTime;
              const remainingTime = Math.max(0, 1500 - elapsedTime);
              
              await new Promise(resolve => setTimeout(resolve, remainingTime));
              
              navigate(`/non-tech-interview/${activeInterview._id}`);
              return;
            } else if (id === activeInterview._id) {
              setInterview(activeInterview);
              setAuthorized(true);
            } else {
              setAuthorized(false);
            }
          } else {

            setAuthorized(false);
          }
        } else {

          setAuthorized(false);
        }

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1500 - elapsedTime);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        
      } catch (error) {
        console.error('Error validating interview access:', error);
        setAuthorized(false);
        
        // Even on error, ensure minimum loading time
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1500 - elapsedTime);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      } finally {
        setLoading(false);
      }
    };
    
    validateInterviewAccess();
  }, [id, userId, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-600">Verifying interview session...</p>
        </div>
      </div>
    );
  }
  
  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full mx-4">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Interview Not Available
          </h1>
          <p className="text-center text-gray-600 mb-6">
            You don't have any active non-technical interview sessions at this time.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // If we get here, the user is authorized to access the interview
  // We can also pass the interview data to the component
  return <>{React.cloneElement(children as React.ReactElement, { interviewData: interview })}</>;
};

export default NonTechnicalInterviewGuard;