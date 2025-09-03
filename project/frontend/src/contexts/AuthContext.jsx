import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // FIX: Ensure Axios points directly to backend URL and handles JSON + errors
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const token = data?.data?.token || 'dev-token';
      const userData = data?.data?.user || { email };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Login failed';
      throw new Error(msg);
    }
  };

  const register = async (email, password, name) => {
    const { data } = await api.post('/auth/register', { email, password, name });
    const { token, user: userData } = data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = { user, login, register, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}