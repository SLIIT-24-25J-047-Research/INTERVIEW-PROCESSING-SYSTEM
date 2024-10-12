import React from 'react';
import { Link } from 'react-router-dom';
import './Styles/Home.css'; 
import confidence from '../images/confidence.webp'
import codecomplex from '../images/codecomplex.webp'
import gamified   from '../images/gamified.webp'
import video from '../images/videobased.webp'

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="header">
    
        <h3>Automated Interview Tool</h3>
        <div className="auth-buttons">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn">Sign Up</Link>
        </div>
      </header>
      <main className="content">
        <section className="intro">
          <h2>Welcome to the Future of Hiring</h2>
          <p>
            Our platform utilizes advanced technology to enhance the interview process, 
            ensuring a fair and efficient experience for both candidates and interviewers.
          </p>
          <Link to="/register" className="btn get-started">Get Started</Link>
        </section>
        
        <section className="features">
          <h3>Key Features</h3>
          <div className="feature-cards">
            <div className="card">
              <img src={confidence} alt="Confidence Assessment" />
              <h4>Confidence Assessment</h4>
              <p>Evaluate candidates' confidence through voice analysis to select the best fit for your team.</p>
            </div>
            <div className="card">
              <img src={gamified} alt="Gamified Environment" />
              <h4>Gamified Environment</h4>
              <p>Engage candidates with interactive assessments that make interviews more enjoyable.</p>
            </div>
            <div className="card">
              <img src={codecomplex} alt="Code Evaluation" />
              <h4>Code Evaluation</h4>
              <p>Analyze candidates' coding abilities in real-time to ensure technical proficiency.</p>
            </div>
            <div className="card">
              <img src={video} alt="Video Assessments" />
              <h4>Video Assessments</h4>
              <p>Use video to evaluate candidates' presentation and communication skills effectively.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Automated Interview Tool. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;