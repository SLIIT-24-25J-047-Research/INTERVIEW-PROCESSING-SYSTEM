import React, { useState } from 'react';
import { MessageSquare, HelpCircle, Send, Phone } from 'lucide-react';
import CandidateLayout from "../../../components/Candidate/CandidateLayout";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface FeedbackForm {
  type: 'feedback' | 'help';
  message: string;
  contact: string;
}

export default function OptionsPage() {
  const [form, setForm] = useState<FeedbackForm>({
    type: 'feedback',
    message: '',
    contact: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post('http://localhost:5000/api/feedback/send', form, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      console.log('Response:', response.data);
      toast.success('Feedback sent successfully!');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setForm({ type: 'feedback', message: '', contact: '' });
    } catch (error) {
      console.error('Error submitting feedback/help request:', error);
      toast.error('Failed to send feedback. Please try again.');
    }
  };
  
  

  return (

    <>
    <CandidateLayout>
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Options</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Feedback Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Send Feedback</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Help us improve by sharing your thoughts and experiences.
            </p>
            <button
              onClick={() => setForm({ ...form, type: 'feedback' })}
              className={`w-full py-3 px-4 rounded-lg transition-all ${
                form.type === 'feedback'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Write Feedback
            </button>
          </div>

          {/* Help Center Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Help Center</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Need assistance? Contact our support team for help.
            </p>
            <button
              onClick={() => setForm({ ...form, type: 'help' })}
              className={`w-full py-3 px-4 rounded-lg transition-all ${
                form.type === 'help'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Get Help
            </button>
          </div>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {form.type === 'feedback' ? 'Share Your Feedback' : 'Request Help'}
          </h3>
          
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              {form.type === 'feedback' ? 'Your Feedback' : 'Describe Your Issue'}
            </label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={
                form.type === 'feedback'
                  ? 'Tell us what you think...'
                  : 'Please describe your issue in detail...'
              }
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                id="contact"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your contact number"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {form.type === 'feedback' ? 'Submit Feedback' : 'Send Help Request'}
          </button>

          {/* Success Message */}
          {submitted && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg text-center">
              {form.type === 'feedback'
                ? 'Thank you for your feedback!'
                : 'Help request sent successfully!'}
            </div>
          )}
        </form>
      </div>
    </div>
  
    </CandidateLayout>
   
    <ToastContainer />
    </>
 
  );
}