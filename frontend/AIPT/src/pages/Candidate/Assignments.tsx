import React from 'react';
import Sidebar from '../../components/Candidate/CandidateSidebar';
import Header from '../../components/Candidate/CandidateHeader';
import '../../components/Candidate/css/candidateLayout.css'; // Assuming your layout styles are here
import AnswerQuestions from '../../components/Candidate/AnswerQuestions';

const Assignments: React.FC = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Header title="Assignments" />
                <div className="content">
                    <h2>Your Assignments</h2>
                    <p>This is where you can view your assignments and their progress.</p>
                    {/* Add your assignments content here */}

                    <AnswerQuestions />
                </div>
            </div>
        </div>
    );
};

export default Assignments;
