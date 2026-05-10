import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../services/api';
import { getToken, getUser, removeAuthData, saveAuthData } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.setAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (token && user) {
      saveAuthData(token, user);
    } else {
      removeAuthData();
    }
  }, [token, user]);

  const getErrorMessage = (err, fallback) => {
    if (err?.response?.data?.message) {
      return err.response.data.message;
    }
    if (err?.message) {
      return err.message;
    }
    return fallback;
  };

  const login = async (payload) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.loginUser(payload);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to sign in');
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.registerUser(payload);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to register');
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError('');
    api.setAuthToken(null);
  };

  const clearError = () => setError('');

  const isAuthenticated = useMemo(() => Boolean(token && user), [token, user]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, error, clearError, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
