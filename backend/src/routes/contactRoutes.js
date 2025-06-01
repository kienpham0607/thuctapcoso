const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Gửi message
router.post('/', contactController.sendMessage);

// Lấy tất cả message (admin and teacher)
router.get('/', protect, authorize('admin', 'teacher'), contactController.getMessages);

// Phản hồi message (admin and teacher)
router.patch('/:id/reply', protect, authorize('admin', 'teacher'), contactController.replyMessage);

// Xóa message (admin and teacher)
router.delete('/:id', protect, authorize('admin', 'teacher'), contactController.deleteMessage);

module.exports = router; 