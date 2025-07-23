const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["lab", "lecture"] },
    year: { type: String, required: true, enum: ["FY", "SY", "TY", "LY"] }
});

// Creating a compound index for unique subject-year combinations
subjectSchema.index({ name: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);