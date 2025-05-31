const PracticeTest = require('../models/PracticeTest');

// Create a new practice test
exports.createPracticeTest = async (req, res) => {
  try {
    const { title, description, subject, timeLimit, passingScore, questions, randomizeQuestions, showResults, allowRetake, status } = req.body;
    const createdBy = req.user ? req.user._id : null;
    const test = new PracticeTest({
      title,
      description,
      subject,
      timeLimit,
      passingScore,
      questions,
      randomizeQuestions,
      showResults,
      allowRetake,
      status,
      createdBy
    });
    await test.save();
    res.status(201).json({ success: true, data: test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all practice tests
exports.getAllPracticeTests = async (req, res) => {
  try {
    const tests = await PracticeTest.find().populate('createdBy', 'fullName email');
    res.json({ success: true, data: tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get a single practice test by ID
exports.getPracticeTestById = async (req, res) => {
  try {
    const test = await PracticeTest.findById(req.params.id).populate('createdBy', 'fullName email');
    if (!test) return res.status(404).json({ success: false, message: 'Practice test not found' });
    res.json({ success: true, data: test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update a practice test
exports.updatePracticeTest = async (req, res) => {
  try {
    const { title, description, subject, timeLimit, passingScore, questions, randomizeQuestions, showResults, allowRetake, status } = req.body;
    const test = await PracticeTest.findByIdAndUpdate(
      req.params.id,
      { title, description, subject, timeLimit, passingScore, questions, randomizeQuestions, showResults, allowRetake, status },
      { new: true }
    );
    if (!test) return res.status(404).json({ success: false, message: 'Practice test not found' });
    res.json({ success: true, data: test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a practice test
exports.deletePracticeTest = async (req, res) => {
  try {
    const test = await PracticeTest.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Practice test not found' });
    res.json({ success: true, message: 'Practice test deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 