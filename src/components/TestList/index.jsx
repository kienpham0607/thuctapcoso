import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Zoom,
  Container,
  LinearProgress,
  IconButton
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuizIcon from '@mui/icons-material/Quiz';

const mockTests = {
  database: [
    {
      id: 1,
      title: 'SQL Basics',
      description: 'Learn basic SQL queries and operations',
      questionCount: 10,
      timeLimit: 15,
      difficulty: 'Easy',
      completion: 0
    }
  ],
  'web-security': [
    {
      id: 1,
      title: 'Web Security Fundamentals',
      description: 'Basic concepts of web security',
      questionCount: 15,
      timeLimit: 20,
      difficulty: 'Medium',
      completion: 0
    }
  ]
};

export default function TestList() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const tests = mockTests[subject] || [];

  const getSubjectName = (slug) => {
    const names = {
      'database': 'Database',
      'web-security': 'Web and Database Security',
      'computer-networks': 'Computer Networks',
      'network-security': 'Network Security'
    };
    return names[slug] || slug;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': '#4caf50',
      'Medium': '#ff9800',
      'Hard': '#f44336'
    };
    return colors[difficulty] || '#757575';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Banner section */}
      <Box 
        sx={{
          background: 'linear-gradient(135deg, #16977D 0%, #0d5c4d 100%)',
          pb: 6,
          pt: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
          }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconButton
              onClick={() => navigate('/practice-test')}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.1)'
                }
              }}
              size="large"
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: '#fff',
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  letterSpacing: '-0.02em'
                }}
              >
                {getSubjectName(subject)}
              </Typography>
              <Typography 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: 600,
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.125rem' }
                }}
              >
                Choose a test to begin practicing and track your progress
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {tests.map((test, index) => (
            <Grid item xs={12} md={6} key={test.id}>
              <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card
                  elevation={0}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(22, 151, 125, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 24px 48px rgba(22, 151, 125, 0.2)',
                      border: '1px solid rgba(22, 151, 125, 0.2)',
                      '&::before': {
                        opacity: 1
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #16977D, #0d5c4d)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }
                  }}
                  onClick={() => navigate(`/practice/${subject}/test/${test.id}`, { replace: true })}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 2,
                        color: '#1e293b'
                      }}
                    >
                      {test.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{
                        color: '#64748b',
                        mb: 3,
                        lineHeight: 1.6
                      }}
                    >
                      {test.description}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(22, 151, 125, 0.04)',
                          border: '1px solid rgba(22, 151, 125, 0.1)'
                        }}>
                          <QuizIcon sx={{ color: '#16977D' }} />
                          <Typography sx={{ fontWeight: 600, color: '#16977D' }}>
                            {test.questionCount} Questions
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(22, 151, 125, 0.04)',
                          border: '1px solid rgba(22, 151, 125, 0.1)'
                        }}>
                          <AccessTimeIcon sx={{ color: '#16977D' }} />
                          <Typography sx={{ fontWeight: 600, color: '#16977D' }}>
                            {test.timeLimit} Minutes
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 3,
                      pt: 3,
                      borderTop: '1px solid rgba(22, 151, 125, 0.1)'
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Box sx={{
                          height: 8,
                          width: 8,
                          borderRadius: '50%',
                          backgroundColor: getDifficultyColor(test.difficulty)
                        }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: getDifficultyColor(test.difficulty),
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {test.difficulty}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, ml: 3 }}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={test.completion}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'rgba(22, 151, 125, 0.08)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#16977D',
                                borderRadius: 3,
                              }
                            }}
                          />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block',
                              textAlign: 'right',
                              mt: 0.5,
                              color: '#64748b',
                              fontWeight: 500
                            }}
                          >
                            {test.completion}% Complete
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}