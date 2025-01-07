import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import CandidateLayout from "../components/Candidate/CandidateLayout";
import InterviewerLayout from "../components/Interviewer/DashboardLayout";
import CandidateDashboard from "../pages/Candidate/CandidateDashboard";
import Assignments from "../pages/Candidate/Assignments";
import CandidateProfile from "../pages/Candidate/CandidateProfile";
import Settings from "../pages/Candidate/Settings";
import MockupTest from "../pages/Candidate/MockupTest";
import Results from "../pages/Candidate/Results";
import JobApplicationForm from "../pages/Candidate/JobDetails";
import CandidateTest from "../pages/Candidate/CandidateTest";
import NotificationsPage from "../components/Candidate/Notifications";
import CandidateHome from "../pages/Candidate/CandidateHome";
import Login from "../components/Login";
import Register from "../components/Register";
import Home from "../pages/Home";

// Wrap the component with PrivateRoute
const protectedRoute = (Component, roles) => {
  return (
    <PrivateRoute allowedRoles={roles}>
      {Component}
    </PrivateRoute>
  );
};

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  
  // Candidate routes
  {
    path: "/",
    element: <CandidateLayout />,
    children: [
      {
        path: "candidate-home",
        element: protectedRoute(<CandidateHome />, ["candidate"]),
      },
      {
        path: "dashboard",
        element: protectedRoute(<CandidateDashboard />, ["candidate"]),
      },
      {
        path: "assignments",
        element: protectedRoute(<Assignments />, ["candidate"]),
      },
      {
        path: "candidate-mockup",
        element: protectedRoute(<MockupTest />, ["candidate"]),
      },
      {
        path: "candidate-test",
        element: protectedRoute(<CandidateTest />, ["candidate"]),
      },
      {
        path: "candidate-mockup-results/:email",
        element: protectedRoute(<Results />, ["candidate"]),
      },
      {
        path: "candidate-home/job/:jobId/apply",
        element: protectedRoute(<JobApplicationForm />, ["candidate"]),
      },
      {
        path: "profile",
        element: protectedRoute(<CandidateProfile />, ["candidate"]),
      },
      {
        path: "settings",
        element: protectedRoute(<Settings />, ["candidate"]),
      },
      {
        path: "notifications",
        element: protectedRoute(<NotificationsPage />, ["candidate"]),
      },
    ],
  },

  // Add interviewer routes here in a similar structure
  {
    path: "/interviewer",
    element: <InterviewerLayout />,
    children: [
      // Add interviewer routes here
    ],
  },
]);

export default router;