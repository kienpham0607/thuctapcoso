import React, { useState, useEffect } from 'react';
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
  ListItemText,
  CircularProgress
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
import { getUserProfileApi, updateUserProfileApi } from '../../apis/authApi'; // Import API calls
import { getGpaPerformanceApi, createGpaEntryApi, getUserGpaEntriesApi, updateGpaEntryApi, deleteGpaEntryApi } from '../../apis/gpaApi'; // Import GPA API calls
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, logout } from '../../features/auth/authSlice';

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

// Helper function to convert score10 to gpa4 (matching backend logic if possible)
const score10ToGpa4 = (score10) => {
  if (score10 === '' || isNaN(score10)) return 0;
  const score = parseFloat(score10);
  if (score >= 9) return 4.0;
  if (score >= 8) return 3.5;
  if (score >= 7) return 3.0;
  if (score >= 6) return 2.5;
  if (score >= 5) return 2.0;
  if (score >= 4) return 1.5;
  return 0;
};

function PersonalProfile() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated); // Get authentication status
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gpaPerformanceData, setGpaPerformanceData] = useState([]); // State for GPA performance data

  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  const dispatch = useDispatch();

  // Function to fetch GPA performance data for the chart
  const fetchGpaPerformance = async () => {
    try {
      console.log('🔄 Fetching GPA performance data...');
      const response = await getGpaPerformanceApi();

      // Check for 401 specifically
      if (response && response.status === 401) {
        console.error('❌ Fetching GPA performance data failed: Unauthorized. Token expired?');
        setSnackbarMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        dispatch(logout());
        return;
      }

      if (response.success && Array.isArray(response.data)) {
        console.log('✅ GPA performance data fetched:', response.data);
        setGpaPerformanceData(response.data);
      } else {
        console.error('❌ Failed to fetch GPA performance data:', response.message || 'Invalid response format');
        setSnackbarMessage('Lỗi khi tải dữ liệu biểu đồ GPA: ' + (response.message || 'Không rõ lỗi'));
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('❌ Error calling fetchGpaPerformance:', error);
      setSnackbarMessage('Lỗi kết nối khi tải dữ liệu biểu đồ GPA: ' + error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      // This fetch doesn't block main loading state, handle separately if needed
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfileApi();
        if (response.success) {
          setProfileData(response.data);
          setFormData({
            fullName: response.data.fullName || '',
            email: response.data.email || '',
          });
        } else {
          setSnackbarMessage('Lỗi khi tải hồ sơ: ' + (response.message || 'Không rõ lỗi'));
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage('Lỗi kết nối khi tải hồ sơ: ' + error.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        // If 401 error, dispatch logout
        if (error.message && error.message.includes('401')) {
          dispatch(logout());
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchGpaEntries = async () => {
      try {
        console.log('🔄 Fetching GPA entries...');
        // Assuming getUserGpaEntriesApi returns { success: boolean, data: GpaEntry[] }
        const response = await getUserGpaEntriesApi();

        // Check for 401 specifically
        if (response && response.status === 401) {
          console.error('❌ Fetching GPA entries failed: Unauthorized. Token expired?');
          setSnackbarMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          dispatch(logout()); // Dispatch logout
          setLoading(false);
          return; // Stop process
        }

        if (response.success && Array.isArray(response.data)) {
          console.log('✅ GPA entries fetched:', response.data);
          // Transform backend data into frontend state structure
          const groupedBySemester = response.data.reduce((acc, entry) => {
            const semesterName = entry.semester || 'Unnamed Semester';
            if (!acc[semesterName]) {
              acc[semesterName] = {
                id: `semester-${semesterName.replace(/\s+/g, '-').toLowerCase()}`, // Generate stable ID
                title: semesterName,
                gpa: 0,
                courses: []
              };
            }
            acc[semesterName].courses.push({
              ...entry,
              score10: String(entry.score10), // Ensure score10 is string for input value
              status: 'existing' // Mark as existing
            });
            return acc;
          }, {});

          // Convert grouped data back to array and calculate semester GPAs
          const semestersArray = Object.values(groupedBySemester).map(semester => ({
            ...semester,
            gpa: calculateSemesterGPA(semester.courses) // Calculate GPA for the semester
          })).sort((a, b) => a.title.localeCompare(b.title)); // Sort semesters alphabetically

          setSemesters(semestersArray);

        } else {
          console.error('❌ Failed to fetch GPA entries:', response.message || 'Invalid response format');
          setSnackbarMessage('Lỗi khi tải dữ liệu điểm: ' + (response.message || 'Không rõ lỗi'));
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error('❌ Error calling fetchGpaEntries:', error);
        setSnackbarMessage('Lỗi kết nối khi tải dữ liệu điểm: ' + error.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        // Set loading to false only after all initial fetches are done
        // setLoading(false); // This will be moved below
      }
    };

    // Fetch profile, GPA performance, and GPA entries on mount or auth change
    const loadInitialData = async () => {
      setLoading(true);
      await fetchProfile();
      await fetchGpaPerformance(); // Call the now externally defined function
      await fetchGpaEntries();
      setLoading(false);
    };

    loadInitialData();

  }, [isAuthenticated]); // Depend on isAuthenticated, fetchGpaPerformance (add if necessary)

  const [semesters, setSemesters] = useState(() => {
    const savedData = localStorage.getItem('semestersData');
    // Update initial state structure to use score10
    return savedData ? JSON.parse(savedData).map(s => ({
      ...s,
      courses: s.courses.map(c => ({ ...c, score10: c.grade || '' })) // Assuming old data used 'grade'
    })) : [];
  });

  const deleteSemester = (semesterId) => {
    setSemesters(semesters.filter(semester => semester.id !== semesterId));
  };

  const addCourse = (semesterId) => {
    const updatedSemesters = semesters.map(semester => {
      if (semester.id === semesterId) {
        const newCourse = {
          id: Date.now(), // Use timestamp for unique ID
          courseName: '',
          credits: '',
          score10: '', // Use score10
          status: 'new' // Mark as new
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
          courses: semester.courses.map(course => {
            if (course.id === courseId) {
              return { ...course, status: 'deleted' }; // Mark as deleted
            }
            return course;
          })
        };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };

  // Update GPA calculation functions to use score10
  const calculateSemesterGPA = (courses) => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      // Use score10 and convert to gpa4 for calculation
      if (course.credits && course.score10 !== '' && !isNaN(course.credits) && !isNaN(course.score10)) {
        const credits = parseFloat(course.credits);
        const gpa4 = score10ToGpa4(course.score10);
        totalPoints += credits * gpa4;
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
            return { ...course, credits: newCredits, status: course.status === 'existing' ? 'modified' : course.status };
          }
          return course;
        });
        return {
          ...semester,
          courses: updatedCourses,
          gpa: calculateSemesterGPA(updatedCourses) // Recalculate semester GPA
        };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };

  // Update handler for score10 change
  const handleScore10Change = (semesterId, courseId, newScore10) => {
    const updatedSemesters = semesters.map(semester => {
      if (semester.id === semesterId) {
        const updatedCourses = semester.courses.map(course => {
          if (course.id === courseId) {
            return { ...course, score10: newScore10, status: course.status === 'existing' ? 'modified' : course.status };
          }
          return course;
        });
        return {
          ...semester,
          courses: updatedCourses,
          gpa: calculateSemesterGPA(updatedCourses) // Recalculate semester GPA
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
        // Use score10 and convert to gpa4 for calculation
        if (course.credits && course.score10 !== '' && !isNaN(course.credits) && !isNaN(course.score10)) {
          const credits = parseFloat(course.credits);
          const gpa4 = score10ToGpa4(course.score10);
          totalPoints += credits * gpa4;
          totalCredits += credits;
        }
      });
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      // 1. Save User Profile Data (if needed)
      const updateProfileData = { ...formData };
      console.log('🔄 Saving profile changes...', updateProfileData);
      const profileResponse = await updateUserProfileApi(updateProfileData);
      
      // Check for 401 specifically after profile update
      if (profileResponse && profileResponse.status === 401) {
        console.error('❌ Profile update failed: Unauthorized. Token expired?');
        setSnackbarMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        dispatch(logout()); // Dispatch logout
        setSaving(false);
        return; // Stop process
      }

      if (!profileResponse.success) {
        // Handle other profile update errors
        setSnackbarMessage('Lỗi khi cập nhật hồ sơ: ' + (profileResponse.message || 'Không rõ lỗi'));
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        setSaving(false);
        return; // Stop if profile update fails
      }

      // 2. Process GPA Entries based on status
      console.log('🔄 Processing GPA entries...');
      const semestersToSave = []; // To build the next state after saving

      for (const semester of semesters) {
        const updatedCourses = [];

        for (const course of semester.courses) {
          if (course.status === 'deleted') {
            if (course._id) {
              // Call DELETE API for existing entries marked as deleted
              try {
                console.log(`Deleting GPA entry with ID: ${course._id}`);
                const deleteResponse = await deleteGpaEntryApi(course._id);
                if (deleteResponse && deleteResponse.status === 401) {
                  console.error(`❌ Deleting GPA entry ${course.courseName} failed: Unauthorized. Token expired?`);
                  setSnackbarMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                  setSnackbarSeverity('error');
                  setOpenSnackbar(true);
                  dispatch(logout());
                  setSaving(false);
                  return;
                }
                if (!deleteResponse.success) {
                  console.error(`❌ Failed to delete GPA entry ${course.courseName}: ${deleteResponse.message}`);
                  setSnackbarMessage(`Lỗi khi xóa môn ${course.courseName}: ${deleteResponse.message || 'Không rõ lỗi'}`);
                  setSnackbarSeverity('error');
                  setOpenSnackbar(true);
                } else {
                  console.log(`✅ GPA entry deleted: ${course.courseName}`);
                  // Don't add to updatedCourses - it's deleted
                }
              } catch (error) {
                console.error(`❌ Error calling deleteGpaEntryApi for ${course.courseName}:`, error);
                setSnackbarMessage(`Lỗi kết nối khi xóa môn ${course.courseName}: ${error.message}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
              }
            } else {
              // If status is 'deleted' but no _id, it was a new entry deleted before saving. Just drop it.
              console.log(`Dropping new GPA entry marked for deletion: ${course.courseName}`);
              // Don't add to updatedCourses
            }
          } else if (course.status === 'new') {
            // Call POST API for new entries
            if (!course.courseName || course.credits === '' || course.score10 === '' || isNaN(parseFloat(course.credits)) || isNaN(parseFloat(course.score10))) {
              console.warn(`Skipping incomplete new course: ${course.courseName || 'Unnamed Course'}`);
              continue; // Skip incomplete new entries
            }

            const gpaEntryData = {
              courseName: course.courseName,
              score10: parseFloat(course.score10),
              credits: parseFloat(course.credits),
              semester: semester.title,
            };
            try {
              console.log(`Creating new GPA entry: ${course.courseName}`, gpaEntryData);
              const gpaResponse = await createGpaEntryApi(gpaEntryData);

              if (gpaResponse && gpaResponse.status === 401) {
                console.error(`❌ Creating GPA entry ${course.courseName} failed: Unauthorized. Token expired?`);
                setSnackbarMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                dispatch(logout());
                setSaving(false);
                return;
              }

              if (gpaResponse.success && gpaResponse.data) {
                console.log('✅ GPA entry created:', gpaResponse.data);
                // Add to updatedCourses with new _id and status 'existing'
                updatedCourses.push({ ...course, _id: gpaResponse.data._id, status: 'existing' });
              } else {
                console.error(`❌ Failed to create GPA entry ${course.courseName}: ${gpaResponse.message}`);
                setSnackbarMessage(`Lỗi khi lưu môn ${course.courseName}: ${gpaResponse.message || 'Không rõ lỗi'}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                // Keep the course in state with original status
                updatedCourses.push(course);
              }
            } catch (error) {
              console.error(`❌ Error calling createGpaEntryApi for ${course.courseName}:`, error);
              setSnackbarMessage(`Lỗi kết nối khi lưu môn ${course.courseName}: ${error.message}`);
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
              // Keep the course in state with original status
              updatedCourses.push(course);
            }
          } else if (course.status === 'modified') {
            // Call PUT API for modified entries
            if (!course._id) {
              console.warn(`Skipping modified course without ID: ${course.courseName}`);
              updatedCourses.push(course); // Keep in state if no ID
              continue;
            }
            if (!course.courseName || course.credits === '' || course.score10 === '' || isNaN(parseFloat(course.credits)) || isNaN(parseFloat(course.score10))) {
              console.warn(`Skipping incomplete modified course: ${course.courseName || 'Unnamed Course'}`);
              updatedCourses.push(course); // Keep in state if incomplete
              continue;
            }

            const gpaEntryData = {
              courseName: course.courseName,
              score10: parseFloat(course.score10),
              credits: parseFloat(course.credits),
              semester: semester.title,
            };
            try {
              console.log(`Updating GPA entry with ID: ${course._id}`, gpaEntryData);
              // Assuming updateGpaEntryApi is PUT /api/gpa/:id
              const gpaResponse = await updateGpaEntryApi(course._id, gpaEntryData);

              if (gpaResponse && gpaResponse.status === 401) {
                console.error(`❌ Updating GPA entry ${course.courseName} failed: Unauthorized. Token expired?`);
                setSnackbarMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                dispatch(logout());
                setSaving(false);
                return;
              }

              if (gpaResponse.success && gpaResponse.data) {
                console.log('✅ GPA entry updated:', gpaResponse.data);
                // Add to updatedCourses with status 'existing'
                updatedCourses.push({ ...course, status: 'existing' });
              } else {
                console.error(`❌ Failed to update GPA entry ${course.courseName}: ${gpaResponse.message}`);
                setSnackbarMessage(`Lỗi khi cập nhật môn ${course.courseName}: ${gpaResponse.message || 'Không rõ lỗi'}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                // Keep the course in state with original status
                updatedCourses.push(course);
              }
            } catch (error) {
              console.error(`❌ Error calling updateGpaEntryApi for ${course.courseName}:`, error);
              setSnackbarMessage(`Lỗi kết nối khi cập nhật môn ${course.courseName}: ${error.message}`);
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
              // Keep the course in state with original status
              updatedCourses.push(course);
            }
          } else {
            // Status is 'existing' - no action needed for saving
            updatedCourses.push(course); // Keep in the next state
          }
        }

        // Only add the semester to the next state if it still has courses after processing deletions
        if (updatedCourses.length > 0) {
          // Recalculate GPA for the semester based on the updated courses list
          const updatedSemester = { ...semester, courses: updatedCourses, gpa: calculateSemesterGPA(updatedCourses) };
          semestersToSave.push(updatedSemester);
        }
      }

      // Update the frontend state with the results of the save operation
      setSemesters(semestersToSave);

      setSnackbarMessage('Đã lưu thay đổi!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // After saving, refetch the performance data to update the chart
      fetchGpaPerformance();

    } catch (error) {
      // This catch will handle network errors or other unexpected issues not returning 401 status
      console.error('❌ Error in handleSaveChanges (general catch):', error);
      setSnackbarMessage('Lỗi chung khi lưu thay đổi: ' + error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);

    } finally {
      setSaving(false);
    }
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
                    performanceData={gpaPerformanceData}
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

                    {semester.courses
                        .filter(course => course.status !== 'deleted') // Filter out deleted courses for rendering
                        .map((course) => (
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
                              value={course.score10}
                              onChange={(e) => handleScore10Change(semester.id, course.id, e.target.value)}
                              displayEmpty
                              renderValue={(selected) => {
                                if (selected === '') {
                                  return <Typography color="text.secondary">Score 10</Typography>;
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
                  onClick={handleSaveChanges}
                  disabled={saving || loading}
                  sx={{
                    bgcolor: '#16977D',
                    '&:hover': {
                      bgcolor: '#12725f'
                    }
                  }}
                >
                  {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
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
                        <strong>Enter Details:</strong> For each course, input the course name, credits, and score10.
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
                        • Regularly update your scores to maintain accurate GPA calculations
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
                        • Take advantage of practice tests to improve your scores
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Personal Information Section */}
          {profileData && (
            <Paper
              sx={{
                p: 4,
                mb: 4,
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
                Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    variant="outlined"
                    disabled={loading || saving}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    disabled={true}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}
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