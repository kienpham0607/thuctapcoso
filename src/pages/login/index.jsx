import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useLoginMutation } from '../../features/auth/authApiService';
import { selectIsAuthenticated, selectAuthError, selectAuthLoading } from '../../features/auth/authSlice';
import logo from "../../assets/logo.png";
import { Link as RouterLink } from "react-router-dom";
import googleIcon from "../../assets/google.png";
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
  CircularProgress
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authError = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthLoading);
  const [login] = useLoginMutation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Show error message if auth fails
  useEffect(() => {
    if (authError) {
      setErrorMessage(authError);
    }
  }, [authError]);

  const handleLogin = async () => {
    setErrorMessage("");
    console.log('🔄 Starting login process...');

    if (!email || !password) {
      console.log('❌ Validation failed: Email or password is empty');
      setErrorMessage("Vui lòng nhập email và mật khẩu");
      return;
    }

    console.log('📧 Attempting login with email:', email);

    try {
      const result = await login({ email, password }).unwrap();
      console.log('✅ Login successful:', result);
    } catch (error) {
      console.error('❌ Login failed:', error);
      setErrorMessage(error.data?.message || "Tài khoản hoặc mật khẩu không đúng!");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", position: "relative" }}>
      <IconButton
        component={RouterLink}
        to="/"
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1,
          bgcolor: "white",
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.9)",
          },
        }}
      >
        <ArrowBack />
      </IconButton>

      {/* Left column */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#fffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ maxWidth: "60%", height: "auto" }}
        />
      </Box>

      {/* Right column */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <Zoom in={true}>
          <Box
            sx={{
              width: 360,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Fade in={true} timeout={800}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                Đăng nhập
              </Typography>
            </Fade>

            <Fade in={true} timeout={1000}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                disabled={isLoading}
                error={!!errorMessage}
              />
            </Fade>

            <Fade in={true} timeout={1200}>
              <TextField
                label="Mật khẩu"
                variant="outlined"
                fullWidth
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPass(!showPass)} 
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                disabled={isLoading}
                error={!!errorMessage}
              />
            </Fade>

            {/* Error message */}
            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {errorMessage}
              </Typography>
            )}

            <Fade in={true} timeout={1400}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FormControlLabel 
                  control={<Checkbox disabled={isLoading} />} 
                  label="Ghi nhớ đăng nhập" 
                />
                <Button
                  component={RouterLink}
                  to="/forgot-password"
                  disabled={isLoading}
                  sx={{ textTransform: "none" }}
                >
                  Quên mật khẩu?
                </Button>
              </Box>
            </Fade>

            <Fade in={true} timeout={1600}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleLogin}
                disabled={isLoading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  backgroundColor: "#16977D",
                  "&:hover": {
                    backgroundColor: "#12725f",
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </Fade>

            <Fade in={true} timeout={1800}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Chưa có tài khoản?{" "}
                </Typography>
                <Button
                  component={RouterLink}
                  to="/register"
                  disabled={isLoading}
                  sx={{
                    textTransform: "none",
                    color: "#16977D",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Đăng ký ngay
                </Button>
              </Box>
            </Fade>
          </Box>
        </Zoom>
      </Box>
    </Box>
  );
}
