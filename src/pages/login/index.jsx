import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../features/auth/authApiService';
import { setCredentials, selectIsAuthenticated } from '../../features/auth/authSlice';
import logo from "../../assets/logo.png";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper
} from "@mui/material";
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon, 
  ArrowBack as ArrowBackIcon 
} from "@mui/icons-material";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ LoginPage: User is authenticated, redirecting to:', redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleCheckboxChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: event.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log('🔄 LoginPage: Starting login process...');

    if (!formData.email || !formData.password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      }).unwrap();

      console.log('✅ LoginPage: Login successful, result:', result);
      
      dispatch(setCredentials({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }));

    } catch (err) {
      console.error('❌ LoginPage: Login failed:', err);
      setError(err.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <Box sx={{
      display: "flex",
      minHeight: "100vh",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f0f4f8",
      p: 3
    }}>
      <Paper
        elevation={6}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ textAlign: 'left', mb: 2 }}>
            <IconButton component={RouterLink} to="/">
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <img
            src={logo}
            alt="logo"
            style={{ maxWidth: "100px", height: "auto", margin: "0 auto 16px auto", display: 'block' }}
          />
          <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
            Đăng nhập
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hoặc <RouterLink to="/auth/signup" style={{ color: '#16977D', textDecoration: 'none' }}>đăng ký tài khoản mới</RouterLink>
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            error={!!error}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={!!error}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.rememberMe}
                  onChange={handleCheckboxChange}
                  color="primary"
                />
              }
              label="Ghi nhớ đăng nhập"
            />
            <RouterLink to="/auth/forgot-password" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary" sx={{'&:hover': { textDecoration: 'underline' }}}>
                Quên mật khẩu?
              </Typography>
            </RouterLink>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#16977D",
              "&:hover": {
                backgroundColor: "#12725f",
              },
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Đăng nhập"}
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có tài khoản?{' '}
              <RouterLink to="/auth/signup" style={{ color: '#16977D', textDecoration: 'none' }}>
                Đăng ký ngay
              </RouterLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
