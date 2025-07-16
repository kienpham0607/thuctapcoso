import React, { useState, useEffect } from 'react';
import './tests-management.css';
import TestForm from './TestForm';
import TestAnalytics from '../test-analytics/TestAnalytics';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
  Help as HelpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  BarChart as BarChartIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { getAllPracticeTests, createPracticeTest, updatePracticeTest, deletePracticeTest, getPracticeTestById } from '../../apis/practiceTestApi';
import { useNavigate } from 'react-router-dom';
import { getAllSubjects } from '../../apis/subjectApi';

// Mock data
const practiceTests = [
  {
    id: 1,
    title: "React Fundamentals Quiz",
    questions: 20,
    attempts: 156,
    avgScore: 85,
    status: "active",
    createdAt: "2024-01-12",
    timeLimit: 30,
    passingScore: 70,
    description: "Test your knowledge of React fundamentals including components, props, and state.",
  },
  {
    id: 2,
    title: "JavaScript ES6+ Assessment",
    questions: 15,
    attempts: 89,
    avgScore: 78,
    status: "active",
    createdAt: "2024-01-10",
    timeLimit: 45,
    passingScore: 75,
    description: "Comprehensive assessment of modern JavaScript features and concepts.",
  },
];

const convertTestFromBackend = (test) => ({
  ...test,
  questions: (test.questions || []).map((q, idx) => ({
    id: q._id || Date.now() + idx,
    type: q.type || "multiple-choice",
    question: String(q.questionText || q.question || ""),
    options: Array.isArray(q.options) ? q.options.map(opt => String(opt)) : [],
    correctAnswer: String(q.correctAnswer || ""),
    points: Number(q.points || 1),
    order: Number(q.order || idx + 1),
    explanation: String(q.explanation || ""),
  })),
});

const TestsManagement = () => {
  const [view, setView] = useState("list");
  const [selectedTest, setSelectedTest] = useState(null);
  const [testsList, setTestsList] = useState([]);
  const [anchorMoreMenu, setAnchorMoreMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [totalAttemptsAll, setTotalAttemptsAll] = useState(0);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  // Load tests from API
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const res = await getAllPracticeTests();
        if (res.success) {
          console.log('Fetched tests:', res.data);
          setTestsList(res.data);
          setTotalAttemptsAll(res.totalAttempts || 0);
        } else {
          throw new Error('Failed to fetch tests');
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
        setSnackbar({
          open: true,
          message: error.message || 'Failed to fetch tests',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      const res = await getAllSubjects();
      if (res.success && Array.isArray(res.data)) {
        setSubjects(res.data);
      } else {
        setSubjects([]);
      }
      setLoadingSubjects(false);
    };
    fetchSubjects();
  }, []);

  // Reset menu actions khi quay lại trang list
  useEffect(() => {
    if (view === 'list') setAnchorMoreMenu(null);
  }, [view]);

  const handleCreateTest = () => {
    setSelectedTest(null);
    setView("create");
  };

  const handleEditTest = async (test) => {
    try {
      setLoading(true);
      const response = await getPracticeTestById(test._id);
      if (response.success) {
        setSelectedTest(convertTestFromBackend(response.data));
        setView("edit");
      } else {
        throw new Error('Failed to fetch test details');
      }
    } catch (error) {
      console.error('Error fetching test:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to fetch test details',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      handleMoreMenuClose();
    }
  };

  const handleViewTest = (testId) => {
    const test = testsList.find(t => t._id === testId);
    if (test && test.subject) {
      navigate(`/practice/${test.subject}`);
    }
    handleMoreMenuClose();
  };

  const handleViewAnalytics = (testId) => {
    const test = testsList.find(t => t._id === testId);
    setSelectedTest(test);
    setView("analytics");
  };

  const handleMoreMenuOpen = (event, test) => {
    setAnchorMoreMenu(event.currentTarget);
    setSelectedTest(test);
  };

  const handleMoreMenuClose = () => {
    setAnchorMoreMenu(null);
  };

  const handleDeleteTest = async (testId) => {
    await deletePracticeTest(testId);
    setTestsList(testsList.filter((t) => t._id !== testId));
    handleMoreMenuClose();
  };

  const handleSaveTest = async (testData) => {
    try {
      setLoading(true);
      console.log('Saving test data:', testData);
      
      let response;
      if (selectedTest?._id) {
        // Update existing test
        console.log('Updating test with ID:', selectedTest._id);
        response = await updatePracticeTest(selectedTest._id, testData);
        console.log('Update response:', response);
        
        if (response.success) {
          // Fetch updated test list
          const updatedTestsResponse = await getAllPracticeTests();
          if (updatedTestsResponse.success) {
            console.log('Updated tests list:', updatedTestsResponse.data);
            setTestsList(updatedTestsResponse.data);
          }
          setSnackbar({
            open: true,
            message: 'Test updated successfully',
            severity: 'success'
          });
        } else {
          throw new Error(response.message || 'Failed to update test');
        }
      } else {
        // Create new test
        console.log('Creating new test');
        response = await createPracticeTest(testData);
        console.log('Create response:', response);
        
        if (response.success) {
          // Fetch updated test list
          const updatedTestsResponse = await getAllPracticeTests();
          if (updatedTestsResponse.success) {
            console.log('Updated tests list:', updatedTestsResponse.data);
            setTestsList(updatedTestsResponse.data);
          }
          setSnackbar({
            open: true,
            message: 'Test created successfully',
            severity: 'success'
          });
        } else {
          throw new Error(response.message || 'Failed to create test');
        }
      }

      setView("list");
      setSelectedTest(null);
    } catch (error) {
      console.error('Error saving test:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save test',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (view === "create" || view === "edit") {
    return (
      <TestForm
        test={selectedTest}
        onSave={handleSaveTest}
        onCancel={() => setView("list")}
      />
    );
  }

  if (view === "analytics") {
    return (
      <TestAnalytics
        testId={selectedTest?._id}
        onBack={() => setView("list")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Practice Tests Management</h2>
          <p style={{ color: '#222' }}>Create and manage practice tests</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTest}
          sx={{
            background: 'linear-gradient(45deg, #4158D0 0%, #C850C0 100%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #3147BF 0%, #B740AF 100%)',
            }
          }}
        >
          Create New Test
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <DescriptionIcon fontSize="small" className="text-muted" />
              <span className="text-sm font-medium">Total Tests</span>
            </div>
            <div className="text-2xl font-bold">{testsList.length}</div>
          </div>
        </div>
        <div className="card">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon fontSize="small" className="text-green-600" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="text-2xl font-bold">
              {testsList.filter((t) => t.status === "active").length}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <WarningIcon fontSize="small" className="text-yellow-600" />
              <span className="text-sm font-medium">Drafts</span>
            </div>
            <div className="text-2xl font-bold">
              {testsList.filter((t) => t.status === "draft").length}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <GroupIcon fontSize="small" className="text-muted" />
              <span className="text-sm font-medium">Total Attempts</span>
            </div>
            <div className="text-2xl font-bold">
              {totalAttemptsAll}
            </div>
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Questions</th>
                <th>Attempts</th>
                <th>Avg Score</th>
                <th>Time Limit</th>
                <th>Pass Score</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testsList.map((test) => {
                const convertedTest = convertTestFromBackend(test);
                console.log('Rendering test:', test);
                return (
                  <tr key={test._id}>
                    <td>
                      <div>
                        <div className="font-medium">{String(test.title || '')}</div>
                        <div className="text-sm text-muted line-clamp-1">
                          {String(test.description || '')}
                        </div>
                      </div>
                    </td>
                    <td>
                      {loadingSubjects
                        ? <span>Loading...</span>
                        : (subjects.find(s => s.value === test.subject)?.label || test.subject)
                      }
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <HelpIcon fontSize="small" />
                        {String(convertedTest.questions.length)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <GroupIcon fontSize="small" />
                        {typeof test.totalAttempts === 'number' ? test.totalAttempts : 0}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <span
                          className={`font-medium ${
                            Number(test.avgScore || 0) >= Number(test.passingScore || 0)
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {typeof test.avgScore === 'number' ? test.avgScore : 0}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <AccessTimeIcon fontSize="small" />
                        {String(test.timeLimit || 0)} min
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <CheckCircleIcon fontSize="small" />
                        {String(test.passingScore || 0)}%
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            test.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : test.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {String(test.status || 'draft')}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-black">
                        {new Date(test.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="text-right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMoreMenuOpen(e, test)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Menu
        anchorEl={anchorMoreMenu}
        open={Boolean(anchorMoreMenu)}
        onClose={handleMoreMenuClose}
      >
        <MenuItem onClick={() => handleViewTest(selectedTest?._id)}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View Test
        </MenuItem>
        <MenuItem onClick={() => handleViewAnalytics(selectedTest?._id)}>
          <BarChartIcon fontSize="small" sx={{ mr: 1 }} />
          View Analytics
        </MenuItem>
        <MenuItem onClick={() => handleEditTest(selectedTest)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Test
        </MenuItem>
        <MenuItem onClick={() => handleDeleteTest(selectedTest?._id)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Test
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TestsManagement;