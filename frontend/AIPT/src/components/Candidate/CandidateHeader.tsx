
import React, { useEffect, useState } from 'react';
import './css/candidateHeader.css';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import Logo from '../../assets/logoAPIT.png'
import { FaBell } from 'react-icons/fa';

interface HeaderProps {
  title: string;
  notificationCount?: number;
}

function logout() {
  localStorage.clear();
  window.location.reload();
}

const CandidateHeader: React.FC<HeaderProps> = ({ title , notificationCount = 0 }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const handleScroll = () => {
    if (location.pathname === '/candidate-home' && window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]); 

  const isCandidatePage = location.pathname === '/candidate-home';

 

  return (
    
    <div
      className={`header ${isCandidatePage ? (isScrolled ? 'header-scrolled' : 'transparent-header') : ''}`}
    >
      <div className="header-title ">
        {location.pathname !== '/candidate-home' && (
          <Link to="/candidate-home" className="logo-container">
            <img src="../../assets/AIPT.png" alt="Logo" className="logo" />
          </Link>
        )}

        {location.pathname === '/candidate-home' && (
          <Link to="/candidate-home" className="logo-container">
            <img src={Logo} alt="Home Logo" className="home-logo w-12 h-12" />
          </Link>
        )}

        <h1 className='text-white'>{title}</h1>
      </div>
      <div className="header-buttons">
      <Link to="/notifications" className="notification-button">
        <FaBell size={24} />
        {notificationCount > 0 && (
          <span className="notification-badge">{notificationCount}</span>
        )}
      </Link>
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
