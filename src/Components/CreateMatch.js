import React, { useState } from 'react';
import axios from 'axios';
import '../Css/CreateMatch.css'; // Adjust the CSS file path

const CreateMatch = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !type.trim() || !player1.trim() || !player2.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    const players = [player1, player2];

    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/match/create-match',
        { name, type, players },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 201 || res.data.msg === 'Match created successfully') {
        // Show success alert and reset form
        alert('Match created successfully');
        setName('');
        setType('');
        setPlayer1('');
        setPlayer2('');
        setError('');
      } else {
        setError('Failed to create match.');
      }
    } catch (error) {
      setError(error.response?.data?.msg || 'Error creating match.');
      console.error('Error creating match:', error.response?.data || error.message);
    }
  };

  return (
    <div className="create-match-container">
      <div className="card">
        <h2 className="card-title">Create Match</h2>
        <form onSubmit={handleSubmit} className="card-form">
          <div className="form-group">
            <label htmlFor="match-name">Match Name</label>
            <input
              id="match-name"
              type="text"
              placeholder="Enter match name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="match-type">Match Type</label>
            <input
              id="match-type"
              type="text"
              placeholder="Enter match type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="player-1">Player 1</label>
            <input
              id="player-1"
              type="text"
              placeholder="Enter Player 1 name"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="player-2">Player 2</label>
            <input
              id="player-2"
              type="text"
              placeholder="Enter Player 2 name"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="card-btn">
            Create Match
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default CreateMatch;
