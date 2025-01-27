import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css'
import { 
  Users, Briefcase, UserCheck, Clock, 
  TrendingUp, Building2, Search, Bell
} from 'lucide-react';


function logout() {
  localStorage.clear();
  window.location.reload();
}


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Search className="h-5 w-5 text-gray-500" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
        </button>
        <img
          className="h-8 w-8 rounded-full"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="User avatar"
        />
      </div>
    </div>
  </header>
  );
};

export default Header;
