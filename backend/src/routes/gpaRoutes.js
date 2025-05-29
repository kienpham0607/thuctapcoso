const express = require('express');
const router = express.Router();
const gpaController = require('../controllers/gpaController');
const { protect } = require('../middlewares/authMiddleware'); // Giả định bạn có middleware xác thực

// Tất cả các route dưới đây đều cần xác thực người dùng
router.use(protect);

// POST /api/gpa - Thêm mục nhập GPA mới
router.post('/', gpaController.createGpaEntry);

// GET /api/gpa - Lấy tất cả mục nhập GPA của người dùng
router.get('/', gpaController.getUserGpaEntries);

// GET /api/gpa/performance - Lấy dữ liệu GPA cho biểu đồ hiệu suất
router.get('/performance', gpaController.getGpaPerformance);

// PUT /api/gpa/:id - Cập nhật mục nhập GPA theo ID
router.put('/:id', gpaController.updateGpaEntry);

// DELETE /api/gpa/:id - Xóa mục nhập GPA theo ID
router.delete('/:id', gpaController.deleteGpaEntry);

module.exports = router; 