import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, DialogContentText, IconButton, Card, CardContent, useTheme
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyMsgId, setReplyMsgId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMsgId, setDeleteMsgId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get('/api/contact', {
          headers,
          withCredentials: true
        });
        setMessages(res.data.data);
      } catch (err) {
        setError('Failed to load contact messages.');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleOpenReply = (msg) => {
    setReplyMsgId(msg._id);
    setReplyText(msg.reply || '');
    setReplyOpen(true);
  };
  const handleCloseReply = () => {
    setReplyOpen(false);
    setReplyMsgId(null);
    setReplyText('');
  };
  const handleSendReply = async () => {
    setReplyLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`/api/contact/${replyMsgId}/reply`, { reply: replyText }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setSuccessMsg('Reply sent successfully!');
      setReplyOpen(false);
      setLoading(true);
      const res = await axios.get('/api/contact', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setMessages(res.data.data);
    } catch (err) {
      setError('Failed to send reply.');
    } finally {
      setReplyLoading(false);
      setLoading(false);
    }
  };
  const handleOpenDelete = (msg) => {
    setDeleteMsgId(msg._id);
    setDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setDeleteMsgId(null);
  };
  const handleDelete = async () => {
    setDeleteLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/contact/${deleteMsgId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setSuccessMsg('Message deleted successfully!');
      setDeleteOpen(false);
      setLoading(true);
      const res = await axios.get('/api/contact', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setMessages(res.data.data);
    } catch (err) {
      setError('Failed to delete message.');
    } finally {
      setDeleteLoading(false);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 3 } }}>
      <Card sx={{ borderRadius: 4, boxShadow: 4, mb: 4 }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'black', mb: 1 }}>
            Contact Messages
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            Manage and respond to user contact messages. You can reply or delete messages directly from this dashboard.
          </Typography>
          {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {!loading && !error && (
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(90deg, #16977D 0%, #43cea2 100%)' }}>
                    <TableCell sx={{ color: 'black', fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 700 }}>Subject</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 700 }}>Message</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 700 }}>Reply</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 700, textAlign: 'center' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {messages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6, color: theme.palette.text.disabled, fontSize: 18 }}>
                        No contact messages found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    messages.map((msg) => (
                      <TableRow key={msg._id} hover sx={{ transition: 'all 0.2s', '&:hover': { background: 'rgba(22,151,125,0.07)' } }}>
                        <TableCell>{msg.name}</TableCell>
                        <TableCell>{msg.email}</TableCell>
                        <TableCell>{msg.subject}</TableCell>
                        <TableCell sx={{ maxWidth: 220, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{msg.message}</TableCell>
                        <TableCell>{new Date(msg.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          {msg.reply ? (
                            <Box>
                              <Typography sx={{ fontWeight: 500, color: theme.palette.success.main }}>{msg.reply}</Typography>
                              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                {msg.repliedAt ? new Date(msg.repliedAt).toLocaleString() : ''}
                              </Typography>
                            </Box>
                          ) : <i style={{ color: theme.palette.text.disabled }}>No reply</i>}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={msg.reply ? 'Edit Reply' : 'Reply'}>
                            <span>
                              <IconButton color="primary" size="small" onClick={() => handleOpenReply(msg)}>
                                {msg.reply ? <EditIcon /> : <ReplyIcon />}
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <span>
                              <IconButton color="error" size="small" sx={{ ml: 1 }} onClick={() => handleOpenDelete(msg)}>
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      <Dialog open={replyOpen} onClose={handleCloseReply} maxWidth="xs" fullWidth>
        <DialogTitle>Reply to Message</DialogTitle>
        <DialogContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Reply"
            type="text"
            size="small"
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            sx={{ mb: 2, maxWidth: 340 }}
            inputProps={{ style: { textAlign: 'left' } }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleCloseReply}>Cancel</Button>
          <Button onClick={handleSendReply} disabled={replyLoading || !replyText.trim()} variant="contained">Send</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteOpen} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this message? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleteLoading}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSuccessMsg('')} severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactMessages; 