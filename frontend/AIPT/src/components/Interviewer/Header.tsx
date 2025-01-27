import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, UserCheck, Clock, TrendingUp, Building2, Search, Bell } from 'lucide-react';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Mock notifications data
  const notifications = [
    { id: 1, text: "New user registration", time: "5 min ago" },
    { id: 2, text: "System update completed", time: "1 hour ago" },
    { id: 3, text: "Backup completed successfully", time: "2 hours ago" },
  ];

  return (
    <header className="bg-white shadow-sm relative">
      <div className="max-w-full mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Search className="h-5 w-5 text-gray-500" />
          </button>
          
          {/* Notification Button */}
          <button 
            className="p-2 rounded-full hover:bg-gray-100 relative"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>

          {/* Profile Button */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="focus:outline-none"
          >
            <img
              className="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
            />
          </button>

          {/* Profile Modal */}
          {isProfileOpen && (
            <div className="absolute right-4 top-16 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}

          {/* Notifications Modal */}
          {isNotificationOpen && (
            <div className="absolute right-4 top-16 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b">
                    <p className="text-sm text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                  View all notifications
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;