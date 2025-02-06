import React, { useState } from 'react';
import { BarChart, CheckCircle, XCircle } from 'lucide-react';
import { Question } from '../../components/types';
import { useInterviewStore } from '../../components/store/InterviewStore';

interface AdminDashboardProps {
  questions: Question[];
}

export const CheckAnswers: React.FC<AdminDashboardProps> = ({ questions }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'detailed' | 'analytics'>('summary');
  const { answers } = useInterviewStore();

  const calculateScore = () => {
    let totalScore = 0;
    let earnedScore = 0;

    questions.forEach(question => {
      totalScore += question.points;
      // Add scoring logic based on question type
      if (answers[question.id]) {
        // This is a simplified scoring example
        earnedScore += question.points;
      }
    });

    return {
      earned: earnedScore,
      total: totalScore,
      percentage: Math.round((earnedScore / totalScore) * 100)
    };
  };

  const score = calculateScore();

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Overall Performance</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Total Score</p>
            <p className="text-2xl font-bold text-blue-700">{score.earned}/{score.total}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Percentage</p>
            <p className="text-2xl font-bold text-green-700">{score.percentage}%</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">Questions Attempted</p>
            <p className="text-2xl font-bold text-purple-700">
              {Object.keys(answers).length}/{questions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailed = () => (
    <div className="space-y-4">
      {questions.map(question => (
        <div key={question.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{question.title}</h3>
              <p className="text-sm text-gray-500">{question.type} • {question.points} points</p>
            </div>
            {answers[question.id] ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Candidate's Answer:</h4>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(answers[question.id] || 'No answer provided', null, 2)}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
        <div className="space-y-4">
          <div className="h-60 bg-gray-50 rounded-lg flex items-center justify-center">
            <BarChart className="w-8 h-8 text-gray-400" />
            <span className="ml-2 text-gray-500">Performance chart will be displayed here</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Time Analysis</h4>
              <p className="text-sm text-gray-600">Average time per question: 5m 30s</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Question Type Performance</h4>
              <p className="text-sm text-gray-600">Strongest: Coding Questions</p>
              <p className="text-sm text-gray-600">Needs Improvement: Multiple Choice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interview Results</h1>
          <p className="mt-2 text-gray-600">Review candidate performance and detailed responses</p>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'summary'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'detailed'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Detailed Review
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'analytics'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {activeTab === 'summary' && renderSummary()}
        {activeTab === 'detailed' && renderDetailed()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};