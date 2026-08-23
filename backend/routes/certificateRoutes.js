const express = require("express");
const router = express.Router();
const {
  saveCertificate,
  getUserCertificates,
} = require("../controllers/certificateController");

// Save Certificate
router.post("/save", saveCertificate);

// Get Certificates by User Email / User ID
router.get("/user/:userEmail", getUserCertificates);

module.exports = router;
