import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  Users,
  Trophy,
  Search,
  ArrowRight,
  CheckCircle2,
  Globe
} from 'lucide-react';
import Footer from '../components/Candidate/Footer';
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect"
import {BackgroundGradientAnimation} from "../components/ui/background-gradient-animation"

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
      description: "We are seeking an experienced software engineer to join our growing team...",
      logo: "/api/placeholder/64/64"
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Innovation Labs",
      location: "New York, NY",
      salary: "$110,000 - $140,000",
      type: "Full-time",
      description: "Looking for a strategic product manager to lead our product initiatives...",
      logo: "/api/placeholder/64/64"
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Creative Digital",
      location: "Remote",
      salary: "$90,000 - $120,000",
      type: "Full-time",
      description: "Join our design team to create beautiful and intuitive user experiences...",
      logo: "/api/placeholder/64/64"
    }
  ];

  const stats = [
    { value: "200+", label: "Job Openings" },
    { value: "50k+", label: "Candidates" },
    { value: "98%", label: "Success Rate" },
  ]

  const words = [
    { text: "Connecting", className: "text-white dark:text-blue-500" },
    { text: "Top", className: "text-white dark:text-blue-500" },
    { text: "Talent", className: "text-white dark:text-blue-500" },
    { text: "with", className: "text-white dark:text-blue-500" },
    { text: "Leading", className: "text-[#d9f99d] dark:text-blue-500" },
    { text: "Companies", className: "text-[#d9f99d] dark:text-pink-500" },
  ]




  const features = [
    {
      title: "Smart Matching",
      description: "AI-powered job matching that connects you with the most relevant opportunities",
      icon: CheckCircle2
    },
    {
      title: "Global Network",
      description: "Access to worldwide opportunities and talent pool",
      icon: Globe
    },
    {
      title: "Expert Support",
      description: "Dedicated recruitment specialists to guide your journey",
      icon: Users
    }
  ];




  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <nav className="bg-white fixed top-0 left-0 w-full border-b border-gray-200 shadow-md z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <h3 className="text-2xl font-bold text-blue-600">AIPT</h3>
            <div className="hidden md:flex space-x-6">
              <Link className="text-gray-700 hover:text-blue-600 transition" to="/jobs">
                Browse Jobs
              </Link>
              <Link className="text-gray-700 hover:text-blue-600 transition" to="/companies">
                Companies
              </Link>
              <Link className="text-gray-700 hover:text-blue-600 transition" to="/about">
                About Us
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-blue-600 border-blue-600 hover:bg-blue-50 transition"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <BackgroundGradientAnimation>
      <div className="absolute z-10 inset-0 flex items-center  px-4 justify-center   text-white overflow-hidden h-screen pointer-events-none ">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px_16px] pointer-events-none" />
        <div className="relative container mx-auto px-6 flex items-center justify-center h-full">
          <div className="text-center max-w-5xl">
            <div className="mb-6 w-full flex justify-center text-white">
              <TypewriterEffectSmooth words={words} />
            </div>

            <p className="bg-clip-text  text-xl md:text-2xl bg-gradient-to-b from-white/80 to-white/20 text-blue-100 mb-10">
              Transform your career journey with our AI-powered recruitment platform. Access exclusive opportunities and
              expert guidance.
            </p>
            <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-lg p-2 shadow-md max-w-md mx-auto">
                <div className="flex items-center bg-white rounded-md p-2 shadow-sm">
                  <Search className="h-5 w-5 text-gray-400 mx-2" />
                  <input
                    type="text"
                    placeholder="Job title, skills, or company"
                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                  />
                  <Button className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Search Jobs
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-12 md:gap-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in delay-100">
                  <div className="text-4xl md:text-5xl font-bold mb-1">{stat.value}</div>
                  <div className="text-blue-100 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </BackgroundGradientAnimation>


      {/* Featured Jobs */}
      <div className="container mx-auto px- py-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold mb-4">Featured Positions</h2>
            <p className="text-gray-500 text-lg">
              Explore curated opportunities from top companies
            </p>
          </div>
          <Button
            variant="outline"
            className="hidden md:flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
            onClick={() => navigate('/positions')}
          >
            View All Positions <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="group hover:shadow-lg hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Card Header */}
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-14 h-14 rounded-lg shadow-md object-cover"
                />
                <div>
                  <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </CardTitle>
                  <CardDescription className="text-gray-500">{job.company}</CardDescription>
                </div>
              </CardHeader>

              {/* Card Content */}
              <CardContent className="px-4 py-4">
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    <span>{job.type}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">{job.description}</p>
                </div>
              </CardContent>

              {/* Card Footer */}
              <CardFooter className="p-4">
                <Button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => navigate('/login')}
                >
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>


      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose AIPT</h2>
            <p className="text-gray-600">
              We're transforming recruitment with cutting-edge technology and human expertise
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies who trust TalentScope for their recruitment needs
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/register')}
            >
              Get Started Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => navigate('/contact')}
            >
              Talk to Sales
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobPortalLanding;