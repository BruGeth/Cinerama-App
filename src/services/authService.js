import * as SecureStore from 'expo-secure-store';

const API_BASE = process.env.API_BASE || 'https://api.example.com';

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

  const res = await fetch(`${API_BASE}${path}`, {
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

export async function register({ name, email, password }) {
  const body = { name, email, password };
  const data = await request('/auth/register', { method: 'POST', body: JSON.stringify(body) });
  if (data && data.token) await saveToken(data.token);
  return data;
}

export async function login({ email, password }) {
  const body = { email, password };
  const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(body) });
  if (data && data.token) await saveToken(data.token);
  return data;
}

export async function verifyCode({ email, code }) {
  const body = { email, code };
  const data = await request('/auth/verify', { method: 'POST', body: JSON.stringify(body) });
  if (data && data.token) await saveToken(data.token);
  return data;
}

export async function me() {
  return await request('/auth/me', { method: 'GET' });
}

export async function logout() {
  try { await request('/auth/logout', { method: 'POST' }); } catch (e) { /* ignore server errors */ }
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
