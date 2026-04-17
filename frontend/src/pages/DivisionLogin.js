import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const DivisionLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/division/auth/login', formData);

      if (response.data.token) {
        // Store division leader token separately
        localStorage.setItem('divisionToken', response.data.token);
        localStorage.setItem('divisionUser', JSON.stringify(response.data.user));
        navigate('/division/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Division Leader Login</h1>
        <p className="login-subtitle">Access your division dashboard</p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-links">
          <button
            className="btn btn-link"
            onClick={() => navigate('/login')}
          >
            ← Back to Admin Login
          </button>
        </div>

        <div className="division-leaders-info">
          <h3>Division Leader Credentials</h3>
          <div className="credentials-list">
            <div className="credential-item">
              <strong>Pr. Asher:</strong> asher / 123456
            </div>
            <div className="credential-item">
              <strong>Pr. Jeba Kumar:</strong> jebakumar / 123456
            </div>
            <div className="credential-item">
              <strong>Pr. Kiruba Karan:</strong> kirubakaran / 123456
            </div>
            <div className="credential-item">
              <strong>Pr. Micah:</strong> micah / 123456
            </div>
            <div className="credential-item">
              <strong>Pr. Jebastin:</strong> jebastin / 123456
            </div>
            <div className="credential-item">
              <strong>Pr. Levi:</strong> levi / 123456
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivisionLogin;