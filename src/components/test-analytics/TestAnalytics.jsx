import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  GetApp as DownloadIcon,
  Group as UsersIcon,
  AccessTime as ClockIcon,
  Gavel as TargetIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Description as FileTextIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Warning as AlertTriangleIcon,
  CalendarToday as CalendarIcon,
  Timer as TimerIcon,
  EmojiEvents as AwardIcon,
  Psychology as BrainIcon,
} from '@mui/icons-material';

// Mock data for test analytics
const testData = {
  id: 1,
  title: "React Fundamentals Quiz",
  description: "Test your knowledge of React fundamentals including components, props, and state.",
  createdAt: "2024-01-12",
  timeLimit: 30,
  passingScore: 70,
  totalQuestions: 20,
  maxScore: 100,
  status: "active",
  attempts: 156,
  avgScore: 78.5,
  passRate: 68.6,
  avgTimeSpent: 24.3,
};

const studentResults = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    avatar: "/placeholder.svg",
    score: 95,
    percentage: 95,
    timeSpent: 28,
    completedAt: "2024-01-15T14:30:00",
    status: "passed",
    correctAnswers: 19,
    incorrectAnswers: 1,
    attempts: 1,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    avatar: "/placeholder.svg",
    score: 82,
    percentage: 82,
    timeSpent: 26,
    completedAt: "2024-01-15T15:45:00",
    status: "passed",
    correctAnswers: 16,
    incorrectAnswers: 4,
    attempts: 1,
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol.davis@example.com",
    avatar: "/placeholder.svg",
    score: 65,
    percentage: 65,
    timeSpent: 30,
    completedAt: "2024-01-15T16:20:00",
    status: "failed",
    correctAnswers: 13,
    incorrectAnswers: 7,
    attempts: 2,
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@example.com",
    avatar: "/placeholder.svg",
    score: 88,
    percentage: 88,
    timeSpent: 22,
    completedAt: "2024-01-15T17:10:00",
    status: "passed",
    correctAnswers: 17,
    incorrectAnswers: 3,
    attempts: 1,
  },
  {
    id: 5,
    name: "Eva Brown",
    email: "eva.brown@example.com",
    avatar: "/placeholder.svg",
    score: 72,
    percentage: 72,
    timeSpent: 29,
    completedAt: "2024-01-15T18:00:00",
    status: "passed",
    correctAnswers: 14,
    incorrectAnswers: 6,
    attempts: 1,
  }
];

const questionAnalytics = [
  {
    id: 1,
    question: "What is JSX?",
    type: "multiple-choice",
    correctRate: 92,
    avgTimeSpent: 45,
    difficulty: "easy",
    correctAnswers: 144,
    incorrectAnswers: 12,
    commonWrongAnswer: "A JavaScript framework",
  },
  {
    id: 2,
    question: "How do you create a functional component in React?",
    type: "multiple-choice",
    correctRate: 78,
    avgTimeSpent: 62,
    difficulty: "medium",
    correctAnswers: 122,
    incorrectAnswers: 34,
    commonWrongAnswer: "class Component extends React.Component",
  },
  {
    id: 3,
    question: "What is the purpose of useEffect hook?",
    type: "multiple-choice",
    correctRate: 65,
    avgTimeSpent: 85,
    difficulty: "hard",
    correctAnswers: 101,
    incorrectAnswers: 55,
    commonWrongAnswer: "To manage component state",
  },
  {
    id: 4,
    question: "React components must return a single element.",
    type: "true-false",
    correctRate: 58,
    avgTimeSpent: 38,
    difficulty: "hard",
    correctAnswers: 90,
    incorrectAnswers: 66,
    commonWrongAnswer: "True",
  },
  {
    id: 5,
    question: "What does useState return?",
    type: "multiple-choice",
    correctRate: 84,
    avgTimeSpent: 52,
    difficulty: "medium",
    correctAnswers: 131,
    incorrectAnswers: 25,
    commonWrongAnswer: "Only the state value",
  }
];

const scoreDistribution = [
  { range: "90-100", count: 28, percentage: 17.9 },
  { range: "80-89", count: 42, percentage: 26.9 },
  { range: "70-79", count: 37, percentage: 23.7 },
  { range: "60-69", count: 31, percentage: 19.9 },
  { range: "50-59", count: 12, percentage: 7.7 },
  { range: "0-49", count: 6, percentage: 3.8 },
];

function OverviewStats() {
  return (
    <Grid container spacing={3}>
      {[
        {
          title: "Total Attempts",
          value: testData.attempts,
          subtitle: "+12 from last week",
          icon: <UsersIcon />,
        },
        {
          title: "Average Score",
          value: `${testData.avgScore}%`,
          subtitle: (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpIcon sx={{ fontSize: '1rem' }} />
              +2.3% from last month
            </Box>
          ),
          icon: <TargetIcon />,
        },
        {
          title: "Pass Rate",
          value: `${testData.passRate}%`,
          subtitle: (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingDownIcon sx={{ fontSize: '1rem' }} />
              -1.2% from last month
            </Box>
          ),
          icon: <CheckCircleIcon color="success" />,
        },
        {
          title: "Avg Time",
          value: `${testData.avgTimeSpent}m`,
          subtitle: `of ${testData.timeLimit}m limit`,
          icon: <ClockIcon />,
        },
      ].map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {stat.icon}
                <Typography variant="subtitle2">{stat.title}</Typography>
              </Box>
              <Typography variant="h4" sx={{ my: 1 }}>{stat.value}</Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function ScoreDistributionChart() {
  const maxCount = Math.max(...scoreDistribution.map((item) => item.count));

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <BarChartIcon />
          <Typography variant="h6">Score Distribution</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {scoreDistribution.map((item, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  {item.range}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.count} students ({item.percentage}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(item.count / maxCount) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

function QuestionAnalyticsTab() {
  const [sortBy, setSortBy] = useState("difficulty");
  
  const sortedQuestions = [...questionAnalytics].sort((a, b) => {
    switch (sortBy) {
      case "difficulty":
        const difficultyOrder = { hard: 0, medium: 1, easy: 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case "correctRate":
        return b.correctRate - a.correctRate;
      case "timeSpent":
        return a.avgTimeSpent - b.avgTimeSpent;
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Question Performance Analysis</Typography>
        <FormControl sx={{ width: 200 }} size="small">
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="difficulty">Sort by Difficulty</MenuItem>
            <MenuItem value="correctRate">Sort by Correct Rate</MenuItem>
            <MenuItem value="timeSpent">Sort by Time Spent</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {sortedQuestions.map((question) => (
        <Card key={question.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle1">Question {question.id}</Typography>
                  <Chip
                    label={question.difficulty}
                    color={getDifficultyColor(question.difficulty)}
                    size="small"
                  />
                  <Chip
                    label={question.type}
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {question.question}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Correct Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={question.correctRate}
                    sx={{ flexGrow: 1 }}
                  />
                  <Typography variant="body2">{question.correctRate}%</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Average Time
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimerIcon fontSize="small" />
                  <Typography>{question.avgTimeSpent}s</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 4 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Correct Answers
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {question.correctAnswers}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Incorrect Answers
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {question.incorrectAnswers}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Common Wrong Answer
                    </Typography>
                    <Typography variant="body2">
                      {question.commonWrongAnswer}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StudentResultsTab() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  const filteredResults = studentResults.filter((student) => {
    if (filterStatus === "all") return true;
    return student.status === filterStatus;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return b.score - a.score;
      case "time":
        return a.timeSpent - b.timeSpent;
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ width: 150 }} size="small">
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
              <MenuItem value="all">All Students</MenuItem>
              <MenuItem value="passed">Passed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: 150 }} size="small">
            <InputLabel>Sort by</InputLabel>
            <Select value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="score">Sort by Score</MenuItem>
              <MenuItem value="time">Sort by Time</MenuItem>
              <MenuItem value="name">Sort by Name</MenuItem>
              <MenuItem value="date">Sort by Date</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button variant="outlined" startIcon={<DownloadIcon />}>
          Export Results
        </Button>
      </Box>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Time Spent</TableCell>
              <TableCell>Correct/Incorrect</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Attempts</TableCell>
              <TableCell>Completed At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedResults.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={student.avatar}>{student.name[0]}</Avatar>
                    <Box>
                      <Typography variant="subtitle2">{student.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{student.score}%</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={student.percentage}
                      sx={{ width: 60 }}
                      color={student.score >= testData.passingScore ? "success" : "error"}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ClockIcon fontSize="small" />
                    <Typography>{student.timeSpent}m</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography>
                    <span style={{ color: '#2e7d32' }}>{student.correctAnswers}</span>
                    {' / '}
                    <span style={{ color: '#d32f2f' }}>{student.incorrectAnswers}</span>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={student.status}
                    color={student.status === "passed" ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip label={student.attempts} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(student.completedAt).toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export function TestAnalytics({ testId, onBack }) {
  const [activeTab, setActiveTab] = useState("questions");

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ mb: 0.5 }}>{testData.title}</Typography>
            <Typography color="text.secondary">{testData.description}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export Report
          </Button>
          <Button variant="outlined" startIcon={<FileTextIcon />}>
            View Test
          </Button>
        </Box>
      </Box>

      {/* Test Info */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            {[
              { icon: <CalendarIcon />, label: "Created", value: testData.createdAt },
              { icon: <FileTextIcon />, label: "Questions", value: testData.totalQuestions },
              { icon: <ClockIcon />, label: "Time Limit", value: `${testData.timeLimit}m` },
              { icon: <TargetIcon />, label: "Passing Score", value: `${testData.passingScore}%` },
              { icon: <AwardIcon />, label: "Max Score", value: testData.maxScore },
              { 
                content: (
                  <Chip 
                    label={testData.status} 
                    color={testData.status === "active" ? "primary" : "default"}
                  />
                )
              },
            ].map((item, index) => (
              <Grid item xs={6} md={2} key={index}>
                {item.content || (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: 'text.secondary' }}>{item.icon}</Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="body1">
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <OverviewStats />

      {/* Analytics Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mt: 4, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab
          value="questions"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BrainIcon sx={{ fontSize: '1.2rem' }} />
              Question Analysis
            </Box>
          }
        />
        <Tab
          value="students"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <UsersIcon sx={{ fontSize: '1.2rem' }} />
              Student Results
            </Box>
          }
        />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {activeTab === "questions" && <QuestionAnalyticsTab />}
        {activeTab === "students" && <StudentResultsTab />}
      </Box>
    </Box>
  );
}

export default TestAnalytics;