import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { FileUploadArea } from "./FileUploadArea";
import { Input } from "../../../components/ui/input";
import Footer from "../../../components/Candidate/Footer";
import Header from '../../../components/Candidate/CandidateHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import axios from "axios";

const getUserIdFromToken = (token: string): string => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const payloadData = JSON.parse(decodedPayload);
    return payloadData.id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return '';
  }
};

const CandidateCVPage = () => {
  const { jobId } = useParams<{ jobId: string }>(); // Ensure jobId is correctly typed
  const navigate = useNavigate();  // Hook to navigate to another page

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | undefined>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string>("");

  // Get the email and userId from the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id = getUserIdFromToken(token);
      if (id) {
        setUserId(id);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cv || !fullName || !email || !jobId) {
      setError("Please fill in all required fields and upload a CV.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("userId", userId);
    formData.append("jobId", jobId);
    formData.append("cv", cv);

    try {
      setUploadProgress(0);

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
        const fileId = response.data.fileId;  // Assuming the response includes the fileId
        setFullName("");
        setEmail("");
        setCv(null);
        setUploadProgress(undefined);
        setError("");

        // Redirect to the ViewCVPage after 2 seconds
        setTimeout(() => {
          navigate(`/view-cv/${fileId}`);  // Redirect to the ViewCVPage with the fileId
        }, 2000);
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
