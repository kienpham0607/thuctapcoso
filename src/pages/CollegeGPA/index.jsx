import React from 'react';
import anh1 from '../../assets/anh1.png';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  TextField,
  Fade,
  Zoom
} from '@mui/material';

export default function CollegeGPA() {
  // State for Subject Structure selection
  const [structure, setStructure] = React.useState('10-10-20-60');
  const handleChangeStructure = (event) => {
    setStructure(event.target.value);
    // ...Handle logic, calculate GPA, etc.
  };

  // Demo: total score calculation
  const [score10A, setScore10A] = React.useState('');
  const [score10B, setScore10B] = React.useState('');
  const [score20, setScore20] = React.useState('');
  const [score60, setScore60] = React.useState('');

  // Calculate scores
  const calculateScores = () => {
    const scores = {
      '10-10-20-60': {
        10: [score10A * 0.1, score10B * 0.1],
        20: [score20 * 0.2],
        60: [score60 * 0.6]
      },
      '10-20-30-40': {
        10: [score10A * 0.1],
        20: [score10B * 0.2],
        30: [score20 * 0.3],
        40: [score60 * 0.4]
      },
      '25-25-25-25': {
        25: [score10A * 0.25, score10B * 0.25, score20 * 0.25, score60 * 0.25]
      }
    };

    const structureScores = scores[structure];
    let total10Scale = 0;
    Object.values(structureScores).forEach(weights => {
      weights.forEach(score => {
        if (!isNaN(score)) total10Scale += score;
      });
    });

    // Convert to 4.0 scale
    const total4Scale = (total10Scale / 10) * 4;

    return {
      scale10: total10Scale,
      scale4: total4Scale
    };
  };

  const getGradeLetter = (score10Scale) => {
    if (score10Scale >= 8.5) return 'A';
    if (score10Scale >= 7.0) return 'B';
    if (score10Scale >= 5.5) return 'C';
    if (score10Scale >= 4.0) return 'D';
    return 'F';
  };

  const scores = calculateScores();
  const gradeLetter = getGradeLetter(scores.scale10);

  const handleScoreChange = (setter) => (event) => {
    const value = parseFloat(event.target.value);
    if (value < 0) {
      setter(0);
    } else if (value > 10) {
      setter(10);
    } else {
      setter(isNaN(value) ? 0 : value);
    }
  };

  return (
    <Box>
      {/* Green banner + card & illustration */}
      <Box sx={{ backgroundColor: '#16977D', pb: 4 }}>
        <Container maxWidth="lg">
          {/* Title "College GPA" at the top */}
          <Typography
            variant="h5"
            sx={{ color: '#fff', fontWeight: 'bold', pt: 2 }}
          >
            College GPA
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Full width Final score card */}
            <Grid item xs={12}>
              <Zoom in={true}>
                <Card
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                {/* Left section: Final score */}
                <Box sx={{ flex: 1 }}>
                  {/* Gray header bar */}
                  <Box
                    sx={{
                      backgroundColor: '#f5f5f5',
                      px: 2,
                      py: 1,
                      borderTopLeftRadius: 8,
                    }}
                  >
                    <Fade in={true} timeout={800}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Score Sheet
                      </Typography>
                    </Fade>
                  </Box>

                  <CardContent>
                    {/* Select Subject Structure */}
                    <Fade in={true} timeout={1000}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Subject Structure
                      </Typography>
                    </Fade>
                    <Fade in={true} timeout={1200}>
                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel>Score Structure</InputLabel>
                      <Select
                        value={structure}
                        label="Score Structure"
                        onChange={handleChangeStructure}
                      >
                        <MenuItem value="10-10-20-60">10-10-20-60</MenuItem>
                        <MenuItem value="10-20-30-40">10-20-30-40</MenuItem>
                        <MenuItem value="25-25-25-25">25-25-25-25</MenuItem>
                      </Select>
                      </FormControl>
                    </Fade>

                    {/* Score display table */}
                    <Fade in={true} timeout={1400}>
                      <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Score 10%</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Score 10%</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Score 20%</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Score 60%</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Grade (10)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>GPA (4.0)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell align="center">
                              <TextField
                                size="small"
                                value={score10A}
                                onChange={handleScoreChange(setScore10A)}
                                placeholder="0-10"
                                variant="outlined"
                                type="text"
                                inputProps={{
                                  style: {
                                    textAlign: 'center',
                                    paddingTop: '8px',
                                    paddingBottom: '8px',
                                    fontSize: '14px'
                                  }
                                }}
                                sx={{
                                  width: '80px',
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: '#ccc',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#666',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#009688',
                                    }
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                size="small"
                                value={score10B}
                                onChange={handleScoreChange(setScore10B)}
                                placeholder="0-10"
                                variant="outlined"
                                type="text"
                                inputProps={{
                                  style: {
                                    textAlign: 'center',
                                    paddingTop: '8px',
                                    paddingBottom: '8px',
                                    fontSize: '14px'
                                  }
                                }}
                                sx={{
                                  width: '80px',
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: '#ccc',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#666',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#009688',
                                    }
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                size="small"
                                value={score20}
                                onChange={handleScoreChange(setScore20)}
                                placeholder="0-10"
                                variant="outlined"
                                type="text"
                                inputProps={{
                                  style: {
                                    textAlign: 'center',
                                    paddingTop: '8px',
                                    paddingBottom: '8px',
                                    fontSize: '14px'
                                  }
                                }}
                                sx={{
                                  width: '80px',
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: '#ccc',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#666',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#009688',
                                    }
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                size="small"
                                value={score60}
                                onChange={handleScoreChange(setScore60)}
                                placeholder="0-10"
                                variant="outlined"
                                type="text"
                                inputProps={{
                                  style: {
                                    textAlign: 'center',
                                    paddingTop: '8px',
                                    paddingBottom: '8px',
                                    fontSize: '14px'
                                  }
                                }}
                                sx={{
                                  width: '80px',
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: '#ccc',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#666',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#009688',
                                    }
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: scores.scale10 >= 5.0 ? 'green' : 'red' }}>
                              {scores.scale10.toFixed(2)}
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: scores.scale4 >= 2.0 ? 'green' : 'red' }}>
                              {scores.scale4.toFixed(2)} ({gradeLetter})
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      </TableContainer>
                    </Fade>
                  </CardContent>
                </Box>

                {/* Right section: Illustration + text */}
                <Box
                  sx={{
                    flex: 0.5,
                    backgroundColor: '#1aad90',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 2,
                  }}
                >
                  {/* Illustration */}
                  <img
                    src={anh1}
                    alt="Illustration"
                    style={{
                      width: '100%',
                      maxWidth: 200,
                      margin: '0 auto',
                      display: 'block',
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: '#fff', mt: 2, textAlign: 'center', fontSize: '0.9rem' }}
                  >
                    Calculate and store your GPA, track your academic progress,
                    and manage your entire learning journey.
                  </Typography>
                </Box>
                </Card>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Instructions section below - UPDATED to match the image */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* How to Use Section with Proper Structure */}
        <Box sx={{ position: 'relative' }}>
          <Fade in={true} timeout={800}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#1A2E43' }}>
                How to Use the College GPA Calculator
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: '#4A5568' }}>
                College is hard enough; take a load off and use our online calculator to quickly get your college GPA. Calculate your semester GPA in just 3 easy steps, or add more courses and semesters to figure out your cumulative GPA. Check out our video for a quick tutorial.
              </Typography>
            </Box>
          </Fade>

          <Fade in={true} timeout={1000}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2D3748' }}>
                Step-by-Step Tutorial
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  If videos are not your thing you can easily get started by following the steps below. Only 1–3 are required; the rest are optional, but recommended.
                </Typography>
                <ol style={{ margin: 0, paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '16px' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Enter your course name
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4A5568' }}>
                      In the first column, enter the name of the course. This way you can keep track of which grade is assigned to which class.
                    </Typography>
                  </li>
                  <li style={{ marginBottom: '16px' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Enter your course grade
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4A5568' }}>
                      Next, enter the grade you received in that particular course by selecting a letter grade from the dropdown.
                    </Typography>
                  </li>
                  <li style={{ marginBottom: '16px' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Enter your course credits
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4A5568' }}>
                      Finally, enter the course's credit hours to calculate your score (most college classes are worth 3 or 4 credits).
                    </Typography>
                  </li>
                  <li style={{ marginBottom: '16px' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Add another course (optional)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4A5568' }}>
                      Select "add course" to optionally add another row to your semester. Then repeat steps 1–3 for the new addition.
                    </Typography>
                  </li>
                  <li style={{ marginBottom: '16px' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Add another semester (optional)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4A5568' }}>
                      Hit the "add semester" button to keep the party going. Record all your semesters and be rewarded with your cumulative GPA!
                    </Typography>
                  </li>
                </ol>
              </Box>
            </Box>
          </Fade>

          <Divider sx={{ my: 4 }} />

          <Fade in={true} timeout={1200}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2D3748' }}>
                Helpful Tips
              </Typography>
            </Box>
          </Fade>
        </Box>
        {/* Two small suggestion cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Zoom in={true} timeout={1400}>
              <Card sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2D3748', mb: 1 }}>
                    Understanding GPA Calculation
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4A5568' }}>
                    Learn how the scoring system works and how different components affect your final grade.
                    Master the basics of GPA calculation.
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} md={6}>
            <Zoom in={true} timeout={1600}>
              <Card sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2D3748', mb: 1 }}>
                    Tips for Success
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4A5568' }}>
                    Get practical advice on managing your coursework effectively and maintaining
                    good academic performance throughout the semester.
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}