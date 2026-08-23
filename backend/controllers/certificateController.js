const Certificate = require("../models/Certificate");

// Save or Update Certificate
const saveCertificate = async (req, res) => {
  try {
    const {
      id,
      certificateId,
      sessionId,
      userId,
      userEmail,
      candidateEmail,
      userName,
      candidateName,
      domain,
      score,
      overallScore,
      communicationScore,
      technicalScore,
      confidenceScore,
      grade,
      badge,
      performanceBadge,
      completionDate,
      issueDate,
      interviewType,
    } = req.body;

    const certId = certificateId || id;
    const email = userEmail || candidateEmail;
    const name = userName || candidateName || "Candidate";
    const finalScore = overallScore !== undefined ? Number(overallScore) : Number(score) || 0;
    const targetSessionId = sessionId || "";

    if (!certId || !email) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID and User Email are required",
      });
    }

    // 1. Check if certificate exists by certificateId
    let cert = null;
    if (certId) {
      cert = await Certificate.findOne({ certificateId: certId });
    }

    // 2. Check by sessionId if not found
    if (!cert && targetSessionId) {
      cert = await Certificate.findOne({ sessionId: targetSessionId });
    }

    // 3. Check for a duplicate certificate created within last 5 minutes with identical email, domain, and score
    if (!cert && email && domain) {
      const fiveMinutesAgo = new Date(Date.now() - 300000);
      cert = await Certificate.findOne({
        userEmail: email,
        domain: domain,
        overallScore: finalScore,
        createdAt: { $gte: fiveMinutesAgo },
      });
    }

    if (cert) {
      // Update existing record to prevent duplicate entries
      cert.userName = name;
      cert.userEmail = email;
      cert.userId = userId || cert.userId || email;
      cert.domain = domain || cert.domain;
      cert.overallScore = finalScore;
      cert.communicationScore = communicationScore || cert.communicationScore;
      cert.technicalScore = technicalScore || cert.technicalScore;
      cert.confidenceScore = confidenceScore || cert.confidenceScore;
      cert.grade = grade || cert.grade;
      cert.performanceBadge = performanceBadge || badge || cert.performanceBadge;
      if (targetSessionId) cert.sessionId = targetSessionId;
      if (completionDate) cert.completionDate = completionDate;
      if (issueDate) cert.issueDate = issueDate;
      await cert.save();
    } else {
      // Create new certificate record
      cert = new Certificate({
        certificateId: certId,
        sessionId: targetSessionId,
        userId: userId || email,
        userEmail: email,
        userName: name,
        domain: domain || "General Domain",
        overallScore: finalScore,
        communicationScore: communicationScore || "0/0",
        technicalScore: technicalScore || "0/0",
        confidenceScore: confidenceScore || "0/0",
        grade: grade || "C",
        performanceBadge: performanceBadge || badge || "📚 Needs Improvement",
        completionDate: completionDate || new Date(),
        issueDate: issueDate || new Date(),
        interviewType: interviewType || "AI",
      });
      await cert.save();
    }

    res.status(201).json({
      success: true,
      message: "Certificate saved successfully",
      certificate: cert,
    });
  } catch (error) {
    console.error("Error saving certificate:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User Certificates
const getUserCertificates = async (req, res) => {
  try {
    const { userEmail } = req.params;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email parameter is required",
      });
    }

    // Find certificates matching userEmail or userId, sorted newest to oldest
    const certificates = await Certificate.find({
      $or: [{ userEmail: userEmail }, { userId: userEmail }],
    }).sort({ completionDate: -1, createdAt: -1 });

    // Deduplicate existing records in database (remove near-identical duplicates created concurrently)
    const uniqueCertificates = [];
    const idsToDelete = [];

    for (const cert of certificates) {
      const duplicateIndex = uniqueCertificates.findIndex((existing) => {
        // Match by exact sessionId if both present
        if (cert.sessionId && existing.sessionId && cert.sessionId === existing.sessionId) {
          return true;
        }
        // Match by identical domain, overallScore, and completionDate within 5 minutes (300,000ms)
        const timeDiff = Math.abs(new Date(cert.completionDate || cert.createdAt) - new Date(existing.completionDate || existing.createdAt));
        const isSameSession =
          cert.domain === existing.domain &&
          Number(cert.overallScore) === Number(existing.overallScore) &&
          timeDiff < 300000;

        return isSameSession;
      });

      if (duplicateIndex >= 0) {
        // Flag duplicate for deletion from MongoDB
        idsToDelete.push(cert._id);
      } else {
        uniqueCertificates.push(cert);
      }
    }

    // Perform background async cleanup of duplicate DB documents if found
    if (idsToDelete.length > 0) {
      Certificate.deleteMany({ _id: { $in: idsToDelete } }).catch((err) =>
        console.error("Error cleaning up duplicate certificates:", err)
      );
    }

    // Format certificates for frontend compatibility
    const formatted = uniqueCertificates.map((c) => ({
      id: c.certificateId,
      certificateId: c.certificateId,
      sessionId: c.sessionId,
      userId: c.userId,
      userEmail: c.userEmail,
      candidateEmail: c.userEmail,
      userName: c.userName,
      candidateName: c.userName,
      domain: c.domain,
      score: c.overallScore,
      overallScore: c.overallScore,
      communicationScore: c.communicationScore,
      technicalScore: c.technicalScore,
      confidenceScore: c.confidenceScore,
      grade: c.grade,
      badge: c.performanceBadge,
      performanceBadge: c.performanceBadge,
      completionDate: c.completionDate,
      issueDate: c.issueDate,
      interviewType: c.interviewType,
      _id: c._id,
    }));

    res.json({
      success: true,
      certificates: formatted,
    });
  } catch (error) {
    console.error("Error fetching user certificates:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveCertificate,
  getUserCertificates,
};
