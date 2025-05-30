import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';

const QuestionAnalysis = ({ questions = [] }) => {
  const [sortBy, setSortBy] = useState('difficulty');

  const sortedQuestions = [...(Array.isArray(questions) ? questions : [])].sort((a, b) => {
    switch (sortBy) {
      case 'difficulty':
        const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      case 'correctRate':
        return a.correctRate - b.correctRate;
      case 'timeSpent':
        return b.avgTimeSpent - a.avgTimeSpent;
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { bg: '#e6f4ea', text: '#1e7f4e' };
      case 'medium':
        return { bg: '#fef3e3', text: '#cc6e00' };
      case 'hard':
        return { bg: '#fce8e8', text: '#d93025' };
      default:
        return { bg: '#f1f3f4', text: '#5f6368' };
    }
  };

  const getPerformanceIcon = (correctRate) => {
    if (correctRate >= 80) {
      return <CheckCircleIcon sx={{ color: '#1e7f4e' }} />;
    }
    if (correctRate >= 60) {
      return <WarningIcon sx={{ color: '#cc6e00' }} />;
    }
    return <CancelIcon sx={{ color: '#d93025' }} />;
  };

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No questions data available for analysis
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="questions-analysis">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Question Performance Analysis
        </Typography>
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="difficulty">Difficulty</MenuItem>
            <MenuItem value="correctRate">Correct Rate</MenuItem>
            <MenuItem value="timeSpent">Time Spent</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sortedQuestions.map((question, index) => (
          <Card key={question.id || index} className="question-card">
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Question {index + 1}
                    </Typography>
                    <Chip
                      label={question.difficulty}
                      size="small"
                      sx={{
                        backgroundColor: getDifficultyColor(question.difficulty).bg,
                        color: getDifficultyColor(question.difficulty).text,
                      }}
                    />
                    <Chip
                      label={question.type}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  {getPerformanceIcon(question.correctRate)}
                </Box>
                <Typography color="text.secondary" variant="body2">
                  {question.question}
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Correct Rate
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={question.correctRate}
                        className="progress-bar"
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(45deg, #4158D0, #C850C0)',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {question.correctRate}%
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Time Spent
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimerIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {question.avgTimeSpent}s
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Correct Answers
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#1e7f4e', fontWeight: 600 }}>
                        {question.correctAnswers}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Incorrect Answers
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#d93025', fontWeight: 600 }}>
                        {question.incorrectAnswers}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default QuestionAnalysis;