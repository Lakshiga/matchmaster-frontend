import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Css/AdminDashboard.css'; // Ensure this path is correct

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // All users
  const [unverifiedOrganizers, setUnverifiedOrganizers] = useState([]); // Unverified organizers
  const [verifyingOrganizer, setVerifyingOrganizer] = useState(null); // Store verifying organizer ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // Manage active tab
  const navigate = useNavigate();

  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:4000/api/auth/AllUser', config); 
        setUsers(res.data.users || []); // Set all users, default to empty array if undefined
        setUnverifiedOrganizers(res.data.unverifiedOrganizers || []); // Set unverified organizers
      } catch (err) {
        console.error('Error fetching users:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login'); // Redirect to login if unauthorized
        } else {
          setError('Failed to load users. Please try again later.');
        }
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };
    fetchUsers();
  }, [token, navigate]);

  const verifyOrganizer = async (id) => {
    setVerifyingOrganizer(id); // Show "Verifying..." for the specific organizer
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:4000/api/auth/AllUser/${id}/verify`, {}, config);
      setUnverifiedOrganizers((prev) => prev.filter((org) => org._id !== id));
      alert('Organizer verified successfully! Organizer can now access their dashboard.');
    } catch (err) {
      console.error('Error verifying organizer:', err);
      setError('Failed to verify organizer.');
    } finally {
      setVerifyingOrganizer(null); // Reset verifying state
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>; // Loading spinner
  }

  const renderUsersTable = () => (
    <div>
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.verified ? 'Verified' : 'Not Verified'}</td>
                <td>
                  {user.role === 'Organizer' && !user.verified ? (
                    <button
                      onClick={() => verifyOrganizer(user._id)}
                      disabled={verifyingOrganizer === user._id}
                    >
                      {verifyingOrganizer === user._id ? 'Verifying...' : 'Verify Organizer'}
                    </button>
                  ) : (
                    <span>No action available</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderUnverifiedOrganizersTable = () => (
    <div>
      <h2>Unverified Organizers</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {unverifiedOrganizers.length > 0 ? (
            unverifiedOrganizers.map((org) => (
              <tr key={org._id}>
                <td>{org.name}</td>
                <td>{org.email}</td>
                <td>
                  <button
                    onClick={() => verifyOrganizer(org._id)}
                    disabled={verifyingOrganizer === org._id}
                  >
                    {verifyingOrganizer === org._id ? 'Verifying...' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No unverified organizers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-dashboard-container">
      <aside className="sidebar">
        <ul>
          <li
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </li>
          <li
            className={activeTab === 'organizers' ? 'active' : ''}
            onClick={() => setActiveTab('organizers')}
          >
            Organizers
          </li>
          <li
            className={activeTab === 'payment' ? 'active' : ''}
            onClick={() => setActiveTab('payment')}
          >
            Payment
          </li>
          <li
            className={activeTab === 'events' ? 'active' : ''}
            onClick={() => setActiveTab('events')}
          >
            Events
          </li>
          <li
            className={activeTab === 'matches' ? 'active' : ''}
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </li>
        </ul>
      </aside>

      <main className="content">
        <header>
          <h1>Admin Dashboard</h1>
        </header>

        {error && <p className="error-message">{error}</p>}

        {/* Conditionally render based on the active tab */}
        {activeTab === 'users' && renderUsersTable()}
        {activeTab === 'organizers' && renderUnverifiedOrganizersTable()}
        {activeTab === 'payment' && (
          <div>
            <h2>Payment Information</h2>
            <p>Payment information will be displayed here.</p>
          </div>
        )}
        {activeTab === 'events' && (
          <div>
            <h2>Events Management</h2>
            <p>Event-related data will be displayed here.</p>
          </div>
        )}
        {activeTab === 'matches' && (
          <div>
            <h2>Matches Management</h2>
            <p>Match-related data will be displayed here.</p>
          </div>
        )}

        <footer>
          <p>Admin Dashboard © 2024</p>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;

