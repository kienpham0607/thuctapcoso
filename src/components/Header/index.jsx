import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import NotificationsIcon from '@mui/icons-material/Notifications';
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
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
            style={{ width: 300, height: 68, marginRight: 8, cursor: 'pointer' }}
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
          <Button color="inherit" sx={{ textTransform: 'capitalize' }}>About</Button>
          <Button color="inherit" sx={{ textTransform: 'capitalize' }} onClick={() => navigate("/contact")}>
            Contract
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
              onClick={() => {
                logout();
                navigate('/');
              }}
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
            onClick={() => navigate("/admin/login")}
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
