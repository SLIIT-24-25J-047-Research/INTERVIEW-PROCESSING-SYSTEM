import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ScheduledInterviewPage: React.FC = () => {
  const [isScheduled, setIsScheduled] = useState(false);
  const [interviewType, setInterviewType] = useState<string>('');
  const userId = 'yourUserIdHere'; // Get this from your authentication context or cookie
  const navigate = useNavigate();

  useEffect(() => {
    // API call to check if an interview is scheduled
    axios
      .get(`http://localhost:5000/api/non-t-interviews/schedule/get/${userId}`)
      .then((response) => {
        if (response.data && response.data.isScheduled) {
          setIsScheduled(true);
          setInterviewType(response.data.interviewType); // Example: "technical" or "non-technical"
        }
      })
      .catch((error) => {
        console.error("Error fetching interview schedule:", error);
      });
  }, [userId]);

  if (!isScheduled) {
    return <div>You don't have any scheduled interviews.</div>;
  }

  return (
    <div>
      <h1>Your Interview Schedule</h1>
      <p>Your interview is scheduled for a {interviewType} interview.</p>
      <button onClick={() => navigate(interviewType === 'technical' ? '/tech-interview' : '/non-tech-interview')}>
        Go to {interviewType} Interview
      </button>
    </div>
  );
};

export default ScheduledInterviewPage;
