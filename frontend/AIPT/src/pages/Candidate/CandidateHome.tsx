import React, { useState } from 'react';
import '../Styles/CandidateHome.css';
import Header from '../../components/Candidate/CandidateHeader';
import { Search, Calendar, ArrowUpDown, Filter } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

const CandidateHome: React.FC = () => {
    { Header }
    const jobPosts = [
        { jobID: 1, jobRole: "Frontend Developer", description: "Create beautiful, responsive user interfaces with React and TypeScript.", company: "TechCorp", location: "New York", salary: 90000, jobType: "Full-time", date: "2021-09-01" },
        { jobID: 2, jobRole: "Backend Developer", description: "Build scalable backend systems using Python, Django, and SQL.", company: "TechCorp", location: "San Francisco", salary: 95000, jobType: "Full-time", date: "2021-09-05" },
        { jobID: 3, jobRole: "Full Stack Developer", description: "Join our team to work on both front-end and back-end development.", company: "TechCorp", location: "Chicago", salary: 105000, jobType: "Full-time", date: "2021-09-10" },
        { jobID: 4, jobRole: "UX/UI Designer", description: "Design and improve the user experience and interface of the platform.", company: "TechCorp", location: "Los Angeles", salary: 85000, jobType: "Full-time", date: "2021-09-15" },
        { jobID: 5, jobRole: "Data Scientist", description: "Analyze data and build predictive models to guide business decisions.", company: "TechCorp", location: "Austin", salary: 120000, jobType: "Full-time", date: "2021-09-20" },
        { jobID: 6, jobRole: "DevOps Engineer", description: "Manage and improve our deployment pipelines and infrastructure.", company: "TechCorp", location: "Dallas", salary: 110000, jobType: "Full-time", date: "2021-09-25" },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [orderBy, setOrderBy] = useState('newest');
    const [typeFilter, setTypeFilter] = useState('all');

    const filteredJobPosts = jobPosts
        .filter((job) =>
            job.jobRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((job) => {
            if (dateFilter === 'all') return true;
            const today = new Date();
            const jobDate = new Date(job.date);
            if (dateFilter === 'today') return jobDate.toDateString() === today.toDateString();
            if (dateFilter === 'week') return (today.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24) <= 7;
            if (dateFilter === 'month') return (today.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24) <= 30;
            return true;
        })
        .filter((job) => (typeFilter === 'all' ? true : job.jobType === typeFilter))
        .sort((a, b) => {
            if (orderBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (orderBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
            return 0;
        });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="Candidate Dashboard" />

            {/* Header Banner Section */}
            <section className="header-banner">
                <div className="banner-text">
                    <p>Find your dream job and kickstart your career with us today.</p>
                    <h1>Welcome to Our Job Portal</h1>
                </div>
            </section>
            {/* Main content area */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-6">
                    {/* Left Column - Filters */}
                    <div className="w-80"> {/* Fixed width container */}
                        <Card className="filter-card sticky top-4">
                            <CardHeader className="pb-2">
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6"> {/* Increased spacing between sections */}
                                    {/* Search Section */}
                                    <div className="select-wrapper">
                                        <label className="select-label">Search</label>
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input
                                                placeholder="Search jobs..."
                                                className="pl-8 w-full"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Date Filter */}
                                    <div className="select-wrapper">
                                        <label className="select-label">Date Posted</label>
                                        <Select value={dateFilter} onValueChange={setDateFilter}>
                                            <SelectTrigger className="w-full">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <SelectValue placeholder="Filter by date" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Time</SelectItem>
                                                <SelectItem value="today">Today</SelectItem>
                                                <SelectItem value="week">Past Week</SelectItem>
                                                <SelectItem value="month">Past Month</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Order By */}
                                    <div className="select-wrapper">
                                        <label className="select-label">Order By</label>
                                        <Select value={orderBy} onValueChange={setOrderBy}>
                                            <SelectTrigger className="w-full">
                                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                                <SelectValue placeholder="Order by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="newest">Newest First</SelectItem>
                                                <SelectItem value="oldest">Oldest First</SelectItem>
                                                <SelectItem value="relevant">Most Relevant</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Job Type */}
                                    <div className="select-wrapper">
                                        <label className="select-label">Job Type</label>
                                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                                            <SelectTrigger className="w-full">
                                                <Filter className="h-4 w-4 mr-2" />
                                                <SelectValue placeholder="Filter by type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="Full-time">Full Time</SelectItem>
                                                <SelectItem value="Part-time">Part Time</SelectItem>
                                                <SelectItem value="Contract">Contract</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Job Listings */}
                    <div className="w-full">
                        {filteredJobPosts.length > 0 ? (
                            <div className="job-grid">
                                {filteredJobPosts.map((job) => (
                                    <div key={job.jobID} className="job-card">
                                        <div className="job-header">{job.jobRole}</div>
                                        <div className="job-company text-gray-500 text-sm">{job.company}</div>
                                        <p className="job-description text-sm text-gray-600 my-2">
                                            {job.description}
                                        </p>
                                        <p className="job-location text-sm text-gray-500">{job.location}</p>
                                        <p className="job-salary text-sm text-gray-500">${job.salary}</p>
                                        <div className="job-meta">
                                            <div className="job-date text-sm text-gray-400">
                                                <Calendar className="inline-block w-4 h-4 mr-1" />
                                                {new Date(job.date).toLocaleDateString()}
                                            </div>
                                            <div>
                                                <Button className="bg-gray-200 hover:bg-gray-300 mr-2">Save</Button>
                                                <Button className="bg-blue-500 text-white hover:bg-blue-600">Apply Now</Button>                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No jobs found. Try adjusting your filters.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateHome;
