import React, { useEffect, useState, useCallback } from 'react';
import '../../Styles/candidateHeader.css';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import Logo from '../../assets/logoAPIT.png';

interface HeaderProps {
  title: string;
  notificationCount?: number;
}

function logout() {
  localStorage.clear();
  window.location.reload();
}

const getUserIdFromToken = (token: string): string => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const payloadData = JSON.parse(decodedPayload);
    return payloadData.id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return '';
  }
};

const CandidateHeader: React.FC<HeaderProps> = ({ title }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleScroll = useCallback(() => {
    if (location.pathname === '/candidate-home' && window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, [location.pathname]);

  const fetchNotificationCount = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const userId = getUserIdFromToken(token);

      const response = await fetch(`http://localhost:5000/api/notifications/${userId}/count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notification count');
      }

      const data = await response.json();
      setNotificationCount(data.count);
    } catch (err) {
      console.error('Error fetching notification count:', err);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    fetchNotificationCount(); 

    const intervalId = setInterval(fetchNotificationCount, 30000); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, [handleScroll, fetchNotificationCount]);

  const isCandidatePage = location.pathname === '/candidate-home';

  return (
    <div
      className={`header ${isCandidatePage ? (isScrolled ? 'header-scrolled' : 'transparent-header') : ''}`}
    >
      <div className="header-title">
        <Link to="/candidate-home" className="logo-container">
          <img
            src={isCandidatePage ? Logo : '../../assets/AIPT.png'}
            alt="Logo"
            className={`logo ${isCandidatePage ? 'home-logo w-16 h-6 mb-2' : ''}`}
          />
        </Link>
        <h1 className="text-white">{title}</h1>
      </div>
      <div className="header-buttons flex items-center gap-4">
  <Link to="/notifications" className="notification-button flex items-center text-white relative">
    <FaBell size={24} className="text-white" />
    {notificationCount > 0 && (
      <span className="notification-badge absolute top-0 right-0 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
        {notificationCount}
      </span>
    )}
  </Link>

  <div className="profile-icon-container relative">
    <FaUserCircle size={30} onClick={toggleDropdown} className="text-white cursor-pointer" />
    {isDropdownOpen && (
      <div className="dropdown-menu absolute right-0 bg-white shadow-md rounded-md">
        <Link to="/dashboard" className="dropdown-item block px-4 py-2 text-black hover:bg-gray-100">Dashboard</Link>
        <Link to="/login" className="dropdown-item block px-4 py-2 text-black hover:bg-gray-100" onClick={logout}>Logout</Link>
      </div>
    )}
  </div>
</div>

    </div>
  );
};

export default CandidateHeader;

