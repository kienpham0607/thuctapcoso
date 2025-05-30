const GpaEntry = require('../models/GpaEntry');

// hêm mục nhập GPA mới
// POST /api/gpa
// Private
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

// Lấy tất cả mục nhập GPA của người dùng
//  GET /api/gpa
// Private
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
        gpaEntry.courseName = courseName !== undefined ? courseName : gpaEntry.courseName;
        gpaEntry.score10 = score10 !== undefined ? score10 : gpaEntry.score10;
        gpaEntry.credits = credits !== undefined ? credits : gpaEntry.credits;
        gpaEntry.semester = semester !== undefined ? semester : gpaEntry.semester;

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

// @desc    Thêm nhiều mục nhập GPA mới cùng lúc
// @route   POST /api/gpa/bulk
// @access  Private
exports.createBulkGpaEntries = async (req, res) => {
    try {
        const gpaEntries = req.body; // Expecting an array of GPA entries
        const userId = req.user._id;

        if (!Array.isArray(gpaEntries) || gpaEntries.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Yêu cầu phải chứa một mảng các mục nhập GPA.'
            });
        }

        // Prepare entries for insertion, adding user ID to each
        const entriesToInsert = gpaEntries.map(entry => ({
            ...entry,
            user: userId
        }));

        // Insert many documents
        const createdEntries = await GpaEntry.insertMany(entriesToInsert, { ordered: false }); // ordered: false allows inserting valid documents even if some fail

        res.status(201).json({
            success: true,
            count: createdEntries.length,
            data: createdEntries,
            message: 'Thêm nhiều mục nhập GPA thành công'
        });

    } catch (error) {
        // Handle validation errors or other insertion errors from insertMany
        console.error('Error during bulk GPA entry creation:', error);

        // Mongoose bulk insert errors are often different. Check error.writeErrors or error.errors
        if (error.writeErrors || error.name === 'ValidationError') {
             const messages = error.writeErrors ? 
                error.writeErrors.map(err => err.errmsg || err.message) : // Handle WriteErrors from bulk insert
                Object.values(error.errors).map(val => val.message); // Handle standard ValidationErrors

             return res.status(400).json({
                success: false,
                message: 'Lỗi khi thêm một hoặc nhiều mục nhập: ' + messages.join(', ')
            });
        } else if (error.code === 11000) { // Handle duplicate key errors
             return res.status(400).json({
                success: false,
                message: 'Có mục nhập trùng lặp.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi server khi thêm nhiều mục nhập: ' + error.message
        });
    }
}; 