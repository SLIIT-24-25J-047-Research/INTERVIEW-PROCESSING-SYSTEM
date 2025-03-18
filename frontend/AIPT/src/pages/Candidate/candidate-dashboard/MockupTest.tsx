import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CandidateLayout from "../../../components/Candidate/CandidateLayout";
import MockupQuestion from "../../../components/Candidate/MockupQuestion";
import Instructions from "../../../components/Candidate/tech-interview/Instructions";

// Define the PredictionResponse type
interface PredictionResponse {
  prediction: string;
}

interface MockupTestProps {
  webcamWidth?: number;
  webcamHeight?: number;
}

const MockupTest: React.FC<MockupTestProps> = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isTesting, setIsTesting] = useState(false); 
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null); 
  const [isEndButtonDisabled, setIsEndButtonDisabled] = useState(true); 
  const navigate = useNavigate();

  const candidateEmail = localStorage.getItem("email");
  const [score, setScore] = useState<number | null>(null);
  const [testEnded, setTestEnded] = useState<boolean>(false);

  interface SavePredictionResponse {
    message: string;
  }

  useEffect(() => {
    if (!candidateEmail) {
      console.error("No candidate email found in localStorage");
      navigate("/login");
    }
  }, [candidateEmail, navigate]);

  const captureScreenshot = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          const blob = await fetch(imageSrc).then((res) => res.blob());
          const file = new File([blob], "screenshot.jpg", {
            type: "image/jpeg",
          });

          const formData = new FormData();
          formData.append("file", file);
          formData.append("email", candidateEmail || "");

          const flaskResponse = await axios.post<PredictionResponse>(
            "http://127.0.0.1:3003/classification-predict",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          console.log("Prediction received:", flaskResponse.data.prediction);

          const prediction = flaskResponse.data.prediction;

          const saveResponse = await axios.post<SavePredictionResponse>(
            "http://127.0.0.1:5000/api/classification/savePrediction",
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

  const startTest = () => {
    setIsTesting(true);
    setIsEndButtonDisabled(true); // Disable the End Test button initially

    const interval = setInterval(() => {
      captureScreenshot();
    }, 30000);

    setIntervalId(interval);

    // Enable the End Test button after 30 seconds
    setTimeout(() => {
      setIsEndButtonDisabled(false);
    }, 30000); // 30 seconds delay
  };

  const endTest = async (finalScore: number) => {
    setIsTesting(false);
    setScore(finalScore);
    setTestEnded(true);

    if (intervalId) {
      clearInterval(intervalId);
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/candidate-result/save', {
        email: candidateEmail,
        score: finalScore,
      });

      console.log(response.data.message);

      // Navigate only after the result is successfully saved
      navigate(`/candidate-mockup-results/${candidateEmail}`, { replace: true });
    } catch (error) {
      console.error('Error saving the result:', error);
    }
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
            margin-top: 100px;
            margin-right: 100px;
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
        <div>
          {isTesting && (
            <div
              className="webcam-container"
              style={{ width: "150px", height: "100px" }}
            >
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
            </div>
          )}
          <h1>Mockup Test</h1>
          <p>Email of Candidate: {candidateEmail}</p>
          {!isTesting && (
            <div className="mockup-test-controls">
              <Instructions />
            </div>
          )}
          {isTesting &&  <MockupQuestion onEndTest={endTest} />}

          <div className="mockup-test-controls">
            {!isTesting ? (
              <button onClick={startTest}>Start Test</button>
            ) : (
              <span>Wait 30 seconds</span>
            )}
          </div>
        </div>
      </CandidateLayout>
    </>
  );
};

export default MockupTest;
