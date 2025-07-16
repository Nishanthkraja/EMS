const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true // Add index for better search performance
    },
    grade: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    rollNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    class: {
        type: String,
        trim: true
    },
    section: {
        type: String,
        trim: true
    },
    subjects: [{
        name: String,
        grade: Number
    }],
    attendance: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'graduated'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Create indexes for common queries
studentSchema.index({ grade: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ class: 1, section: 1 });

// Add a method to calculate average grade across all subjects
studentSchema.methods.calculateAverageGrade = function() {
    if (!this.subjects || this.subjects.length === 0) {
        return this.grade;
    }
    const sum = this.subjects.reduce((acc, subject) => acc + subject.grade, 0);
    return Math.round(sum / this.subjects.length);
};

module.exports = mongoose.model('Student', studentSchema);
