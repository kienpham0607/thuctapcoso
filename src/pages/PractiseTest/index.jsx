import React from 'react';
import anh1 from '../../assets/anh1.png';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Fade,
  Zoom
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PractiseTests() {
  const navigate = useNavigate();

  const subjects = [
    {
      name: "Database",
      description: "Test your knowledge of databases, SQL, and data management",
      path: "/practice/database"
    },
    {
      name: "Marxist-Leninist Political Economy",
      description: "Review basic concepts and principles of Marxist-Leninist political economy",
      path: "/practice/political-economy"
    },
    {
      name: "Computer Networks",
      description: "Practice exercises on computer networks, protocols, and network security",
      path: "/practice/computer-networks"
    },
    {
      name: "Web and Database Security",
      description: "Practice web security and database protection",
      path: "/practice/web-security"
    },
    {
      name: "Party History",
      description: "Review the history of the Communist Party of Vietnam",
      path: "/practice/party-history"
    },
    {
      name: "General Law",
      description: "Learn about basic legal concepts and Vietnamese legal system",
      path: "/practice/general-law"
    }
  ];

  return (
    <Box>
      {/* Banner section */}
      <Box sx={{ backgroundColor: '#16977D', pb: 4 }}>
        <Container maxWidth="lg">
          {/* Title */}
          <Typography
            variant="h5"
            sx={{ color: '#fff', fontWeight: 'bold', pt: 2 }}
          >
            Practise Tests
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Zoom in={true}>
                <Card
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                {/* Left section */}
                <Box sx={{ flex: 1, p: 3 }}>
                  <Fade in={true} timeout={800}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                      Select Subject
                    </Typography>
                  </Fade>
                  
                  <Grid container spacing={2}>
                    {subjects.map((subject, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                          <Card
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                              boxShadow: 6,
                              transform: 'scale(1.02)',
                              transition: 'all 0.2s ease-in-out'
                            }
                          }}
                          onClick={() => navigate(subject.path)}
                        >
                          <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {subject.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {subject.description}
                            </Typography>
                          </CardContent>
                          </Card>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Right section */}
                <Box
                  sx={{
                    flex: 0.5,
                    backgroundColor: '#1aad90',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 2,
                  }}
                >
                  <img
                    src={anh1}
                    alt="Illustration"
                    style={{
                      width: '100%',
                      maxWidth: 200,
                      margin: '0 auto',
                      display: 'block',
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: '#fff', mt: 2, textAlign: 'center', fontSize: '0.9rem' }}
                  >
                    Test your knowledge with practice exercises. Choose a subject and start learning!
                  </Typography>
                </Box>
                </Card>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Instructions section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{
          backgroundColor: '#fff',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{
            backgroundColor: '#16977D',
            py: 3,
            px: 4,
            color: 'white'
          }}>
            <Typography variant="h5" fontWeight="bold">
              Practice Test Guide
            </Typography>
            <Typography sx={{ mt: 1, opacity: 0.9 }}>
              Follow these steps to make the most of your learning experience
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 3, color: '#16977D', fontWeight: 'bold' }}>
                  Getting Started
                </Typography>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  {[
                    {
                      step: '01',
                      title: 'Choose Your Subject',
                      desc: 'Select a subject that you want to practice from the available options'
                    },
                    {
                      step: '02',
                      title: 'Select Test Level',
                      desc: 'Pick a test that matches your current knowledge level'
                    },
                    {
                      step: '03',
                      title: 'Complete Questions',
                      desc: 'Answer all questions within the given time limit'
                    },
                    {
                      step: '04',
                      title: 'Review Results',
                      desc: 'Check your answers and learn from any mistakes'
                    }
                  ].map((item) => (
                    <Box key={item.step} sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start'
                    }}>
                      <Box sx={{
                        backgroundColor: 'rgba(22, 151, 125, 0.1)',
                        color: '#16977D',
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}>
                        {item.step}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 3, color: '#16977D', fontWeight: 'bold' }}>
                  Study Tips
                </Typography>
                <Grid container spacing={2}>
                  {[
                    {
                      title: 'Regular Practice',
                      desc: 'Set aside dedicated time for practice sessions'
                    },
                    {
                      title: 'Track Progress',
                      desc: 'Monitor your improvement over time'
                    },
                    {
                      title: 'Learn from Mistakes',
                      desc: 'Review incorrect answers to understand concepts better'
                    },
                    {
                      title: 'Time Management',
                      desc: 'Practice working within time constraints'
                    }
                  ].map((tip, index) => (
                    <Grid item xs={12} key={index}>
                      <Card sx={{
                        backgroundColor: 'rgba(22, 151, 125, 0.05)',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(22, 151, 125, 0.1)',
                        }
                      }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {tip.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {tip.desc}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}