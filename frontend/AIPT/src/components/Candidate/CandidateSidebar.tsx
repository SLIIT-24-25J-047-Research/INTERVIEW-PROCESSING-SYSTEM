import React from 'react';
import { FaHome, FaTasks, FaUserAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './candidateSidebar.css'; // Make sure to create this CSS file

const CandidateSidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul className="menu-list">
        <li className="menu-item">
          <FaHome className="menu-icon" />
          <Link to="/candidate-home">Dashboard</Link>
        </li>
        <li className="menu-item">
          <FaTasks className="menu-icon" />
          <Link to="/assignments">Assignments</Link>
        </li>
        <li className="menu-item">
          <FaUserAlt className="menu-icon" />
          <Link to="/profile">Profile</Link>
        </li>
        <li className="menu-item">
          <FaCog className="menu-icon" />
          <Link to="/settings">Settings</Link>
        </li>
       
      </ul>
    </div>
  );
};

export default CandidateSidebar;
