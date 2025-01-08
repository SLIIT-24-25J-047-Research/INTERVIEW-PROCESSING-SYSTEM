import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';


const Client_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!Client_ID) {
  console.error('Google Client ID is not defined in .env file');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={Client_ID!}>
      <AuthProvider>
        <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
