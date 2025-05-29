const mongoose = require('mongoose');

const GpaEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courseName: {
        type: String,
        required: true,
        trim: true,
    },
    score10: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    gpa4: {
        type: Number,
        min: 0,
        max: 4,
    },
    credits: {
        type: Number,
        required: true,
        min: 0,
    },
    semester: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Tính toán gpa4 trước khi lưu
GpaEntrySchema.pre('save', function(next) {
    if (this.score10 >= 9) {
        this.gpa4 = 4.0;
    } else if (this.score10 >= 8) {
        this.gpa4 = 3.5;
    } else if (this.score10 >= 7) {
        this.gpa4 = 3.0;
    } else if (this.score10 >= 6) {
        this.gpa4 = 2.5;
    } else if (this.score10 >= 5) {
        this.gpa4 = 2.0;
    } else if (this.score10 >= 4) {
         this.gpa4 = 1.5;
    } else {
        this.gpa4 = 0;
    }
    next();
});

const GpaEntry = mongoose.model('GpaEntry', GpaEntrySchema);

module.exports = GpaEntry; 