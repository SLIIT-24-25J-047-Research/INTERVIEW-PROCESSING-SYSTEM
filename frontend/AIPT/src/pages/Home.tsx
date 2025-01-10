import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Briefcase, MapPin, DollarSign, Building2, Users, Trophy, Mail, Phone, MapPin as Location } from 'lucide-react';
import Footer from '../components/Candidate/Footer';


const JobPortalLanding = () => {
  const navigate = useNavigate();
  
  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Solutions Inc",
      location: "San Francisco, CA",
      salary: "$120,000 - $160,000",
      type: "Full-time",
      description: "We are seeking an experienced software engineer to join our growing team..."
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Innovation Labs",
      location: "New York, NY",
      salary: "$110,000 - $140,000",
      type: "Full-time",
      description: "Looking for a strategic product manager to lead our product initiatives..."
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Creative Digital",
      location: "Remote",
      salary: "$90,000 - $120,000",
      type: "Full-time",
      description: "Join our design team to create beautiful and intuitive user experiences..."
    }
  ];

  const stats = [
    { icon: Building2, value: "500+", label: "Partner Companies" },
    { icon: Users, value: "1M+", label: "Active Job Seekers" },
    { icon: Trophy, value: "20k+", label: "Success Stories" }
  ];

  return (
    <div className="main-container bg-gray-50">

      <header className="header">
    
        <h3>Automated Interview Tool</h3>
        <div className="auth-buttons">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn">Sign Up</Link>
        </div>
      </header>
      {/* Hero Section with Banner */}
      <div className="relative bg-blue-600 text-white">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"
          style={{
            backgroundImage: "url('/api/placeholder/1920/600')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'multiply'
          }}
        />
        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">Find Your Dream Job Today</h1>
            <p className="text-xl mb-8 text-blue-100">Connect with top companies and opportunities that match your skills and aspirations. Your next career move starts here.</p>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/login')}
              >
                Find Jobs
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
              >
                Post a Job
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <stat.icon className="h-12 w-12 text-blue-600 mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Listings Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Opportunities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated selection of positions from industry-leading companies
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <CardDescription>{job.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span>{job.type}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{job.description}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* About Company Section */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/api/placeholder/600/400" 
                alt="Company Culture" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">About Our Platform</h2>
              <p className="text-gray-600 mb-6">
                We're revolutionizing the way people find their dream jobs. Our platform connects talented individuals with forward-thinking companies, creating meaningful career opportunities that benefit both parties.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Expert Team</h3>
                    <p className="text-gray-600">Dedicated support throughout your job search</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Top Companies</h3>
                    <p className="text-gray-600">Partner with industry leaders</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Proven Success</h3>
                    <p className="text-gray-600">Thousands of successful placements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default JobPortalLanding;