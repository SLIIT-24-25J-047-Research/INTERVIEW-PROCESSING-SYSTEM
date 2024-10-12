import React from 'react';
import CandidateLayout from '../../components/Candidate/CandidateLayout';

const CandidateHome: React.FC = () => {
  return (
    <CandidateLayout>
      {/* Add any content for the candidate home page here */}
      <div>
      <h2>Welcome to the Candidate Dashboard!</h2>
      <p>This is where you'll see your assignments, progress, and more.</p>
      </div>
    </CandidateLayout>
  );
};

export default CandidateHome;
