import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { FileUploadArea } from "./FileUploadArea";
import { Input } from "../../../components/ui/input";
import Footer from "../../../components/Candidate/Footer";
import Header from '../../../components/Candidate/CandidateHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import axios from "axios";

const CandidateCVPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | undefined>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Dummy userId and jobId for demonstration purposes (replace with actual values)
  const userId = "6738ccc6339fff5ad4245b8d"; 
  const jobId = "675aa492ea75fb1d58881893";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cv || !fullName || !email) {
      setError("Please fill in all required fields and upload a CV.");
      return;
    }

    // Create FormData to send file and form inputs
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("userId", userId);
    formData.append("jobId", jobId);
    formData.append("cv", cv);

    try {
      setUploadProgress(0);

      // Axios POST request to upload CV
      const response = await axios.post("http://localhost:5000/api/CVfiles/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        },
      });

      if (response.status === 200) {
        setMessage("CV Submitted Successfully!");
        setFullName("");
        setEmail("");
        setCv(null);
        setUploadProgress(undefined);
        setError("");
      }
    } catch (error: any) {
      console.error("Error uploading CV:", error);
      setError(error.response?.data?.message || "Failed to upload CV");
      setUploadProgress(undefined);
    }
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
                    onFileSelect={setCv}
                    file={cv}
                    uploadProgress={uploadProgress}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!cv || !fullName || !email}
                >
                  Submit CV
                </Button>

                {uploadProgress !== undefined && (
                  <p className="text-center text-sm font-medium text-blue-600">
                    Uploading: {uploadProgress}%
                  </p>
                )}

                {message && (
                  <p className="text-center text-sm font-medium text-green-600">
                    {message}
                  </p>
                )}

                {error && (
                  <p className="text-center text-sm font-medium text-red-600">
                    {error}
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
