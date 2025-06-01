import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/practice-tests';

export async function getAllPracticeTests(params = {}) {
  let url = `${API_BASE}`;
  const query = [];
  if (params.subject) query.push(`subject=${encodeURIComponent(params.subject)}`);
  if (params.status) query.push(`status=${encodeURIComponent(params.status)}`);
  if (query.length > 0) url += `?${query.join('&')}`;
  const token = localStorage.getItem('accessToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(url, { headers });
  return res.json();
}

export async function getPracticeTestById(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  return res.json();
}

export async function createPracticeTest(data) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updatePracticeTest(id, data) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deletePracticeTest(id) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function submitPracticeTestResult(data) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API_BASE}/submit-result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/dashboard-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, message: error.message };
  }
};

export async function getPracticeTestAnalytics(testId) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API_BASE}/${testId}/analytics`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.json();
} 