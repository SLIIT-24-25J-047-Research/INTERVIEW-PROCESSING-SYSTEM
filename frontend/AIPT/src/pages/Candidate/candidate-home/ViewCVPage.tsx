import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../../../components/ui/button";
import Footer from "../../../components/Candidate/Footer";
import Header from "../../../components/Candidate/CandidateHeader";
import { Document, Page } from 'react-pdf'; // Importing react-pdf to render PDFs
import FileViewer from "../../../components/Candidate/FileViewer";
import FileSkillExtractor from "../../../components/Candidate/FileSkillExtractor";

const ViewCVPage = () => {
  const { fileId } = useParams<{ fileId: string }>(); // Get the fileId from the URL
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/CVfiles/download/${fileId}`, {
          responseType: "blob", // Handle file download as blob
        });
        const url = URL.createObjectURL(response.data);
        setCvUrl(url); // Set the URL to the blob response
      } catch (error: any) {
        console.error("Error fetching CV:", error);
        setError("Failed to fetch CV. Please try again.");
      }
    };

    if (fileId) {
      fetchCV();
    }
  }, [fileId]);

  // PDF rendering functions
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="View Your CV" />
      <section className="header-banner">
        <div className="banner-text">
          <h1>View Your Uploaded CV</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 relative">
        {error && <p className="text-red-600">{error}</p>}

        {cvUrl ? (
          <div className="relative">
            {/* Button positioned at the top-right corner */}
            <div className="absolute top-2 right-2 z-10">
              <a href={cvUrl} download>
                <Button className="w-full">Download Your CV</Button>
              </a>
            </div>

            {/* Render CV Preview */}
            <div className="flex justify-center">
            <FileViewer filePath={cvUrl} />
            </div>
            <FileSkillExtractor filePath={cvUrl} />

            {/* Pagination for PDF (if it's a multi-page PDF) */}
            {numPages && numPages > 1 && (
              <div className="flex justify-center space-x-4 mt-4">
                <Button 
                  onClick={() => setPageNumber(pageNumber - 1)} 
                  disabled={pageNumber <= 1}
                >
                  Previous
                </Button>
                <span>Page {pageNumber} of {numPages}</span>
                <Button 
                  onClick={() => setPageNumber(pageNumber + 1)} 
                  disabled={pageNumber >= numPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center">Loading CV...</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ViewCVPage;

