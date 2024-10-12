import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="profile-container p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="profile-info bg-white p-4 rounded-lg shadow-md">
        <p className="text-lg">
          <strong>Name:</strong> John Doe
        </p>
        <p className="text-lg">
          <strong>Email:</strong> john.doe@example.com
        </p>
        <p className="text-lg">
          <strong>Role:</strong> Interviewer
        </p>
      </div>
    </div>
  );
};

export default Profile;
