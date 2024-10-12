import React from 'react';
import './candidateHeader.css'; 
import { Link } from 'react-router-dom';


interface HeaderProps {

  title: string;

}

function logout() {
  localStorage.clear();
  window.location.reload();
}


const CandidateHeader: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="header">
      <div className="header-title">
        <h1>{title}</h1>
        <h1>Candidate Dashboard</h1>
      </div>
      <div className="header-buttons">
        <Link to="/login" className="logout-btn" onClick={logout}>Logout</Link>
      </div>
    </div>
  );
};





export default CandidateHeader;
