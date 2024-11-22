import React from 'react';
import '../Styles/CandidateHome.css';
import Header from '../../components/Candidate/CandidateHeader';

const CandidateHome: React.FC = () => {

    {Header}
    const jobPosts = [
        { id: 1, title: "Frontend Developer", description: "Create beautiful, responsive user interfaces with React and TypeScript." },
        { id: 2, title: "Backend Developer", description: "Build scalable backend systems using Python, Django, and SQL." },
        { id: 3, title: "Full Stack Developer", description: "Join our team to work on both front-end and back-end development." },
      ];
    
      return (
        <div className="landing-page">
         <Header title="Candidate Dashboard"/>
    
          {/* Job Posts Section */}
          <section className="job-section">
            <h2>Current Job Openings</h2>
            <div className="job-list">
              {jobPosts.map((job) => (
                <div className="job-item" key={job.id}>
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>
                  <button className="apply-button">Apply Now</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      );
};

export default CandidateHome;
