const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },

    interviewType: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      default: "",
    },

    attempt: {
      type: Number,
      default: 1,
    },

    score: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    answers: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Interview",
  interviewSchema
);