import React, { useState } from "react";
import { Button } from "../../../components/ui/button"; // Adjust imports as per your project structure
import { Input } from "../../../components/ui/input";
import Footer from "../../../components/Candidate/Footer";
import Header from '../../../components/Candidate/CandidateHeader';


const CandidateCVPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle CV submission logic here
        console.log({ fullName, email, cvFile });
        setMessage("CV Submitted Successfully!");
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
            <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">CV Submission</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-600 mb-2 flex items-center"
                        >
                            Full Name
                        </label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Email Address */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-600 mb-2 flex items-center"
                        >
                            Email Address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* CV Upload */}
                    <div>
                        <label
                            htmlFor="cvFile"
                            className="block text-sm font-medium text-gray-600 mb-2 flex items-center"
                        >
                            Upload Your CV
                        </label>
                        <Input
                            id="cvFile"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setCvFile(e.target.files[0]);
                                }
                            }}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full py-2 text-white font-semibold bg-blue-500 rounded hover:bg-blue-600"
                    >
                        Submit
                    </Button>
                </form>

                {/* Status Message */}
                {message && (
                    <p className="text-center text-green-500 mt-4">{message}</p>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default CandidateCVPage;
