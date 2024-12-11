import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import '../Auth.css';  
import image from '../images/loginBG.jpg';

// Define the response type for login
interface LoginResponse {
  token: string;
  role: string;
  email: string;
  message?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Specify the response type as LoginResponse
      const response = await axios.post<LoginResponse>('http://localhost:5000/api/auth/login', { email, password });
      
      handleLoginSuccess(response.data);
    } catch (error: unknown) {
      console.error(error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      const token = response.credential;  

      // Send the token to your backend to verify and login
      const backendResponse = await axios.post<LoginResponse>(
        'http://localhost:5000/api/auth/glogin',
        { token }
      );

      handleLoginSuccess(backendResponse.data);
    } catch (error: unknown) {
      console.error('Google Login Error:', error);

      // Type assertion: Telling TypeScript that error is an AxiosError
      if (axios.isAxiosError(error)) {
        // Check if the error response exists
        if (error.response) {
          // If the error status is 404, it means the user is not found
          if (error.response.status === 404) {
            alert('User not found. Please sign up first.');
            navigate('/register');
          } else {
            alert('Login failed. Please try again.');
          }
        } else {
          alert('An error occurred. No response from the server.');
        }
      } else {
        alert('An unknown error occurred. Please try again.');
      }
    }
  };

  const handleLoginSuccess = (data: LoginResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('email', data.email);
    localStorage.setItem('authToken', data.token);

    if (data.role === 'interviewer') {
      navigate('/interviewer-home');
    } else if (data.role === 'candidate') {
      navigate('/candidate-home');
    } else {
      navigate('/');
    }
  };

  const handleGoogleFailure = () => {
    console.error('Google Login Failed');
    alert('Google login failed. Please try again.');
  };

  return (
    <div className="auth-container1">
      <div className="auth-box">
        <div className="auth-image">
          <img src={image} alt="Login Illustration" />
        </div>
        <div className="auth-form-wrapper">
          <form className="auth-form flex flex-col items-center space-y-6 w-full" onSubmit={handleSubmit}>
            <h2 className="text-center w-full mb-6">Login</h2> {/* Increased margin-bottom */}
            <div className="w-full px-4">
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="input-field w-full mb-4"
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="input-field w-full mb-4"
              />
              <button type="submit" className="submit-btn w-full mb-4">Login</button>
      
              {/* Separator */}
              <div className="my-4 text-center text-gray-500">or</div>
      
              {/* Google Login Button */}
              <div className="w-full flex justify-center">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess} 
                  onError={handleGoogleFailure} 
                  theme="outline" 
                  shape="circle"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
  
};

export default Login;