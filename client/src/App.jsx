import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [vpcs, setVpcs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cidrBlock: '',
    region: '',
    description: ''
  });

  // Fetch all VPCs
  const fetchVPCs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/vpcs`);
      setVpcs(response.data);
    } catch (error) {
      console.error('Error fetching VPCs:', error);
      alert('Error fetching VPCs: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Load VPCs on component mount
  useEffect(() => {
    fetchVPCs();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_URL}/vpcs`, formData);
      setFormData({ name: '', cidrBlock: '', region: '', description: '' });
      fetchVPCs(); // Refresh the list
      alert('VPC created successfully!');
    } catch (error) {
      console.error('Error creating VPC:', error);
      alert('Error creating VPC: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle VPC deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this VPC?')) {
      return;
    }
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/vpcs/${id}`);
      fetchVPCs(); // Refresh the list
      alert('VPC deleted successfully!');
    } catch (error) {
      console.error('Error deleting VPC:', error);
      alert('Error deleting VPC: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🌐 AWS VPC Management</h1>
          <p>Manage your Virtual Private Clouds</p>
        </header>

        <div className="content">
          {/* Create VPC Form */}
          <section className="form-section">
            <h2>Create New VPC</h2>
            <form onSubmit={handleSubmit} className="vpc-form">
              <div className="form-group">
                <label htmlFor="name">VPC Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., production-vpc"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cidrBlock">CIDR Block *</label>
                <input
                  type="text"
                  id="cidrBlock"
                  name="cidrBlock"
                  value={formData.cidrBlock}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 10.0.0.0/16"
                />
              </div>

              <div className="form-group">
                <label htmlFor="region">Region *</label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  placeholder="e.g., us-east-1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional description"
                  rows="3"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create VPC'}
              </button>
            </form>
          </section>

          {/* VPCs List */}
          <section className="list-section">
            <div className="section-header">
              <h2>Your VPCs</h2>
              <button onClick={fetchVPCs} className="btn btn-secondary" disabled={loading}>
                {loading ? 'Loading...' : '🔄 Refresh'}
              </button>
            </div>

            {loading && vpcs.length === 0 ? (
              <div className="loading">Loading VPCs...</div>
            ) : vpcs.length === 0 ? (
              <div className="empty-state">
                <p>No VPCs found. Create your first VPC above!</p>
              </div>
            ) : (
              <div className="vpc-list">
                {vpcs.map((vpc) => (
                  <div key={vpc._id} className="vpc-card">
                    <div className="vpc-header">
                      <h3>{vpc.name}</h3>
                      <span className={`status status-${vpc.status}`}>
                        {vpc.status}
                      </span>
                    </div>
                    <div className="vpc-details">
                      <p><strong>CIDR Block:</strong> {vpc.cidrBlock}</p>
                      <p><strong>Region:</strong> {vpc.region}</p>
                      {vpc.description && (
                        <p><strong>Description:</strong> {vpc.description}</p>
                      )}
                      <p className="timestamp">
                        Created: {new Date(vpc.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(vpc._id)}
                      className="btn btn-danger"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;

