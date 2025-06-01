import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Button, Modal, Box, TextField, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllSubjects, createSubject, deleteSubject } from '../apis/subjectApi';

const SUBJECTS_KEY = 'practice_subjects';

const defaultSubjects = [
  { value: 'database', label: 'Database', count: 12 },
  { value: 'political-economy', label: 'Marxist-Leninist Political Economy', count: 8 },
  { value: 'computer-networks', label: 'Computer Networks', count: 5 },
  { value: 'web-security', label: 'Web and Database Security', count: 7 },
  { value: 'party-history', label: 'Party History', count: 3 },
  { value: 'general-law', label: 'General Law', count: 10 },
];

const iconList = [
  'BookIcon',
  'StorageIcon',
  'NetworkCheckIcon',
  'SecurityIcon',
  'HistoryEduIcon',
  'GavelIcon'
];

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await getAllSubjects();
      if (res.success) setSubjects(res.data);
      else setSubjects([]);
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
  }, [subjects]);

  const handleAdd = async () => {
    if (!newSubject.trim() || subjects.some(s => s.label.toLowerCase() === newSubject.trim().toLowerCase())) return;
    const value = newSubject.trim().toLowerCase().replace(/\s+/g, '-');
    const randomIcon = iconList[Math.floor(Math.random() * iconList.length)];
    const res = await createSubject({ label: newSubject.trim(), value, icon: randomIcon });
    if (res.success) {
      setSubjects([...subjects, res.data]);
      setNewSubject('');
      setModalOpen(false);
    }
  };

  const handleDelete = async (value) => {
    const res = await deleteSubject(value);
    if (res.success) setSubjects(subjects.filter(s => s.value !== value));
  };

  // Fake count for demo (replace with real API count if available)
  const getCount = (subject) => subject.count || 0;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      <CardHeader sx={{ pb: 0 }}>
        <CardTitle sx={{ fontWeight: 700, fontSize: 24, color: '#16977D' }}>Subject Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{
              minWidth: 160,
              borderRadius: 2,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #16977D 0%, #1aad90 100%)',
              boxShadow: '0 2px 8px rgba(22,151,125,0.08)',
              '&:hover': { background: 'linear-gradient(90deg, #12725f 0%, #16977D 100%)' }
            }}
          >
            Add New Subject
          </Button>
        </Box>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#e6f4f1' }}>
                <th style={{ textAlign: 'left', padding: 16, fontWeight: 700, fontSize: 16, color: '#16977D' }}>Subject</th>
                <th style={{ textAlign: 'center', padding: 16, fontWeight: 700, fontSize: 16, color: '#16977D' }}>Count</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr
                  key={s.value}
                  style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseOut={e => (e.currentTarget.style.background = '#fff')}
                >
                  <td style={{ padding: 16, fontWeight: 500 }}>{s.label}</td>
                  <td style={{ textAlign: 'center', padding: 16, fontWeight: 600, color: '#2563eb' }}>{getCount(s)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(s.value)} sx={{ color: '#D32F2F' }}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            minWidth: 340,
            maxWidth: '90vw',
            width: 400
          }}>
            <Typography variant="h6" mb={2} sx={{ fontWeight: 700, color: '#16977D' }}>Add New Subject</Typography>
            <TextField
              fullWidth
              label="Subject Name"
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              autoFocus
              sx={{ mb: 3 }}
            />
            <Box mt={1} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setModalOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
              <Button onClick={handleAdd} variant="contained" sx={{ borderRadius: 2, fontWeight: 600, background: 'linear-gradient(90deg, #16977D 0%, #1aad90 100%)' }}>Add</Button>
            </Box>
          </Box>
        </Modal>
      </CardContent>
    </Card>
  );
} 