const express = require('express');
const router = express.Router();
const practiceTestController = require('../controllers/practiceTestController');
const { authenticate, authenticateOptional } = require('../middlewares/authMiddleware');

// Tạo mới practice test (giáo viên)
router.post('/', authenticate, practiceTestController.createPracticeTest);
// Lấy tất cả practice test (có thể có hoặc không user)
router.get('/', authenticateOptional, practiceTestController.getAllPracticeTests);
// Thống kê tổng hợp cho dashboard (ĐẶT TRƯỚC route /:id)
router.get('/dashboard-stats', practiceTestController.getDashboardStats);
// Nộp kết quả làm bài (user)
router.post('/submit-result', authenticate, practiceTestController.submitPracticeTestResult);
// Lấy 1 practice test theo id
router.get('/:id', practiceTestController.getPracticeTestById);
// Cập nhật practice test (giáo viên)
router.put('/:id', authenticate, practiceTestController.updatePracticeTest);
// Xóa practice test (giáo viên)
router.delete('/:id', authenticate, practiceTestController.deletePracticeTest);
// Lấy analytics của 1 bài practice test
router.get('/:id/analytics', practiceTestController.getPracticeTestAnalytics);

module.exports = router; 