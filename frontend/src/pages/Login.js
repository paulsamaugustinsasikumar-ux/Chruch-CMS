import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'division'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, divisionLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const loginFunction = loginType === 'admin' ? login : divisionLogin;
    const result = await loginFunction(formData.username, formData.password);

    if (result.success) {
      // Navigation will be handled by role-based redirect
      navigate('/');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Church Management System</h1>

        {/* Login Type Selector */}
        <div className="login-type-selector">
          <button
            type="button"
            className={`login-type-btn ${loginType === 'admin' ? 'active' : ''}`}
            onClick={() => setLoginType('admin')}
          >
            Admin Login
          </button>
          <button
            type="button"
            className={`login-type-btn ${loginType === 'division' ? 'active' : ''}`}
            onClick={() => setLoginType('division')}
          >
            Division Login
          </button>
        </div>

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
              placeholder={loginType === 'admin' ? 'Enter admin username' : 'Enter division username'}
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
            {loading ? 'Logging in...' : `Login as ${loginType === 'admin' ? 'Admin' : 'Division Leader'}`}
          </button>
        </form>

        {/* Credentials Info */}
        {loginType === 'admin' && (
          <div className="credentials-info">
            <h3>Admin Credentials</h3>
            <p><strong>Username:</strong> HJChosur</p>
            <p><strong>Password:</strong> HJC@007</p>
          </div>
        )}

        {loginType === 'division' && (
          <div className="credentials-info">
            <h3>Division Leader Credentials</h3>
            <div className="division-credentials">
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
        )}
      </div>
    </div>
  );
};

export default Login;