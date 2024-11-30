import React, { PropsWithChildren } from 'react';
import CandidateSidebar from './CandidateSidebar';
import CandidateHeader from './CandidateHeader';
import './candidateLayout.css'; 

const CandidateLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
      <div className="dashboard-layout">
        <CandidateSidebar />
        <div className="main-content">
          <CandidateHeader title="Dashboard" />
          <div className="content">
            {children}
          </div>
        </div>
      </div>
    );
  };

export default CandidateLayout;
