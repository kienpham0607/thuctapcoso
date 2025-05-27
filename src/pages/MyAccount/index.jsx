import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { useUploadAvatarMutation } from '../../features/auth/authApiService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Grid,
  TextField,
  Avatar,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';

export default function MyAccount() {
  const user = useSelector(selectCurrentUser);
  const [uploadAvatar] = useUploadAvatarMutation();
  const [selectedSection, setSelectedSection] = useState('overview');
  const menuItems = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
    { id: 'personal', label: 'Personal Info', icon: <PersonIcon /> },
    { id: 'security', label: 'Security', icon: <SecurityIcon /> },
  ], []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      }));
  
      const current = sections.find(section => {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          const scrollPosition = window.scrollY + 100;
          const elementPosition = rect.top + window.pageYOffset;
          return scrollPosition >= elementPosition && scrollPosition <= elementPosition + rect.height;
        }
        return false;
      });

      if (current) {
        setSelectedSection(current.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuItems]);

  // Early return if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleMenuClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 32;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setSelectedSection(sectionId);
    }
  };

  const pageStyles = {
    container: {
      maxWidth: '100vw',
      minHeight: 'calc(100vh - 64px)',
      bgcolor: '#f8fafc',
      pt: 3,
      pb: 4,
      display: 'flex',
      justifyContent: 'center',
    },
    inner: {
      width: '100%',
      maxWidth: 1200,
      display: 'flex',
      gap: 3,
      px: 3,
      position: 'relative',
    },
    sidebarWrapper: {
      width: 280,
      height: 'fit-content',
      position: 'sticky',
      top: 24,
    },
    sidebar: {
      width: '100%',
      bgcolor: 'white',
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      p: 4,
      bgcolor: 'white',
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      '& > div': {
        scrollMarginTop: '88px'
      },
      '& .MuiCard-root': {
        border: '1px solid #e5e7eb',
        boxShadow: 'none',
        mb: 4,
        '&:hover': {
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }
      }
    },
    listItem: {
      mx: 2,
      my: 1,
      borderRadius: 1,
      transition: 'all 0.2s',
      fontSize: '0.875rem',
      '&.Mui-selected': {
        bgcolor: 'rgba(22, 151, 125, 0.08)',
        borderRight: '2px solid #16977D',
        '&:hover': {
          bgcolor: 'rgba(22, 151, 125, 0.12)',
        },
      },
      '&:hover': {
        bgcolor: 'rgba(0, 0, 0, 0.02)',
      },
    }
  };

  return (
    <Box sx={pageStyles.container}>
      <Box sx={pageStyles.inner}>
        {/* Sidebar */}
        <Box sx={pageStyles.sidebarWrapper}>
          <Paper sx={pageStyles.sidebar}>
            <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.id}
                selected={selectedSection === item.id}
                onClick={() => handleMenuClick(item.id)}
                sx={pageStyles.listItem}
              >
                <ListItemIcon sx={{
                  color: selectedSection === item.id ? '#16977D' : 'inherit',
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: selectedSection === item.id ? 600 : 400,
                      color: selectedSection === item.id ? '#16977D' : 'inherit'
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
          </Paper>
        </Box>

        {/* Content Area */}
        <Box sx={pageStyles.content}>
          {/* Overview Section */}
          <Box id="overview">
            <Card>
              <Box sx={{ 
                height: 140,
                background: 'linear-gradient(135deg, #16977D 0%, #0d5c4d 100%)',
                borderRadius: '8px 8px 0 0',
              }} />
              <Box sx={{
                position: 'relative',
                mt: -9,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: 3,
                pb: 3,
              }}>
                <Box
                  sx={{
                    position: 'relative',
                    '&:hover .upload-overlay': {
                      opacity: 1
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      border: '4px solid white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    src={user?.photoURL || '/placeholder.svg'}
                  />
                  <Box
                    className="upload-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: '50%',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      cursor: 'pointer'
                    }}
                    onClick={() => document.getElementById('avatar-upload').click()}
                  >
                    <Typography sx={{ color: 'white', fontSize: '0.75rem' }}>
                      Change Photo
                    </Typography>
                  </Box>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append('avatar', file);
                        
                        try {
                          await uploadAvatar(formData).unwrap();
                          // Avatar update will be handled by redux state through invalidation
                        } catch (error) {
                          console.error('Error uploading avatar:', error);
                          alert('Failed to upload avatar. Please try again.');
                        }
                      }
                    }}
                  />
                </Box>
                <Typography variant="h5" sx={{ mt: 2, fontWeight: 600, color: '#111827' }}>
                  {user?.displayName || user?.email?.split('@')[0]}
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 3 }}>
                  User
                </Typography>
                <Grid container spacing={3}>
                  {/* Email Info */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2,
                      bgcolor: '#fff',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#16977D',
                        bgcolor: 'rgba(22, 151, 125, 0.02)'
                      }
                    }}>
                      <Box sx={{ 
                        p: 1,
                        bgcolor: 'rgba(22, 151, 125, 0.1)',
                        borderRadius: '50%',
                        display: 'flex'
                      }}>
                        <EmailIcon sx={{ color: '#16977D' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Email</Typography>
                        <Typography>{user?.email}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Phone Info */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2,
                      bgcolor: '#fff',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#16977D',
                        bgcolor: 'rgba(22, 151, 125, 0.02)'
                      }
                    }}>
                      <Box sx={{ 
                        p: 1,
                        bgcolor: 'rgba(22, 151, 125, 0.1)',
                        borderRadius: '50%',
                        display: 'flex'
                      }}>
                        <PhoneIcon sx={{ color: '#16977D' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Phone</Typography>
                        <Typography>0123456789</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Location Info */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2,
                      bgcolor: '#fff',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#16977D',
                        bgcolor: 'rgba(22, 151, 125, 0.02)'
                      }
                    }}>
                      <Box sx={{ 
                        p: 1,
                        bgcolor: 'rgba(22, 151, 125, 0.1)',
                        borderRadius: '50%',
                        display: 'flex'
                      }}>
                        <LocationOnIcon sx={{ color: '#16977D' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Address</Typography>
                        <Typography>Hanoi, Vietnam</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Member Since Info */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2,
                      bgcolor: '#fff',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#16977D',
                        bgcolor: 'rgba(22, 151, 125, 0.02)'
                      }
                    }}>
                      <Box sx={{ 
                        p: 1,
                        bgcolor: 'rgba(22, 151, 125, 0.1)',
                        borderRadius: '50%',
                        display: 'flex'
                      }}>
                        <CalendarTodayIcon sx={{ color: '#16977D' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Member Since</Typography>
                        <Typography>{new Date().toLocaleDateString()}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Box>

          {/* Personal Info Section */}
          <Box id="personal">
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: '#16977D' }}>
                  Personal Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      defaultValue="John"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#16977D',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16977D',
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      defaultValue="Doe"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#16977D',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16977D',
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      defaultValue={user?.email}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#16977D',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16977D',
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      defaultValue="0123456789"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#16977D',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16977D',
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      defaultValue="Hanoi, Vietnam"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#16977D',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16977D',
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      multiline
                      rows={4}
                      defaultValue="Computer Science student."
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#16977D',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16977D',
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        variant="contained" 
                        sx={{ 
                          bgcolor: '#16977D',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: '#0d5c4d',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* Security Section */}
          <Box id="security">
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: '#16977D' }}>
                  Security
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#16977D',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16977D',
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#16977D',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16977D',
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#16977D',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16977D',
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        variant="contained"
                        sx={{ 
                          bgcolor: '#16977D',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: '#0d5c4d',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        Update Password
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 4 }} />
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#16977D' }}>
                      Notifications
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Paper
                        sx={{
                          p: 3,
                          border: '1px solid #e5e7eb',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#16977D',
                            bgcolor: 'rgba(22, 151, 125, 0.02)',
                            transform: 'translateY(-1px)'
                          }
                        }}
                        elevation={0}
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              defaultChecked
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#16977D',
                                  '&:hover': {
                                    bgcolor: 'rgba(22, 151, 125, 0.08)',
                                  },
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  bgcolor: '#16977D',
                                },
                              }}
                            />
                          }
                          label={
                            <Box>
                              <Typography sx={{ fontWeight: 500 }}>Email Notifications</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Receive email notifications
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                      <Paper 
                        sx={{ 
                          p: 3, 
                          border: '1px solid #e5e7eb',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#16977D',
                            bgcolor: 'rgba(22, 151, 125, 0.02)',
                            transform: 'translateY(-1px)'
                          }
                        }} 
                        elevation={0}
                      >
                        <FormControlLabel
                          control={
                            <Switch 
                              defaultChecked 
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#16977D',
                                  '&:hover': {
                                    bgcolor: 'rgba(22, 151, 125, 0.08)',
                                  },
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  bgcolor: '#16977D',
                                },
                              }}
                            />
                          }
                          label={
                            <Box>
                              <Typography sx={{ fontWeight: 500 }}>Website Notifications</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Show notifications on website
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
