import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ww_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('ww_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('ww_token', token); else localStorage.removeItem('ww_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('ww_user', JSON.stringify(user)); else localStorage.removeItem('ww_user');
  }, [user]);

  const isAuthed = Boolean(token && user);
  const role = user?.role || null;

  const login = (jwt, userObj) => {
    try {
      const decoded = jwtDecode(jwt);
      if (!decoded?.exp || decoded.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }
      setToken(jwt);
      setUser(userObj);
    } catch (e) {
      console.error('Invalid token', e);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, role, isAuthed, login, logout, setUser }), [token, user, role, isAuthed]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
