import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, logout } from '../../features/auth/authSlice';
import logo from '../../assets/logo.png';
import {
  Grid,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button
} from '@mui/material';
import Footer from '../Footer';
import UserMenu from '../UserMenu';

import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/auth/login');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #ffffff 20%, #f0f7ff 80%)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 25px 25px, #e6f0ff 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e6f0ff 2%, transparent 0%)',
        backgroundSize: '100px 100px',
        opacity: 0.4,
        pointerEvents: 'none'
      },
      position: 'relative'
    }}>
      <Box sx={{ 
        position: 'absolute', 
        top: 32, 
        left: 32,
        cursor: 'pointer',
        zIndex: 2
      }}>
        <img
          src={logo}
          alt="logo"
          style={{ width: 300, height: 68 }}
          onClick={() => navigate("/")}
        />
      </Box>
      <Box sx={{
        position: 'absolute',
        top: 32,
        right: 32,
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        {user ? (
          <UserMenu />
        ) : (
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              backgroundColor: '#16977D',
              borderRadius: 20,
              height: 30,
              width: 100,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#12725f'
              },
            }}
          >
            Sign In
          </Button>
        )}
      </Box>
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 6,
        mt: 8
      }}>
        <Box sx={{ 
          maxWidth: '1000px', 
          width: '100%',
          position: 'relative'
        }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #16977D 0%, #0d5c4d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                letterSpacing: '-0.02em',
                textShadow: '0 2px 10px rgba(22, 151, 125, 0.1)'
              }}
            >
              Welcome to GPA Calculator
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#475569',
                maxWidth: '800px',
                mx: 'auto',
                mb: 6,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6
              }}
            >
              Your comprehensive platform for academic success and progress tracking
            </Typography>
          </Box>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
            sx={{
              margin: '0 auto',
            }}
          >
            {[
              { title: 'GPA Calculator', icon: SchoolIcon, path: '/college-gpa' },
              { title: 'Personal Profile', icon: DescriptionIcon, path: '/Personal-profile' },
              { title: 'Practice Tests', icon: CheckBoxIcon, path: '/practice-test' },
              { title: 'My Account', icon: PersonIcon, path: '/my-account' },
              { title: 'About Us', icon: InfoIcon, path: '/about' },
              { title: 'Contact', icon: ContactMailIcon, path: '/contact' }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  elevation={0}
                  sx={{
                    width: '100%',
                    height: '180px',
                    textAlign: 'center',
                    borderRadius: '24px',
                    border: '1px solid rgba(22, 151, 125, 0.15)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
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
                    },
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: '0 24px 48px rgba(22, 151, 125, 0.2)',
                      border: '1px solid rgba(22, 151, 125, 0.3)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      '&::before': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  <CardActionArea
                    sx={{ height: '100%' }}
                    onClick={() => item.path && navigate(item.path)}
                  >
                    <CardContent>
                      <Box sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(22, 151, 125, 0.08)',
                        boxShadow: '0 4px 12px rgba(22, 151, 125, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(22, 151, 125, 0.15)',
                          boxShadow: '0 8px 24px rgba(22, 151, 125, 0.15)',
                          transform: 'scale(1.05)'
                        }
                      }}>
                        {React.createElement(item.icon, { 
                          fontSize: "large", 
                          sx: { 
                            color: '#16977D',
                            fontSize: '36px',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'scale(0.95)',
                            '&:hover': {
                              transform: 'scale(1.1)'
                            }
                          } 
                        })}
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#1e293b',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: '50%',
                            bottom: '-8px',
                            width: '40px',
                            height: '2px',
                            background: 'linear-gradient(90deg, #16977D, #0d5c4d)',
                            transform: 'translateX(-50%) scaleX(0)',
                            transition: 'transform 0.3s ease',
                          },
                          '&:hover::after': {
                            transform: 'translateX(-50%) scaleX(1)'
                          }
                        }}
                      >
                        {item.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default HomePage;
