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
import logoGradeCalculator from '../../assets/logo.png';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { logout } from '../../features/auth/authSlice';
import UserMenu from '../UserMenu';
import Avatar from '@mui/material/Avatar';

export default function Header() {
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

  // Xác định tab đang active
  const path = window.location.pathname.toLowerCase();
  const menuItems = [
    { label: 'College GPA', path: '/college-gpa' },
    { label: 'Practice Test', path: '/practice-test' },
    { label: 'Personal Profile', path: '/personal-profile' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: '1px solid #eee', px: 2, bgcolor: '#fff' }}
    >
      <Toolbar disableGutters sx={{ minHeight: 64, position: 'relative' }}>
        {/* Logo to hơn */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, flexShrink: 0 }}>
          <img
            src={logoGradeCalculator}
            alt="Grade Calculator Logo"
            style={{ height: 56, maxWidth: 220, marginRight: 20, cursor: 'pointer', objectFit: 'contain', display: 'block' }}
            onClick={() => navigate("/")}
          />
        </Box>

        {/* Menu căn giữa tuyệt đối */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 0,
            height: '100%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 3,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          {menuItems.map((item) => {
            const isActive = path === item.path;
            return (
              <Typography
                key={item.path}
                variant="subtitle1"
                onClick={() => navigate(item.path)}
                sx={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 17,
                  color: isActive ? '#06c39f' : '#374151',
                  cursor: 'pointer',
                  px: 0.5,
                  pb: 0.5,
                  borderBottom: isActive ? '3px solid #06c39f' : '3px solid transparent',
                  transition: 'color 0.2s, border-bottom 0.2s',
                  '&:hover': {
                    color: '#06c39f',
                    borderBottom: '3px solid #06c39f',
                    background: 'none',
                  },
                  borderRadius: 0,
                  background: 'none',
                  userSelect: 'none',
                  lineHeight: 1.1,
                }}
              >
                {item.label}
              </Typography>
            );
          })}
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
