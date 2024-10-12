import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './dashboard.css'

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="content">{children}</div>
        </div>
      </div>
    );
  };

export default DashboardLayout;
