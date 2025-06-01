const PracticeTest = require('../models/PracticeTest');
const PracticeTestResult = require('../models/PracticeTestResult');
const User = require('../models/User');
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
    console.log('[SUBMIT RESULT] testId:', testId, 'userId:', userId);
    console.log('[SUBMIT RESULT] answers:', answers);
    if (answers && typeof answers === 'object') {
      Object.entries(answers).forEach(([k, v]) => {
        console.log(`[SUBMIT RESULT] answer key:`, k, 'typeof:', typeof k, '| value:', v, 'typeof:', typeof v);
      });
    }
    console.log('PracticeTestResult saved:', result); // Debug log
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// API thống kê tổng hợp cho dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // Tổng số bài test
    const totalTests = await PracticeTest.countDocuments();
    // Tổng số attempts
    const attemptsAgg = await PracticeTestResult.aggregate([
      { $group: { _id: null, totalAttempts: { $sum: "$attempts" } } }
    ]);
    const totalAttempts = attemptsAgg[0]?.totalAttempts || 0;
    // Avg score toàn hệ thống
    const avgScoreAgg = await PracticeTestResult.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$score" } } }
    ]);
    const avgScore = avgScoreAgg[0]?.avgScore ? Math.round(avgScoreAgg[0].avgScore) : 0;
    // Tổng số học sinh
    const totalStudents = await User.countDocuments({ role: 'student' });
    // Tổng số giáo viên
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    res.json({
      success: true,
      data: {
        totalTests,
        totalAttempts,
        avgScore,
        totalStudents,
        totalTeachers
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// API analytics cho 1 bài practice test
exports.getPracticeTestAnalytics = async (req, res) => {
  try {
    const testId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ success: false, message: 'Invalid test id' });
    }
    // Lấy test
    const test = await PracticeTest.findById(testId);
    if (!test) return res.status(404).json({ success: false, message: 'Practice test not found' });

    // Lấy tất cả kết quả của test này
    const results = await PracticeTestResult.find({ test: testId }).populate('user', 'fullName email avatar');
    const totalAttempts = results.reduce((sum, r) => sum + (r.attempts || 1), 0);
    const avgScore = results.length ? (results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0;
    const passScore = test.passingScore || 70;
    const passCount = results.filter(r => r.score >= passScore).length;
    const passRate = results.length ? (passCount / results.length) * 100 : 0;
    const avgTimeSpent = results.length ? (results.reduce((sum, r) => sum + (r.timeSpent || 0), 0) / results.length) : 0;

    // Phân phối điểm
    const scoreDistribution = [
      { range: '90-100', count: 0 },
      { range: '80-89', count: 0 },
      { range: '70-79', count: 0 },
      { range: '60-69', count: 0 },
      { range: '50-59', count: 0 },
      { range: '0-49', count: 0 },
    ];
    results.forEach(r => {
      if (r.score >= 90) scoreDistribution[0].count++;
      else if (r.score >= 80) scoreDistribution[1].count++;
      else if (r.score >= 70) scoreDistribution[2].count++;
      else if (r.score >= 60) scoreDistribution[3].count++;
      else if (r.score >= 50) scoreDistribution[4].count++;
      else scoreDistribution[5].count++;
    });
    const total = results.length || 1;
    scoreDistribution.forEach(d => d.percentage = Math.round((d.count / total) * 1000) / 10);

    // Thống kê từng câu hỏi
    const questionStats = (test.questions || []).map((q, idx) => {
      let correct = 0, incorrect = 0, totalTime = 0, totalAns = 0;
      let answerStats = {};
      results.forEach(r => {
        const ans = r.answers ? r.answers[q._id] : undefined;
        if (ans !== undefined) {
          totalAns++;
          answerStats[ans] = (answerStats[ans] || 0) + 1;
          if (Number(ans) === Number(q.correctAnswer)) correct++;
          else incorrect++;
          totalTime += r.timeSpent || 0;
        }
      });
      // Tìm đáp án sai phổ biến nhất (không phải đáp án đúng)
      let commonWrongAnswer = null;
      let maxWrong = 0;
      for (const [ans, cnt] of Object.entries(answerStats)) {
        if (Number(ans) !== Number(q.correctAnswer) && cnt > maxWrong) {
          maxWrong = cnt;
          commonWrongAnswer = ans;
        }
      }
      return {
        id: q._id,
        question: q.questionText,
        type: q.type || 'multiple-choice',
        correctRate: totalAns ? Math.round((correct / totalAns) * 100) : 0,
        correctAnswers: correct,
        incorrectAnswers: incorrect,
        totalAnswers: totalAns,
        correctAnswer: q.correctAnswer,
        answerStats, // { answer: count }
        commonWrongAnswer: commonWrongAnswer || '',
        avgTimeSpent: totalAns ? Math.round(totalTime / totalAns) : 0,
      };
    });

    // Danh sách kết quả học sinh
    const studentResults = results.map(r => ({
      id: r._id,
      name: r.user?.fullName || 'Unknown',
      email: r.user?.email || '',
      avatar: r.user?.avatar || '',
      score: r.score,
      percentage: r.score,
      timeSpent: r.timeSpent,
      completedAt: r.submittedAt,
      status: r.score >= passScore ? 'passed' : 'failed',
      correctAnswers: Object.values(r.answers || {}).filter((ans, i) => {
        const q = test.questions.find(q => q._id.toString() === Object.keys(r.answers)[i]);
        return q && ans === q.correctAnswer;
      }).length,
      incorrectAnswers: Object.values(r.answers || {}).filter((ans, i) => {
        const q = test.questions.find(q => q._id.toString() === Object.keys(r.answers)[i]);
        return q && ans !== q.correctAnswer;
      }).length,
      attempts: r.attempts || 1,
    }));

    results.forEach((r, idx) => {
      console.log(`[ANALYTICS] Result #${idx} answers:`, r.answers);
      if (r.answers && typeof r.answers === 'object') {
        Object.entries(r.answers).forEach(([k, v]) => {
          console.log(`[ANALYTICS] answer key:`, k, 'typeof:', typeof k, '| value:', v, 'typeof:', typeof v);
        });
      }
    });

    res.json({
      success: true,
      data: {
        test: {
          id: test._id,
          title: test.title,
          description: test.description,
          createdAt: test.createdAt,
          timeLimit: test.timeLimit,
          passingScore: test.passingScore,
          totalQuestions: test.questions.length,
          maxScore: 100,
          status: test.status,
          attempts: totalAttempts,
          avgScore: Math.round(avgScore * 10) / 10,
          passRate: Math.round(passRate * 10) / 10,
          avgTimeSpent: Math.round(avgTimeSpent * 10) / 10,
        },
        scoreDistribution,
        questionAnalytics: questionStats,
        studentResults,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 