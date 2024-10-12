import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import InterviewerHome from './pages/Interviewer/InterviewerHome';
import CandidateHome from './pages/Candidate/CandidateHome';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Profile from './pages/Interviewer/Profile';
import Interviews from './pages/Interviewer/Interviews';
import Assignments from './pages/Candidate/Assignments';
import CandidateProfile from './pages/Candidate/CandidateProfile';
import Settings from './pages/Candidate/Settings';

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
          <PrivateRoute allowedRoles={['interviewer']}>
            <InterviewerHome />
          </PrivateRoute>
        }
      />
      <Route
        path="/interviewer-profile"
        element={
          <PrivateRoute allowedRoles={['interviewer']}>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/interviewer-interviews"
        element={
          <PrivateRoute allowedRoles={['interviewer']}>
            <Interviews />
          </PrivateRoute>
        }
      />


      {/* Routes for Candidates */}

      <Route
        path="/candidate-home"
        element={
          <PrivateRoute allowedRoles={['candidate']}>
            <CandidateHome />
          </PrivateRoute>
        }
      />
      <Route
        path="/assignments"
        element={
          <PrivateRoute allowedRoles={['candidate']}>
            <Assignments />
          </PrivateRoute>
        }
      />
      <Route
        path="/candidate-home"
        element={
          <PrivateRoute allowedRoles={['candidate']}>
            <CandidateHome />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={['candidate']}>
            <CandidateProfile />
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute allowedRoles={['candidate']}>
           <Settings />
          </PrivateRoute>
        }
      />






    </Routes>
  );
}

export default App;
