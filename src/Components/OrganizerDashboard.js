import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, Route, Routes } from "react-router-dom";
import "../Css/OrganizerDashboard.css";

const OrganizerDashboard = () => {
  const [eventData, setEventData] = useState({
    name: "",
    matchType: "League",
    players: "",
    umpires: "",
  });
  const [matchData, setMatchData] = useState({
    name: "",
    type: "",
    player1: "",
    player2: "",
  });
  const [umpireVerifications, setUmpireVerifications] = useState([]);
  const [playerVerifications, setPlayerVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch data for verification and check token
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch umpire and player verification data
        const umpireRes = await axios.get("/api/organizer/unverified-umpires", config);
        const playerRes = await axios.get("/api/organizer/unverified-players", config);

        setUmpireVerifications(umpireRes.data);
        setPlayerVerifications(playerRes.data);
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

    const allPlayersVerified = players.every((player) =>
      playerVerifications.some((p) => p.name === player && p.verified)
    );
    const allUmpiresVerified = umpires.every((umpire) =>
      umpireVerifications.some((u) => u.name === umpire && u.verified)
    );

    if (!allPlayersVerified || !allUmpiresVerified) {
      setError("All players and umpires must be verified before creating an event.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post("/api/event/create-event", { ...eventData, players, umpires }, config);

      if (res.status === 200) {
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
    const { name, type, player1, player2 } = matchData;

    if (!name || !type || !player1 || !player2) {
      setError("All fields are required for match creation.");
      return;
    }

    const players = [player1, player2];

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post("/api/match/create-match", { name, type, players }, config);

      if (res.status === 200) {
        setSuccess("Match created successfully!");
        setMatchData({ name: "", type: "", player1: "", player2: "" });
      } else {
        setError("Failed to create match.");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Server error");
    }
  };

  // Verify Umpire
  const verifyUmpire = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`/api/organizer/verify-umpire/${id}`, {}, config);
      setUmpireVerifications((prev) => prev.filter((ump) => ump._id !== id));
      alert("Umpire verified successfully");
    } catch (error) {
      setError("Failed to verify umpire.");
    }
  };

  // Verify Player
  const verifyPlayer = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`/api/organizer/verify-player/${id}`, {}, config);
      setPlayerVerifications((prev) => prev.filter((player) => player._id !== id));
      alert("Player verified successfully");
    } catch (error) {
      setError("Failed to verify player.");
    }
  };

  // Loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Organizer Dashboard</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="dashboard-cards">
        <Link to="/organizer-dashboard/create-event">
          <div className="dashboard-card">
            <h2 className="dashboard-title">Manage Events</h2>
            <p>View and create new events.</p>
          </div>
        </Link>

        <Link to="/organizer-dashboard/create-match">
          <div className="dashboard-card">
            <h2 className="dashboard-title">Manage Matches</h2>
            <p>Create and manage matches.</p>
          </div>
        </Link>

        <Link to="/organizer-dashboard/unverified-umpires">
          <div className="dashboard-card">
            <h2 className="dashboard-title">Verify Umpires</h2>
            <p>Verify registered umpires.</p>
          </div>
        </Link>

        <Link to="/organizer-dashboard/unverified-players">
          <div className="dashboard-card">
            <h2 className="dashboard-title">Verify Players</h2>
            <p>Verify registered players.</p>
          </div>
        </Link>
      </div>

      <Routes>
        {/* Manage Events Route */}
        <Route
          path="/manage-events"
          element={
            <div>
              <h1>Manage Events</h1>
              <Link to="/organizer-dashboard/manage-events/create">
                <button>Create Event</button>
              </Link>
              <Link to="/organizer-dashboard/manage-events/view">
                <button>Show All Events</button>
              </Link>
            </div>
          }
        />

        {/* Create Event Route */}
        <Route
          path="/manage-events/create"
          element={
            <div className="create-event-container">
              <h1>Create Event</h1>
              <form onSubmit={onSubmitEvent}>
                <input
                  type="text"
                  placeholder="Event Name"
                  name="name"
                  value={eventData.name}
                  onChange={onChangeEvent}
                  required
                />
                <h3>Players</h3>
                <input
                  type="text"
                  placeholder="Player 1, Player 2, ..."
                  name="players"
                  value={eventData.players}
                  onChange={onChangeEvent}
                  required
                />
                <h3>Umpires</h3>
                <input
                  type="text"
                  placeholder="Umpire 1, Umpire 2, ..."
                  name="umpires"
                  value={eventData.umpires}
                  onChange={onChangeEvent}
                  required
                />
                <button type="submit">Create Event</button>
              </form>
            </div>
          }
        />

        {/* View All Events Route */}
        <Route
          path="/manage-events/view"
          element={
            <div>
              <h1>All Events</h1>
              {/* Implement functionality to fetch and display all events here */}
              <p>Event list will be displayed here...</p>
            </div>
          }
        />

        {/* Manage Matches Route */}
        <Route
          path="/manage-matches"
          element={
            <div>
              <h1>Manage Matches</h1>
              <Link to="/organizer-dashboard/manage-matches/create">
                <button>Create Match</button>
              </Link>
              <Link to="/organizer-dashboard/manage-matches/view">
                <button>Show All Matches</button>
              </Link>
            </div>
          }
        />

        {/* Create Match Route */}
        <Route
          path="/manage-matches/create"
          element={
            <div className="create-match-container">
              <h1>Create Match</h1>
              <form onSubmit={onSubmitMatch}>
                <input
                  type="text"
                  placeholder="Match Name"
                  name="name"
                  value={matchData.name}
                  onChange={onChangeMatch}
                  required
                />
                <h3>Match Type</h3>
                <input
                  type="text"
                  placeholder="Type (e.g., League, Knockout)"
                  name="type"
                  value={matchData.type}
                  onChange={onChangeMatch}
                  required
                />
                <h3>Players</h3>
                <input
                  type="text"
                  placeholder="Player 1"
                  name="player1"
                  value={matchData.player1}
                  onChange={onChangeMatch}
                  required
                />
                <input
                  type="text"
                  placeholder="Player 2"
                  name="player2"
                  value={matchData.player2}
                  onChange={onChangeMatch}
                  required
                />
                <button type="submit">Create Match</button>
              </form>
            </div>
          }
        />

        {/* View All Matches Route */}
        <Route
          path="/manage-matches/view"
          element={
            <div>
              <h1>All Matches</h1>
              {/* Implement functionality to fetch and display all matches here */}
              <p>Match list will be displayed here...</p>
            </div>
          }
        />
        
        {/* Unverified Umpires Route */}
        <Route
          path="/unverified-umpires"
          element={
            <div>
              <h1>Unverified Umpires</h1>
              {umpireVerifications.map((umpire) => (
                <div key={umpire._id}>
                  <span>{umpire.name}</span>
                  <button onClick={() => verifyUmpire(umpire._id)}>Verify</button>
                </div>
              ))}
            </div>
          }
        />

        {/* Unverified Players Route */}
        <Route
          path="/unverified-players"
          element={
            <div>
              <h1>Unverified Players</h1>
              {playerVerifications.map((player) => (
                <div key={player._id}>
                  <span>{player.name}</span>
                  <button onClick={() => verifyPlayer(player._id)}>Verify</button>
                </div>
              ))}
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default OrganizerDashboard;
