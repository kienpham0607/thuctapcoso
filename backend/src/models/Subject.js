const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model('Subject', SubjectSchema); 