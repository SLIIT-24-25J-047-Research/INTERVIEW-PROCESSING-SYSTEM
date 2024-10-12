import React, { PropsWithChildren } from 'react';
import CandidateSidebar from './CandidateSidebar';
import CandidateHeader from './CandidateHeader';
import './candidateLayout.css'; // Create this CSS file

const CandidateLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
      <div className="dashboard-layout">
        <CandidateSidebar />
        <div className="main-content">
          <CandidateHeader />
          <div className="content">
            {children}
          </div>
        </div>
      </div>
    );
  };

export default CandidateLayout;
