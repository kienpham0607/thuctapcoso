const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize, verifyRefreshToken } = require('../middlewares/authMiddleware');

// Public routes
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

// Admin only routes
router.get('/users', authorize('admin'), authController.getAllUsers);

// Add routes for specific user management (admin only)
router.route('/users/:id')
    .get(authorize('admin'), authController.getUserById)
    .put(authorize('admin'), authController.updateUserById)
    .delete(authorize('admin'), authController.deleteUserById);

// Upload avatar route (if implemented)
// router.post('/upload-avatar', upload.single('avatar'), authController.uploadAvatar);

module.exports = router;
