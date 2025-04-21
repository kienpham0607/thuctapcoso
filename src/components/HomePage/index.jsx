import React from 'react';
import {
  Grid,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';

// Các icon ví dụ
import SchoolIcon from '@mui/icons-material/School';         // College GPA
import DescriptionIcon from '@mui/icons-material/Description'; // Personal profile (hoặc PersonOutline)
import PersonIcon from '@mui/icons-material/Person';         // Sign In
import CheckBoxIcon from '@mui/icons-material/CheckBox';     // Practice Test
import CalculateIcon from '@mui/icons-material/Calculate';   // Calculate Final Grade
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';   // Convert 10 to 4 Scale

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)', // Subtract header height
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4
      }}>
        <Box sx={{ maxWidth: '800px', width: '100%' }}>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
            sx={{
              margin: '0 auto',
            }}
          >
            {/* Repeat this for all 6 cards */}
            {[
              { title: 'College GPA', icon: SchoolIcon, path: '/college-gpa' },
              { title: 'Personal profile', icon: DescriptionIcon, path: '/Personal-profile' },
              { title: 'Sign In', icon: PersonIcon, path: '/admin/login' },
              { title: 'Practice Test', icon: CheckBoxIcon, path: '/practice-test' },
              { title: 'Calculate Final Grade', icon: CalculateIcon, path: '' },
              { title: 'Convert 10 to 4 Scale', icon: SwapHorizIcon, path: '' }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }} key={index}>
                <Card variant="outlined" sx={{
                  width: '230px',
                  height: '160px',
                  textAlign: 'center',
                  borderRadius: '20px',
                  border: '1px solid #16977D',
                  background: '#FFF'
                }}>
                  <CardActionArea
                    sx={{ height: '100%' }}
                    onClick={() => item.path && navigate(item.path)}
                  >
                    <CardContent>
                      <Box sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: '#D9D9D9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 1
                      }}>
                        {React.createElement(item.icon, { fontSize: "large", sx: { color: '#16977D' } })}
                      </Box>
                      <Typography variant="h6" sx={{ color: '#333', fontWeight: 500 }}>
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
