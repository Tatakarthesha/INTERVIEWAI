const express = require("express");

const router = express.Router();

const {
  saveInterview,
  getDashboardAnalytics,
} = require("../controllers/interviewController");

// Save Interview
router.post("/save", saveInterview);

// Dashboard Analytics
router.get(
  "/dashboard/:userEmail",
  getDashboardAnalytics
);

module.exports = router;