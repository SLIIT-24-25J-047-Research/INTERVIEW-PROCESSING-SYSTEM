import React, { useState } from "react";
import { Button } from "../../components/ui/button"; // Adjust imports as per your project structure
import { Input } from "../../components/ui/input";
import Footer from "../../components/Candidate/Footer";
import Header from '../../components/Candidate/CandidateHeader';
import '../Styles/JobApplicationForm.css'


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

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">CV Submission</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-600 mb-2" htmlFor="fullName">
                                Full Name
                            </label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-2" htmlFor="cvFile">
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
                                className="w-full"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
                        >
                            Submit
                        </Button>
                    </form>
                    {message && (
                        <p className="text-green-500 mt-4 text-center">{message}</p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CandidateCVPage;
