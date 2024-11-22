import React from 'react';
import '../Styles/CandidateHome.css';
import Header from '../../components/Candidate/CandidateHeader';
import banner from '../../images/header.png';

const CandidateHome: React.FC = () => {

    {Header}
    const jobPosts = [
        { id: 1, title: "Frontend Developer", description: "Create beautiful, responsive user interfaces with React and TypeScript." },
        { id: 2, title: "Backend Developer", description: "Build scalable backend systems using Python, Django, and SQL." },
        { id: 3, title: "Full Stack Developer", description: "Join our team to work on both front-end and back-end development." },
      ];
    
      return (
        <div className="landing-page">
            <Header title="Candidate Dashboard" />

            {/* Header Banner Section */}
            <section className="header-banner">
                <div className="banner-text">
                    <h1>Welcome to Our Job Portal</h1>
                    <p>Find your dream job and kickstart your career with us today.</p>
                    <h2>Browse through exciting job openings from top companies.</h2>
                </div>
                <div className="banner-image">
                    <img src={banner} alt="Banner" />
                </div>
            </section>

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