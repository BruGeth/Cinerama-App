import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Resolve API base from Expo config extras (app.json/app.config.js) or process.env
const API_BASE =
  (Constants?.manifest?.extra && Constants.manifest.extra.API_BASE) ||
  (Constants?.expoConfig?.extra && Constants.expoConfig.extra.API_BASE) ||
  process.env.API_BASE ||
  'https://api.example.com';

async function saveToken(token) {
  if (!token) return;
  await SecureStore.setItemAsync('userToken', token);
}

async function getToken() {
  return await SecureStore.getItemAsync('userToken');
}

async function deleteToken() {
  await SecureStore.deleteItemAsync('userToken');
}

async function request(path, options = {}) {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const fullUrl = `${API_BASE}${path}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers,
  });

  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch(e) { json = text; }

  if (!res.ok) {
    const err = new Error(json && json.message ? json.message : 'Request failed');
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json;
}

export async function register({ fullName, email, password, confirmPassword }) {
  const body = { fullName, email, password, confirmPassword };
  const data = await request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) });
  if (data && data.token) await saveToken(data.token);
  return data;
}

export async function login({ email, password }) {
  const body = { email, password };
  const data = await request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
  if (data && data.token) await saveToken(data.token);
  return data;
}

export async function verifyCode({ email, code }) {
  const body = { email, code };
  const data = await request('/api/auth/verify', { method: 'POST', body: JSON.stringify(body) });
  if (data && data.token) await saveToken(data.token);
  return data;
}

export async function me() {
  return await request('/api/auth/me', { method: 'GET' });
}

export async function logout() {
  try { await request('/api/auth/logout', { method: 'POST' }); } catch (e) { /* ignore server errors */ }
  await deleteToken();
}

export async function getStoredToken() {
  return await getToken();
}

const authService = {
  register,
  login,
  verifyCode,
  me,
  logout,
  getStoredToken,
};

export default authService;
