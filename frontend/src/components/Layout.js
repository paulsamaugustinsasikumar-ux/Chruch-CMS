import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome, FaUsers, FaBuilding, FaUserFriends,
  FaPlus, FaSignOutAlt, FaBars, FaTimes
} from 'react-icons/fa';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/families', icon: FaUsers, label: 'Families' },
    { path: '/divisions', icon: FaBuilding, label: 'Divisions' },
    { path: '/youth', icon: FaUserFriends, label: 'Youth' },
    { path: '/quick-entry', icon: FaPlus, label: 'Quick Entry' }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Church Management</h2>
          <span>Admin Panel</span>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <item.icon />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="d-flex align-items-center">
            <button 
              className="mobile-menu"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h1>Church Management System</h1>
          </div>
          
          <div className="top-bar-actions">
            <span>Welcome, {user?.username}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;