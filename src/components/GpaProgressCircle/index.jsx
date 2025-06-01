import React from 'react';
import { Box, Typography } from '@mui/material';

const GpaProgressCircle = ({ gpa = 0.0, maxGpa = 4.0 }) => {
  const progressValue = (gpa / maxGpa) * 100;
  const radius = 70;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progressValue / 100) * circumference;

  const getProgressColor = (gpaValue) => {
    if (gpaValue === 0) return '#F0C0C0';
    if (gpaValue < 2.0) return '#FF6B6B';
    if (gpaValue < 2.5) return '#FFD166';
    if (gpaValue < 3.5) return '#F8B64C';
    return '#06D6A0';
  };

  const progressColor = getProgressColor(gpa);

  return (
    <Box sx={{
      position: 'relative',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <svg width="160" height="160">
        {/* Background Circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#E5E7EB" // Màu xám nhạt cho nền
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={gpa === 0 ? '#E5E7EB' : progressColor} // Màu xám nhạt nếu GPA = 0
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      <Box sx={{
        position: 'absolute',
        textAlign: 'center',
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1A202C' }}>
          {gpa.toFixed(2)}
        </Typography>
        <Typography variant="caption" sx={{ color: '#718096' }}>
          Cumulative GPA
        </Typography>
      </Box>
    </Box>
  );
};

export default GpaProgressCircle;