import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 300, sm: 400, md: 500 }, // Responsive width
  bgcolor: 'background.paper',
  border: '1px solid #ddd', // Lighter border
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  maxHeight: '90vh', // Limit max height
  overflowY: 'auto', // Add scrolling if content exceeds max height
};

const gradeOptions = ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']; // Keep numeric options for score10 input

function AddGpaEntryModal({ open, handleClose, handleSave }) {
  const [gpaEntryData, setGpaEntryData] = useState({
    semester: '',
    courses: [], // State to hold multiple course entries
  });

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;
    const newCourses = [...gpaEntryData.courses];
    newCourses[index][field] = value;
    setGpaEntryData({ ...gpaEntryData, courses: newCourses });
  };

  const handleSemesterChange = (e) => {
    setGpaEntryData({ ...gpaEntryData, semester: e.target.value });
  };

  const addCourse = () => {
    setGpaEntryData({ ...gpaEntryData, courses: [...gpaEntryData.courses, { courseName: '', score10: '', credits: '' }] });
  };

  const removeCourse = (index) => {
    const newCourses = [...gpaEntryData.courses];
    newCourses.splice(index, 1);
    setGpaEntryData({ ...gpaEntryData, courses: newCourses });
  };

  const onSave = () => {
    // Basic validation for semester
    if (!gpaEntryData.semester) {
        alert('Please enter the semester.');
        return;
    }

    if (gpaEntryData.courses.length === 0) {
        alert('Please add at least one course.');
        return;
    }

    const validEntries = [];
    for (const course of gpaEntryData.courses) {
        // Validate each course entry
        if (!course.courseName || course.score10 === '' || course.credits === '') {
            console.warn('Skipping incomplete course:', course);
            continue; // Skip incomplete entries
        }
         if (isNaN(parseFloat(course.score10)) || parseFloat(course.score10) < 0 || parseFloat(course.score10) > 10) {
            alert(`Invalid Score 10 for ${course.courseName || 'a course'}.`);
            return; // Stop saving if any score is invalid
        }
        if (isNaN(parseFloat(course.credits)) || parseFloat(course.credits) <= 0) {
             alert(`Invalid Credits for ${course.courseName || 'a course'}.`);
            return; // Stop saving if any credits is invalid
        }

        validEntries.push({
            ...course,
            semester: gpaEntryData.semester, // Assign the modal's semester to each entry
            score10: parseFloat(course.score10), // Ensure score10 is a number
            credits: parseFloat(course.credits), // Ensure credits is a number
        });
    }

    if (validEntries.length === 0) {
       alert('No valid course entries to save.');
       return;
    }

    handleSave(validEntries); // Pass the array of valid entries to the parent handler
    setGpaEntryData({
      semester: '',
      courses: [],
    }); // Reset form
  };

  const onCancel = () => {
      setGpaEntryData({
        semester: '',
        courses: [],
      }); // Reset form
      handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={onCancel} // Use onCancel for closing
      aria-labelledby="add-gpa-entry-modal-title"
      aria-describedby="add-gpa-entry-modal-description"
    >
      <Box sx={style}>
        <Typography id="add-gpa-entry-modal-title" variant="h6" component="h2" gutterBottom>
          Add New Course Entry
        </Typography>
        <Grid container spacing={2} direction="column"> {/* Use column direction for overall layout */}
           <Grid item xs={12}> {/* Semester field takes full width */}
             <TextField
                fullWidth
                label="Semester"
                name="semester"
                value={gpaEntryData.semester}
                onChange={handleSemesterChange} // Use dedicated handler for semester
                variant="outlined"
                size="small"
                sx={{ mb: 2 }} // Add margin bottom
             />
           </Grid>

            {/* List of Course Entries */}
            {gpaEntryData.courses.map((course, index) => (
              <Grid item xs={12} key={index}> {/* Each course entry row takes full width */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* Use Box with flex for horizontal layout */} 
                  <TextField
                    label="Course Name"
                    name="courseName"
                    value={course.courseName}
                    onChange={(e) => handleInputChange(e, index, 'courseName')}
                    variant="outlined"
                    size="small"
                    sx={{ flexGrow: 1 }} // Allow course name to take available space
                  />
                  <TextField
                    label="Score 10"
                    name="score10"
                    value={course.score10}
                    onChange={(e) => handleInputChange(e, index, 'score10')}
                    variant="outlined"
                    size="small"
                    type="number"
                    inputProps={{ step: 0.1, min: 0, max: 10 }}
                    sx={{ width: 90 }} // Fixed width for score
                  />
                  <TextField
                    label="Credits"
                    name="credits"
                    value={course.credits}
                    onChange={(e) => handleInputChange(e, index, 'credits')}
                    variant="outlined"
                    size="small"
                    type="number"
                    inputProps={{ step: 1, min: 1 }}
                    sx={{ width: 70 }} // Fixed width for credits
                  />
                  {/* Remove Course Button */}
                   <IconButton
                      size="small"
                      onClick={() => removeCourse(index)}
                      sx={{
                        color: '#D32F2F',
                        backgroundColor: 'rgba(211, 47, 47, 0.12)',
                        borderRadius: '4px', // Square corners for remove button in list
                         padding: '4px',
                         '&:hover': {
                           backgroundColor: '#D32F2F',
                           color: '#fff',
                         }
                      }}
                   >
                      <CloseIcon fontSize="small" />
                   </IconButton>
                </Box>
              </Grid>
            ))}

            {/* Add Course Button within the modal */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addCourse}
                fullWidth
              >
                Add Course
              </Button>
            </Grid>

        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddGpaEntryModal; 