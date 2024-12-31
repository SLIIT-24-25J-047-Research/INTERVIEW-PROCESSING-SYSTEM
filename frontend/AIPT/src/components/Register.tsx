import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // Import the GoogleLogin component
import '../Auth.css';
import image from '../images/registerBG.jpg';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';


// Define response type for Google signup
interface GoogleSignupResponse {
  message: string;
  token: string;
  role: string;
}

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate'); // Default is 'candidate'
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ message: string; token: string; role: string }>(
        'http://localhost:5000/api/auth/register',
        { name, email, password, role }
      );
     Swal.fire({
        icon: 'success',
        title: response.data.message,
        text: 'You are now registered. Please login to continue.',
        confirmButtonText: 'Okay',
      });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      const token = response.credential; 

      const backendResponse = await axios.post<GoogleSignupResponse>(
        'http://localhost:5000/api/auth/google-signup',
        { token }
      );
  
      Swal.fire({
        position: "top-end",
        icon: 'success',
        title: backendResponse.data.message,
        text: 'You are now logged in.',
        confirmButtonText: 'Okay',
      });
      
      localStorage.setItem('token', backendResponse.data.token);
      localStorage.setItem('role', backendResponse.data.role);
  
      if (backendResponse.data.role === 'interviewer') {
        navigate('/interviewer-home');
      } else if (backendResponse.data.role === 'candidate') {
        navigate('/candidate-home');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Something went wrong. Please try again.',
          confirmButtonText: 'Okay',
        });
        navigate('/');  
      }
  
    } catch (error) {
      console.error('Google Signup Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Google Signup Failed',
        text: 'Google signup failed. Please try again.',
        confirmButtonText: 'Okay',
      });
    }
  };
  
  const handleGoogleFailure = () => {
    console.error('Google Signup Failed');
   Swal.fire({
      icon: 'error',
      title: 'Google Signup Failed',
      text: 'Google signup failed. Please try again.',
      confirmButtonText: 'Okay',
    });
  };
  

  return (
    <motion.div className="auth-container2"
    initial={{ background: 'linear-gradient(135deg, #b9168d, #1e0c5e, #2623bd)' }}
      animate={{
        background: [
          'linear-gradient(135deg, #b9168d, #1e0c5e, #2623bd)',
          'linear-gradient(135deg, #1e0c5e, #2623bd, #b9168d)',
          'linear-gradient(135deg, #2623bd, #b9168d, #1e0c5e)',
          'linear-gradient(135deg, #b9168d, #1e0c5e, #2623bd)'
        ],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}>
      <div className="auth-box">
        <div className="auth-image">
          <img src={image} alt="Register Illustration" />
        </div>
        <div className="auth-form-wrapper">
          <form className="auth-form flex flex-col items-center space-y-6 w-full" onSubmit={handleSubmit}>
            <h2 className="text-center w-full mb-6">Register</h2> {/* Increased margin-bottom */}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field w-full mb-4"
            />
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
            <div className="radio-group ">
              <label>
                <input
                  type="radio"
                  value="candidate"
                  checked={role === 'candidate'}
                  onChange={() => setRole('candidate')}
                  className="mr-2"
                />
                Candidate
              </label>
              <label>
                <input
                  type="radio"
                  value="interviewer"
                  checked={role === 'interviewer'}
                  onChange={() => setRole('interviewer')}
                  className="mr-2"
                />
                Interviewer
              </label>
            </div>
            <button type="submit" className="submit-btn w-full mb-4">Register</button>
            {/* Divider and Notice to Login Page */}
       
          <p>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
              Login here
            </a>
          </p>

            
              {/* Separator */}
              <div className=" text-center text-gray-500">or</div>
              
                  {/* Google Login Button for Signup */}
          <div className="w-full flex justify-center">
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={handleGoogleFailure} 
              theme="outline" 
              shape="circle"
            />
          </div>
          </form>

    
        </div>
      </div>
    </motion.div>
  );
};

export default Register;