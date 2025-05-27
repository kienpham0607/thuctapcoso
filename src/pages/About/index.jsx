import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import QuizIcon from '@mui/icons-material/Quiz';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';

export default function About() {
  const features = [
    {
      icon: <CalculateIcon fontSize="large" />,
      title: "GPA Calculator",
      description: "Calculate and track your GPA accurately. Supports multiple grading scales and credit weightings."
    },
    {
      icon: <BarChartIcon fontSize="large" />,
      title: "Analytics Dashboard",
      description: "View detailed analytics and charts about your academic performance and progress across semesters."
    },
    {
      icon: <QuizIcon fontSize="large" />,
      title: "Practice Tests",
      description: "Take practice tests and exercises to prepare for your exams in the best possible way."
    },
    {
      icon: <PersonIcon fontSize="large" />,
      title: "Personal Profile",
      description: "Manage your personal information and track your academic progress efficiently."
    },
    {
      icon: <SchoolIcon fontSize="large" />,
      title: "Learning Materials",
      description: "Access and store learning materials, lectures, and important notes in one place."
    },
    {
      icon: <StorageIcon fontSize="large" />,
      title: "Data Storage",
      description: "Securely store all your academic data with access anytime, anywhere."
    }
  ];

  return (
    <Box sx={{ 
      bgcolor: '#f8fafc',
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #16977D 0%, #0d5c4d 100%)',
        py: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
        }
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            align="center" 
            sx={{ 
              color: 'white',
              fontWeight: 800,
              mb: 2,
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              fontSize: { xs: '2rem', md: '2.75rem' }
            }}
          >
            About Us
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.125rem' }
            }}
          >
            GPA Calculator with Learning Materials Storage - A Comprehensive Learning Support Tool for Students
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
                elevation={1}
              >
                <Card sx={{ height: '100%', bgcolor: 'transparent', boxShadow: 'none' }}>
                  <CardContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4
                  }}>
                    <Box 
                      sx={{ 
                        color: '#16977D',
                        mb: 2,
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: 'rgba(22, 151, 125, 0.1)'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 600,
                        mb: 2,
                        color: '#1e293b'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1"
                      sx={{ color: '#64748b' }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}