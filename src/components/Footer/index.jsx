import React from 'react';
import { Box, Typography, Container } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: '#16977D',
        color: '#fff',
        py: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          <Typography variant="body1" align="center">
            © 2024 Grade Calculator. All rights reserved.
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Contact us: support@gradecalculator.com
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;