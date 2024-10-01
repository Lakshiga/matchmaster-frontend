import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password,
      });

      const { token, role, isVerified } = res.data;

      // Store the token and role in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Check if the user is an organizer and if they are verified
      if (role && role.toLowerCase() === 'organizer') {
        if (isVerified) {
          alert('Login successful as organizer.');
          navigate('/organizer-dashboard');
        } else {
          setError('Your account is awaiting admin verification.');
        }
      } 
      // Check if the user is an admin
      else if (role && role.toLowerCase() === 'admin') {
        alert('Login successful as admin.');
        navigate('/admin-dashboard');
      } 
      // If the user has any other role
      else {
        alert('Login successful.');
        navigate('/');
      }
    } catch (err) {
      // Set an error message for failed login
      setError('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account?</p>
      <p><a href="/register">Register here</a></p>
    </div>
  );
};

export default Login;