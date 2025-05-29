const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); // Giả định bạn có middleware xác thực

// POST /api/auth/register - Đăng ký tài khoản
router.post('/register', authController.register);

// POST /api/auth/login - Đăng nhập
router.post('/login', authController.login);

// POST /api/auth/refresh-token - Làm mới Access Token
router.post('/refresh-token', authController.refreshToken);

// POST /api/auth/logout - Đăng xuất
router.post('/logout', authController.logout);

// Private routes (cần xác thực)
// GET /api/auth/profile - Lấy thông tin profile
router.get('/profile', protect, authController.getUserProfile);
// PUT /api/auth/profile - Cập nhật thông tin profile
router.put('/profile', protect, authController.updateUserProfile);

module.exports = router;
