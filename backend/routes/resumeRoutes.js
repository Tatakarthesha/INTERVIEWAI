const express = require("express");
const router = express.Router();

const {
  analyze,
} = require("../controllers/resumeController");

router.post("/analyze", analyze);

module.exports = router;