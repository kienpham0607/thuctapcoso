const Subject = require('../models/Subject');

// Lấy tất cả subject
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json({ success: true, data: subjects });
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