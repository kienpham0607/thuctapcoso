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

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ color: '#16977D' }}>
              {user.email}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                borderColor: '#16977D',
                color: '#16977D',
                borderRadius: 20,
                height: 30,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#12725f',
                  backgroundColor: 'rgba(18, 114, 95, 0.04)'
                },
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
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
