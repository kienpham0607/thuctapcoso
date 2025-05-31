import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { getPracticeTestById } from '../../apis/practiceTestApi';

export default function TestQuestions() {
  const { subject, testId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPracticeTestById(testId);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch test');
        }

        const testData = response.data;
        if (!testData || !Array.isArray(testData.questions)) {
          throw new Error('Invalid test data format');
        }

        // Transform questions to ensure consistent format
        const transformedQuestions = testData.questions.map((q, index) => {
          // Ensure options are strings and handle nested objects
          const options = Array.isArray(q.options) 
            ? q.options.map(opt => {
                if (opt === null || opt === undefined) return '';
                if (typeof opt === 'object') {
                  try {
                    return JSON.stringify(opt);
                  } catch (e) {
                    console.error('Error stringifying option:', opt);
                    return '';
                  }
                }
                return String(opt);
              })
            : [];

          return {
            id: String(q._id || `q-${index}`),
            questionText: String(q.questionText || ''),
            options: options,
            correctAnswer: String(q.correctAnswer || ''),
            explanation: String(q.explanation || '')
          };
        });

        console.log('Transformed questions:', transformedQuestions);
        setQuestions(transformedQuestions);
      } catch (err) {
        console.error('Error fetching test:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  // Reset current question when questions change
  useEffect(() => {
    setCurrentQuestion(0);
    setAnswers({});
  }, [questions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });
    setShowResults(true);
  };

  const calculateProgress = () => {
    return (Object.keys(answers).length / questions.length) * 100;
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
        <Container maxWidth="md">
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="error" gutterBottom>
              Error Loading Test
            </Typography>
            <Typography color="text.secondary" paragraph>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(`/practice/${subject}`)}
              sx={{ mt: 2 }}
            >
              Back to Tests
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  if (showResults) {
    const score = questions.reduce((acc, question) => {
      return acc + (answers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);

    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
        <Container maxWidth="md">
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              backgroundColor: '#16977D',
              py: 4,
              px: 3,
              textAlign: 'center',
              color: 'white'
            }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Test Complete!
              </Typography>
              <Typography variant="h3" sx={{ mt: 2 }}>
                {Math.round((score/questions.length) * 100)}%
              </Typography>
            </Box>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Your Score
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {score} out of {questions.length} questions correct
                </Typography>
              </Box>
              
              <Box sx={{ 
                backgroundColor: 'rgba(22, 151, 125, 0.1)',
                borderRadius: 2,
                p: 3,
                mb: 4
              }}>
                <Typography variant="body1" paragraph>
                  {score/questions.length >= 0.7 ? 
                    "Great job! You've demonstrated a good understanding of the material." :
                    "Keep practicing! Review the material and try again to improve your score."
                  }
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={() => navigate(`/practice/${subject}`)}
                sx={{ 
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold'
                }}
              >
                Back to Tests
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // Add validation before rendering
  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
        <Container maxWidth="md">
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="error">
              No questions available for this test.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(`/practice/${subject}`)}
              sx={{ mt: 2 }}
            >
              Back to Tests
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', pb: 4 }}>
      <Box sx={{ 
        backgroundColor: '#16977D',
        py: 3,
        mb: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <IconButton
                onClick={() => navigate(`/practice/${subject}`)}
                sx={{
                  backgroundColor: 'white',
                  color: '#16977D',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
                size="large"
              >
                <ArrowBack />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Question {currentQuestion + 1} of {questions.length}
              </Typography>
            </Grid>
            <Grid item>
              <Chip
                label={`Time Left: ${formatTime(timeLeft)}`}
                sx={{
                  backgroundColor: 'white',
                  fontWeight: 'bold',
                  '& .MuiChip-label': { px: 2 }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Progress: {Math.round(calculateProgress())}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={calculateProgress()}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(22, 151, 125, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#16977D',
                borderRadius: 4,
              }
            }}
          />
        </Box>

        {questions[currentQuestion] && (
          <Card sx={{
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 28px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#16977D',
                  fontWeight: 'bold',
                  display: 'block',
                  mb: 2
                }}
              >
                Question {currentQuestion + 1}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {questions[currentQuestion].questionText}
              </Typography>

              <RadioGroup
                value={String(answers[questions[currentQuestion].id] || '')}
                onChange={(e) => handleAnswerChange(questions[currentQuestion].id, e.target.value)}
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={String(option)}
                    control={
                      <Radio
                        sx={{
                          '&.Mui-checked': {
                            color: '#16977D',
                          }
                        }}
                      />
                    }
                    label={String(option)}
                    sx={{
                      my: 1,
                      py: 1,
                      px: 2,
                      width: '100%',
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(22, 151, 125, 0.05)',
                      },
                      ...(answers[questions[currentQuestion].id] === option && {
                        backgroundColor: 'rgba(22, 151, 125, 0.1)',
                      })
                    }}
                  />
                ))}
              </RadioGroup>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 4,
                gap: 2
              }}>
                <Button
                  variant="outlined"
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                >
                  ← Previous
                </Button>
                
                {currentQuestion === questions.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowConfirmSubmit(true)}
                  >
                    Submit Test
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                  >
                    Next →
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>

      <Dialog open={showConfirmSubmit} onClose={() => setShowConfirmSubmit(false)}>
        <DialogTitle>Submit Test?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit your test? You cannot change your answers after submission.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmSubmit(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}