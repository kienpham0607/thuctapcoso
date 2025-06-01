const Subject = require('../models/Subject');
const PracticeTest = require('../models/PracticeTest');

// Lấy tất cả subject kèm count thực tế
exports.getAllSubjects = async (req, res) => {
  try {
    // Lấy tất cả subject
    const subjects = await Subject.find();
    // Đếm số lượng bài test theo từng subject
    const counts = await PracticeTest.aggregate([
      { $group: { _id: "$subject", count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach(c => { countMap[c._id] = c.count; });
    // Gán count thực tế vào subject
    const subjectsWithCount = subjects.map(s => ({
      ...s.toObject(),
      count: countMap[s.value] || 0
    }));
    res.json({ success: true, data: subjectsWithCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Thêm subject mới
exports.createSubject = async (req, res) => {
  try {
    const { label, value, icon } = req.body;
    if (!label || !value) return res.status(400).json({ success: false, message: 'Missing label or value' });
    const exists = await Subject.findOne({ value });
    if (exists) return res.status(400).json({ success: false, message: 'Subject already exists' });
    const subject = new Subject({ label, value, icon });
    await subject.save();
    res.status(201).json({ success: true, data: subject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa subject
exports.deleteSubject = async (req, res) => {
  try {
    const { value } = req.params;
    const subject = await Subject.findOneAndDelete({ value });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 