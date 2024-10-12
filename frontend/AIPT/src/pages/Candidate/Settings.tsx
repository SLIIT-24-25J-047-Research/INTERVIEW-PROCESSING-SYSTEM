import React from 'react';
import Sidebar from '../../components/Candidate/CandidateSidebar';
import Header from '../../components/Candidate/CandidateHeader';
import '../../components/Candidate/candidateLayout.css';

const Settings: React.FC = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Header title="Settings" />
                <div className="content">
                    <h2>Account Settings</h2>
                    <p>Adjust your preferences and account settings here.</p>
                    {/* Add settings form or controls here */}
                </div>
            </div>
        </div>
    );
};

export default Settings;
