import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaUsers, FaUserFriends, FaBuilding, FaChild } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFamilies: 0,
    totalMembers: 0,
    totalDivisions: 0,
    totalYouth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/dashboard');
      const dashboardData = response.data.data;
      setStats({
        totalFamilies: dashboardData.stats.families,
        totalMembers: dashboardData.stats.familyMembers,
        totalDivisions: dashboardData.stats.divisions,
        totalYouth: dashboardData.stats.youth
      });
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
      <h1>Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon families">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>{stats.totalFamilies}</h3>
            <p>Total Families</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon members">
            <FaUserFriends />
          </div>
          <div className="stat-info">
            <h3>{stats.totalMembers}</h3>
            <p>Total Members</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon divisions">
            <FaBuilding />
          </div>
          <div className="stat-info">
            <h3>{stats.totalDivisions}</h3>
            <p>Total Divisions</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon youth">
            <FaChild />
          </div>
          <div className="stat-info">
            <h3>{stats.totalYouth}</h3>
            <p>Total Youth</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="card-body">
          <p>Welcome to the Church Management System. Use the navigation menu to manage families, divisions, youth members, and generate reports.</p>
          
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
              <FaUsers style={{ fontSize: '2rem', color: '#667eea', marginBottom: '10px' }} />
              <h4>Add Family</h4>
              <p>Register new families with complete details</p>
            </div>
            
            <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
              <FaBuilding style={{ fontSize: '2rem', color: '#4facfe', marginBottom: '10px' }} />
              <h4>Manage Divisions</h4>
              <p>Organize families by divisions</p>
            </div>
            
            <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
              <FaChild style={{ fontSize: '2rem', color: '#43e97b', marginBottom: '10px' }} />
              <h4>Youth Members</h4>
              <p>Track youth and bachelors</p>
            </div>
            
            <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
              <FaUserFriends style={{ fontSize: '2rem', color: '#f093fb', marginBottom: '10px' }} />
              <h4>Generate Reports</h4>
              <p>Export data in PDF, Excel, Word formats</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;