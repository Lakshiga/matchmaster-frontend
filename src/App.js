import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomePage';
import About from './Components/About';
import Login from './Components/Login';
import Register from './Components/Register';
import AdminDashboard from './Components/AdminDashboard';
import OrganizerDashboard from './Components/OrganizerDashboard';
import PrivateRoute from './Components/PrivateRoute';
import ProtectedRoute from './Components/ProtectedRoute'; // Import the ProtectedRoute

import './App.css';

function App() {
  // State to store the user's authentication and verification status
  const [user, setUser] = useState({
    isAuthenticated: false,
    role: '',
    isVerified: false,
  });
   
  const [loading,setLoading] = useState (true);
  // Simulate fetching user info from local storage or API on page load
  useEffect(() => {
    // You would replace this with actual logic to retrieve user data from localStorage or an API
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user')); // Assuming user data is stored as JSON
    
    if (token && userData) {
      setUser({
        isAuthenticated: true,
        role: userData.role,
        isVerified: userData.isVerified,
      });
    }

    setLoading(false); // Set loading to false when user data is retrieved

  }, []);
   if (loading) {
    return <div> Loading...</div>
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protect Admin Dashboard */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Protect Organizer Dashboard */}
          
          <Route
            path="/organizer-dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={user.isAuthenticated}
                isVerified={user.isVerified}
                role={user.role}
              >
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
