import React from "react";
import Sidebar from "../../components/Candidate/CandidateSidebar";
import Header from "../../components/Candidate/CandidateHeader";
import "../../components/Candidate/css/candidateLayout.css";
import userImg from "../../images/user.png";

const CandidateProfile: React.FC = () => {
  return (
    <>
      <style>
        {`
          .card {
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            max-width: 350px;
            margin: auto;
            text-align: center;
            border-radius: 10px;
            overflow: hidden;
          }

          .card img {
            width: 150px; /* Fixing image size */
            height: 150px; /* Maintain square shape */
            border-radius: 50%; /* Make the image circular */
            object-fit: cover; /* Ensure the image fits without distortion */
            margin-top: 20px;
          }

          .title {
            color: grey;
            font-size: 16px; /* Adjust font size for title */
          }

          .card h1 {
            font-size: 24px; /* Adjust name font size */
            margin: 10px 0;
          }

          .card p {
            font-size: 14px; /* Adjust paragraph font size */
            color: #666; /* Dark grey color for text */
          }

          .card .email {
            font-size: 16px;
            color: #333;
            margin-top: 10px;
          }

          .card .edit-delete-btns {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }

          button {
            border: none;
            outline: 0;
            display: inline-block;
            padding: 10px 20px; /* Adjust padding for button */
            color: white;
            background-color: #000;
            text-align: center;
            cursor: pointer;
            width: 48%; /* Buttons take up half the space */
            font-size: 16px;
            border-radius: 5px; /* Add rounded corners */
          }

          button:hover {
            opacity: 0.7;
          }

          .card a {
            text-decoration: none;
            font-size: 20px; /* Adjust icon size */
            color: #666; /* Change icon color */
            margin: 0 10px;
          }

          .card a:hover {
            opacity: 0.7;
          }

          .card .social-links {
            margin-top: 10px;
          }

          /* Media queries for responsiveness */
          @media (max-width: 768px) {
            .card {
              max-width: 100%;
            }
            button {
              width: 100%;
            }
          }
        `}
      </style>
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
                <button>Edit</button>
                <button>Delete</button>
              </div> {/* Added Edit and Delete buttons */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateProfile;
