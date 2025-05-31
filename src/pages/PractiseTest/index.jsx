import React, { useEffect, useState } from 'react';
import anh1 from '../../assets/anh1.png';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Fade,
  Zoom
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import BookIcon from '@mui/icons-material/Book';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import GavelIcon from '@mui/icons-material/Gavel';
import { getAllPracticeTests } from '../../apis/practiceTestApi';
import { getAllSubjects } from '../../apis/subjectApi';

export default function PractiseTests() {
  const navigate = useNavigate();
  const { subject } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      const res = await getAllPracticeTests();
      if (res.success) setTests(res.data);
      setLoading(false);
    };
    fetchTests();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      const res = await getAllSubjects();
      if (res.success && Array.isArray(res.data)) {
        // Map icons/colors by subject code or name if needed
        const iconMap = {
          'database': StorageIcon,
          'computer-networks': NetworkCheckIcon,
          'web-security': SecurityIcon,
          'party-history': HistoryEduIcon,
          'general-law': GavelIcon,
          'political-economy': BookIcon,
        };
        const colorMap = {
          'database': '#2563eb',
          'computer-networks': '#9333ea',
          'web-security': '#e11d48',
          'party-history': '#ea580c',
          'general-law': '#4f46e5',
          'political-economy': '#16977D',
        };
        const iconList = [BookIcon, NetworkCheckIcon, StorageIcon, SecurityIcon, HistoryEduIcon, GavelIcon];
        setSubjects(res.data.map((subj, idx) => {
          let icon = iconMap[subj.code];
          if (!icon) {
            // Pick a random icon for unknown codes
            icon = iconList[Math.floor(Math.random() * iconList.length)];
          }
          return {
            ...subj,
            icon,
            color: colorMap[subj.code] || '#2563eb',
            path: `/practice/${subj.code}`,
          };
        }));
      } else {
        setSubjects([]);
      }
      setLoadingSubjects(false);
    };
    fetchSubjects();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Banner section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #16977D 0%, #0d5c4d 100%)',
          pb: 6,
          pt: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
          }
        }}
      >
        <Container maxWidth="lg">
          <Fade in={true} timeout={800}>
            <Typography
              variant="h3"
              sx={{
                color: '#fff',
                fontWeight: 800,
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Practice Tests
            </Typography>
          </Fade>
          <Fade in={true} timeout={1000}>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 600,
                lineHeight: 1.6,
                mb: 6
              }}
            >
              Choose a subject and start practicing with our comprehensive test collection
            </Typography>
          </Fade>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {loadingSubjects ? (
              <Typography>Loading subjects...</Typography>
            ) : (
              subjects.map((subject, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card
                      elevation={0}
                      sx={{
                        cursor: 'pointer',
                        height: '100%',
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
                          '& .subject-icon': {
                            transform: 'scale(1.1)'
                          }
                        }
                      }}
                      onClick={() => navigate(subject.path)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: `${subject.color}15`,
                            color: subject.color
                          }}
                        >
                          {React.createElement(subject.icon, {
                            className: 'subject-icon',
                            sx: {
                              fontSize: 32,
                              transition: 'transform 0.3s ease'
                            }
                          })}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: '#1e293b'
                          }}
                        >
                          {subject.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            lineHeight: 1.6
                          }}
                        >
                          {subject.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* Instructions section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            bgcolor: '#fff',
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #16977D 0%, #0d5c4d 100%)',
              py: 4,
              px: 4,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
              }
            }}
          >
            <Typography variant="h4" fontWeight="800">
              Practice Guide
            </Typography>
            <Typography sx={{ mt: 1, opacity: 0.9, maxWidth: 600 }}>
              Follow these steps to make the most of your learning experience
            </Typography>
          </Box>

          <Box sx={{ p: 6 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ mb: 4, color: '#16977D', fontWeight: 800 }}>
                  Getting Started
                </Typography>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  {[
                    {
                      step: '01',
                      title: 'Choose Your Subject',
                      desc: 'Select a subject that you want to practice from the available options'
                    },
                    {
                      step: '02',
                      title: 'Select Test Level',
                      desc: 'Pick a test that matches your current knowledge level'
                    },
                    {
                      step: '03',
                      title: 'Complete Questions',
                      desc: 'Answer all questions within the given time limit'
                    },
                    {
                      step: '04',
                      title: 'Review Results',
                      desc: 'Check your answers and learn from any mistakes'
                    }
                  ].map((item) => (
                    <Box key={item.step} sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start'
                    }}>
                      <Box
                        sx={{
                          backgroundColor: 'rgba(22, 151, 125, 0.1)',
                          color: '#16977D',
                          borderRadius: 2,
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.125rem',
                          fontWeight: 800,
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(22, 151, 125, 0.1)',
                          border: '2px solid rgba(22, 151, 125, 0.2)'
                        }}
                      >
                        {item.step}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 0.5,
                            color: '#1e293b'
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            lineHeight: 1.6
                          }}
                        >
                          {item.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 3, color: '#16977D', fontWeight: 'bold' }}>
                  Study Tips
                </Typography>
                <Grid container spacing={2}>
                  {[
                    {
                      title: 'Regular Practice',
                      desc: 'Set aside dedicated time for practice sessions'
                    },
                    {
                      title: 'Track Progress',
                      desc: 'Monitor your improvement over time'
                    },
                    {
                      title: 'Learn from Mistakes',
                      desc: 'Review incorrect answers to understand concepts better'
                    },
                    {
                      title: 'Time Management',
                      desc: 'Practice working within time constraints'
                    }
                  ].map((tip, index) => (
                    <Grid item xs={12} key={index}>
                      <Card
                        elevation={0}
                        sx={{
                          backgroundColor: 'rgba(22, 151, 125, 0.04)',
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          border: '1px solid rgba(22, 151, 125, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(22, 151, 125, 0.08)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(22, 151, 125, 0.1)',
                          }
                        }}
                      >
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {tip.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {tip.desc}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Danh sách bài Practice Test {subject ? `cho chủ đề: ${subject}` : ''}
        </Typography>
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : (
          <Grid container spacing={2}>
            {tests.filter(test => test.status === 'active' && (!subject || test.subject === subject)).length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary">Chưa có bài test nào được duyệt.</Typography>
              </Grid>
            )}
            {tests.filter(test => test.status === 'active' && (!subject || test.subject === subject)).map(test => (
              <Grid item xs={12} md={6} lg={4} key={test._id}>
                <Card
                  sx={{ cursor: 'pointer', borderRadius: 2, mb: 2, '&:hover': { boxShadow: 6 } }}
                  onClick={() => navigate(`/practice/${test.subject}/test/${test._id}`)}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {test.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {test.description}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      Chủ đề: {test.subject}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}