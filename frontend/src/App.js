import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Admin Portal Components
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Families from './pages/Families';
import Divisions from './pages/Divisions';
import Youth from './pages/Youth';
import QuickEntry from './pages/QuickEntry';

// Division Portal Components
import DivisionLogin from './pages/DivisionLogin';
import DivisionDashboard from './pages/DivisionDashboard';

// Layout
import Layout from './components/Layout';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, userType } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'admin') {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

const DivisionProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, userType } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'division') {
    return <Navigate to="/division/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/admin/login" />} />

          {/* Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <Layout />
            </AdminProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="families" element={<Families />} />
            <Route path="divisions" element={<Divisions />} />
            <Route path="youth" element={<Youth />} />
            <Route path="quick-entry" element={<QuickEntry />} />
          </Route>

          {/* Division Portal Routes */}
          <Route path="/division/login" element={<DivisionLogin />} />
          <Route path="/division/dashboard" element={
            <DivisionProtectedRoute>
              <DivisionDashboard />
            </DivisionProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
