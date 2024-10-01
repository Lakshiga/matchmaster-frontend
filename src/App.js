import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
import About from "./Components/About";
import Login from "./Components/Login";
import Register from "./Components/Register";
import AdminDashboard from "./Components/AdminDashboard";
import OrganizerDashboard from "./Components/OrganizerDashboard";
import PrivateRoute from "./Components/PrivateRoute";
import ProtectedRoute from "./Components/ProtectedRoute"; // Import the ProtectedRoute
import EventWidget from "./Components/EventWidget";
import "./App.css";

function App() {
  // State to store the user's authentication and verification status
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);

  // Simulate fetching user info from local storage or API on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setRole(role);
    }

    setLoading(false); // Set loading to false when user data is retrieved
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Protect Organizer Dashboard and Nested Routes */}
          <Route
            path="/organizer-dashboard"
            element={
              <ProtectedRoute role={role}>
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizer-dashboard/events"
            element={
              <ProtectedRoute role={role}>
                <EventWidget />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;