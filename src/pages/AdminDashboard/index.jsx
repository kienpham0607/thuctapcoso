import React, { useState, useEffect } from 'react';
import TestsManagement from '../../components/tests-management';
import { OverviewTab } from '../../components/overview-tab';
import { ProfileContent } from './ProfileContent'; // Updated import
import UserManagement from '../../components/user-management/UserManagement';
import SubjectManagement from '../../components/SubjectManagement';
import ContactMessages from '../../components/contact-messages/ContactMessages';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  useTheme,
  Skeleton,
  Button,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  School as SchoolIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { getUserProfileApi } from '../../apis/authApi';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';

const drawerWidth = 280;

const AdminDashboard = () => { // Renamed component
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    // Get the active tab from localStorage or default to 'overview'
    return localStorage.getItem('adminDashboardActiveTab') || 'overview'; // Updated localStorage key
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState(null);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminDashboardActiveTab', activeTab); // Updated localStorage key
  }, [activeTab]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getUserProfileApi();
        setProfileData(data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        setError(error.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [activeTab]); // Keep activeTab as dependency if profile data loading depends on tab

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAvatarMenuOpen = (event) => setAvatarMenuAnchor(event.currentTarget);
  const handleAvatarMenuClose = () => setAvatarMenuAnchor(null);

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { id: 'overview', text: 'Overview', icon: <BarChartIcon /> },
    { id: 'tests', text: 'Practice Tests', icon: <DescriptionIcon /> },
    { id: 'users', text: 'User Management', icon: <GroupIcon /> },
    { id: 'profile', text: 'Profile', icon: <AccountCircleIcon /> },
    { id: 'settings', text: 'Subjects', icon: <SettingsIcon /> },
    { id: 'contact', text: 'Contact Messages', icon: <NotificationsIcon /> }
  ];

  const drawer = (
    <Box sx={{ bgcolor: 'background.paper', color: 'text.primary', height: '100vh' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'grey.900',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          {/* Consider changing this icon for Admin */}
          <SchoolIcon sx={{ fontSize: 20 }} /> 
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1 }}>
            AdminHub
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Dashboard
          </Typography>
        </Box>
      </Box>
      
      <Divider />
      
      <Typography variant="overline" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary' }}>
        MAIN MENU
      </Typography>
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              sx={{
                mx: 1,
                borderRadius: 1,
                py: 1,
                minHeight: 40,
                '&.Mui-selected': {
                  bgcolor: alpha('#16977D', 0.1),
                  color: '#16977D',
                  '&:hover': {
                    bgcolor: alpha('#16977D', 0.15),
                  }
                },
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
                color: theme.palette.text.secondary,
                justifyContent: 'flex-start',
                gap: 2,
              }}
            >
              <ListItemIcon sx={{ color: activeTab === item.id ? '#16977D' : theme.palette.grey[700], minWidth: 0 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ '& .MuiTypography-root': { fontWeight: activeTab === item.id ? 600 : 500, fontSize: '0.9rem' } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const PracticeTestsContent = () => {
    return (
      <Box>
        <TestsManagement />
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <Toolbar sx={{ height: 70 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Tooltip title="Go to Home">
            {/* Consider changing navigation for Admin */}
            <IconButton color="inherit" onClick={() => navigate('/')} sx={{ mr: 1 }}>
              <HomeIcon />
            </IconButton>
          </Tooltip>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton size="large" color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton size="large" edge="end" aria-label="account of current user" aria-haspopup="true" onClick={handleAvatarMenuOpen} color="inherit">
            <Avatar sx={{ width: 32, height: 32 }} src={currentUser?.avatar || undefined}>
              {!currentUser?.avatar && (currentUser?.fullName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || '?')}
            </Avatar>
          </IconButton>
          <Menu anchorEl={avatarMenuAnchor} open={Boolean(avatarMenuAnchor)} onClose={handleAvatarMenuClose}>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#F7F7F7',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'tests' && <PracticeTestsContent />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'profile' && <ProfileContent />}
        {activeTab === 'settings' && <SubjectManagement />}
        {activeTab === 'contact' && <ContactMessages />}
      </Box>
    </Box>
  );
};

export default AdminDashboard; // Export with new name 