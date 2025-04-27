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
  Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '@mui/material';

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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', pb: 4 }}>
      <Box sx={{ backgroundColor: '#16977D', py: 3, mb: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => navigate('/practice-test')}
              sx={{
                backgroundColor: 'white',
                color: '#16977D',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
              size="large"
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                {getSubjectName(subject)}
              </Typography>
              <Typography sx={{ color: 'white', mt: 1 }}>
                Select a test to begin practicing
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {tests.map((test, index) => (
            <Grid item xs={12} md={6} key={test.id}>
              <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                  onClick={() => navigate(`/practice/${subject}/test/${test.id}`, { replace: true })}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 1,
                        color: '#16977D'
                      }}>
                      {test.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ 
                        display: 'block',
                        mb: 2,
                        color: 'text.primary',
                        fontSize: '0.95rem'
                      }}>
                        {test.description}
                      </Box>
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          backgroundColor: 'rgba(22, 151, 125, 0.1)',
                          borderRadius: 1,
                          p: 1
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {test.questionCount} Questions
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          backgroundColor: 'rgba(22, 151, 125, 0.1)',
                          borderRadius: 1,
                          p: 1
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {test.timeLimit} minutes
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 2
                    }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: getDifficultyColor(test.difficulty),
                          fontWeight: 'bold',
                          backgroundColor: `${getDifficultyColor(test.difficulty)}15`,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1
                        }}
                      >
                        {test.difficulty}
                      </Typography>

                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={test.completion}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#16977D'
                            }
                          }}
                        />
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