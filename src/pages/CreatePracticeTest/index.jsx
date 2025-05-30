import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Grid
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const CreatePracticeTestPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid divider' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Create New Practice Test
          </Typography>
          <Button color="inherit" startIcon={<Cancel />} sx={{ mr: 1 }}>Cancel</Button>
          <Button variant="contained" startIcon={<Save />} sx={{ bgcolor: '#16977D', '&:hover': { bgcolor: '#137f6a' } }}>Save Test</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="practice test tabs">
          <Tab label="Basic Information" {...a11yProps(0)} />
          <Tab label={`Questions (0)`} {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={activeTab} index={0}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid divider' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Test Information
          </Typography>
          <TextField
            label="Test Title"
            placeholder="Enter test title..."
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Test Description"
            placeholder="Describe the test content and objectives..."
            fullWidth
            margin="normal"
            multiline
            rows={4}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time Limit (minutes)"
                placeholder="30"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Passing Score (%)"
                placeholder="70"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        {/* Questions Content */}
        <Typography variant="h6">Questions Section</Typography>
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        {/* Settings Content */}
        <Typography variant="h6">Settings Section</Typography>
      </TabPanel>
    </Box>
  );
};

export default CreatePracticeTestPage; 