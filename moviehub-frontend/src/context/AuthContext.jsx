import React, { createContext, useEffect, useState } from 'react';
import { parseJSON } from '../utils/fetchHelpers';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      setToken(t);
      // optionally decode or fetch user info here
      setUser({});
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseJSON(res);
    if (!res.ok) throw new Error((data && (data.message || data._raw)) || 'Login failed');
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user || {});
    }
    return data;
  }

  async function signup(payload) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await parseJSON(res);
    if (!res.ok) throw new Error((data && (data.message || data._raw)) || 'Signup failed');
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user || {});
    }
    return data;
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, signup, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
