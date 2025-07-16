import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

const StudentResults = ({ results = [], passingScore = 70 }) => {
  const [sortBy, setSortBy] = useState('score');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filteredResults = (Array.isArray(results) ? results : []).filter((student) => {
    if (filterStatus === 'all') return true;
    return student.status === filterStatus;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'time':
        return a.timeSpent - b.timeSpent;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!Array.isArray(results) || results.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No student results available
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="student-results">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Results</MenuItem>
              <MenuItem value="passed">Passed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="score">Score</MenuItem>
              <MenuItem value="time">Time Spent</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{ borderRadius: 2 }}
        >
          Export Results
        </Button>
      </Box>

      <Card className="results-table">
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                <TableCell />
                <TableCell>Student</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Time Spent</TableCell>
                <TableCell>Correct/Incorrect</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Completed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedResults.map((student) => (
                <React.Fragment key={student.id}>
                  <TableRow className="student-row">
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => setExpanded(expanded === student.id ? null : student.id)}
                        aria-label="expand row"
                      >
                        <ExpandMoreIcon style={{ transform: expanded === student.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={student.avatar}
                          alt={student.name}
                          sx={{ width: 40, height: 40, background: 'linear-gradient(45deg, #4158D0, #C850C0)' }}
                        >
                          {student.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {student.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {student.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: '100%', maxWidth: 200 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {student.score}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={student.score}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(0, 0, 0, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: student.score >= passingScore
                                ? 'linear-gradient(45deg, #4CAF50, #8BC34A)'
                                : 'linear-gradient(45deg, #FF9800, #F44336)',
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimerIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {student.timeSpent}m
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 500 }}>
                          {student.correctAnswers}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">/</Typography>
                        <Typography variant="body2" sx={{ color: '#F44336', fontWeight: 500 }}>
                          {student.incorrectAnswers}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={student.score >= passingScore ? <CheckCircleIcon /> : <CancelIcon />}
                        label={student.score >= passingScore ? 'Passed' : 'Failed'}
                        size="small"
                        color={student.score >= passingScore ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(student.completedAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={expanded === student.id} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Lịch sử các lần làm bài:
                          </Typography>
                          {student.history && student.history.length > 0 ? (
                            <Table size="small" sx={{ mb: 2 }}>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Lần</TableCell>
                                  <TableCell>Score</TableCell>
                                  <TableCell>Time Spent</TableCell>
                                  <TableCell>Submitted At</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {student.history.map((h, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{h.score}%</TableCell>
                                    <TableCell>{h.timeSpent}m</TableCell>
                                    <TableCell>{formatDate(h.submittedAt)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography color="text.secondary">Chưa có lịch sử làm bài.</Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentResults;