const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/subjects';

export async function getAllSubjects() {
  const token = localStorage.getItem('accessToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}`, { headers });
  return res.json();
}

export async function createSubject(data) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const res = await fetch(`${API_BASE}` , {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteSubject(value) {
  const token = localStorage.getItem('accessToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/${value}`, {
    method: 'DELETE',
    headers,
  });
  return res.json();
} 