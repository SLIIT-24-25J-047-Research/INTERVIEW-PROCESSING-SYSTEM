import React, { useState, useEffect } from 'react';
import { MessageSquare, HelpCircle, CheckCircle, XCircle, Send, Search } from 'lucide-react';
import DashboardLayout from "../../components/Interviewer/DashboardLayout";

interface FeedbackItem {
  id: string;
  type: 'feedback' | 'help';
  message: string;
  contact: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  response?: string;
}

export default function SendFeedback() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [response, setResponse] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      
      // Get the token from local storage
      const token = localStorage.getItem('token');
  
      const response = await fetch('http://localhost:5000/api/feedback/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include the authorization header with the token
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch feedbacks');
      }
  
      const data = await response.json();
  
      // Map the API data to match our FeedbackItem interface if needed
      const mappedFeedbacks = data.map((item: FeedbackItem) => ({
        id: item.id,
        type: item.type || 'feedback',
        message: item.message,
        contact: item.contact,
        status: item.status,
        createdAt: item.createdAt,
        response: item.response // Add this line if your API returns a response field
      }));
  
      setFeedbacks(mappedFeedbacks);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSendResponse = async (feedbackId: string) => {
    try {
      const fetchResponse = await fetch(`/api/feedback/${feedbackId}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if needed
        },
        body: JSON.stringify({ response, status: 'resolved' }),
      });

      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json();
        throw new Error(errorData.message || 'Failed to send response');
      }

      // Update local state
      setFeedbacks(feedbacks.map(feedback => 
        feedback.id === feedbackId 
          ? { ...feedback, status: 'resolved', response: response as string }
          : feedback
      ));
      setResponse('');
      setSelectedFeedback(null);
      
      // Refresh the feedbacks
      fetchFeedbacks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send response');
      console.error('Error sending response:', err);
    }
  };

  const filteredFeedbacks = feedbacks
    .filter(feedback => filter === 'all' || feedback.status === filter)
    .filter(feedback => 
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.contact.includes(searchTerm)
    );

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search feedbacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'resolved')}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feedback List */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Feedbacks</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading feedbacks...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={fetchFeedbacks}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No feedbacks found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedFeedback?.id === feedback.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedFeedback(feedback)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {feedback.type === 'help' ? (
                          <HelpCircle className="w-5 h-5 text-orange-500" />
                        ) : (
                          <MessageSquare className="w-5 h-5 text-blue-500" />
                        )}
                        <span className="font-medium">
                          {feedback.type === 'help' ? 'Help Request' : 'Feedback'}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 ${
                        feedback.status === 'resolved' ? 'text-green-600' : 'text-orange-500'
                      }`}>
                        {feedback.status === 'resolved' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span className="text-sm capitalize">{feedback.status}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{feedback.message}</p>
                    <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                      <span>{feedback.contact}</span>
                      <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Response Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Response Panel</h2>
            {selectedFeedback ? (
              <div>
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Selected Message</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">{selectedFeedback.message}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Contact: {selectedFeedback.contact}</p>
                      <p>Received: {new Date(selectedFeedback.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {selectedFeedback.status === 'resolved' ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Resolved</span>
                    </div>
                    <p className="text-green-700">{selectedFeedback.response}</p>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Response
                    </label>
                    <textarea
                      id="response"
                      rows={4}
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Type your response here..."
                    />
                    <button
                      onClick={() => handleSendResponse(selectedFeedback.id)}
                      disabled={!response.trim()}
                      className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                      Send Response
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a feedback item to respond</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}