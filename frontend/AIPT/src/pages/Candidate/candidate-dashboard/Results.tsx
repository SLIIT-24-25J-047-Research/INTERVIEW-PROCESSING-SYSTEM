import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CandidateLayout from "../../../components/Candidate/CandidateLayout";

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
    clean_formal: 100,   // Clean environment with formal attire is perceived highly professional
    messy_formal: 75,    // Formal attire still holds value, but messiness reduces the perception
    clean_casual: 50,    // Clean environment with casual attire is generally acceptable but less professional
    messy_casual: 25,    // Messy environment with casual attire is seen negatively in terms of professionalism
  };

  useEffect(() => {
    if (email) {
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
        .catch(() => setError("Failed to fetch predictions."));

      axios
        .get<TestResult>(`http://localhost:5000/api/candidate-result/getResultByEmail/${email}`)
        .then((response) => {
          if (response.data) {
            setTestResult(response.data);
          } else {
            setError("No test result found for this email.");
          }
        })
        .catch(() => setError("Failed to fetch test result."));
    } else {
      setError("No email provided.");
    }
  }, [email]);

  const overallScore =
    score !== null && testResult ? (score * 0.7 + testResult.score * 10 * 0.3).toFixed(2) : null;
  const isPassed = overallScore !== null && parseFloat(overallScore) >= 50;

  return (
    <CandidateLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Results for <span className="text-blue-600">{email}</span>
          </h1>

          {error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : (
            <>
              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="border border-gray-300 p-3 text-left">Final Prediction</th>
                      <th className="border border-gray-300 p-3 text-left">Prediction Score</th>
                      <th className="border border-gray-300 p-3 text-left">Mockup Test Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-50 hover:bg-gray-100">
                      <td className="border border-gray-300 p-3">{finalPrediction}</td>
                      <td className="border border-gray-300 p-3">{score}/100</td>
                      <td className="border border-gray-300 p-3">{testResult ? testResult.score : "N/A"}/10</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Evaluation Card */}
              <div
                className={`mt-6 p-6 rounded-lg shadow-md ${
                  isPassed ? "bg-green-500 text-white" : "bg-red-500 text-white"
                } text-center`}
              >
                <h2 className="text-xl font-bold">Candidate Pre-Evaluation</h2>
                <p className="text-lg mt-2">Overall Score: <strong>{overallScore}%</strong></p>
                <p className="mt-2 text-lg font-semibold">
                  {isPassed ? "✅ Passed Pre-Evaluation" : "❌ Failed Pre-Evaluation"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </CandidateLayout>
  );
};

export default Results;
