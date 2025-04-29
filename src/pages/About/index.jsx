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
      py: 8
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: '#16977D',
              mb: 2
            }}
          >
            About Us
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#475569',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            GPA Calculator with Learning Materials Storage - A Comprehensive Learning Support Tool for Students
          </Typography>
        </Box>

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