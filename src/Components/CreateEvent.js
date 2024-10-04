import React, { useState } from 'react';
import axios from 'axios';
import '../Css/CreateEvent.css'; // Import the CSS file

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [players, setPlayers] = useState(['']);
  const [umpires, setUmpires] = useState(['']);
  const [error, setError] = useState('');

  const handlePlayerChange = (index, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = value;
    setPlayers(updatedPlayers);
  };

  const handleUmpireChange = (index, value) => {
    const updatedUmpires = [...umpires];
    updatedUmpires[index] = value;
    setUmpires(updatedUmpires);
  };

  const addPlayerField = () => {
    setPlayers([...players, '']);
  };

  const addUmpireField = () => {
    setUmpires([...umpires, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventName.trim() || players.some(player => !player.trim()) || umpires.some(umpire => !umpire.trim())) {
      setError('Please fill out all fields correctly.');
      return;
    }

    const eventData = { name: eventName, players, umpires };

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/event/create-event',
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 201) {
        alert('Event created successfully');
        setEventName('');
        setPlayers(['']);
        setUmpires(['']);
        setError('');
      } else {
        setError('Failed to create event.');
      }
    } catch (error) {
      setError('Error creating event.');
    }
  };

  return (
    <div className="create-event-container">
      <h1>Create Event</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
        <h3>Players</h3>
        {players.map((player, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Player ${index + 1}`}
            value={player}
            onChange={(e) => handlePlayerChange(index, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={addPlayerField}>Add Player</button>
        <h3>Umpires</h3>
        {umpires.map((umpire, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Umpire ${index + 1}`}
            value={umpire}
            onChange={(e) => handleUmpireChange(index, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={addUmpireField}>Add Umpire</button>
        {error && <p className="error">{error}</p>}
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
