import React, { useEffect, useState } from 'react';
import './overview-tab.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Stars as StarsIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { getDashboardStats } from '../../apis/practiceTestApi';

export const OverviewTab = () => {
  const [stats, setStats] = useState({
    totalTests: 0,
    avgScore: 0,
    totalStudents: 0,
    totalTeachers: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const res = await getDashboardStats();
      if (res.success && res.data) setStats(res.data);
    }
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Practice Tests',
      value: stats.totalTests,
      icon: <AssignmentTurnedInIcon />,
      gradientStart: '#4158D0',
      gradientEnd: '#C850C0',
      subtitle: ''
    },
    {
      title: 'Average Score',
      value: stats.avgScore,
      icon: <StarsIcon />,
      gradientStart: '#0093E9',
      gradientEnd: '#80D0C7',
      subtitle: ''
    },
    {
      title: 'Students',
      value: stats.totalStudents,
      icon: <GroupIcon />,
      gradientStart: '#00C9FF',
      gradientEnd: '#92FE9D',
      subtitle: ''
    },
    {
      title: 'Teachers',
      value: stats.totalTeachers,
      icon: <AccountCircleIcon />,
      gradientStart: '#FF0080',
      gradientEnd: '#7928CA',
      subtitle: ''
    },
  ];

  return (
    <Box>
      <Box sx={{ py: 2 }}>
        <Box sx={{ mb: 5 }} className="overview-header">
          <Typography variant="h4" gutterBottom className="gradient-text">
            Welcome back!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your teaching activities today.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 5 }} className="stats-container">
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
              <Card
                className="stats-card"
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease-in-out',
                  background: `linear-gradient(135deg, ${card.gradientStart}08 0%, ${card.gradientEnd}08 100%)`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    background: `linear-gradient(135deg, ${card.gradientStart}15 0%, ${card.gradientEnd}15 100%)`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${card.gradientStart} 0%, ${card.gradientEnd} 100%)`,
                        color: 'white',
                        display: 'flex',
                        boxShadow: `0 4px 20px ${card.gradientStart}20`,
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                  <Typography className="stats-value" sx={{ mb: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    {card.title}
                  </Typography>
                  {card.subtitle && (
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
                      {card.subtitle}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 5 }} className="activity-section">
          <Typography variant="h5" gutterBottom className="gradient-text">
            Recent Activities
          </Typography>
          <Box sx={{ mt: 2 }}>
            {[
              {
                type: 'Test Completed',
                title: 'JavaScript Basics Quiz',
                time: '2 hours ago',
                color: 'primary'
              },
              {
                type: 'New Attempt',
                title: 'React Components Test',
                time: '4 hours ago',
                color: 'info'
              },
              {
                type: 'Results Published',
                title: 'CSS Grid Assessment',
                time: '1 day ago',
                color: 'success'
              }
            ].map((activity) => (
              <Box
                key={activity.title}
                className="activity-item"
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    bgcolor: `${activity.color}.lighter`,
                    borderColor: `${activity.color}.main`,
                    transform: 'translateX(8px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                <Box
                  className="activity-dot"
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: `${activity.color}.main`,
                    flexShrink: 0,
                    mr: 2,
                    boxShadow: `0 0 0 4px ${activity.color}.light`,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontWeight: 500 }}>
                    {activity.type}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {activity.title}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                  {activity.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OverviewTab;