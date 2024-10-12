import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import './sidebar.css'; 

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
          <h2 className="text-xl font-bold mb-4">Dashboard</h2>
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/interviewer-home" className="menu-link">
                <FaHome className="menu-icon" />
                <span>Home</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/interviewer-profile" className="menu-link">
                <FaUser className="menu-icon" />
                <span>Profile</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/interviewer-interviews" className="menu-link">
                <FaClipboardList className="menu-icon" />
                <span>Interviews</span>
              </Link>
            </li>
          
          </ul>
        </div>
      );
    };
export default Sidebar;
