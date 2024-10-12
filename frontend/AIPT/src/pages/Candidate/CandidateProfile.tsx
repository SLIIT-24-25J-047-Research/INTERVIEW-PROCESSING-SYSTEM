import React from 'react';
import Sidebar from '../../components/Candidate/CandidateSidebar';
import Header from '../../components/Candidate/CandidateHeader';
import '../../components/Candidate/candidateLayout.css';

const CandidateProfile: React.FC = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Header title="Profile" />
                <div className="content">
                    <h2>Profile Information</h2>
                    <p>Here you can update your profile details.</p>
                    {/* Add profile editing form or display info here */}
                </div>
            </div>
        </div>
    );
};

export default CandidateProfile;
