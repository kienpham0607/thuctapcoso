import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import NotificationsIcon from '@mui/icons-material/Notifications';
import logo from '../../assets/logo.svg';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { logout } from '../../features/auth/authSlice';
import UserMenu from '../UserMenu';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLogin = () => {
    console.log('🔑 Header: Is authenticated before navigating to login:', user ? true : false);
    console.log('🔄 Header: Attempting to navigate to login page...');
    navigate('/login');
    console.log('✅ Header: Navigation completed');
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: '1px solid #ccc',
        px: 2
      }}
    >
      <Toolbar disableGutters sx={{ minHeight: 64 }}>
        {/* Logo + Tên app */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <img
            src={logo}
            alt="logo"
            style={{ width: 200, height: 45, marginRight: 8, cursor: 'pointer', objectFit: 'contain' }}
            onClick={() => navigate("/")}
          />
        </Box>

        {/* Menu chính giữa */}
        <Box sx={{ display: 'flex', gap: 3, flexGrow: 1, justifyContent: 'center' }}>
          <Button
            color="inherit"
            sx={{ textTransform: 'capitalize' }}
            onClick={() => navigate("/College-GPA")}
          >
            College GPA
          </Button>
          <Button
            color="inherit"
            sx={{ textTransform: 'capitalize' }}
            onClick={() => navigate("/practice-test")}
          >
            Practice Test
          </Button>
          <Button
            color="inherit"
            sx={{ textTransform: 'capitalize' }}
            onClick={() => navigate("/Personal-profile")}
          >
            Personal profile
          </Button>
          <Button 
            color="inherit" 
            sx={{ textTransform: 'capitalize' }}
            onClick={() => navigate("/about")}
          >
            About
          </Button>
          <Button 
            color="inherit" 
            sx={{ textTransform: 'capitalize' }} 
            onClick={() => navigate("/contact")}
          >
            Contact
          </Button>
        </Box>

        {/* Đẩy các item còn lại sang bên phải */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Icon notification */}
        <IconButton color="inherit" sx={{ mr: 2 }}>
          <NotificationsIcon />
        </IconButton>

        {/* Hiển thị email hoặc nút Sign In */}
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
      </Toolbar>
    </AppBar>
  );
}
