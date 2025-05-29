const GpaEntry = require('../models/GpaEntry');

// @desc    Thêm mục nhập GPA mới
// @route   POST /api/gpa
// @access  Private
exports.createGpaEntry = async (req, res) => {
    try {
        const { courseName, score10, credits, semester } = req.body;

        const gpaEntry = new GpaEntry({
            user: req.user._id, // Lấy user từ middleware xác thực
            courseName,
            score10,
            credits,
            semester,
        });

        const createdGpaEntry = await gpaEntry.save();
        res.status(201).json({
            success: true,
            data: createdGpaEntry,
            message: 'Thêm mục nhập GPA thành công'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + error.message
        });
    }
};

// @desc    Lấy tất cả mục nhập GPA của người dùng
// @route   GET /api/gpa
// @access  Private
exports.getUserGpaEntries = async (req, res) => {
    try {
        // Lấy tất cả GPA entries của user đã xác thực
        const gpaEntries = await GpaEntry.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: gpaEntries.length,
            data: gpaEntries,
            message: 'Lấy danh sách mục nhập GPA thành công'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + error.message
        });
    }
};

// @desc    Cập nhật mục nhập GPA theo ID
// @route   PUT /api/gpa/:id
// @access  Private
exports.updateGpaEntry = async (req, res) => {
    try {
        const { courseName, score10, credits, semester } = req.body;

        let gpaEntry = await GpaEntry.findById(req.params.id);

        if (!gpaEntry) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy mục nhập GPA'
            });
        }

        // Đảm bảo user sở hữu mục nhập này
        if (gpaEntry.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Không có quyền cập nhật mục nhập GPA này'
            });
        }

        // Cập nhật các trường, GPA 4.0 sẽ tự động tính lại nhờ pre-save hook
        gpaEntry.courseName = courseName || gpaEntry.courseName;
        gpaEntry.score10 = score10 || gpaEntry.score10;
        gpaEntry.credits = credits || gpaEntry.credits;
        gpaEntry.semester = semester || gpaEntry.semester;

        const updatedGpaEntry = await gpaEntry.save();

        res.status(200).json({
            success: true,
            data: updatedGpaEntry,
            message: 'Cập nhật mục nhập GPA thành công'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + error.message
        });
    }
};

// @desc    Xóa mục nhập GPA theo ID
// @route   DELETE /api/gpa/:id
// @access  Private
exports.deleteGpaEntry = async (req, res) => {
    try {
        let gpaEntry = await GpaEntry.findById(req.params.id);

        if (!gpaEntry) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy mục nhập GPA'
            });
        }

        // Đảm bảo user sở hữu mục nhập này
        if (gpaEntry.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Không có quyền xóa mục nhập GPA này'
            });
        }

        await gpaEntry.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
            message: 'Xóa mục nhập GPA thành công'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + error.message
        });
    }
};

// @desc    Lấy dữ liệu GPA cho biểu đồ hiệu suất
// @route   GET /api/gpa/performance
// @access  Private
exports.getGpaPerformance = async (req, res) => {
    try {
        // Lấy tất cả GPA entries của user, sắp xếp theo thời gian tạo
        const gpaEntries = await GpaEntry.find({ user: req.user._id }).sort({ createdAt: 1 });

        // Nhóm các mục nhập theo học kỳ và tính GPA theo kỳ
        const semestersData = gpaEntries.reduce((acc, entry) => {
            const semester = entry.semester || 'Unknown Semester';
            if (!acc[semester]) {
                acc[semester] = { entries: [], totalCredits: 0, totalWeightedGpa: 0 };
            }
            acc[semester].entries.push(entry);
            acc[semester].totalCredits += entry.credits;
            acc[semester].totalWeightedGpa += entry.gpa4 * entry.credits;
            return acc;
        }, {});

        const performanceData = [];
        let cumulativeTotalCredits = 0;
        let cumulativeTotalWeightedGpa = 0;

        // Tính GPA theo kỳ và GPA tích lũy, sắp xếp theo tên học kỳ
        const sortedSemesters = Object.keys(semestersData).sort();

        sortedSemesters.forEach(semesterName => {
            const semester = semestersData[semesterName];
            const termGpa = semester.totalCredits > 0 ? (semester.totalWeightedGpa / semester.totalCredits) : 0;

            cumulativeTotalCredits += semester.totalCredits;
            cumulativeTotalWeightedGpa += semester.totalWeightedGpa;
            const cumulativeGpa = cumulativeTotalCredits > 0 ? (cumulativeTotalWeightedGpa / cumulativeTotalCredits) : 0;

            performanceData.push({
                semester: semesterName,
                termGpa: parseFloat(termGpa.toFixed(2)),
                cumulativeGpa: parseFloat(cumulativeGpa.toFixed(2)),
            });
        });

        res.status(200).json({
            success: true,
            data: performanceData,
            message: 'Lấy dữ liệu hiệu suất GPA thành công'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + error.message
        });
    }
}; 