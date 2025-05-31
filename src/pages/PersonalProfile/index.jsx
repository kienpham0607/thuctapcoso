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
  RadioButtonChecked as RadioButtonCheckedIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getUserProfileApi, updateUserProfileApi } from '../../apis/authApi'; // Import API calls
import { getGpaPerformanceApi, createGpaEntryApi, getUserGpaEntriesApi, updateGpaEntryApi, deleteGpaEntryApi } from '../../apis/gpaApi'; // Import GPA API calls
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, logout } from '../../features/auth/authSlice';
import AddGpaEntryModal from '../../components/AddGpaEntryModal';

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

// Helper functions for grade conversions
const score10ToGpa4 = (score10) => {
  if (score10 === '' || isNaN(score10)) return 0;
  const score = parseFloat(score10);
  if (score >= 8.95) return 4.0;
  if (score >= 8.45) return 3.7;
  if (score >= 7.95) return 3.5;
  if (score >= 6.95) return 3.0;
  if (score >= 6.45) return 2.5;
  if (score >= 5.45) return 2.0;
  if (score >= 4.95) return 1.5;
  if (score >= 3.95) return 1.0;
  return 0;
};

const score10ToLetterGrade = (score10) => {
  if (score10 === '' || isNaN(score10)) return '-';
  const score = parseFloat(score10);
  if (score >= 8.95) return 'A+';
  if (score >= 8.45) return 'A';
  if (score >= 7.95) return 'B+';
  if (score >= 6.95) return 'B';
  if (score >= 6.45) return 'C+';
  if (score >= 5.45) return 'C';
  if (score >= 4.95) return 'D+';
  if (score >= 3.95) return 'D';
  return 'F';
};

// Main component
function PersonalProfile() {
  // State declarations
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [gpaPerformanceData, setGpaPerformanceData] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });
  const [semesters, setSemesters] = useState(() => {
    const savedData = localStorage.getItem('semestersData');
    return savedData ? JSON.parse(savedData).map(s => ({
      ...s,
      isEditing: false,
      courses: s.courses.map(c => ({ ...c, score10: c.grade || '' }))
    })) : [];
  });
  const [addSemesterModalOpen, setAddSemesterModalOpen] = useState(false);

  // Định nghĩa fetchGpaEntries bên trong component để dùng được state và dispatch
  const fetchGpaEntries = async () => {
    try {
      setLoading(true);
      const response = await getUserGpaEntriesApi();
      if (response && response.status === 401) {
        setSnackbarMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        dispatch(logout());
        setLoading(false);
        return;
      }
      if (response.success && Array.isArray(response.data)) {
        const groupedBySemester = response.data.reduce((acc, entry) => {
          const semesterName = entry.semester || 'Unnamed Semester';
          if (!acc[semesterName]) {
            acc[semesterName] = {
              id: `semester-${semesterName.replace(/\s+/g, '-').toLowerCase()}`,
              title: semesterName,
              gpa: 0,
              courses: []
            };
          }
          acc[semesterName].courses.push({
            ...entry,
            score10: String(entry.score10),
            status: 'existing'
          });
          return acc;
        }, {});
        const semestersArray = Object.values(groupedBySemester).map(semester => ({
          ...semester,
          gpa: calculateSemesterGPA(semester.courses)
        })).sort((a, b) => a.title.localeCompare(b.title));
        setSemesters(semestersArray);
      } else {
        setSnackbarMessage('Lỗi khi tải dữ liệu điểm: ' + (response.message || 'Không rõ lỗi'));
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Lỗi kết nối khi tải dữ liệu điểm: ' + error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

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


  const handleEditSemester = (semesterId) => {
    setSemesters(prev =>
      prev.map(semester => ({
        ...semester,
        isEditing: semester.id === semesterId
      }))
    );
  };

  const handleSaveSemester = async (semesterId) => {
    const semesterToSave = semesters.find(s => s.id === semesterId);
    if (!semesterToSave) return;

    try {
      setSaving(true);
      // Xử lý từng course trong semester
      for (const course of semesterToSave.courses) {
        if (course.status === 'deleted' && course._id) {
          await deleteGpaEntryApi(course._id);
        } else if (course.status === 'new') {
          if (course.courseName && course.credits && course.score10) {
            await createGpaEntryApi({
              courseName: course.courseName,
              score10: parseFloat(course.score10),
              credits: parseFloat(course.credits),
              semester: semesterToSave.title,
            });
          }
        } else if (course.status === 'modified' && course._id) {
          await updateGpaEntryApi(course._id, {
            courseName: course.courseName,
            score10: parseFloat(course.score10),
            credits: parseFloat(course.credits),
            semester: semesterToSave.title,
          });
        }
      }
      // Sau khi lưu, reload lại dữ liệu từ backend
      await fetchGpaEntries();
      setSemesters(prev =>
        prev.map(semester =>
          semester.id === semesterId
            ? { ...semester, isEditing: false }
            : semester
        )
      );
      setSnackbarMessage('Đã lưu thay đổi!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Lỗi khi lưu: ' + error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setSaving(false);
    }
  };

  const deleteSemester = async (semesterId) => {
    const semesterToDelete = semesters.find(s => s.id === semesterId);
    if (!semesterToDelete) return;
    try {
      for (const course of semesterToDelete.courses) {
        if (course._id) {
          await deleteGpaEntryApi(course._id);
        }
      }
      setSemesters(prev => prev.filter(s => s.id !== semesterId));
    } catch (error) {
      console.error('Error deleting semester:', error);
    }
  };

  const addCourse = (semesterId) => {
    const updatedSemesters = semesters.map(semester => {
      if (semester.id === semesterId) {
        const newCourse = {
          id: Date.now(), // Use timestamp for unique ID
          courseName: '',
          credits: '',
          score10: '', // Use score10
          status: 'new'
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
      courses: [],
      isEditing: false
    };
    setSemesters([...semesters, newSemester]);
  };

  const deleteCourse = (semesterId, courseId) => {
    setSemesters(prevSemesters =>
      prevSemesters.map(semester => {
        if (semester.id === semesterId) {
          return {
            ...semester,
            courses: semester.courses.filter(course => (course._id && course._id !== courseId) || (!course._id && course.id !== courseId))
          };
        }
        return semester;
      })
    );
  };

  const calculateSemesterGPA = (courses) => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.status !== 'deleted' && course.credits && course.score10 !== '' && !isNaN(parseFloat(course.credits)) && !isNaN(parseFloat(course.score10))) {
        const credits = parseFloat(course.credits);
        const gpa4 = score10ToGpa4(course.score10);
        totalPoints += credits * gpa4;
        totalCredits += credits;
      }
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const handleCourseNameChange = (semesterId, courseId, newName) => {
    setSemesters(prevSemesters =>
      prevSemesters.map(semester => {
        if (semester.id === semesterId) {
          const updatedCourses = semester.courses.map(course => {
            if ((course._id && course._id === courseId) || (!course._id && course.id === courseId)) {
              return { ...course, courseName: newName, status: course._id ? 'modified' : course.status };
            }
            return course;
          });
          return { ...semester, courses: updatedCourses };
        }
        return semester;
      })
    );
  };

  const handleCreditsChange = (semesterId, courseId, newCredits) => {
    setSemesters(prevSemesters =>
      prevSemesters.map(semester => {
        if (semester.id === semesterId) {
          const updatedCourses = semester.courses.map(course => {
            if ((course._id && course._id === courseId) || (!course._id && course.id === courseId)) {
              return { ...course, credits: newCredits, status: course._id ? 'modified' : course.status };
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
      })
    );
  };

  const handleScore10Change = (semesterId, courseId, newScore10) => {
    setSemesters(prevSemesters =>
      prevSemesters.map(semester => {
        if (semester.id === semesterId) {
          const updatedCourses = semester.courses.map(course => {
            if ((course._id && course._id === courseId) || (!course._id && course.id === courseId)) {
              return { ...course, score10: newScore10, status: course._id ? 'modified' : course.status };
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
      })
    );
  };

  const calculateOverallGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    semesters.forEach(semester => {
      semester.courses.forEach(course => {
        if (course.status !== 'deleted' && course.credits && course.score10 !== '' && !isNaN(parseFloat(course.credits)) && !isNaN(parseFloat(course.score10))) {
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

      const updateProfileData = { ...formData };
      console.log('🔄 Saving profile changes...', updateProfileData);
      const profileResponse = await updateUserProfileApi(updateProfileData);

      if (profileResponse && profileResponse.status === 401) {
        console.error('❌ Profile update failed: Unauthorized. Token expired?');
        setSnackbarMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        dispatch(logout());
        setSaving(false);
        return;
      }

      if (!profileResponse.success) {
        setSnackbarMessage('Lỗi khi cập nhật hồ sơ: ' + (profileResponse.message || 'Không rõ lỗi'));
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        setSaving(false);
        return;
      }

      console.log('🔄 Processing GPA entries across all semesters...');
      const semestersToSave = [];

      for (const semester of semesters) {
        const updatedCourses = [];

        for (const course of semester.courses) {
          if (course.status === 'deleted') {
            if (course._id) {
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
                   updatedCourses.push(semester.courses.find(c => c.id === course.id));
                } else {
                  console.log(`✅ GPA entry deleted: ${course.courseName}`);
                }
              } catch (error) {
                console.error(`❌ Error calling deleteGpaEntryApi for ${course.courseName}:`, error);
                setSnackbarMessage(`Lỗi kết nối khi xóa môn ${course.courseName}: ${error.message}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                 updatedCourses.push(semester.courses.find(c => c.id === course.id));
              }
            } else {
              console.log(`Dropping new GPA entry marked for deletion: ${course.courseName}`);
            }
          } else if (course.status === 'new') {
            if (!course.courseName || course.credits === '' || course.score10 === '' || isNaN(parseFloat(course.credits)) || isNaN(parseFloat(course.score10))) {
              console.warn(`Skipping incomplete new course: ${course.courseName || 'Unnamed Course'}`);
              updatedCourses.push(course);
              continue;
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
                updatedCourses.push({ ...course, _id: gpaResponse.data._id, status: 'existing' });
              } else {
                console.error(`❌ Failed to create GPA entry ${course.courseName}: ${gpaResponse.message}`);
                setSnackbarMessage(`Lỗi khi lưu môn ${course.courseName}: ${gpaResponse.message || 'Không rõ lỗi'}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                updatedCourses.push(course);
              }
            } catch (error) {
              console.error(`❌ Error calling createGpaEntryApi for ${course.courseName}:`, error);
              setSnackbarMessage(`Lỗi kết nối khi lưu môn ${course.courseName}: ${error.message}`);
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
              updatedCourses.push(course);
            }
          } else if (course.status === 'modified') {
            if (!course._id) {
              console.warn(`Skipping modified course without ID: ${course.courseName}`);
              updatedCourses.push(course);
              continue;
            }
            if (!course.courseName || course.credits === '' || course.score10 === '' || isNaN(parseFloat(course.credits)) || isNaN(parseFloat(course.score10))) {
              console.warn(`Skipping incomplete modified course: ${course.courseName || 'Unnamed Course'}`);
              updatedCourses.push(course);
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
                console.log(' GPA entry updated:', gpaResponse.data);
                updatedCourses.push({ ...course, status: 'existing' });
              } else {
                console.error(` Failed to update GPA entry ${course.courseName}: ${gpaResponse.message}`);
                setSnackbarMessage(`Lỗi khi cập nhật môn ${course.courseName}: ${gpaResponse.message || 'Không rõ lỗi'}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                updatedCourses.push(course);
              }
            } catch (error) {
              console.error(` Error calling updateGpaEntryApi for ${course.courseName}:`, error);
              setSnackbarMessage(`Lỗi kết nối khi cập nhật môn ${course.courseName}: ${error.message}`);
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
              updatedCourses.push(course);
            }
          } else {
            updatedCourses.push(course);
          }
        }

        if (updatedCourses.length > 0) {
          const updatedSemester = { ...semester, courses: updatedCourses, gpa: calculateSemesterGPA(updatedCourses), isEditing: false };
          semestersToSave.push(updatedSemester);
        }
      }

      setSemesters(semestersToSave);

      setSnackbarMessage('Đã lưu thay đổi!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      fetchGpaPerformance();

    } catch (error) {
      console.error('❌ Error in handleSaveChanges (general catch):', error);
      setSnackbarMessage('Lỗi chung khi lưu thay đổi: ' + error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);

    } finally {
      setSaving(false);
    }
  };

  // Hàm thêm semester mới từ modal
  const handleAddSemesterFromModal = async (entries) => {
    if (!entries || entries.length === 0) return;
    const semesterName = entries[0].semester;
    const newSemesterId = `semester-${semesterName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
    const newSemester = {
      id: newSemesterId,
      title: semesterName,
      gpa: 0.0,
      courses: [],
      isEditing: true
    };
    try {
      for (const course of entries) {
        const response = await createGpaEntryApi({
          courseName: course.courseName,
          score10: course.score10,
          credits: course.credits,
          semester: semesterName
        });
        if (response.success && response.data) {
          newSemester.courses.push({ ...course, _id: response.data._id, status: 'existing' });
        } else {
          console.error(`Failed to create course: ${course.courseName}`, response.message);
        }
      }
      setSemesters(prev => [...prev, newSemester]);
      setAddSemesterModalOpen(false);
    } catch (error) {
      console.error('Error adding semester:', error);
    }
  };

  // Move SemesterCard definition inside PersonalProfile
  const SemesterCard = ({ semester }) => {
    return (
      <Paper sx={{ mb: 3, p: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            {semester.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {semester.isEditing ? (
              <IconButton
                size="small"
                onClick={() => handleSaveSemester(semester.id)}
                sx={{
                  color: 'primary.main',
                  backgroundColor: 'rgba(22, 151, 125, 0.12)',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: '#fff',
                  }
                }}
              >
                <SaveIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton
                size="small"
                onClick={() => handleEditSemester(semester.id)}
                sx={{
                  color: 'primary.main',
                  backgroundColor: 'rgba(22, 151, 125, 0.12)',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: '#fff',
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={() => deleteSemester(semester.id)}
              sx={{
                color: '#D32F2F',
                backgroundColor: 'rgba(211, 47, 47, 0.12)',
                '&:hover': {
                  backgroundColor: '#D32F2F',
                  color: '#fff',
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Column Headers */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2, 
          px: 2,
          py: 1.5,
          backgroundColor: 'rgba(22, 151, 125, 0.08)',
          borderRadius: 1,
          borderBottom: '2px solid rgba(22, 151, 125, 0.2)'
        }}>
          <Typography variant="subtitle2" sx={{ width: '45%', color: 'primary.main', fontWeight: 600 }}>
            Course Name
          </Typography>
          <Typography variant="subtitle2" sx={{ width: '20%', textAlign: 'center', color: 'primary.main', fontWeight: 600 }}>
            Score (0-10)
          </Typography>
          <Typography variant="subtitle2" sx={{ width: '20%', textAlign: 'center', color: 'primary.main', fontWeight: 600 }}>
            Grade
          </Typography>
          <Typography variant="subtitle2" sx={{ width: '15%', textAlign: 'center', color: 'primary.main', fontWeight: 600 }}>
            Credits
          </Typography>
        </Box>
        
        {/* Course list */}
        {semester.courses
          .filter(course => course.status !== 'deleted')
          .map((course) => (
            <Box 
              key={course._id || course.id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1.5, 
                px: 2,
                py: 1.5,
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                }
              }}
            >
              <TextField
                disabled={!semester.isEditing}
                size="small"
                placeholder="Enter course name"
                value={course.courseName || ''}
                onChange={(e) => handleCourseNameChange(semester.id, course._id || course.id, e.target.value)}
                sx={{ 
                  width: '45%',
                  mr: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-input': {
                      color: 'rgba(0, 0, 0, 0.87)',
                      '&::placeholder': {
                        color: 'rgba(0, 0, 0, 0.6)',
                        opacity: 1
                      }
                    },
                    '&.Mui-disabled .MuiOutlinedInput-input': {
                      color: 'rgba(0, 0, 0, 0.87)',
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)'
                    }
                  }
                }}
              />
              <TextField
                disabled={!semester.isEditing}
                size="small"
                type="number"
                placeholder="0-10"
                value={course.score10 || ''}
                onChange={(e) => handleScore10Change(semester.id, course._id || course.id, e.target.value)}
                sx={{ 
                  width: '20%',
                  mr: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-input': {
                      color: 'rgba(0, 0, 0, 0.87)',
                      textAlign: 'center',
                      '&::placeholder': {
                        color: 'rgba(0, 0, 0, 0.6)',
                        opacity: 1
                      }
                    },
                    '&.Mui-disabled .MuiOutlinedInput-input': {
                      color: 'rgba(0, 0, 0, 0.87)',
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)'
                    }
                  }
                }}
                inputProps={{ min: 0, max: 10, step: 0.1 }}
              />
              <Typography sx={{ 
                width: '20%', 
                textAlign: 'center', 
                color: course.score10 ? 'text.primary' : 'text.disabled',
                fontWeight: course.score10 ? 500 : 400
              }}>
                {score10ToLetterGrade(course.score10)}
              </Typography>
              <TextField
                disabled={!semester.isEditing}
                size="small"
                type="number"
                placeholder="Credits"
                value={course.credits || ''}
                onChange={(e) => handleCreditsChange(semester.id, course._id || course.id, e.target.value)}
                sx={{ 
                  width: '15%',
                  mr: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-input': {
                      color: 'rgba(0, 0, 0, 0.87)',
                      textAlign: 'center',
                      '&::placeholder': {
                        color: 'rgba(0, 0, 0, 0.6)',
                        opacity: 1
                      }
                    },
                    '&.Mui-disabled .MuiOutlinedInput-input': {
                      color: 'rgba(0, 0, 0, 0.87)',
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)'
                    }
                  }
                }}
                inputProps={{ min: 0, max: 10, step: 1 }}
              />
              {semester.isEditing && (
                <IconButton
                  size="small"
                  onClick={() => deleteCourse(semester.id, course._id || course.id)}
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
              )}
            </Box>
          ))}
          
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 3,
          pt: 2,
          borderTop: '1px solid rgba(0,0,0,0.12)'
        }}>
          <Typography variant="subtitle1" color="primary" fontWeight="medium">
            Semester GPA: {semester.gpa.toFixed(2)}
          </Typography>
          {semester.isEditing && (
            <Button
              startIcon={<AddIcon />}
              onClick={() => addCourse(semester.id)}
              variant="outlined"
              color="primary"
              size="small"
            >
              Add Course
            </Button>
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
            <>
            <Box sx={{
              backgroundColor: theme.palette.primary.main,
              padding: '20px',
              color: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              mb: 4
            }}>
              <Box display="flex" alignItems="center" gap={2}>
                <SchoolIcon sx={{ fontSize: 32 }} />
                <Typography variant="h5" fontWeight="bold">
                  Personal Profile
                </Typography>
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
              </Box>
            ) : (
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
                    <div>
                      <SemesterCard semester={semester} />
                    </div>
                  </Zoom>
                ))}

                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="large"
                    onClick={() => setAddSemesterModalOpen(true)}
                  >
                    Add New Semester
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }} className="gpa-progress-circle">
                  <GpaProgressCircle gpa={parseFloat(calculateOverallGPA())} />
                </Box>
              </Grid>

              {/* Personal Guide */}
              <Grid item xs={12} md={4}>
                {/* Study Smart Tips Card */}
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
              </Grid>
            </Grid>
          )}
          {/* Snackbar for notifications */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
          </>
        </Box>
        <AddGpaEntryModal
          open={addSemesterModalOpen}
          handleClose={() => setAddSemesterModalOpen(false)}
          handleSave={handleAddSemesterFromModal}
        />
      </Container>
    </ThemeProvider>
  );
}

export default PersonalProfile;