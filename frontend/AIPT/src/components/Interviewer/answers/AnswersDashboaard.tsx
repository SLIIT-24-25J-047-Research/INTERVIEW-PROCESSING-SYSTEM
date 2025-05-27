import React, { useState } from 'react';
import { AnswersList } from './AnswersList';
import { AnswerDetails } from './AnswerDetails';
import DashboardLayout from '../DashboardLayout';
import { NonTechnicalAnswerDetails } from './NonTechnicalInterviewDetails';


export const AnswersDashboard: React.FC = () => {
  const [selectedTechnicalId, setSelectedTechnicalId] = useState<string | null>(null);
  const [selectedNonTechnicalId, setSelectedNonTechnicalId] = useState<string | null>(null);

  const handleSelectInterview = (technicalId?: string, nonTechnicalId?: string) => {
    if (technicalId) {
      setSelectedTechnicalId(technicalId);
      setSelectedNonTechnicalId(null);
    } else if (nonTechnicalId) {
      setSelectedNonTechnicalId(nonTechnicalId);
      setSelectedTechnicalId(null);
    }
  };

  const handleBack = () => {
    setSelectedTechnicalId(null);
    setSelectedNonTechnicalId(null);
  };

  if (selectedTechnicalId) {
    return <AnswerDetails submissionId={selectedTechnicalId} onBack={handleBack} />;
  }

  if (selectedNonTechnicalId) {
    return <NonTechnicalAnswerDetails submissionId={selectedNonTechnicalId} onBack={handleBack} />;
  }

  return <AnswersList onSelectInterview={handleSelectInterview} />;
};

