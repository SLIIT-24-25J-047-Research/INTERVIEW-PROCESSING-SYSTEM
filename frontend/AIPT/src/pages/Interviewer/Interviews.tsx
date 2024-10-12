import React from 'react';

const Interviews: React.FC = () => {
  // Sample data
  const upcomingInterviews = [
    { id: 1, candidate: 'Alice Smith', date: '2024-10-15', time: '10:00 AM' },
    { id: 2, candidate: 'Bob Johnson', date: '2024-10-16', time: '11:00 AM' },
    { id: 3, candidate: 'Charlie Brown', date: '2024-10-17', time: '02:00 PM' },
  ];

  return (
    <div className="interviews-container p-4">
      <h2 className="text-2xl font-bold mb-4">Upcoming Interviews</h2>
      <div className="interviews-list bg-white p-4 rounded-lg shadow-md">
        {upcomingInterviews.length > 0 ? (
          <ul>
            {upcomingInterviews.map((interview) => (
              <li key={interview.id} className="border-b border-gray-200 py-2">
                <p className="text-lg">
                  <strong>Candidate:</strong> {interview.candidate}
                </p>
                <p className="text-md text-gray-600">
                  <strong>Date:</strong> {interview.date} | <strong>Time:</strong> {interview.time}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming interviews scheduled.</p>
        )}
      </div>
    </div>
  );
};

export default Interviews;
