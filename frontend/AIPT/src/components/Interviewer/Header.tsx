import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css'


function logout() {
  localStorage.clear();
  window.location.reload();
}


const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-title">
        <h1>Interview Management System</h1>
      </div>
      <div className="header-buttons">
        <Link to="/login" className="logout-btn" onClick={logout}>Logout</Link>
      </div>
      {/* add a profile button to go to the profile */}
      {/* <div className="header-buttons">
        <Link to="/interviewer-profile" className="profile-btn">Profile</Link>
      </div> */}
    </header>
  );
};

export default Header;
