import React, { useState } from 'react';
import { AnswersList } from './AnswersList';
import { AnswerDetails } from './AnswerDetails';
import DashboardLayout from '../DashboardLayout';

export const AnswersDashboard: React.FC = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);

  return (
    <DashboardLayout>
    <div>
      {selectedSubmission ? (
        <AnswerDetails
          submissionId={selectedSubmission}
          onBack={() => setSelectedSubmission(null)}
        />
      ) : (
        <AnswersList onSelectInterview={setSelectedSubmission} />
      )}
    </div>
    </DashboardLayout>
  );
};