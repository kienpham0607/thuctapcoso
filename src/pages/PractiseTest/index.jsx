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

const iconComponentMap = {
  BookIcon,
  StorageIcon,
  NetworkCheckIcon,
  SecurityIcon,
  HistoryEduIcon,
  GavelIcon
};

export default function PractiseTests() {
  const navigate = useNavigate();
  const { subject } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(subjects.length / pageSize);

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
        setSubjects(res.data.map((subj) => {
          const iconComponent = iconComponentMap[subj.icon] || BookIcon;
          return {
            ...subj,
            icon: iconComponent,
            color: '#2563eb', // hoặc logic màu như cũ nếu muốn
            path: `/practice/${subj.value}`,
          };
        }));
      } else {
        setSubjects([]);
      }
      setLoadingSubjects(false);
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    setPage(1); // Reset về trang 1 khi subjects thay đổi
  }, [subjects.length]);

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
              subjects.slice((page-1)*pageSize, page*pageSize).map((subject, index) => (
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
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                sx={{
                  minWidth: 40,
                  borderRadius: '50%',
                  fontWeight: 700,
                  color: '#16977D',
                  borderColor: '#16977D',
                  '&:hover': { background: '#e6f4f1', borderColor: '#16977D' }
                }}
              >
                &#8592;
              </Button>
              {[...Array(totalPages)].map((_, i) => {
                // Hiện trang đầu, cuối, trang hiện tại và lân cận
                if (
                  i === 0 ||
                  i === totalPages - 1 ||
                  Math.abs(i + 1 - page) <= 1
                ) {
                  return (
                    <Button
                      key={i}
                      variant={page === i + 1 ? 'contained' : 'outlined'}
                      onClick={() => setPage(i + 1)}
                      sx={{
                        minWidth: 40,
                        borderRadius: '50%',
                        fontWeight: 700,
                        mx: 0.5,
                        background: page === i + 1 ? '#16977D' : undefined,
                        color: page === i + 1 ? '#fff' : '#16977D',
                        borderColor: '#16977D',
                        '&:hover': {
                          background: page === i + 1 ? '#12725f' : '#e6f4f1',
                          borderColor: '#16977D'
                        }
                      }}
                    >
                      {i + 1}
                    </Button>
                  );
                }
                // Hiện dấu ... nếu cần
                if (
                  (i === 1 && page > 3) ||
                  (i === totalPages - 2 && page < totalPages - 2)
                ) {
                  return (
                    <Box key={i} sx={{ minWidth: 32, textAlign: 'center', color: '#999', pt: 1 }}>
                      ...
                    </Box>
                  );
                }
                return null;
              })}
              <Button
                variant="outlined"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                sx={{
                  minWidth: 40,
                  borderRadius: '50%',
                  fontWeight: 700,
                  color: '#16977D',
                  borderColor: '#16977D',
                  '&:hover': { background: '#e6f4f1', borderColor: '#16977D' }
                }}
              >
                &#8594;
              </Button>
            </Box>
          )}
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
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', letterSpacing: 0.5 }}>
          Practice Test List {subject ? `for subject: ${subject}` : ''}
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={4}>
            {tests.filter(test => test.status === 'active' && (!subject || test.subject === subject)).length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary" align="center">No approved test available.</Typography>
              </Grid>
            )}
            {tests.filter(test => test.status === 'active' && (!subject || test.subject === subject)).map(test => (
              <Grid item xs={12} md={6} lg={4} key={test._id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 4,
                    mb: 2,
                    boxShadow: '0 4px 24px rgba(22, 151, 125, 0.10)',
                    transition: 'transform 0.22s, box-shadow 0.22s',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(22, 151, 125, 0.18)',
                      transform: 'translateY(-6px) scale(1.03)',
                    },
                    p: 0,
                  }}
                  onClick={() => navigate(`/practice/${test.subject}/test/${test._id}`)}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                      {test.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {test.description}
                    </Typography>
                    <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                      Subject: {test.subject}
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