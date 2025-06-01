import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, logout } from '../../features/auth/authSlice';
import {
  Box,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

function UserMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action from authSlice
    navigate('/'); // Redirect to home after logout
    handleClose();
  };

  const getMenuItems = () => {
    const items = [];

    // Add role-specific menu items
    if (currentUser?.role === 'admin') {
      items.push({
        icon: <AdminIcon />,
        text: 'Admin Dashboard',
        onClick: () => handleNavigation('/admin/dashboard'),
      });
      items.push({
        icon: <PersonIcon />,
        text: 'Personal Profile',
        onClick: () => handleNavigation('/personal-profile'),
      });
       items.push({
        icon: <SettingsIcon />,
        text: 'My Account',
        onClick: () => handleNavigation('/settings'),
      });
    } else if (currentUser?.role === 'teacher') {
      items.push({
        icon: <SchoolIcon />,
        text: 'Teacher Dashboard',
        onClick: () => handleNavigation('/teacher/dashboard'),
      });
       items.push({
        icon: <SettingsIcon />,
        text: 'My Account',
        onClick: () => handleNavigation('/personal-profile'), // Navigate to personal profile for teachers
      });
    } else if (currentUser?.role === 'student') {
      items.push({
        icon: <DashboardIcon />,
        text: 'Student Dashboard',
        onClick: () => handleNavigation('/student/dashboard'),
      });
      items.push({
        icon: <PersonIcon />,
        text: 'Personal Profile',
        onClick: () => handleNavigation('/personal-profile'),
      });
       items.push({
        icon: <SettingsIcon />,
        text: 'My Account',
        onClick: () => handleNavigation('/settings'),
      });
    }

    // Add logout at the end
    items.push(
      { type: 'divider' },
      {
        icon: <LogoutIcon />,
        text: 'Sign Out',
        onClick: handleLogout,
      }
    );

    return items;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Avatar
          src={currentUser?.avatar}
          alt={currentUser?.fullname || currentUser?.email}
          sx={{ width: 32, height: 32 }}
        />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {currentUser?.fullname || currentUser?.email?.split('@')[0]}
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {getMenuItems().map((item, index) => {
          if (item.type === 'divider') {
            return <Divider key={index} />;
          }
          return (
            <MenuItem
              key={index}
              onClick={item.onClick}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(22, 151, 125, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}

export default UserMenu; 