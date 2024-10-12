import React from 'react';
import DashboardLayout from '../../components/Interviewer/DashboardLayout';

const InterviewerHome: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-5">
        <h2 className="text-2xl font-bold mb-4">Welcome to Interviewer Dashboard</h2>
        <p className="mb-4">මෙතනට එක එක එව්වා දාන්න</p>
        {/* Additional content*/}
      </div>
    </DashboardLayout>
  );
};


export default InterviewerHome;
