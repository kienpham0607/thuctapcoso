const PracticeTest = require('../models/PracticeTest');
const PracticeTestResult = require('../models/PracticeTestResult');
const mongoose = require('mongoose');

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

// Get all practice tests, with optional subject/status filter
exports.getAllPracticeTests = async (req, res) => {
  try {
    const { subject, status } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (status) filter.status = status;
    const tests = await PracticeTest.find(filter).populate('createdBy', 'fullName email');

    // Lấy tổng số attempts cho mỗi test từ tất cả user
    const attemptsAgg = await PracticeTestResult.aggregate([
      { $group: { _id: "$test", totalAttempts: { $sum: "$attempts" } } }
    ]);
    const attemptsMap = {};
    let totalAttemptsAll = 0;
    attemptsAgg.forEach(a => {
      attemptsMap[a._id.toString()] = a.totalAttempts;
      totalAttemptsAll += a.totalAttempts;
    });

    // Lấy avgScore cho mỗi test từ tất cả user
    const avgScoreAgg = await PracticeTestResult.aggregate([
      { $group: { _id: "$test", avgScore: { $avg: "$score" } } }
    ]);
    const avgScoreMap = {};
    avgScoreAgg.forEach(a => {
      avgScoreMap[a._id.toString()] = a.avgScore;
    });

    // Nếu có user đăng nhập, join thêm kết quả của user đó
    let userResults = [];
    if (req.user && req.user._id) {
      userResults = await PracticeTestResult.find({ user: req.user._id });
    }
    // Map kết quả vào từng test
    const testsWithResult = tests.map(test => {
      let foundResult = null;
      for (const r of userResults) {
        if (r.test.toString() === test._id.toString()) {
          foundResult = r;
          break;
        }
      }
      return {
        ...test.toObject(),
        completed: !!foundResult,
        score: foundResult ? foundResult.score : null,
        attempts: foundResult ? foundResult.attempts : 0, // attempts của user hiện tại
        totalAttempts: attemptsMap[test._id.toString()] || 0, // tổng tất cả user
        avgScore: typeof avgScoreMap[test._id.toString()] === 'number' ? Math.round(avgScoreMap[test._id.toString()]) : 0, // trung bình điểm
        lastSubmitted: foundResult ? foundResult.submittedAt : null,
      };
    });
    res.json({ success: true, data: testsWithResult, totalAttempts: totalAttemptsAll });
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

// Submit or update a user's practice test result
exports.submitPracticeTestResult = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const { testId, answers, score, timeSpent, completed } = req.body;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!testId) return res.status(400).json({ success: false, message: 'Missing testId' });

    const testObjectId = new mongoose.Types.ObjectId(testId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    // Find existing result
    let result = await PracticeTestResult.findOne({ user: userObjectId, test: testObjectId });
    if (result) {
      // Update existing result
      result.answers = answers;
      result.score = score;
      result.timeSpent = timeSpent;
      result.completed = completed !== undefined ? completed : true;
      result.attempts += 1;
      result.submittedAt = new Date();
      await result.save();
    } else {
      // Create new result
      result = await PracticeTestResult.create({
        user: userObjectId,
        test: testObjectId,
        answers,
        score,
        timeSpent,
        completed: completed !== undefined ? completed : true,
        attempts: 1,
        submittedAt: new Date()
      });
    }
    console.log('PracticeTestResult saved:', result); // Debug log
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 