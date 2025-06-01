import React, { useState, useEffect } from 'react';
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
import { getPracticeTestAnalytics } from '../../apis/practiceTestApi';

export function TestAnalytics({ testId, onBack }) {
  const [activeTab, setActiveTab] = useState("questions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getPracticeTestAnalytics(testId);
        if (res.success) setAnalytics(res.data);
        else setError(res.message || "Lỗi khi lấy dữ liệu analytics");
      } catch (err) {
        setError(err.message || "Lỗi khi lấy dữ liệu analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [testId]);

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}>Đang tải dữ liệu...</Box>;
  if (error) return <Box sx={{ p: 4, color: 'red', textAlign: 'center' }}>{error}</Box>;
  if (!analytics) return null;
  const { test, scoreDistribution, questionAnalytics, studentResults } = analytics;

  function OverviewStats() {
    return (
      <Grid container spacing={3}>
        {[
          {
            title: "Total Attempts",
            value: test.attempts,
            subtitle: "Tổng số lượt làm bài",
            icon: <UsersIcon />,
          },
          {
            title: "Average Score",
            value: `${test.avgScore}%`,
            subtitle: <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><TrendingUpIcon sx={{ fontSize: '1rem' }} />Trung bình điểm</Box>,
            icon: <TargetIcon />,
          },
          {
            title: "Pass Rate",
            value: `${test.passRate}%`,
            subtitle: <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><TrendingDownIcon sx={{ fontSize: '1rem' }} />Tỉ lệ qua bài</Box>,
            icon: <CheckCircleIcon color="success" />,
          },
          {
            title: "Avg Time",
            value: `${test.avgTimeSpent}m`,
            subtitle: `of ${test.timeLimit}m limit`,
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
                  value={maxCount ? (item.count / maxCount) * 100 : 0}
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
        case "easy": return "success";
        case "medium": return "warning";
        case "hard": return "error";
        default: return "default";
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
                    <Typography variant="subtitle1">Question</Typography>
                    <Chip label={question.type} variant="outlined" size="small" />
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
                    <LinearProgress variant="determinate" value={question.correctRate} sx={{ flexGrow: 1 }} />
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
                  <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Correct Rate</Typography>
                      <Typography variant="h6" color="primary.main">{question.correctRate}%</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Correct Answer</Typography>
                      <Typography variant="h6" color="success.main">{question.correctAnswer}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Answer Stats</Typography>
                      <Box>
                        {question.answerStats && Object.keys(question.answerStats).length > 0 ? (
                          Object.entries(question.answerStats).map(([ans, cnt]) => (
                            <Typography key={ans} variant="body2">
                              <b>{ans}</b>: {cnt} lần
                            </Typography>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">No answers</Typography>
                        )}
                      </Box>
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
        case "score": return b.score - a.score;
        case "time": return a.timeSpent - b.timeSpent;
        case "name": return a.name.localeCompare(b.name);
        case "date": return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        default: return 0;
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
          <Button variant="outlined" startIcon={<DownloadIcon />}>Export Results</Button>
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
                        <Typography variant="body2" color="text.secondary">{student.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{student.score}%</Typography>
                      <LinearProgress variant="determinate" value={student.percentage} sx={{ width: 60 }} color={student.score >= test.passingScore ? "success" : "error"} />
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
                    <Chip label={student.status} color={student.status === "passed" ? "success" : "error"} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={student.attempts} variant="outlined" size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{new Date(student.completedAt).toLocaleString()}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ mb: 0.5 }}>{test.title}</Typography>
            <Typography color="text.secondary">{test.description}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>Export Report</Button>
          <Button variant="outlined" startIcon={<FileTextIcon />}>View Test</Button>
        </Box>
      </Box>
      {/* Test Info */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            {[
              { icon: <CalendarIcon />, label: "Created", value: test.createdAt },
              { icon: <FileTextIcon />, label: "Questions", value: test.totalQuestions },
              { icon: <ClockIcon />, label: "Time Limit", value: `${test.timeLimit}m` },
              { icon: <TargetIcon />, label: "Passing Score", value: `${test.passingScore}%` },
              { icon: <AwardIcon />, label: "Max Score", value: test.maxScore },
              { content: (<Chip label={test.status} color={test.status === "active" ? "primary" : "default"} />) },
            ].map((item, index) => (
              <Grid item xs={6} md={2} key={index}>
                {item.content || (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: 'text.secondary' }}>{item.icon}</Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="body1">{item.value}</Typography>
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
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mt: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Tab value="questions" label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><BrainIcon sx={{ fontSize: '1.2rem' }} />Question Analysis</Box>} />
        <Tab value="students" label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><UsersIcon sx={{ fontSize: '1.2rem' }} />Student Results</Box>} />
      </Tabs>
      <Box sx={{ mt: 3 }}>
        {activeTab === "questions" && <QuestionAnalyticsTab />}
        {activeTab === "students" && <StudentResultsTab />}
      </Box>
    </Box>
  );
}

export default TestAnalytics;