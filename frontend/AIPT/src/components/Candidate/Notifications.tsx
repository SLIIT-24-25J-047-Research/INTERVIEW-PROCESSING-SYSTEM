import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Candidate/CandidateHeader';


interface Notification {
  id: number;
  message: string;
  read: boolean;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulating fetching notifications from an API
    const fetchNotifications = async () => {
      // Replace this with actual API call
      const mockNotifications: Notification[] = [
        { id: 1, message: "New interview scheduled", read: false },
        { id: 2, message: "Reminder: Complete your profile", read: false },
        { id: 3, message: "Interview feedback available", read: true },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
       <Header title="Candidate Home" />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Notifications ({unreadCount})</h2>
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map(notification => (
              <li 
                key={notification.id} 
                className={`p-4 border rounded-lg ${notification.read ? 'bg-gray-100' : 'bg-white'}`}
              >
                <p className="text-lg">{notification.message}</p>
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="mt-2 text-blue-500 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <Link to="/candidate-home" className="mt-8 inline-block text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotificationsPage;
