import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Link,
  ThemeProvider,
  createTheme,
  Fade,
  Zoom,
  Container,
  IconButton
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#16977D',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box>
        {/* Header Section */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #16977D 0%, #0d5c4d 100%)',
            pt: 4,
            pb: 12,
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
            <Fade in={true} timeout={800}>
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
                Get in Touch
              </Typography>
            </Fade>
            <Fade in={true} timeout={1000}>
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
                Have questions or feedback? We're here to help. Send us a message and we'll respond as soon as possible.
              </Typography>
            </Fade>
          </Container>
        </Box>

        {/* Main Content */}
        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: -6,
            position: 'relative',
            zIndex: 1
          }}
        >
          <Grid container spacing={4}>
            {/* Contact Info */}
            <Grid item xs={12} md={5}>
              <Zoom in={true}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(22, 151, 125, 0.1)',
                  }}
                >
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                      Contact Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {[
                        {
                          icon: EmailIcon,
                          title: 'Email',
                          info: 'contact@gmail.com'
                        },
                        {
                          icon: AccessTimeIcon,
                          title: 'Office Hours',
                          info: 'Monday - Friday: 9am - 5pm\nSaturday: 10am - 2pm'
                        },
                        {
                          icon: LocationOnIcon,
                          title: 'Location',
                          info: 'Hanoi, Vietnam'
                        }
                      ].map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(22, 151, 125, 0.08)',
                              color: '#16977D',
                              flexShrink: 0
                            }}
                          >
                            <item.icon />
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                              {item.title}
                            </Typography>
                            <Typography 
                              sx={{ 
                                color: '#64748b',
                                whiteSpace: 'pre-line'
                              }}
                            >
                              {item.info}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'rgba(22, 151, 125, 0.04)',
                      border: '1px solid rgba(22, 151, 125, 0.1)',
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start'
                    }}
                  >
                    <HelpOutlineIcon sx={{ color: '#16977D', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                      Need help? Check out our{' '}
                      <Box
                        component="span"
                        onClick={() => navigate('/about')}
                        sx={{
                          color: '#16977D',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        About page
                      </Box>{' '}
                      for details on how to use Grade Calculator features.
                    </Typography>
                  </Box>
                </Paper>
              </Zoom>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Zoom in={true}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(22, 151, 125, 0.1)',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                    Send a Message
                  </Typography>
                  <Typography sx={{ mb: 4, color: '#64748b' }}>
                    Fill out the form below and we'll get back to you soon
                  </Typography>

                  <Box component="form" noValidate>
                    <Grid container spacing={3}>
                      {['Name', 'Email', 'Subject'].map((label) => (
                        <Grid item xs={12} key={label}>
                          <Typography 
                            sx={{ 
                              mb: 1,
                              fontWeight: 500,
                              color: '#1e293b'
                            }}
                          >
                            {label}
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder={`Enter your ${label.toLowerCase()}`}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(22, 151, 125, 0.5)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#16977D',
                                }
                              }
                            }}
                          />
                        </Grid>
                      ))}

                      <Grid item xs={12}>
                        <Typography 
                          sx={{ 
                            mb: 1,
                            fontWeight: 500,
                            color: '#1e293b'
                          }}
                        >
                          Message
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Write your message here..."
                          multiline
                          rows={4}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'rgba(255,255,255,0.7)',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(22, 151, 125, 0.5)',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#16977D',
                              }
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          size="large"
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(22, 151, 125, 0.2)',
                            '&:hover': {
                              boxShadow: '0 6px 16px rgba(22, 151, 125, 0.3)',
                              transform: 'translateY(-1px)'
                            }
                          }}
                        >
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
