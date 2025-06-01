const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Load biến môi trường
dotenv.config();

// Kết nối MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json()); // parse JSON body
app.use('/uploads', express.static('uploads')); // serve static files from uploads directory

// Import routes
const authRoutes = require('./routes/authRoutes');
const gpaRoutes = require('./routes/gpaRoutes');
const practiceTestRoutes = require('./routes/practiceTestRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Sử dụng routes
app.use('/api/auth', authRoutes);
app.use('/api/gpa', gpaRoutes);
app.use('/api/practice-tests', practiceTestRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/contact', contactRoutes);

// Route mẫu kiểm tra
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Cổng server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
