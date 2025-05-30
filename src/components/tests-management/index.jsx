import React, { useState } from 'react';
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

const TestsManagement = () => {
  const [view, setView] = useState("list");
  const [selectedTest, setSelectedTest] = useState(null);
  const [testsList, setTestsList] = useState(practiceTests);
  const [anchorMoreMenu, setAnchorMoreMenu] = useState(null);

  const handleCreateTest = () => {
    setSelectedTest(null);
    setView("create");
  };

  const handleEditTest = (test) => {
    setSelectedTest(test);
    setView("edit");
    handleMoreMenuClose();
  };

  const handleViewTest = (testId) => {
    const test = testsList.find(t => t.id === testId);
    setSelectedTest(test);
    setView("view");
  };

  const handleViewAnalytics = (testId) => {
    const test = testsList.find(t => t.id === testId);
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

  const handleDeleteTest = (testId) => {
    setTestsList(testsList.filter((t) => t.id !== testId));
    handleMoreMenuClose();
  };

  const handleSaveTest = (test) => {
    if (test.id) {
      setTestsList(testsList.map((t) => (t.id === test.id ? { ...t, ...test } : t)));
    } else {
      const newTest = {
        ...test,
        id: Date.now(),
        createdAt: new Date().toISOString().split("T")[0],
        attempts: 0,
        avgScore: 0,
        questions: test.questions.length,
      };
      setTestsList([newTest, ...testsList]);
    }
    setView("list");
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
        testData={selectedTest}
        onBack={() => setView("list")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Practice Tests Management</h2>
          <p className="text-muted">Create and manage practice tests</p>
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
              {testsList.reduce((total, test) => total + test.attempts, 0)}
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
              {testsList.map((test) => (
                <tr key={test.id}>
                  <td>
                    <div>
                      <div className="font-medium">{test.title}</div>
                      <div className="text-sm text-muted line-clamp-1">
                        {test.description}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <HelpIcon fontSize="small" />
                      {test.questions}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <GroupIcon fontSize="small" />
                      {test.attempts}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <span
                        className={`font-medium ${
                          test.avgScore >= test.passingScore
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {test.avgScore}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <AccessTimeIcon fontSize="small" />
                      {test.timeLimit}m
                    </div>
                  </td>
                  <td>{test.passingScore}%</td>
                  <td>
                    <span
                      className={`badge ${
                        test.status === "active"
                          ? "badge-success"
                          : test.status === "draft"
                          ? "badge-warning"
                          : "badge-secondary"
                      }`}
                    >
                      {test.status}
                    </span>
                  </td>
                  <td>{test.createdAt}</td>
                  <td>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        onClick={(event) => handleMoreMenuOpen(event, test)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Menu
        anchorEl={anchorMoreMenu}
        open={Boolean(anchorMoreMenu)}
        onClose={handleMoreMenuClose}
      >
        <MenuItem onClick={() => handleViewTest(selectedTest?.id)}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View Test
        </MenuItem>
        <MenuItem onClick={() => handleViewAnalytics(selectedTest?.id)}>
          <BarChartIcon fontSize="small" sx={{ mr: 1 }} />
          View Analytics
        </MenuItem>
        <MenuItem onClick={() => handleEditTest(selectedTest)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Test
        </MenuItem>
        <MenuItem onClick={() => handleDeleteTest(selectedTest?.id)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Test
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TestsManagement;