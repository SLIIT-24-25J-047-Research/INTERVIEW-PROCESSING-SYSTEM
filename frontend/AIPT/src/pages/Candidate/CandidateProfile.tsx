import React from "react";
import Sidebar from "../../components/Candidate/CandidateSidebar";
import Header from "../../components/Candidate/CandidateHeader";
import "../../components/Candidate/css/candidateLayout.css";
import userImg from "../../images/user.png";

const CandidateProfile: React.FC = () => {
  return (
    <>
    
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Header title="Profile" />
          <div className="content">
            <div className="card">
              <img src={userImg} alt="John" />
              <h1>John Doe</h1>
              <p className="title">CEO & Founder, Example</p>
              <p>Harvard University</p>
              <p className="email">Email: johndoe@example.com</p> {/* Added Email section */}
              <div className="social-links">
                <a href="#">
                  <i className="fa fa-dribbble"></i>
                </a>
                <a href="#">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fa fa-linkedin"></i>
                </a>
                <a href="#">
                  <i className="fa fa-facebook"></i>
                </a>
              </div>
              <div className="edit-delete-btns">
                <button className="edit-btn" >Edit</button>
                <button className="delete-btn">Delete</button>
              </div> {/* Added Edit and Delete buttons */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateProfile;
