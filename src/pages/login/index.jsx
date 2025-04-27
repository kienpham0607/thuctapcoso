import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../contexts/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import googleIcon from "../../assets/google.png"; // Logo Google đa màu
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
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useContext(AuthContext);

  // Chuyển về trang chủ sau khi đăng nhập thành công
  const redirectPath = "/";

  // Nếu đã đăng nhập, chuyển hướng đến trang yêu cầu
  useEffect(() => {
    if (user) {
      navigate(redirectPath);
    }
  }, [user, navigate, redirectPath]);

  const handleLogin = () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Vui lòng nhập email và mật khẩu");
      return;
    }

    if (email === "admin@gmail.com" && password === "123") {
      // Lưu thông tin user với role admin
      const success = login({ email, role: "admin" });

      if (success) {
        console.log("Đăng nhập thành công, chuyển hướng về trang chủ");
        navigate(redirectPath);
      }
    } else {
      setErrorMessage("Tài khoản hoặc mật khẩu không đúng!");
    }
  };

  // xử lý bấm phím enter
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

      {/* Cột trái */}
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

      {/* Cột phải */}
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
            Sign in to continue
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
          />
            </Fade>

            <Fade in={true} timeout={1200}>

          <TextField
            label="Password"
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
                  <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
            </Fade>

          {/* Hiển thị thông báo lỗi nếu có */}
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
            <FormControlLabel control={<Checkbox />} label="Remember me" />
            <Button variant="text" size="small" sx={{ textTransform: "none" }}>
              Forgot password
            </Button>
          </Box>
          </Fade>

          <Fade in={true} timeout={1600}>

          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ textTransform: "none", fontWeight: "bold", mb: 1 }}
          >
            Sign In
          </Button>
          </Fade>

          <Fade in={true} timeout={1800}>

          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <img
              src={googleIcon}
              alt="Google"
              style={{ width: 20, height: 20 }}
            />
            Sign in with Google
          </Button>
          </Fade>

          <Fade in={true} timeout={2000}>

          <Box sx={{ fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <Button
              variant="text"
              size="small"
              sx={{ textTransform: "none", p: 0 }}
              component={RouterLink}
              to="/signup"
            >
              Signup
            </Button>
          </Box>
          </Fade>
        </Box>
        </Zoom>
      </Box>
    </Box>
  );
}
