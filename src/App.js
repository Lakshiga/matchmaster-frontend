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
import CreateMatch from "./Components/CreateMatch";
import CreateEvent from "./Components/CreateEvent";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-match" element={<CreateMatch />} />
          <Route path="/create-event" element={<CreateEvent />} />

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
              <PrivateRoute allowedRoles={["Organizer"]}>
                <OrganizerDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/organizer-dashboard/events"
            element={
              <PrivateRoute allowedRoles={["Organizer"]}>
                <EventWidget />
                </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;