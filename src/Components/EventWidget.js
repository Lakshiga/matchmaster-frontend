import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/EventWidget.css";

const EventWidget = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);  // Define the error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const events = await axios.get(
          "http://localhost:4000/api/event/events",
          config
        );
        setEvents(events.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");  // Set the error state
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, navigate]);

  return (
    <div className="dashboard-card">
      <h2 className="dashboard-title">Event Widget</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      {!loading && events.length > 0 && (
        <ul>
          {events.map((event) => (
            <li key={event.id}>{event.name}</li>
          ))}
        </ul>
      )}
      {!loading && events.length === 0 && <p>No events found.</p>}
    </div>
  );
};

export default EventWidget;
