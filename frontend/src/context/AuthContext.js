import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'admin' or 'division'

  useEffect(() => {
    // Check for admin token
    const adminToken = localStorage.getItem('token');
    const adminUser = localStorage.getItem('user');

    // Check for division token
    const divisionToken = localStorage.getItem('divisionToken');
    const divisionUser = localStorage.getItem('divisionUser');

    if (adminToken && adminUser) {
      setUser(JSON.parse(adminUser));
      setUserType('admin');
      api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
    } else if (divisionToken && divisionUser) {
      setUser(JSON.parse(divisionUser));
      setUserType('division');
      api.defaults.headers.common['Authorization'] = `Bearer ${divisionToken}`;
    }

    setLoading(false);
  }, []);

  const adminLogin = async (username, password) => {
    try {
      const response = await api.post('/api/admin/auth/login', { username, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('divisionToken'); // Clear division token
      localStorage.removeItem('divisionUser');

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      setUserType('admin');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const divisionLogin = async (username, password) => {
    try {
      const response = await api.post('/api/division/auth/login', { username, password });
      const { token, user } = response.data;

      localStorage.setItem('divisionToken', token);
      localStorage.setItem('divisionUser', JSON.stringify(user));
      localStorage.removeItem('token'); // Clear admin token
      localStorage.removeItem('user');

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      setUserType('division');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('divisionToken');
    localStorage.removeItem('divisionUser');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setUserType(null);
  };

  const isAdmin = () => userType === 'admin';
  const isDivisionLeader = () => userType === 'division';

  return (
    <AuthContext.Provider value={{
      user,
      userType,
      login: adminLogin,
      divisionLogin,
      logout,
      loading,
      isAuthenticated: !!user,
      isAdmin,
      isDivisionLeader
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
