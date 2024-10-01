import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import "../Css/OrganizerDashboard.css"; // Adjust this path based on your file structure

const OrganizerDashboard = () => {
  const [eventData, setEventData] = useState({
    name: "",
    matchType: "League",
    players: "",
    umpires: "",
  });
  const [matchData, setMatchData] = useState({
    eventName: "",
    player1: "",
    player2: "",
    umpire: "",
  });
  const [umpireVerifications, setUmpireVerifications] = useState([]);
  const [playerVerifications, setPlayerVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // Event form change handler
  const onChangeEvent = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Match form change handler
  const onChangeMatch = (e) => {
    setMatchData({ ...matchData, [e.target.name]: e.target.value });
  };

  // Handle Event Submission
  const onSubmitEvent = async (e) => {
    e.preventDefault();
    const players = eventData.players.split(",").map((p) => p.trim());
    const umpires = eventData.umpires.split(",").map((u) => u.trim());

    // Ensure all players and umpires are verified
    const allPlayersVerified = players.every((player) =>
      playerVerifications.some((p) => p.name === player && p.verified)
    );
    const allUmpiresVerified = umpires.every((umpire) =>
      umpireVerifications.some((u) => u.name === umpire && u.verified)
    );

    if (!allPlayersVerified || !allUmpiresVerified) {
      setError(
        "All players and umpires must be verified before creating an event."
      );
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        "http://localhost:4000/api/events/create-event",
        { ...eventData, players, umpires },
        config
      );

      if (res.status === 201) {
        setSuccess("Event created successfully!");
        setEventData({
          name: "",
          matchType: "League",
          players: "",
          umpires: "",
        });
      } else {
        setError("Failed to create event.");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Server error");
    }
  };

  // Handle Match Submission
  const onSubmitMatch = async (e) => {
    e.preventDefault();
    const { eventName, player1, player2, umpire } = matchData;

    if (!eventName || !player1 || !player2 || !umpire) {
      setError("All fields are required for match creation.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        "http://localhost:4000/api/matches/create-match",
        { eventName, player1, player2, umpire },
        config
      );

      if (res.status === 201) {
        setSuccess("Match created successfully!");
        setMatchData({ eventName: "", player1: "", player2: "", umpire: "" });
      } else {
        setError("Failed to create match.");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Server error");
    }
  };

  // Verify Umpire Handler
  const verifyUmpire = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        `http://localhost:4000/api/users/verify-umpire/${id}`,
        {},
        config
      );
      setUmpireVerifications((prev) => prev.filter((ump) => ump._id !== id));
      alert("Umpire verified successfully");
    } catch (error) {
      console.error("Error verifying umpire:", error);
      setError("Failed to verify umpire.");
    }
  };

  // Verify Player Handler
  const verifyPlayer = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        `http://localhost:4000/api/users/verify-player/${id}`,
        {},
        config
      );
      setPlayerVerifications((prev) =>
        prev.filter((player) => player._id !== id)
      );
      alert("Player verified successfully");
    } catch (error) {
      console.error("Error verifying player:", error);
      setError("Failed to verify player.");
    }
  };

  // Display loading message if data is still being fetched
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
   <Link to="/organizer-dashboard/events">
      <div className="dashboard-card">
        <h2 className="dashboard-title">Events</h2>
        
      </div>
    </Link>
   
    </>
  );
};

export default OrganizerDashboard;