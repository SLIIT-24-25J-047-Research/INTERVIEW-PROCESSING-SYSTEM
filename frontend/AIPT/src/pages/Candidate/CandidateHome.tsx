import React, { useState } from 'react';
import '../Styles/CandidateHome.css';
import Header from '../../components/Candidate/CandidateHeader';

const CandidateHome: React.FC = () => {

    { Header }
    const jobPosts = [
        { id: 1, title: "Frontend Developer", description: "Create beautiful, responsive user interfaces with React and TypeScript." },
        { id: 2, title: "Backend Developer", description: "Build scalable backend systems using Python, Django, and SQL." },
        { id: 3, title: "Full Stack Developer", description: "Join our team to work on both front-end and back-end development." },
        { id: 4, title: "UX/UI Designer", description: "Design and improve the user experience and interface of the platform." },
        { id: 5, title: "Data Scientist", description: "Analyze data and build predictive models to guide business decisions." },
        { id: 6, title: "DevOps Engineer", description: "Manage and improve our deployment pipelines and infrastructure." },
    ];

    // State for filter
    const [filter, setFilter] = useState<string>('All');

    // Filter jobs based on category
    const filteredJobs = filter === 'All' ? jobPosts : jobPosts.filter((job) => job.title.includes(filter));




    return (
        <div className="landing-page">
            <Header title="Candidate Dashboard" />

            {/* Header Banner Section */}
            <section className="header-banner">
                <div className="banner-text">
                    <p>Find your dream job and kickstart your career with us today.</p>
                    <h1>Welcome to Our Job Portal</h1>
                </div>
            </section>

            {/* Job Filter Section */}
            <section className="filter-section">
                <h2>Filter Jobs</h2>
                <div className="filter-options">
                    <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active' : ''}>All</button>
                    <button onClick={() => setFilter('Frontend')} className={filter === 'Frontend' ? 'active' : ''}>Frontend</button>
                    <button onClick={() => setFilter('Backend')} className={filter === 'Backend' ? 'active' : ''}>Backend</button>
                    <button onClick={() => setFilter('Full Stack')} className={filter === 'Full Stack' ? 'active' : ''}>Full Stack</button>
                    <button onClick={() => setFilter('Designer')} className={filter === 'Designer' ? 'active' : ''}>Designer</button>
                    <button onClick={() => setFilter('Data')} className={filter === 'Data' ? 'active' : ''}>Data</button>
                    <button onClick={() => setFilter('DevOps')} className={filter === 'DevOps' ? 'active' : ''}>DevOps</button>
                </div>
            </section>



            {/* Job Posts Section */}
            <section className="job-section">
                <h2>Current Job Openings</h2>
                <div className="job-list">
                    {filteredJobs.map((job) => (
                        <div className="job-card" key={job.id}>
                            <h3 className="job-title">{job.title}</h3>
                            <p className="job-description">{job.description}</p>
                            <button className="apply-button">Apply Now</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CandidateHome;