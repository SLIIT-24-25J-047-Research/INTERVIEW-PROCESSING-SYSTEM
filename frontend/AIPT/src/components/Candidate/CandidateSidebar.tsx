import React, { useState } from 'react';
import { FaHome, FaTasks, FaUserAlt, FaCog, FaPen, FaBars } from 'react-icons/fa';
import { FaNoteSticky } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import './candidateSidebar.css';

const CandidateSidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
            onMouseEnter={() => setIsCollapsed(false)}
            onMouseLeave={() => setIsCollapsed(true)}
        >
            {/* <div className="hamburger-icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                <FaBars />
            </div> */}
            <ul className="menu-list">
                <li className="menu-item">
                    <FaHome className="menu-icon" />
                    {!isCollapsed && <Link to="/dashboard">Dashboard</Link>}
                </li>
                <li className="menu-item">
                    <FaTasks className="menu-icon" />
                    {!isCollapsed && <Link to="/assignments">Assignments</Link>}
                </li>
                <li className="menu-item">
                    <FaPen  className="menu-icon" />
                    {!isCollapsed && <Link to="/candidate-mockup">Mockup-Test</Link>}
                </li>
                <li className="menu-item">
                    <FaNoteSticky  className="menu-icon" />
                    {!isCollapsed && <Link to="/candidate-test">Non Technical Interview</Link>}
                </li>
                <li className="menu-item">
                    <FaUserAlt className="menu-icon" />
                    {!isCollapsed && <Link to="/profile">Profile</Link>}
                </li>
                <li className="menu-item">
                    <FaCog className="menu-icon" />
                    {!isCollapsed && <Link to="/settings">Settings</Link>}
                </li>
            </ul>
        </div>
    );
};

export default CandidateSidebar;
