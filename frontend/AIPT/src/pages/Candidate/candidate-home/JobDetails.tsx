import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { FileUploadArea } from "./FileUploadArea";
import { Input } from "../../../components/ui/input";
import Footer from "../../../components/Candidate/Footer";
import Header from '../../../components/Candidate/CandidateHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import axios from "axios";
import FileSkillExtractor from "../../../components/Candidate/FileSkillExtractor"; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


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
  const [fileId, setFileId] = useState<string>(""); // State to store the uploaded fileId
  const [skillsValidated, setSkillsValidated] = useState<boolean>(false); // Track if skills are validated
  const [skillValidationError, setSkillValidationError] = useState<string>(""); // Track skill validation errors

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

  // Handle skill validation callback from FileSkillExtractor
  const handleSkillValidation = (isValid: boolean, errorMessage?: string) => {
    setSkillsValidated(isValid);
    if (!isValid && errorMessage) {
      setSkillValidationError(errorMessage);
      toast.error(errorMessage);
    } else if (isValid) {
      setSkillValidationError("");
      toast.success("Skills validated successfully! You can proceed with your application.");
      
      // Proceed with job application after successful validation
      proceedWithJobApplication();
    }
  };

  // Function to proceed with job application
  const proceedWithJobApplication = async () => {
    try {
      await axios.post("http://localhost:5000/api/user-job-applications/apply", {
        userId,
        jobId,
      });
      
      // Redirect to /candidate-home after 2 seconds
      setTimeout(() => {
        navigate('/candidate-home');  // Navigate to the candidate home page
      }, 2000);
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Failed to apply for the job. Please try again.");
    }
  };

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
        setMessage("CV Uploaded Successfully! Validating skills...");
        const fileId = response.data.fileId;  // Assuming the response includes the fileId
        setFileId(fileId); // Save the fileId to state
        setFullName("");
        setEmail("");
        setCv(null);
        setUploadProgress(undefined);
        setError("");
  
        // Show success Toast notification for upload
        toast.success("CV Uploaded Successfully! Now validating your skills...");
        
        // Note: Job application will be handled after skill validation in handleSkillValidation
      }
    } catch (error: unknown) {
      console.error("Error uploading CV:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to upload CV");
      } else {
        setError("Failed to upload CV");
      }
      setUploadProgress(undefined);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

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

                {skillValidationError && (
                  <p className="text-center text-sm font-medium text-red-600">
                    {skillValidationError}
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Render FileSkillExtractor after CV is uploaded */}
      {fileId && (
        <FileSkillExtractor
          filePath={`http://localhost:5000/api/CVfiles/download/${fileId}`} // Path to the uploaded CV
          fileId={fileId}
          jobId={jobId!} // Pass jobId as a prop
          userId={userId} // Pass userId as a prop
          onSkillValidation={handleSkillValidation} // Pass callback for skill validation
        />
      )}

      <Footer />
    

    </div>
  );
};

export default CandidateCVPage;