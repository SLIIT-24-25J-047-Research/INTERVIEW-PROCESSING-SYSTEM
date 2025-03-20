import React from 'react';
import Sidebar from '../../../components/Candidate/CandidateSidebar';
import Header from '../../../components/Candidate/CandidateHeader';

import NonTechInterview from '../../../components/Candidate/non-tech-interview/NonTechInterview';

const NonTechInterviewPage: React.FC = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Header title="Assignments" />
                <div className="content">
                    <h2>Your Assignment</h2>
               

                    <NonTechInterview />
                </div>
            </div>
        </div>
    );
};

export default NonTechInterviewPage;
