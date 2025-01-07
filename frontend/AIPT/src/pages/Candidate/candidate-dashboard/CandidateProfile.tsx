import React from "react";
import Sidebar from "../../../components/Candidate/CandidateSidebar";
import Header from "../../../components/Candidate/CandidateHeader";
import userImg from "../../../images/user.png";

const CandidateProfile: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-24">
        <Header title="Profile" />

        <div className="mt-8">
          {/* Profile Card */}
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <img src={userImg} alt="John" className="w-32 h-32 rounded-full border-4 border-blue-500" />
              <h1 className="mt-4 text-2xl font-semibold text-gray-600">John Doe</h1>
              <p className="text-sm text-gray-600">CEO & Founder, Example</p>
              <p className="text-sm text-gray-600">Harvard University</p>
              <p className="text-sm text-gray-600">Email: johndoe@example.com</p>

              {/* Social Links */}
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <i className="fa fa-dribbble"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <i className="fa fa-linkedin"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <i className="fa fa-facebook"></i>
                </a>
              </div>

              {/* Edit and Delete Buttons */}
              <div className="flex space-x-4 mt-6">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none">
                  Edit
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
