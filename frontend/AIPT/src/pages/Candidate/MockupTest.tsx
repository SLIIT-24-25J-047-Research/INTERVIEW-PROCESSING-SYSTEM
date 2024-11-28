import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the PredictionResponse type
interface PredictionResponse {
  prediction: string;
}

const MockupTest: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isTesting, setIsTesting] = useState(false); // Track test state
  const navigate = useNavigate();

  // Retrieve the candidate's email from localStorage
  const candidateEmail = localStorage.getItem("email");

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

          // Create form data for Flask API
          const formData = new FormData();
          formData.append("file", file);
          formData.append("email", candidateEmail || "");

          // Send the image to Flask for classification
          const flaskResponse = await axios.post<PredictionResponse>(
            "http://127.0.0.1:5001/classification-predict",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          console.log("Prediction received:", flaskResponse.data.prediction);

          // Store the prediction as a string in localStorage
          localStorage.setItem(
            "Prediction",
            JSON.stringify(flaskResponse.data.prediction)
          );

          // Send the prediction as an array to Node.js backend
          const predictionArray = Array.isArray(flaskResponse.data.prediction)
            ? flaskResponse.data.prediction
            : [flaskResponse.data.prediction]; // Ensure prediction is an array

          // Send the prediction array to Node.js backend
          await axios.post(
            "http://localhost:5000/api/classification/store-prediction",
            {
              email: candidateEmail,
              prediction: predictionArray,
            }
          );
        } catch (error) {
          console.error("Error during prediction or save:", error);
        }
      }
    }
  };

  // Start the test and begin capturing screenshots
  const startTest = () => {
    setIsTesting(true);
  };

  // End the test and navigate to the results page
  const endTest = () => {
    setIsTesting(false); // Stop testing
    navigate(`/candidate-mockup-results/${candidateEmail}`); // Redirect to results page with actual email
  };

  // Capture screenshots every 30 seconds while testing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTesting) {
      interval = setInterval(() => {
        captureScreenshot();
      }, 30000); // 30 seconds interval
    }

    // Cleanup the interval on component unmount or when testing stops
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTesting]);

  return (
    <div>
      <h1>Mockup Test</h1>
      <p>Email of Candidate: {candidateEmail}</p>{" "}
      {/* Display candidate's email */}
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      {!isTesting ? (
        <button onClick={startTest}>Start Test</button>
      ) : (
        <button onClick={endTest}>End Test</button>
      )}
    </div>
  );
};

export default MockupTest;
