const mongoose = require('mongoose');

const PracticeTestResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'PracticeTest', required: true },
  score: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  attempts: { type: Number, default: 1 },
  answers: { type: Object, default: {} }, // { questionId: answer }
  timeSpent: { type: Number }, // in minutes
  submittedAt: { type: Date, default: Date.now }
});

PracticeTestResultSchema.index({ user: 1, test: 1 }, { unique: true });

module.exports = mongoose.model('PracticeTestResult', PracticeTestResultSchema); 