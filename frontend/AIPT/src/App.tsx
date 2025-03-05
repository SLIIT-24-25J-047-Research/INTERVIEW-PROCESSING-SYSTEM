import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import InterviewerHome from "./pages/Interviewer/InterviewerHome";
import CandidateDashboard from "./pages/Candidate/candidate-dashboard/CandidateDashboard";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Profile from "./pages/Interviewer/Profile";
import Interviews from "./pages/Interviewer/Interviews";
import NonTechInterviewPage from "./pages/Candidate/candidate-dashboard/NonTechInterviewPage";
import CandidateProfile from "./pages/Candidate/candidate-dashboard/CandidateProfile";
import Settings from "./pages/Candidate/candidate-dashboard/Settings";
import MockupTest from "./pages/Candidate/candidate-dashboard/MockupTest";
import Results from "./pages/Candidate/candidate-dashboard/Results";
import CandidateHome from "./pages/Candidate/candidate-home/CandidateHome";
import JobApplicationForm from "./pages/Candidate/candidate-home/JobDetails";
import CandidateTest from "./pages/Candidate/candidate-dashboard/CandidateTest";
import AddJob from "./pages/Interviewer/AddJob";
import NotificationsPage from "./pages/Candidate/candidate-home/Notifications";
import ScheduledInterviewPage from "./pages/Candidate/candidate-dashboard/ScheduledInterviewPage";
import Techexam from "./pages/Candidate/candidate-dashboard/TechInterviewPage";
import { AnswersDashboard } from "./components/Interviewer/answers/AnswersDashboaard";
import ViewCVPage from "./pages/Candidate/candidate-home/ViewCVPage";
import NonTechnicalInterviewGuard from "./components/Candidate/non-tech-interview/NonTechInterviewGuard";
import OptionsPage from "./pages/Candidate/candidate-dashboard/OptionsPage";
import SendFeedback from "./pages/Interviewer/SendFeedback";
import JobAdminDashboard from "./pages/Interviewer/jobdetails/Job-admin-dashboard";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />

      {/* Routes for Interviewer */}

      <Route
        path="/interviewer-home"
        element={
          <PrivateRoute allowedRoles={["interviewer"]}>
            <InterviewerHome />
          </PrivateRoute>
        }
      />
      <Route
        path="/interviewer-profile"
        element={
          <PrivateRoute allowedRoles={["interviewer"]}>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/interviewer-interviews"
        element={
          <PrivateRoute allowedRoles={["interviewer"]}>
            <Interviews />
          </PrivateRoute>
        }
      />
      <Route
        path="/interviewer-Vacancies"
        element={
          <PrivateRoute allowedRoles={["interviewer"]}>
            <AddJob />
          </PrivateRoute>
        }
      />
      <Route
        path="/interviewer-answers"
        element={
          <PrivateRoute allowedRoles={["interviewer"]}>
            <AnswersDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/interviewer-feedback"
        element={
          <PrivateRoute allowedRoles={["interviewer"]}>
            <SendFeedback />
          </PrivateRoute>
        }
      />


      <Route
        path="/interviewer-jobs"
        element={
          <PrivateRoute allowedRoles={["interviewer"]}>
            <JobAdminDashboard />       
          </PrivateRoute>
        }
      />




      {/* Routes for Candidates */}

      <Route
        path="/candidate-home"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <CandidateHome />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <CandidateDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/interview"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <ScheduledInterviewPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/non-tech-interview/:id?"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <NonTechnicalInterviewGuard>
              <NonTechInterviewPage />
            </NonTechnicalInterviewGuard>

          </PrivateRoute>
        }
      />
      <Route
        path="/candidate-home"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <CandidateHome />
          </PrivateRoute>
        }
      />
      <Route
        path="/view-cv/:fileId"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <ViewCVPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/candidate-mockup"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <MockupTest />
          </PrivateRoute>
        }
      />
      <Route
        path="/tech-interview"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <CandidateTest />
          </PrivateRoute>
        }
      />
      <Route
        path="/candidate-mockup-results/:email"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <Results />
          </PrivateRoute>
        }
      />

      <Route
        path="/candidate-home/job/:jobId/apply"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <JobApplicationForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <CandidateProfile />
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <Settings />
          </PrivateRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <NotificationsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tech"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <Techexam />
          </PrivateRoute>
        }
      />

      <Route
        path="/test"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <AnswersDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/options"
        element={
          <PrivateRoute allowedRoles={["candidate"]}>
            <OptionsPage />
          </PrivateRoute>
        }
      />




    </Routes>
  );
};

export default App;
