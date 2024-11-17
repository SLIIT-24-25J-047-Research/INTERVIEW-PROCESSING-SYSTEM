import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams

// Define the type for the response
interface PredictionResponse {
  prediction: string;
  error?: string;
}

const Results = () => {
  const { email } = useParams<{ email: string }>(); // Get email from route parameters
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null); // State for prediction
  const [candidateEmail, setCandidateEmail] = useState<string | null>(null); // State for email

  // Use localStorage to retrieve email and prediction
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPrediction = localStorage.getItem("Prediction");

    if (storedEmail) setCandidateEmail(storedEmail);
    if (storedPrediction) setPrediction(storedPrediction);
  }, []); // Only run on component mount

  return (
    <div>
      {error && <p>{error}</p>}
      {prediction && <p>Prediction: {prediction}</p>}
      {candidateEmail && <p>Email: {candidateEmail}</p>}
    </div>
  );
};

export default Results;
