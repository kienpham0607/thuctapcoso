const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/practice-tests';

export async function getAllPracticeTests() {
  const res = await fetch(`${API_BASE}`);
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