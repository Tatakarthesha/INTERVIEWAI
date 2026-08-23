const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    sessionId: {
      type: String,
      default: "",
    },
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      default: "Candidate",
    },
    domain: {
      type: String,
      required: true,
      default: "General Domain",
    },
    overallScore: {
      type: Number,
      required: true,
      default: 0,
    },
    communicationScore: {
      type: String,
      default: "0/0",
    },
    technicalScore: {
      type: String,
      default: "0/0",
    },
    confidenceScore: {
      type: String,
      default: "0/0",
    },
    grade: {
      type: String,
      default: "C",
    },
    performanceBadge: {
      type: String,
      default: "📚 Needs Improvement",
    },
    completionDate: {
      type: Date,
      default: Date.now,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    interviewType: {
      type: String,
      default: "AI",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Certificate", certificateSchema);
