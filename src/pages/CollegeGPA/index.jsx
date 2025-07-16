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
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function CollegeGPA() {
  // State for Subject Structure selection
  const structureOptions = [
    "10-10-20-60",
    "10-20-20-50",
    "10-10-30-50",
    "10-10-20-60",
    "10-10-10-70",
    "10-30-60",
    "10-20-70",
    "10-10-80"
  ];
  const [structure, setStructure] = React.useState(structureOptions[0]);
  const handleChangeStructure = (event) => {
    setStructure(event.target.value);
    // ...Handle logic, calculate GPA, etc.
  };

  // State for scores (dynamically based on structure)
  const [scores, setScores] = React.useState({});

  React.useEffect(() => {
    // Reset scores when structure changes
    const parts = structure.split("-").map(Number);
    const newScores = {};
    let idx = 0;
    parts.forEach((weight, i) => {
      newScores[`score${i}`] = '';
    });
    setScores(newScores);
  }, [structure]);

  const handleScoreChange = (idx, value) => {
    setScores((prev) => ({ ...prev, [`score${idx}`]: value }));
  };

  const calculateScores = () => {
    const parts = structure.split("-").map(Number);
    let total10Scale = 0;
    parts.forEach((weight, i) => {
      const score = parseFloat(scores[`score${i}`]);
      if (!isNaN(score)) {
        total10Scale += score * (weight / 100);
      }
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

  const scoresResult = calculateScores();
  const gradeLetter = getGradeLetter(scoresResult.scale10);

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
                          {structureOptions.map((opt) => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Fade>

                    {/* Score display table */}
                    <Fade in={true} timeout={1400}>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              {structure.split("-").map((weight, idx) => (
                                <TableCell key={idx} align="center" sx={{ fontWeight: 'bold' }}>{`Score ${weight}%`}</TableCell>
                              ))}
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Grade (10)</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>GPA (4.0)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              {structure.split("-").map((weight, idx) => (
                                <TableCell key={idx} align="center">
                                  <TextField
                                    size="small"
                                    value={scores[`score${idx}`] || ''}
                                    onChange={e => handleScoreChange(idx, e.target.value)}
                                    placeholder="0-10"
                                    variant="outlined"
                                    inputProps={{ min: 0, max: 10, step: 0.01, style: { textAlign: 'center' } }}
                                  />
                                </TableCell>
                              ))}
                              <TableCell align="center" sx={{ fontWeight: 'bold', color: scoresResult.scale10 >= 5.0 ? 'green' : 'red' }}>
                                {scoresResult.scale10.toFixed(2)}
                              </TableCell>
                              <TableCell align="center" sx={{ fontWeight: 'bold', color: scoresResult.scale4 >= 2.0 ? 'green' : 'red' }}>
                                {scoresResult.scale4.toFixed(2)} ({gradeLetter})
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
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#1A2E43', textAlign: 'center' }}>
                How to Use the College GPA Calculator
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: '#4A5568', textAlign: 'center', maxWidth: 800, mx: 'auto', fontWeight: 400, lineHeight: 1.5 }}>
                College is hard enough; take a load off and use our online calculator to quickly get your college GPA. Calculate your semester GPA in just 3 easy steps, or add more courses and semesters to figure out your cumulative GPA. Check out our video for a quick tutorial.
              </Typography>
            </Box>
          </Fade>

          <Fade in={true} timeout={1000}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#1A2E43' }}>
                Step-by-Step Tutorial
              </Typography>
              <Box sx={{ background: '#e6fcf7', borderRadius: 3, p: 4, mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 3, color: '#222' }}>
                  If videos are not your thing you can easily get started by following the steps below. Only 1–3 are required; the rest are optional, but recommended.
                </Typography>
                {[{
                  title: 'Enter your course name',
                  desc: 'In the first column, enter the name of the course. This way you can keep track of which grade is assigned to which class.'
                }, {
                  title: 'Enter your course grade',
                  desc: 'Next, enter the grade you received in that particular course by selecting a letter grade from the dropdown.'
                }, {
                  title: 'Enter your course credits',
                  desc: "Finally, enter the course's credit hours to calculate your score (most college classes are worth 3 or 4 credits)."
                }].map((step, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
                    <Box sx={{
                      width: 36, height: 36, borderRadius: '50%', bgcolor: '#06c39f', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, mr: 3
                    }}>{idx + 1}</Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{step.title}</Typography>
                      <Typography variant="body2" sx={{ color: '#222', opacity: 0.85 }}>{step.desc}</Typography>
                    </Box>
                  </Box>
                ))}
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
        {/* Two small suggestion cards - NÂNG CẤP UI */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Zoom in={true} timeout={1400}>
              <Card sx={{
                height: '100%',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(22, 151, 125, 0.10)',
                p: 0,
                transition: 'transform 0.25s, box-shadow 0.25s',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.03)',
                  boxShadow: '0 16px 48px rgba(22, 151, 125, 0.18)',
                },
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                bgcolor: '#fff',
              }}>
                <CardContent sx={{ p: 4, width: '100%' }}>
                  <Box sx={{
                    width: 56, height: 56, borderRadius: 3,
                    background: 'linear-gradient(135deg, #06c39f 0%, #16977D 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2
                  }}>
                    <LightbulbIcon sx={{ color: '#fff', fontSize: 32 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A2E43', mb: 1 }}>
                    Understanding GPA Calculation
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4A5568', fontSize: 16 }}>
                    Learn how the scoring system works and how different components affect your final grade. Master the basics of GPA calculation.
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} md={6}>
            <Zoom in={true} timeout={1600}>
              <Card sx={{
                height: '100%',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(22, 151, 125, 0.10)',
                p: 0,
                transition: 'transform 0.25s, box-shadow 0.25s',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.03)',
                  boxShadow: '0 16px 48px rgba(22, 151, 125, 0.18)',
                },
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                bgcolor: '#fff',
              }}>
                <CardContent sx={{ p: 4, width: '100%' }}>
                  <Box sx={{
                    width: 56, height: 56, borderRadius: 3,
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e42 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2
                  }}>
                    <EmojiEventsIcon sx={{ color: '#fff', fontSize: 32 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A2E43', mb: 1 }}>
                    Tips for Success
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4A5568', fontSize: 16 }}>
                    Get practical advice on managing your coursework effectively and maintaining good academic performance throughout the semester.
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