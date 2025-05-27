import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock
} from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "user",
    agreeTerms: false,
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'agreeTerms' ? checked : value,
    }));
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError("Email không được để trống");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpSent(true);
      setCountdown(300);
      setError("✓ Mã OTP đã được gửi đến email của bạn");
    } catch (err) {
      setError("⚠️ Có lỗi xảy ra khi gửi mã OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      setError("Vui lòng nhập mã OTP");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpVerified(true);
      setError("✓ Xác thực OTP thành công!");
    } catch (err) {
      setError("⚠️ Mã OTP không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      setError("❌ Vui lòng nhập họ và tên");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("❌ Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("❌ Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!formData.agreeTerms) {
      setError("❌ Vui lòng đồng ý với điều khoản dịch vụ");
      return;
    }

    if (!otpVerified) {
      setError("❌ Vui lòng xác thực mã OTP trước khi đăng ký");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setError("✓ Đăng ký thành công! Đang chuyển hướng...");
      
      setTimeout(() => {
        navigate("/register");
      }, 2000);
    } catch (err) {
      setError("⚠️ Có lỗi xảy ra khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #16977D 0%, #0d5c4d 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
        }
      }}
    >
      <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
        <Paper 
          elevation={24}
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ width: 64, height: 64, mb: 2 }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="8" fill="#16977D" />
              <path
                d="M22 12.5C22 10.567 20.433 9 18.5 9C16.567 9 15 10.567 15 12.5C15 14.433 16.567 16 18.5 16C20.433 16 22 14.433 22 12.5Z"
                fill="white"
              />
              <path
                d="M17 19.5C17 17.567 15.433 16 13.5 16C11.567 16 10 17.567 10 19.5C10 21.433 11.567 23 13.5 23C15.433 23 17 21.433 17 19.5Z"
                fill="white"
              />
            </svg>
          </Box>

          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              mb: 3, 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #16977D 0%, #0d5c4d 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Đăng ký tài khoản
          </Typography>

          {error && (
            <Box
              sx={{
                p: 2,
                mb: 3,
                width: '100%',
                borderRadius: 2,
                bgcolor: error.includes('✓') ? 'rgba(46, 125, 50, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                border: 1,
                borderColor: error.includes('✓') ? 'success.main' : 'error.main',
                color: error.includes('✓') ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {error.includes('✓') ? '✓' : '⚠️'} {error.replace(/[✓⚠️❌]\s?/g, '')}
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#16977D' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#16977D',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#16977D',
                  }
                }
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#16977D' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#16977D',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#16977D',
                  }
                }
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#16977D' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? 
                        <VisibilityOff sx={{ color: '#16977D' }} /> : 
                        <Visibility sx={{ color: '#16977D' }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#16977D',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#16977D',
                  }
                }
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#16977D' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#16977D',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#16977D',
                  }
                }
              }}
            />

            <Box sx={{ mt: 3, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <TextField
                    required
                    fullWidth
                    name="otp"
                    label="Mã OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#16977D',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#16977D',
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item>
                  {!otpSent ? (
                    <Button
                      onClick={handleSendOtp}
                      disabled={loading || !formData.email}
                      variant="outlined"
                      sx={{
                        borderColor: '#16977D',
                        color: '#16977D',
                        '&:hover': {
                          borderColor: '#0d5c4d',
                          bgcolor: 'rgba(22, 151, 125, 0.1)',
                        }
                      }}
                    >
                      Gửi mã
                    </Button>
                  ) : !otpVerified ? (
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={loading || !formData.otp}
                      variant="outlined"
                      sx={{
                        borderColor: '#16977D',
                        color: '#16977D',
                        '&:hover': {
                          borderColor: '#0d5c4d',
                          bgcolor: 'rgba(22, 151, 125, 0.1)',
                        }
                      }}
                    >
                      Xác thực
                    </Button>
                  ) : (
                    <Typography 
                      sx={{ 
                        color: '#2e7d32',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      ✓ Đã xác thực
                    </Typography>
                  )}
                </Grid>
              </Grid>

              {countdown > 0 && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 1, 
                    display: 'block',
                    color: '#666'
                  }}
                >
                  Có thể gửi lại sau: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                </Typography>
              )}
            </Box>

            <FormControl 
              fullWidth 
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#16977D',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#16977D',
                  }
                }
              }}
            >
              <InputLabel id="accountType-label">Loại tài khoản</InputLabel>
              <Select
                labelId="accountType-label"
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                label="Loại tài khoản"
              >
                <MenuItem value="user">Độc giả</MenuItem>
                <MenuItem value="journalist">Tác giả</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  sx={{
                    color: '#16977D',
                    '&.Mui-checked': {
                      color: '#16977D',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  Tôi đồng ý với{' '}
                  <Link 
                    to="/terms" 
                    style={{ 
                      color: '#16977D',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Điều khoản dịch vụ
                  </Link>
                  {' '}và{' '}
                  <Link 
                    to="/privacy" 
                    style={{ 
                      color: '#16977D',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Chính sách bảo mật
                  </Link>
                </Typography>
              }
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !otpVerified}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#16977D',
                color: 'white',
                height: 48,
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#0d5c4d',
                },
                '&:disabled': {
                  bgcolor: '#ccc',
                }
              }}
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </Button>

            <Divider 
              sx={{ 
                my: 3,
                '&::before, &::after': {
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  px: 2,
                }}
              >
                Hoặc đăng ký với
              </Typography>
            </Divider>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  sx={{
                    textTransform: 'none',
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.87)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.02)',
                    }
                  }}
                >
                  Google
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  sx={{
                    textTransform: 'none',
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.87)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.02)',
                    }
                  }}
                >
                  Facebook
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2">
                Đã có tài khoản?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#16977D',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Đăng nhập
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
