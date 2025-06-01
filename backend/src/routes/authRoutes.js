const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize, verifyRefreshToken } = require('../middlewares/authMiddleware');
const multer = require('multer'); // Thêm nếu cần

// Public routes
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Token refresh route
router.post('/refresh-token', verifyRefreshToken, authController.refreshToken);

// Protected routes - require authentication
router.use(protect); // Apply protection to all routes below

// Profile routes
router.route('/profile')
    .get(authController.getUserProfile)
    .put(authController.updateUserProfile);

// Change password
router.put('/change-password', authController.changePassword);

// Admin and Teacher routes
router.get('/users', authorize('admin', 'teacher'), authController.getAllUsers);

// Add routes for specific user management (admin and teacher)
router.route('/users/:id')
    .get(authorize('admin', 'teacher'), authController.getUserById)
    .put(authorize('admin', 'teacher'), authController.updateUserById)
    .delete(authorize('admin'), authController.deleteUserById); // Keep delete as admin only

// Upload avatar route (if implemented)
router.post('/upload-avatar', authController.uploadAvatar);

module.exports = router;
