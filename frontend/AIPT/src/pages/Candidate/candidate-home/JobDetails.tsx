import React, { useState } from "react";
import { Button } from "../../../components/ui/button"; 
import { FileUploadArea } from "./FileUploadArea"; 
import { Input } from "../../../components/ui/input";
import Footer from "../../../components/Candidate/Footer";
import Header from '../../../components/Candidate/CandidateHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";


const CandidateCVPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | undefined>();
    const [message, setMessage] = useState("");
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if ((prev ?? 0) >= 100) {
            clearInterval(interval);
            setMessage("CV Submitted Successfully!");
            return prev;
          }
          return (prev ?? 0) + 10;
        });
      }, 500);
    };
  
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Submit Your CV" />
        <section className="header-banner">
            <div className="banner-text">
                <h1>Submit Your CV</h1>
                <p>Let us help you take the next step in your career.</p>
            </div>
        </section>
  
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Submit Your CV</CardTitle>
              <CardDescription>
                Let us help you take the next step in your career
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium text-gray-900"
                    >
                      Full Name
                    </label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
  
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-900"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                      Upload Your CV
                    </label>
                    <FileUploadArea
                      onFileSelect={setCvFile}
                      file={cvFile}
                      uploadProgress={uploadProgress}
                    />
                  </div>
                </div>
  
                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!cvFile || !fullName || !email}
                  >
                    Submit CV
                  </Button>
                  
                  {message && (
                    <p className="text-center text-sm font-medium text-green-600">
                      {message}
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
  
        <Footer />
      </div>
    );
  };
  
  export default CandidateCVPage;
  
  