import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GpaProgressCircle from '../../components/GpaProgressCircle';
import GPAChart from '../../components/GPAChart';
import {
  Container,
  Paper,
  Grid,
  TextField,
  IconButton,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
  Typography,
  Fade,
  Zoom,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
  RadioButtonChecked as RadioButtonCheckedIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#16977D',
      light: '#1aad90',
      dark: '#12725f',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#9a0036',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      letterSpacing: 0.5,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

const guideFeatures = [
  {
    icon: '📊',
    title: 'Performance Analytics',
    desc: 'Track your GPA trends'
  },
  {
    icon: '🎯',
    title: 'Set Goals',
    desc: 'Define your target GPA'
  },
  {
    icon: '📋',
    title: 'Semester Planning',
    desc: 'Plan your course load'
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    desc: 'Monitor improvements'
  }
];

function PersonalProfile() {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const [semesters, setSemesters] = useState(() => {
    const savedData = localStorage.getItem('semestersData');
    return savedData ? JSON.parse(savedData) : [];
  });

  const deleteSemester = (semesterId) => {
    setSemesters(semesters.filter(semester => semester.id !== semesterId));
  };

  const addCourse = (semesterId) => {
    const updatedSemesters = semesters.map(semester => {
      if (semester.id === semesterId) {
        const newCourse = {
          id: semester.courses.length + 1,
          courseName: '',
          credits: '',
          grade: '',
        };
        return {
          ...semester,
          courses: [...semester.courses, newCourse]
        };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };

  const addSemester = () => {
    const newSemesterId = semesters.length + 1;
    const newSemester = {
      id: newSemesterId,
      title: `Semester ${newSemesterId}`,
      gpa: 0.0,
      courses: []
    };
    setSemesters([...semesters, newSemester]);
  };

  const deleteCourse = (semesterId, courseId) => {
    const updatedSemesters = semesters.map(semester => {
      if (semester.id === semesterId) {
        return {
          ...semester,
          courses: semester.courses.filter(course => course.id !== courseId)
        };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };

  const gradeToPoints = (grade) => {
    const points = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };
    return points[grade] || 0;
  };

  const calculateSemesterGPA = (courses) => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.credits && course.grade) {
        const credits = parseFloat(course.credits);
        const points = gradeToPoints(course.grade);
        totalPoints += credits * points;
        totalCredits += credits;
      }
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const handleCreditsChange = (semesterId, courseId, newCredits) => {
    const updatedSemesters = semesters.map(semester => {
      if (semester.id === semesterId) {
        const updatedCourses = semester.courses.map(course => {
          if (course.id === courseId) {
            return { ...course, credits: newCredits };
          }
          return course;
        });
        return {
          ...semester,
          courses: updatedCourses,
          gpa: calculateSemesterGPA(updatedCourses)
        };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };

  const handleGradeChange = (semesterId, courseId, newGrade) => {
    const updatedSemesters = semesters.map(semester => {
      if (semester.id === semesterId) {
        const updatedCourses = semester.courses.map(course => {
          if (course.id === courseId) {
            return { ...course, grade: newGrade };
          }
          return course;
        });
        return {
          ...semester,
          courses: updatedCourses,
          gpa: calculateSemesterGPA(updatedCourses)
        };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };

  const calculateOverallGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    semesters.forEach(semester => {
      semester.courses.forEach(course => {
        if (course.credits && course.grade) {
          const credits = parseFloat(course.credits);
          const points = gradeToPoints(course.grade);
          totalPoints += credits * points;
          totalCredits += credits;
        }
      });
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        flexGrow: 1, 
        backgroundColor: theme.palette.background.default, 
        minHeight: '100vh' 
      }}>
        <Box sx={{ 
          backgroundColor: theme.palette.primary.main, 
          padding: '20px',
          color: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <Container maxWidth="lg">
            <Box display="flex" alignItems="center" gap={2}>
              <SchoolIcon sx={{ fontSize: 32 }} />
              <Typography variant="h5" fontWeight="bold">
                Personal Profile
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* GPA Chart */}
            <Grid item xs={12}>
              <Zoom in={true}>
                <Box id="gpa-chart">
                  <GPAChart
                    semesters={semesters}
                    calculateOverallGPA={calculateOverallGPA}
                  />
                </Box>
              </Zoom>
            </Grid>

            {/* Semester List */}
            <Grid item xs={12} md={8}>
              {semesters.map((semester, index) => (
                <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }} key={semester.id}>
                  <Paper
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      borderRadius: '16px',
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                      <Typography variant="h6" color="primary">
                        {semester.title}
                      </Typography>
                      <IconButton
                        onClick={() => deleteSemester(semester.id)}
                        sx={{
                          color: '#D32F2F',
                          backgroundColor: 'rgba(211, 47, 47, 0.12)',
                          borderRadius: '50%',
                          padding: '8px',
                          marginLeft: '8px',
                          '&:hover': {
                            backgroundColor: '#D32F2F',
                            color: '#fff',
                          }
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {semester.courses.map((course) => (
                      <Fade in={true} key={course.id}>
                        <Box 
                          display="flex" 
                          alignItems="center" 
                          mb={2}
                          sx={{
                            backgroundColor: 'rgba(0,0,0,0.02)',
                            borderRadius: 2,
                            p: 1,
                          }}
                        >
                          <TextField
                            size="small"
                            value={course.courseName}
                            onChange={(e) => {
                              const updatedSemesters = semesters.map(s => {
                                if (s.id === semester.id) {
                                  const updatedCourses = s.courses.map(c => {
                                    if (c.id === course.id) {
                                      return { ...c, courseName: e.target.value };
                                    }
                                    return c;
                                  });
                                  return { ...s, courses: updatedCourses };
                                }
                                return s;
                              });
                              setSemesters(updatedSemesters);
                            }}
                            placeholder="Enter course name"
                            sx={{ 
                              flexGrow: 1,
                              mr: 1,
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                              }
                            }}
                          />
                          
                          <FormControl 
                            size="small" 
                            sx={{ 
                              width: '100px', 
                              mr: 1,
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                              }
                            }}
                          >
                            <Select
                              value={course.grade}
                              onChange={(e) => handleGradeChange(semester.id, course.id, e.target.value)}
                              displayEmpty
                              renderValue={(selected) => {
                                if (selected === '') {
                                  return <Typography color="text.secondary">Grade</Typography>;
                                }
                                return selected;
                              }}
                            >
                              {gradeOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          
                          <TextField
                            size="small"
                            value={course.credits}
                            onChange={(e) => handleCreditsChange(semester.id, course.id, e.target.value)}
                            placeholder="Credits"
                            sx={{ 
                              width: '80px', 
                              mr: 1,
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                              }
                            }}
                          />
                          
                          <IconButton 
                            size="small" 
                            onClick={() => deleteCourse(semester.id, course.id)}
                            sx={{
                              color: 'rgba(0, 0, 0, 0.54)',
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              borderRadius: '50%',
                              padding: '4px',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                color: 'rgba(0, 0, 0, 0.87)',
                              }
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Fade>
                    ))}

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                      <Typography variant="body1" color="primary" fontWeight="medium">
                        Semester {semester.id} GPA: {semester.gpa.toFixed(2)}
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        size="small"
                        onClick={() => addCourse(semester.id)}
                      >
                        Add Course
                      </Button>
                    </Box>
                  </Paper>
                </Zoom>
              ))}

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  size="large"
                  onClick={addSemester}
                >
                  Add New Semester
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={() => {
                    try {
                      localStorage.setItem('semestersData', JSON.stringify(semesters));
                      setSnackbarMessage('Data saved successfully!');
                      setSnackbarSeverity('success');
                      setOpenSnackbar(true);
                    } catch (error) {
                      setSnackbarMessage('Failed to save data. Please try again.');
                      setSnackbarSeverity('error');
                      setOpenSnackbar(true);
                    }
                  }}
                  sx={{
                    bgcolor: '#16977D',
                    '&:hover': {
                      bgcolor: '#12725f'
                    }
                  }}
                >
                  Save Changes
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }} className="gpa-progress-circle">
                <GpaProgressCircle gpa={parseFloat(calculateOverallGPA())} />
              </Box>
            </Grid>
            
            {/* Personal Guide */}
            <Grid item xs={12} md={4}>
              <Zoom in={true}>
                <Card sx={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
                  mb: 3,
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
                      Study Smart Tips
                    </Typography>
                    <List>
                      <ListItem sx={{ mb: 2 }}>
                        <ListItemIcon>
                          <RadioButtonCheckedIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Stay consistent with your study schedule"
                          sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                        />
                      </ListItem>
                      
                      <ListItem sx={{ mb: 2 }}>
                        <ListItemIcon>
                          <RadioButtonCheckedIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Review your notes after every class"
                          sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                        />
                      </ListItem>
                      
                      <ListItem sx={{ mb: 2 }}>
                        <ListItemIcon>
                          <AccessTimeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Use Pomodoro technique"
                          secondary="25 mins study + 5 mins break"
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <GroupIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Study with classmates"
                          secondary="Share knowledge and perspectives"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Zoom>

              {/* Personal Guide Card */}
              <Zoom in={true}>
                <Card sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}>
                  <Box sx={{
                    backgroundColor: '#16977D',
                    py: 2,
                    px: 3,
                    color: 'white'
                  }}>
                    <Typography variant="h6" fontWeight="bold">
                      Personal Guide
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                      Track your progress
                    </Typography>
                  </Box>
                  <CardContent>
                    {[
                      {
                        icon: '📊',
                        title: 'GPA Analysis',
                        desc: 'View your GPA trend chart and semester performance',
                        onClick: () => {
                          document.getElementById('gpa-chart').scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                          });
                        }
                      },
                      {
                        icon: '✏️',
                        title: 'Course Management',
                        desc: 'Add/edit courses and manage semester grades',
                        onClick: () => {
                          addSemester();
                          setTimeout(() => {
                            window.scrollTo({
                              top: document.body.scrollHeight,
                              behavior: 'smooth'
                            });
                          }, 100);
                        }
                      },
                      {
                        icon: '🎓',
                        title: 'Academic Progress',
                        desc: 'Track your overall academic performance and GPA',
                        onClick: () => {
                          document.querySelector('.gpa-progress-circle').scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                          });
                        }
                      },
                      {
                        icon: '📚',
                        title: 'Study Resources',
                        desc: 'Access practice tests and study materials',
                        onClick: () => {
                          navigate('/practice-test');
                        }
                      }
                    ].map((item, index) => (
                      <Box
                        key={index}
                        onClick={item.onClick}
                        sx={{
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                          p: 2,
                          '&:not(:last-child)': {
                            borderBottom: '1px solid rgba(0,0,0,0.08)'
                          },
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(22, 151, 125, 0.05)',
                            transform: 'translateX(8px)'
                          }
                        }}
                      >
                        <Typography sx={{ fontSize: '24px' }}>
                          {item.icon}
                        </Typography>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.desc}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </Grid>

          {/* User Guide Section */}
          <Box sx={{ mt: 6, mb: 4 }}>
            <Card sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}>
              <Box sx={{
                backgroundColor: '#16977D',
                py: 2,
                px: 3,
                color: 'white'
              }}>
                <Typography variant="h6" fontWeight="bold">
                  Personal Profile Guide
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                  How to use this page effectively
                </Typography>
              </Box>
              <CardContent>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#16977D', fontWeight: 'bold' }}>
                      Managing Your Academic Progress
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Typography component="li" sx={{ mb: 2 }}>
                        <strong>Add Semester:</strong> Click the "Add New Semester" button to create a new semester.
                      </Typography>
                      <Typography component="li" sx={{ mb: 2 }}>
                        <strong>Add Courses:</strong> Within each semester, use "Add Course" to include your courses.
                      </Typography>
                      <Typography component="li" sx={{ mb: 2 }}>
                        <strong>Enter Details:</strong> For each course, input the course name, credits, and grade.
                      </Typography>
                      <Typography component="li">
                        <strong>Track Progress:</strong> View your GPA chart and progress circle for performance tracking.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#16977D', fontWeight: 'bold' }}>
                      Using Profile Features
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Typography component="li" sx={{ mb: 2 }}>
                        <strong>GPA Analysis:</strong> Click to view detailed GPA trends and semester comparisons.
                      </Typography>
                      <Typography component="li" sx={{ mb: 2 }}>
                        <strong>Course Management:</strong> Easily add or modify your course information.
                      </Typography>
                      <Typography component="li" sx={{ mb: 2 }}>
                        <strong>Academic Progress:</strong> Monitor your overall academic performance.
                      </Typography>
                      <Typography component="li">
                        <strong>Study Resources:</strong> Access practice tests and study materials for improvement.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(22, 151, 125, 0.05)', borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: '#16977D', fontWeight: 'bold' }}>
                    Pro Tips:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • Regularly update your grades to maintain accurate GPA calculations
                      </Typography>
                      <Typography variant="body2">
                        • Use the Study Smart Tips section for effective learning strategies
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • Check your progress circle to track your overall performance
                      </Typography>
                      <Typography variant="body2">
                        • Take advantage of practice tests to improve your grades
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiAlert-root': {
            width: '100%',
            maxWidth: '400px',
          }
        }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="standard"
          elevation={0}
          sx={{
            width: '100%',
            fontSize: '1rem',
            alignItems: 'center'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default PersonalProfile;