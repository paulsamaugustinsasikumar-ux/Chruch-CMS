import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaUsers, FaUserFriends, FaBuilding, FaChild } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    families: 0,
    familyMembers: 0,
    divisions: 0,
    youth: 0,
    youth_male: 0,
    youth_female: 0
  });
  const [recentFamilies, setRecentFamilies] = useState([]);
  const [recentYouth, setRecentYouth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      const dashboardData = response.data.data;
      setStats(dashboardData.stats);
      setRecentFamilies(dashboardData.recentFamilies);
      setRecentYouth(dashboardData.recentYouth);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p className="dashboard-subtitle">Complete Church Management Overview</p>

      <div className="dashboard-grid">
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
          <div className="stat-icon divisions">
            <FaBuilding />
          </div>
          <div className="stat-content">
            <h3>{stats.divisions}</h3>
            <p>Divisions</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon youth">
            <FaChild />
          </div>
          <div className="stat-content">
            <h3>{stats.youth}</h3>
            <p>Total Youth</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon youth-male">
            <FaChild />
          </div>
          <div className="stat-content">
            <h3>{stats.youth_male}</h3>
            <p>Youth Male</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon youth-female">
            <FaChild />
          </div>
          <div className="stat-content">
            <h3>{stats.youth_female}</h3>
            <p>Youth Female</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tables">
        <div className="table-section">
          <h2>Recent Families</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Family Name</th>
                  <th>Division</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {recentFamilies.map((family) => (
                  <tr key={family.id}>
                    <td>{family.family_name}</td>
                    <td>{family.division_name}</td>
                    <td>{new Date(family.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-section">
          <h2>Recent Youth</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Division</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {recentYouth.map((youth) => (
                  <tr key={youth.id}>
                    <td>{youth.name}</td>
                    <td>{youth.division_name}</td>
                    <td>{new Date(youth.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;