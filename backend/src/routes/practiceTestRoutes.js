const express = require('express');
const router = express.Router();
const practiceTestController = require('../controllers/practiceTestController');
const { authenticate } = require('../middlewares/authMiddleware');

// Tạo mới practice test (giáo viên)
router.post('/', authenticate, practiceTestController.createPracticeTest);
// Lấy tất cả practice test
router.get('/', practiceTestController.getAllPracticeTests);
// Lấy 1 practice test theo id
router.get('/:id', practiceTestController.getPracticeTestById);
// Cập nhật practice test (giáo viên)
router.put('/:id', authenticate, practiceTestController.updatePracticeTest);
// Xóa practice test (giáo viên)
router.delete('/:id', authenticate, practiceTestController.deletePracticeTest);

module.exports = router; 