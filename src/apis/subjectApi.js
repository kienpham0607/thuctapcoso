const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/subjects';

export async function getAllSubjects() {
  const res = await fetch(`${API_BASE}`);
  return res.json();
}

export async function createSubject(data) {
  const res = await fetch(`${API_BASE}` , {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteSubject(value) {
  const res = await fetch(`${API_BASE}/${value}`, {
    method: 'DELETE',
  });
  return res.json();
} 