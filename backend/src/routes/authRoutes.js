const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register - Đăng ký tài khoản
router.post('/register', authController.register);

// POST /api/auth/login - Đăng nhập
router.post('/login', authController.login);

// GET /api/auth/users - Lấy danh sách người dùng
router.get('/users', authController.getAllUsers);

module.exports = router;
