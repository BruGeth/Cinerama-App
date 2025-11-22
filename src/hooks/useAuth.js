import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import authService from '../services/authService';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const me = await authService.me();
      setUser(me.user || me);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function login({ email, password }) {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      await loadUser();
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const data = await authService.register(payload);
      await loadUser();
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function verify({ email, code }) {
    setLoading(true);
    try {
      const data = await authService.verifyCode({ email, code });
      await loadUser();
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return { user, loading, login, register, verify, logout, refresh: loadUser };
}
