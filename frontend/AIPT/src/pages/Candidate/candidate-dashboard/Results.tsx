import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../../Styles/Results.css";
import CandidateLayout from "../../../components/Candidate/CandidateLayout";

interface PredictionDocument {
  prediction: string;
}

interface TestResult {
  score: number;
}

const Results: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [error, setError] = useState<string | null>(null);
  const [finalPrediction, setFinalPrediction] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const predictionScores: Record<string, number> = {
    clean_formal: 100,
    clean_casual: 75,
    messy_formal: 75,
    messy_casual: 50,
  };

  useEffect(() => {
    if (email) {
      // Fetch prediction from the backend
      axios
        .get<{ prediction: string }>(`http://localhost:5000/api/classification/getAllPredictions/${email}`)
        .then((response) => {
          const prediction = response.data.prediction;

          if (prediction) {
            setFinalPrediction(prediction);
            setScore(predictionScores[prediction]);
          } else {
            setError("No predictions found for this email.");
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch predictions.");
        });

      // Fetch test result from the backend
      axios
        .get<TestResult>(`http://localhost:5000/api/candidate-result/getResultByEmail/${email}`)
        .then((response) => {
          const result = response.data;

          if (result) {
            setTestResult(result);
          } else {
            setError("No test result found for this email.");
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch test result.");
        });
    } else {
      setError("No email provided.");
    }
  }, [email]);

  return (
    <CandidateLayout>
      <div className="results-container">
        {error && <p className="error-message">{error}</p>}
        {!error && finalPrediction && score !== null ? (
          <div className="results-card">
            <h1>Results for {email}</h1>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Final Prediction</th>
                  <th>Prediction Score</th>
                  <th>Mockup Test Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{finalPrediction}</td>
                  <td>{score}/100</td>
                  <td>{testResult ? testResult.score : "N/A"}/10</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="loading-message">Loading results...</p>
        )}
      </div>
    </CandidateLayout>
  );
};

export default Results;
