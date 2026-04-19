import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaUsers, FaUserFriends, FaChild, FaMale, FaFemale } from 'react-icons/fa';

const DivisionDashboard = () => {
  const [stats, setStats] = useState({
    families: 0,
    familyMembers: 0,
    youth: 0,
    youth_male: 0,
    youth_female: 0
  });
  const [families, setFamilies] = useState([]);
  const [youthMale, setYouthMale] = useState([]);
  const [youthFemale, setYouthFemale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('divisionToken');
    const userData = localStorage.getItem('divisionUser');

    if (!token) {
      navigate('/division/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load stats
      const statsResponse = await api.get('/api/division/dashboard');
      setStats(statsResponse.data.data.stats);

      // Load data based on active tab
      if (activeTab === 'families') {
        const familiesResponse = await api.get('/api/admin/families');
        setFamilies(familiesResponse.data.data);
      } else if (activeTab === 'youth-male') {
        const youthResponse = await api.get('/api/admin/youth');
        setYouthMale(youthResponse.data.data.youth_male);
      } else if (activeTab === 'youth-female') {
        const youthResponse = await api.get('/api/admin/youth');
        setYouthFemale(youthResponse.data.data.youth_female);
      }

    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    loadDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem('divisionToken');
    localStorage.removeItem('divisionUser');
    navigate('/division/login');
  };

  if (loading && !user) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="division-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Division Portal</h1>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.leaderName}</span>
              <span className="division-name">{user.divisionName}</span>
            </div>
          )}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => handleTabChange('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'families' ? 'active' : ''}
          onClick={() => handleTabChange('families')}
        >
          Families
        </button>
        <button
          className={activeTab === 'youth-male' ? 'active' : ''}
          onClick={() => handleTabChange('youth-male')}
        >
          Youth Male
        </button>
        <button
          className={activeTab === 'youth-female' ? 'active' : ''}
          onClick={() => handleTabChange('youth-female')}
        >
          Youth Female
        </button>
      </nav>

      <main className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="stat-card">
              <div className="stat-icon families">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{stats.families}</h3>
                <p>Total Families</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon members">
                <FaUserFriends />
              </div>
              <div className="stat-content">
                <h3>{stats.familyMembers}</h3>
                <p>Family Members</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon youth-male">
                <FaMale />
              </div>
              <div className="stat-content">
                <h3>{stats.youth_male}</h3>
                <p>Youth Male</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon youth-female">
                <FaFemale />
              </div>
              <div className="stat-content">
                <h3>{stats.youth_female}</h3>
                <p>Youth Female</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'families' && (
          <div className="data-table">
            <h2>Families in {user?.divisionName}</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Family Name</th>
                    <th>Members</th>
                    <th>Phone</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {families.map((family) => (
                    <tr key={family.id}>
                      <td>{family.family_name}</td>
                      <td>{family.member_count}</td>
                      <td>{family.phone || '-'}</td>
                      <td>{family.address || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'youth-male' && (
          <div className="data-table">
            <h2>Youth Male in {user?.divisionName}</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Phone</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {youthMale.map((youth) => (
                    <tr key={youth.id}>
                      <td>{youth.name}</td>
                      <td>{youth.date_of_birth ? new Date(youth.date_of_birth).toLocaleDateString() : '-'}</td>
                      <td>{youth.phone || '-'}</td>
                      <td>{youth.address || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'youth-female' && (
          <div className="data-table">
            <h2>Youth Female in {user?.divisionName}</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Phone</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {youthFemale.map((youth) => (
                    <tr key={youth.id}>
                      <td>{youth.name}</td>
                      <td>{youth.date_of_birth ? new Date(youth.date_of_birth).toLocaleDateString() : '-'}</td>
                      <td>{youth.phone || '-'}</td>
                      <td>{youth.address || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DivisionDashboard;