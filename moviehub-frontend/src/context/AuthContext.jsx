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
      const stored = localStorage.getItem('moviehub-current-user');
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch { setUser({}); }
      } else {
        setUser({});
      }
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
    if (!res.ok || !data || !data.token) {
      throw new Error(data?.message || 'Invalid email or password');
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('moviehub-current-user', JSON.stringify(data.user || {}));
    setToken(data.token);
    setUser(data.user || {});
    return data;
  }

  async function signup(payload) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await parseJSON(res);
    if (!res.ok || !data || !data.token) {
      throw new Error(data?.message || 'Signup failed');
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('moviehub-current-user', JSON.stringify(data.user || {}));
    setToken(data.token);
    setUser(data.user || {});
    return data;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('moviehub-current-user');
    setToken(null);
    setUser(null);
  }

  async function forgotPassword(email) {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await parseJSON(res);
    if (!res.ok) throw new Error(data?.message || 'Forgot password request failed');
    return data;
  }

  async function resetPassword(token, password) {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await parseJSON(res);
    if (!res.ok) throw new Error(data?.message || 'Reset password failed');
    return data;
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, signup, logout, forgotPassword, resetPassword, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
