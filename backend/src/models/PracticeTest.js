const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
});

const PracticeTestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  timeLimit: { type: Number },
  passingScore: { type: Number },
  questions: [QuestionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  randomizeQuestions: { type: Boolean, default: false },
  showResults: { type: Boolean, default: true },
  allowRetake: { type: Boolean, default: true },
  status: { type: String, default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('PracticeTest', PracticeTestSchema); 