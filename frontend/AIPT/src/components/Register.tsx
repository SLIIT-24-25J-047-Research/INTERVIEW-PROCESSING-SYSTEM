import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';
import image from '../images/registerBG.jpg';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate'); // Default is 'candidate'
  const [name, setName] = useState('');


  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      alert(response.data.message);
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role); 
      navigate('/login');
 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container2">
      <div className="auth-box">
        <div className="auth-image">
          <img src={image} alt="Register Illustration" />
        </div>
        <div className="auth-form-wrapper">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input 
              type="text" 
              placeholder="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="candidate"
                  checked={role === 'candidate'}
                  onChange={() => setRole('candidate')}
                />
                Candidate
              </label>
              <label>
                <input
                  type="radio"
                  value="interviewer"
                  checked={role === 'interviewer'}
                  onChange={() => setRole('interviewer')}
                />
                Interviewer
              </label>
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
