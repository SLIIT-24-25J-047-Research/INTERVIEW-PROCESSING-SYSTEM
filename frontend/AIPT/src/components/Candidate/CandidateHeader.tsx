import React, { useState } from 'react';
import './candidateHeader.css';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

interface HeaderProps {
  title: string;
}

function logout() {
  localStorage.clear();
  window.location.reload();
}

const CandidateHeader: React.FC<HeaderProps> = ({ title }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isCandidatePage = location.pathname === '/candidate-home'; // Check if we're on candidate-home page

  return (
    <div className={`header ${isCandidatePage ? 'transparent-header' : ''}`}>
      <div className="header-title">
        {location.pathname !== '/candidate-home' && (
          <Link to="/candidate-home" className="logo-container">
            <img src="/path-to-your-logo.png" alt="Logo" className="logo" />
          </Link>
        )}

        {location.pathname === '/candidate-home' && (
          <Link to="/candidate-home" className="logo-container">
            <img src="/path-to-your-candidate-home-logo.png" alt="Home Logo" className="home-logo" />
          </Link>
        )}

        <h1>{title}</h1>
      </div>
      <div className="header-buttons">
        <div className="profile-icon-container">
          <FaUserCircle size={30} onClick={toggleDropdown} /> {/* Profile icon */}
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
