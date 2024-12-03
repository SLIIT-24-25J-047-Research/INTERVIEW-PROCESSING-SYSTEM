import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CandidateLayout from "../../components/Candidate/CandidateLayout";
import MockupQuestion from "../../components/Candidate/MockupQuestion";

// Define the PredictionResponse type
interface PredictionResponse {
  prediction: string;
}

interface MockupTestProps {
  webcamWidth?: number;
  webcamHeight?: number;
}

const MockupTest: React.FC<MockupTestProps> = ({

}) => {
  const webcamRef = useRef<Webcam>(null);
  const [isTesting, setIsTesting] = useState(false); // Track test state
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // Track the interval ID
  const navigate = useNavigate();

  // Retrieve the candidate's email from localStorage
  const candidateEmail = localStorage.getItem("email");

  interface SavePredictionResponse {
    message: string;
  }

  // Redirect to login if no email is found
  useEffect(() => {
    if (!candidateEmail) {
      console.error("No candidate email found in localStorage");
      navigate("/login");
    }
  }, [candidateEmail, navigate]);

  // Capture a screenshot from the webcam
  const captureScreenshot = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          // Convert base64 image to Blob
          const blob = await fetch(imageSrc).then((res) => res.blob());
          const file = new File([blob], "screenshot.jpg", {
            type: "image/jpeg",
          });

          // Create form data for the API
          const formData = new FormData();
          formData.append("file", file);
          formData.append("email", candidateEmail || "");

          // Send the image to Flask for classification
          const flaskResponse = await axios.post<PredictionResponse>(
            "http://127.0.0.1:3003/classification-predict",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          console.log("Prediction received:", flaskResponse.data.prediction);

          // Send the prediction to the Node.js backend to save it
          const prediction = flaskResponse.data.prediction;

          const saveResponse = await axios.post<SavePredictionResponse>(
            "http://127.0.0.1:5000/api/classification/savePrediction", // Node.js backend
            {
              email: candidateEmail,
              prediction: prediction,
            }
          );

          if (
            saveResponse.data.message ===
            "Prediction already saved within the last 30 seconds"
          ) {
            console.log(
              "Prediction skipped, already saved in the last 30 seconds."
            );
          }
        } catch (error) {
          console.error("Error during prediction or save:", error);
        }
      }
    }
  };

  // Start the test and begin capturing screenshots
  const startTest = () => {
    setIsTesting(true);

    // Start capturing screenshots every 30 seconds
    const interval = setInterval(() => {
      captureScreenshot();
    }, 30000); // 30 seconds interval

    setIntervalId(interval); // Save interval ID for cleanup
  };

  // End the test and navigate to the results page
  const endTest = () => {
    setIsTesting(false); // Stop testing

    // Clear the interval to stop capturing screenshots
    if (intervalId) {
      clearInterval(intervalId);
    }

    // Navigate to the results page
    navigate(`/candidate-mockup-results/${candidateEmail}`);
  };

  return (
    <>
      <style>
        {`
          .webcam-container {
            position: absolute;
            top: 10px;
            right: 10px;
            border: 2px solid #000;
            border-radius: 8px;
            overflow: hidden;
          }
          .webcam-container video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .mockup-test-controls {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            gap: 10px;
          }
          .mockup-test-controls button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background-color: #007bff;
            color: #fff;
          }
          .mockup-test-controls button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
      <CandidateLayout>
        <div style={{ position: "relative" }}>
          <div
            className="webcam-container"
            style={{ width: "150px", height: "100px" }}
          >
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
          </div>
          <h1>Mockup Test</h1>
          <p>Email of Candidate: {candidateEmail}</p>
          <div className="mockup-test-controls">
            {!isTesting ? (
              <button onClick={startTest}>Start Test</button>
            ) : (
              <button onClick={endTest}>End Test</button>
            )}
          </div>
          <MockupQuestion />
        </div>
      </CandidateLayout>
    </>
  );
};

export default MockupTest;
