import React, { useState, useEffect } from 'react';
import { Search, Star, Archive, MoreVertical } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/Tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdownMenu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"

import CandidateHeader from '../../../components/Candidate/CandidateHeader';

interface HeaderProps { title: string; notificationCount: number; }

interface Notification {
  _id: string;
  userId: string;
  message: string;
  interviewType: string;
  status: 'read' | 'unread';
  createdAt: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const userId = getUserIdFromToken(token);
        const response = await fetch(`http://localhost:5000/api/notifications/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch notifications');

        const data: Notification[] = await response.json();
        setNotifications(data.map(n => ({ ...n, isFavorite: false, isArchived: false })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

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

  const toggleFavorite = (id: string) => {
    setNotifications(notifications.map(n =>
      n._id === id ? { ...n, isFavorite: !n.isFavorite } : n
    ));
  };

  const toggleArchive = (id: string) => {
    setNotifications(notifications.map(n =>
      n._id === id ? { ...n, isArchived: !n.isArchived } : n
    ));
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`http://localhost:5000/api/notifications/read/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'read' })
      });

      if (!response.ok) throw new Error('Failed to update notification status');

      setNotifications(prevNotifications =>
        prevNotifications.map(n => n._id === id ? { ...n, status: 'read' } : n)
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      (activeTab === 'all' && !n.isArchived) ||
      (activeTab === 'archive' && n.isArchived) ||
      (activeTab === 'favorite' && n.isFavorite);
    return matchesSearch && matchesTab;
  });

  const getTimeString = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 24 * 60 * 60 * 1000) { // Less than 24 hours
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'dd MMM, yyyy');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading notifications...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <CandidateHeader title="Notifications" />
      <div className="max-w-6xl mx-auto pt-8 mt-20 px-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold">List Notification</h1>
              <span className="text-gray-500">{notifications.length} Notifications</span>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search notifications"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  All
                  <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-sm">
                    {notifications.filter(n => !n.isArchived && n.status === 'unread').length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="archive">
                  Archive
                  <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-sm">
                    {notifications.filter(n => n.isArchived).length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="favorite">
                  Favorite
                  <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-sm">
                    {notifications.filter(n => n.isFavorite).length}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Favorite</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Interview Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification._id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`${notification.isFavorite ? 'text-yellow-400' : 'text-gray-400'}`}
                        onClick={() => toggleFavorite(notification._id)}
                      >
                        <Star className="h-5 w-5" fill={notification.isFavorite ? "currentColor" : "none"} />
                      </Button>
                    </TableCell>
                    <TableCell>{notification.message}</TableCell>
                    <TableCell>{notification.interviewType}</TableCell>
                    <TableCell>{getTimeString(notification.createdAt)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        notification.status === 'unread' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {notification.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                          >
                            <MoreVertical className="h-5 w-5 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => markAsRead(notification._id)} className="cursor-pointer">
                            Mark as read
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleArchive(notification._id)} className="cursor-pointer">
                            {notification.isArchived ? 'Unarchive' : 'Archive'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleFavorite(notification._id)} className="cursor-pointer">
                            {notification.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

