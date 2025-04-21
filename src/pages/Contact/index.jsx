import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Link,
  ThemeProvider,
  createTheme,
  styled,
  Fade,
  Zoom
} from '@mui/material';

// Tạo theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#16977D',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Box xanh "Looking for help?"
const GreenBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: '16px',
  borderRadius: '4px',
  marginTop: '24px',
  maxWidth: '300px',
}));

export default function ContactPage() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ px: { xs: 2, md: 8 }, py: 6 }}>
        <Typography
          variant="h5"
          align="center"
          color="primary"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 5 }}
        >
          Contact Us
        </Typography>

        <Grid
          container
          spacing={6}
          justifyContent="center"      // ✅ Căn giữa theo chiều ngang
          alignItems="flex-start"
          maxWidth="md"                // ✅ Giới hạn chiều rộng tối đa
          margin="0 auto"              // ✅ Đặt lề auto để căn giữa
        >
          {/* LEFT SIDE: Get in Touch */}
          <Grid item xs={12} md={6}>
            <Zoom in={true}>
              <Box sx={{ maxWidth: 400 }}>
              <Fade in={true} timeout={800}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Get in Touch
                </Typography>
              </Fade>
              <Fade in={true} timeout={1000}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                Have questions, feedback, or suggestions? We'd love to hear from you.
                Fill out the form and our team will get back to you as soon as possible.
                </Typography>
              </Fade>

              <Fade in={true} timeout={1200}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    contract@gmail.com
                  </Typography>
                </Box>
              </Fade>

              <Fade in={true} timeout={1400}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Office Hours
                  </Typography>
                  <Typography variant="body1">
                    Monday - Friday: 9am - 5pm
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Saturday: 10am - 2pm
                  </Typography>
                </Box>
              </Fade>

              <Fade in={true} timeout={1600}>
                <GreenBox>
                <Typography variant="body1" fontWeight="bold">
                  Looking for help?
                </Typography>
                <Typography variant="body2">
                  Check out our{' '}
                  <Link href="/about" color="inherit" underline="always">
                    About page
                  </Link>{' '}
                  for details on how to use Grade Calculator features.
                </Typography>
                </GreenBox>
              </Fade>
              </Box>
            </Zoom>
          </Grid>

          {/* RIGHT SIDE: Form */}
          <Grid item xs={12} md={6}>
            <Zoom in={true}>
              <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                border: '1px solid #ccc',
              }}
            >
              <Fade in={true} timeout={800}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Send a Message
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    We'll get back to you as soon as possible
                  </Typography>
                </Box>
              </Fade>

              <Fade in={true} timeout={1000}>
                <Box component="form" noValidate>
                {['Name', 'Email', 'Subject'].map((label) => (
                  <Box key={label} sx={{ mb: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      {label}
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder={`Your ${label.toLowerCase()}`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                ))}

                <Typography variant="body1" gutterBottom>
                  Message
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Your message"
                  variant="outlined"
                  multiline
                  rows={4}
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                >
                  Send a Message
                </Button>
                </Box>
              </Fade>
              </Paper>
            </Zoom>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
