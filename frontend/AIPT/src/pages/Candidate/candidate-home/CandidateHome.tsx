import React, { useState, useEffect } from 'react';
import '../../../Styles/CandidateHome.css';
import Header from '../../../components/Candidate/CandidateHeader';
import Footer from '../../../components/Candidate/Footer';
import { Search, Calendar, ArrowUpDown, Filter } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import axios from 'axios';
import { toast, Toaster  } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";


interface SavedJob {
    _id: string;
    userId: string;
    jobId: string;
}

const CandidateHome: React.FC = () => {
    const navigate = useNavigate();
    interface JobPost {
        _id: string;
        jobRole: string;
        description: string;
        date: string;
        jobType: string;
        company: string;
        location: string;
        salary: number;
    }

    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [orderBy, setOrderBy] = useState('newest');
    const [typeFilter, setTypeFilter] = useState('all');
    const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

    const { user } = useAuth();

    // Fetch all jobs
    useEffect(() => {
        axios.get('http://localhost:5000/api/jobs/all')
            .then(response => {
                setJobPosts(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the jobs:", error);
                toast.error("Failed to fetch job listings");
            });
    }, []);

    // Fetch saved jobs
    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5000/api/savejobs/getSavedJobs/${user.id}`)
                .then(response => {
                    const jobIds = response.data.map((savedJob: SavedJob) => savedJob.jobId);
                    setSavedJobIds(jobIds);
                })
                .catch(error => {
                    console.error("Error fetching saved jobs:", error);
                });
        }
    }, [user]);


    // Save job function
    const saveJob = async (jobId: string) => {
        if (!user) {
            toast.error('Please login to save jobs');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/savejobs/save', {
                jobId,
                userId: user.id
            });
            
            if (response.status === 200) {
                setSavedJobIds(prev => [...prev, jobId]);
                toast.success('Job saved successfully!');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast.error('Job already saved!');
            } else {
                toast.error('Error saving job');
                console.error('Error saving job:', error);
            }
        }
    };


    


    // Filtering and sorting logic 
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
              <Toaster /> 
            <Header title="Candidate Home" />

            {/* Header Banner  */}
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
                    <div className="w-80"> 
                        <Card className="filter-card sticky top-4">
                            <CardHeader className="pb-2">
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6"> 
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
                                    <div key={job._id} className="job-card">
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
                                            <Button 
                                                    className={savedJobIds.includes(job._id) 
                                                        ? 'bg-green-500 text-white' 
                                                        : 'bg-gray-200 text-black'
                                                    } 
                                                    onClick={() => saveJob(job._id)}
                                                >
                                                    {savedJobIds.includes(job._id) ? 'Saved' : 'Save Job'}
                                                </Button>
                                                <Button
                                                    className="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                                                    onClick={() => navigate(`/candidate-home/job/${job._id}/apply`)}
                                                >
                                                    Apply Now
                                                </Button>
                                            </div>
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
            <Footer />
        </div>
    );
};

export default CandidateHome;
