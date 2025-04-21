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
        <Fade in={true} timeout={1000}>
          <Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Practice Test Guide
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Our practice tests are designed to help you assess your knowledge and prepare for exams.
          Follow these simple steps to get started:
        </Typography>

        <Box sx={{ pl: 2, mt: 1 }}>
          <ol>
            <li><strong>Select a subject</strong> from the options above</li>
            <li><strong>Choose difficulty level</strong> that matches your current knowledge</li>
            <li><strong>Complete questions</strong> within the time limit</li>
            <li><strong>Review answers</strong> and learn from mistakes</li>
          </ol>
        </Box>

            <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Zoom in={true}>
              <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Study Tips
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Make the most of your practice sessions with our effective learning strategies.
                </Typography>
              </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} md={6}>
            <Zoom in={true}>
              <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Track Progress
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Monitor your progress over time and identify areas that need more focus.
                </Typography>
              </CardContent>
              </Card>
            </Zoom>
          </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}