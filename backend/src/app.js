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
app.use(cors());
app.use(express.json()); // parse JSON body
app.use('/uploads', express.static('uploads')); // serve static files from uploads directory

// Import routes
const authRoutes = require('./routes/authRoutes');
const gpaRoutes = require('./routes/gpaRoutes');

// Sử dụng routes
app.use('/api/auth', authRoutes);
app.use('/api/gpa', gpaRoutes);

// Route mẫu kiểm tra
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Cổng server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
