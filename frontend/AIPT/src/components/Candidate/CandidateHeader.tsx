import React, { useState } from 'react';
import './candidateHeader.css';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';  // Import the profile icon

interface HeaderProps {
  title: string;
}

function logout() {
  localStorage.clear();
  window.location.reload();
}

const CandidateHeader: React.FC<HeaderProps> = ({ title }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // State for dropdown visibility

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);  // Toggle the dropdown menu visibility
  };

  return (
    <div className="header">
      <div className="header-title">
        <h1>{title}</h1>
        <h1>Candidate Dashboard</h1>
      </div>
      <div className="header-buttons">
        <div className="profile-icon-container">
          <FaUserCircle size={30} onClick={toggleDropdown} />  {/* Profile icon */}
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
              <Link to="/login" className="dropdown-item" onClick={logout}>Logout</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateHeader;
