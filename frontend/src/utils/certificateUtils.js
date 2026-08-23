import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { getUser, getUserData, saveUserData } from "./storage";
import { API_BASE_URL } from "../config";

/**
 * Calculates Grade and Performance Badge based on Overall Score (0 - 10)
 * 9.0–10.0 -> Grade: A+, Badge: 🏆 Excellent
 * 8.0–8.9  -> Grade: A,  Badge: 🌟 Very Good
 * 7.0–7.9  -> Grade: B+, Badge: 👍 Good
 * 6.0–6.9  -> Grade: B,  Badge: 📘 Satisfactory
 * Below 6.0 -> Grade: C, Badge: 📚 Needs Improvement
 */
export const getGradeAndBadge = (scoreNum) => {
  const score = Number(scoreNum) || 0;

  if (score >= 9.0) {
    return { grade: "A+", badge: "🏆 Excellent" };
  } else if (score >= 8.0) {
    return { grade: "A", badge: "🌟 Very Good" };
  } else if (score >= 7.0) {
    return { grade: "B+", badge: "👍 Good" };
  } else if (score >= 6.0) {
    return { grade: "B", badge: "📘 Satisfactory" };
  } else {
    return { grade: "C", badge: "📚 Needs Improvement" };
  }
};

/**
 * Generates a unique Certificate ID
 */
export const generateCertificateId = () => {
  const prefix = "KPI-CERT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Formats date into readable string
 */
export const formatDate = (dateInput) => {
  const dateObj = dateInput ? new Date(dateInput) : new Date();
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Retrieves cached certificates for current user from localStorage
 */
export const getCertificates = () => {
  return getUserData("certificates") || [];
};

/**
 * Fetches all earned certificates for current user from MongoDB Backend
 */
export const fetchCertificates = async (userEmail) => {
  const user = getUser();
  const targetEmail = userEmail || user?.email;

  if (!targetEmail) {
    return getCertificates();
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/certificates/user/${encodeURIComponent(targetEmail)}`
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.certificates)) {
        saveUserData("certificates", data.certificates);
        return data.certificates;
      }
    }
  } catch (err) {
    console.error("Error fetching certificates from backend:", err);
  }

  // Fallback to local storage
  return getCertificates();
};

/**
 * Saves a new certificate record permanently in MongoDB backend & localStorage
 */
export const saveCertificate = async (certData) => {
  const user = getUser();
  const certId = certData.id || certData.certificateId || generateCertificateId();
  const email = certData.candidateEmail || certData.userEmail || user?.email;
  const name = certData.candidateName || certData.userName || user?.name || "Candidate";
  const userId = certData.userId || user?._id || user?.id || email;

  const normalizedCert = {
    ...certData,
    id: certId,
    certificateId: certId,
    userId,
    userEmail: email,
    candidateEmail: email,
    userName: name,
    candidateName: name,
    score: certData.score !== undefined ? certData.score : certData.overallScore,
    overallScore: certData.overallScore !== undefined ? certData.overallScore : certData.score,
  };

  // 1. Update localStorage cache for instant UI feedback
  const existing = getCertificates();
  const foundIndex = existing.findIndex(
    (c) => (c.id && c.id === certId) || (c.certificateId && c.certificateId === certId)
  );

  let updatedList;
  if (foundIndex >= 0) {
    updatedList = [...existing];
    updatedList[foundIndex] = { ...updatedList[foundIndex], ...normalizedCert };
  } else {
    updatedList = [normalizedCert, ...existing];
  }
  saveUserData("certificates", updatedList);

  // 2. Persist permanently to MongoDB backend
  try {
    const payload = {
      id: certId,
      certificateId: certId,
      userId,
      userEmail: email,
      candidateEmail: email,
      userName: name,
      candidateName: name,
      domain: certData.domain || "General Domain",
      score: certData.score !== undefined ? certData.score : certData.overallScore,
      overallScore: certData.overallScore !== undefined ? certData.overallScore : certData.score,
      communicationScore: certData.communicationScore || "0/0",
      technicalScore: certData.technicalScore || "0/0",
      confidenceScore: certData.confidenceScore || "0/0",
      grade: certData.grade,
      badge: certData.badge || certData.performanceBadge,
      performanceBadge: certData.performanceBadge || certData.badge,
      completionDate: certData.completionDate || new Date().toISOString(),
      issueDate: certData.issueDate || new Date().toISOString(),
      interviewType: certData.interviewType || "AI",
    };

    const res = await fetch(`${API_BASE_URL}/certificates/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.certificate) {
        return normalizedCert;
      }
    }
  } catch (err) {
    console.error("Error persisting certificate to backend DB:", err);
  }

  return normalizedCert;
};

/**
 * Converts a DOM certificate element to a high-quality landscape PDF document
 */
export const downloadCertificateAsPDF = async (element, filename = "KP_Interview_Certificate.pdf") => {
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution capture
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    // A4 dimensions in landscape: 297mm x 210mm
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (err) {
    console.error("Error generating Certificate PDF:", err);
    alert("Failed to generate certificate PDF. Please try again.");
  }
};
