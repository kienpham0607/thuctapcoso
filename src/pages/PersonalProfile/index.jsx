import React, { useState } from 'react';
import GpaProgressCircle from '../../components/GpaProgressCircle';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Divider,
  Typography,
  Fade,
  Zoom
} from '@mui/material';
import { 
  Add as AddIcon, 
  Close as CloseIcon, 
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  LocationOn as LocationOnIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme
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

function PersonalProfile() {
  // Function to delete a semester
  const deleteSemester = (semesterId) => {
    setSemesters(semesters.filter(semester => semester.id !== semesterId));
  };
  const [semesters, setSemesters] = useState([
    {
      id: 1,
      title: 'Semester 1',
      gpa: 0.0,
      courses: Array(5).fill().map((_, i) => ({
        id: i + 1,
        courseName: '',
        credits: '',
        grade: '',
      }))
    },
    {
      id: 2,
      title: 'Semester 2',
      gpa: 0.0,
      courses: Array(4).fill().map((_, i) => ({ 
        id: i + 1, 
        courseName: '',
        credits: '', 
        grade: '', 
      }))
    }
  ]);

  // Function to add a new course to a semester
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

  // Function to add a new semester
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

  // Function to delete a course
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

  // Helper function to convert grade to GPA points
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

  // Function to calculate GPA for a semester
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

  // Function to handle credits change
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

  // Function to handle grade change
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

  // Calculate overall GPA
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

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
                sx={{ mb: 4 }}
                onClick={addSemester}
              >
                Add New Semester
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <GpaProgressCircle gpa={parseFloat(calculateOverallGPA())} />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Zoom in={true}>
                <Card sx={{ 
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
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
                      
                      <ListItem sx={{ mb: 2 }}>
                        <ListItemIcon>
                          <GroupIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Study with classmates"
                          secondary="Share knowledge and perspectives"
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <TrendingUpIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Track your progress"
                          secondary="Aim to improve 1% every day"
                        />
                      </ListItem>
                    </List>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography 
                      variant="body1" 
                      align="center" 
                      sx={{ 
                        fontStyle: 'italic',
                        color: theme.palette.primary.main,
                        fontWeight: 500
                      }}
                    >
                      "Small habits lead to big results"
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default PersonalProfile;