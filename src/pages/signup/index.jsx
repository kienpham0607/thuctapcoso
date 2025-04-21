import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Fade,
  Zoom
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Person, Email, Lock, ArrowBack } from "@mui/icons-material";
import logo from "../../assets/logo.png";
import googleIcon from "../../assets/google.png";

export default function SignUpPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign up submitted!");
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
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: 360,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Fade in={true} timeout={800}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Create an account
            </Typography>
          </Fade>

          <Fade in={true} timeout={1000}>

          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
          </Fade>

          <Fade in={true} timeout={1200}>

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          </Fade>

          <Fade in={true} timeout={1400}>

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            required
            type="password"
            helperText="Must be at least 8 characters"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
          </Fade>

          <Fade in={true} timeout={1600}>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ textTransform: "none", fontWeight: "bold", mt: 1, mb: 1 }}
          >
            Create Account
          </Button>
          </Fade>

          <Fade in={true} timeout={1800}>

          <Button
            variant="outlined"
            fullWidth
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
            Sign up with Google
          </Button>
          </Fade>

          <Fade in={true} timeout={2000}>

          <Box sx={{ fontSize: "0.9rem", textAlign: "center" }}>
            Already have an account?{" "}
            <Button
              variant="text"
              size="small"
              sx={{ textTransform: "none", p: 0 }}
              component={RouterLink}
              to="/admin/login"
            >
              Sign in
            </Button>
          </Box>
          </Fade>
          </Box>
        </Zoom>
      </Box>
    </Box>
  );
}
