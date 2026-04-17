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
              <span className="division-name">{user.divisionName}</span>
            </div>
          )}
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Families</h3>
          <div className="stat-number">{stats.families}</div>
        </div>
        <div className="stat-card">
          <h3>Family Members</h3>
          <div className="stat-number">{stats.familyMembers}</div>
        </div>
        <div className="stat-card">
          <h3>Youth Members</h3>
          <div className="stat-number">{stats.youthMembers}</div>
        </div>
        <div className="stat-card">
          <h3>Youth Male</h3>
          <div className="stat-number">{stats.youthMale}</div>
        </div>
        <div className="stat-card">
          <h3>Youth Female</h3>
          <div className="stat-number">{stats.youthFemale}</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'families' ? 'active' : ''}`}
          onClick={() => handleTabChange('families')}
        >
          Families ({stats.families})
        </button>
        <button
          className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => handleTabChange('members')}
        >
          Members ({stats.familyMembers})
        </button>
        <button
          className={`tab-button ${activeTab === 'youth-male' ? 'active' : ''}`}
          onClick={() => handleTabChange('youth-male')}
        >
          Youth Male ({stats.youthMale})
        </button>
        <button
          className={`tab-button ${activeTab === 'youth-female' ? 'active' : ''}`}
          onClick={() => handleTabChange('youth-female')}
        >
          Youth Female ({stats.youthFemale})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <h2>Division Overview</h2>
            <p>Welcome to your division dashboard. Here you can view all families, members, and youth in your division.</p>
            <div className="quick-actions">
              <button className="btn btn-primary" onClick={() => handleTabChange('families')}>
                View Families
              </button>
              <button className="btn btn-primary" onClick={() => handleTabChange('members')}>
                View Members
              </button>
              <button className="btn btn-primary" onClick={() => handleTabChange('youth-male')}>
                View Youth Male
              </button>
              <button className="btn btn-primary" onClick={() => handleTabChange('youth-female')}>
                View Youth Female
              </button>
            </div>
          </div>
        )}

        {activeTab === 'families' && (
          <div className="data-table">
            <h2>Families in {user?.divisionName}</h2>
            {families.length === 0 ? (
              <p>No families found in this division.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Family Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Members</th>
                  </tr>
                </thead>
                <tbody>
                  {families.map(family => (
                    <tr key={family.id}>
                      <td>{family.family_name}</td>
                      <td>{family.address || '-'}</td>
                      <td>{family.phone || '-'}</td>
                      <td>{family.member_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="data-table">
            <h2>Family Members in {user?.divisionName}</h2>
            {members.length === 0 ? (
              <p>No family members found in this division.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Relationship</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Family</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.relationship || '-'}</td>
                      <td>{member.gender || '-'}</td>
                      <td>{member.phone || '-'}</td>
                      <td>{member.family_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'youth-male' && (
          <div className="data-table">
            <h2>Youth Male in {user?.divisionName}</h2>
            {youthMale.length === 0 ? (
              <p>No youth male members found in this division.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Phone</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {youthMale.map(member => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.date_of_birth || '-'}</td>
                      <td>{member.phone || '-'}</td>
                      <td>{member.email || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'youth-female' && (
          <div className="data-table">
            <h2>Youth Female in {user?.divisionName}</h2>
            {youthFemale.length === 0 ? (
              <p>No youth female members found in this division.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Phone</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {youthFemale.map(member => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.date_of_birth || '-'}</td>
                      <td>{member.phone || '-'}</td>
                      <td>{member.email || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DivisionDashboard;