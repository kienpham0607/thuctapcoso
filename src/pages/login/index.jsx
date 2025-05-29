import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../features/auth/authApiService';
import { selectIsAuthenticated, selectAuthError, selectAuthLoading } from '../../features/auth/authSlice';
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
  Fade,
  Zoom,
  CircularProgress,
  Container,
  Paper
} from "@mui/material";
import { Email as EmailIcon, Lock as LockIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authError = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthLoading);

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [login, { isLoading: loginLoading, error: loginError }] = useLoginMutation();

  useEffect(() => {
    if (loginError) {
      setLocalError(loginError?.data?.message || loginError?.message || 'Đăng nhập thất bại từ API');
      console.error('❌ LoginPage: RTK Query Login Error:', loginError);
    } else if (authError) {
      setLocalError(authError);
      console.log('🔍 LoginPage: Auth Error from slice:', authError);
    } else {
      setLocalError(null);
    }
  }, [loginError, authError]);

  useEffect(() => {
    console.log('🔍 LoginPage: Checking authentication status:', isAuthenticated);
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
    if (localError) setLocalError(null);
  };

  const handleCheckboxChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: event.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    console.log('🔄 LoginPage: Starting login process...');

    if (!formData.email || !formData.password) {
      const errorMsg = "Vui lòng nhập email và mật khẩu.";
      setLocalError(errorMsg);
      console.log('❌ LoginPage: Validation failed:', errorMsg);
      return;
    }

    try {
      console.log('�� LoginPage: Attempting login for:', formData.email);
      const result = await login({ email: formData.email, password: formData.password }).unwrap();

      console.log('✅ LoginPage: Login mutation called, result:', result);

    } catch (error) {
      console.error("❌ LoginPage: Error caught during mutation call:", error);
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
            Hoặc <RouterLink to="/signup" style={{ color: '#16977D', textDecoration: 'none' }}>đăng ký tài khoản mới</RouterLink>
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
          {localError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {localError}
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
            error={!!localError}
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
            error={!!localError}
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
              <Typography variant="body2" color="primary" sx={{'&:hover': { textDecoration: 'underline' }}}>Quên mật khẩu?</Typography>
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
              <RouterLink to="/signup" style={{ color: '#16977D', textDecoration: 'none' }}>
                Đăng ký ngay
              </RouterLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
