import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 15000,
});

const generateFrontendFallback = (question, answer) => {
  const trimmed = (answer || "").trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  let score = 7.0;
  let communication = "Good";
  let technicalKnowledge = "Satisfactory";
  let confidence = "Good";
  const feedback = [];

  if (wordCount === 0) {
    score = 3.0;
    communication = "Needs Improvement";
    technicalKnowledge = "Incomplete";
    confidence = "Low";
    feedback.push("No answer was provided.");
    feedback.push("Please try to explain the fundamental principles in your own words.");
  } else if (wordCount < 10) {
    score = 5.5;
    communication = "Satisfactory";
    technicalKnowledge = "Basic";
    confidence = "Moderate";
    feedback.push("Your answer is brief. Try adding technical details and frameworks.");
    feedback.push("Provide practical code or architecture examples to strengthen your response.");
  } else if (wordCount < 35) {
    score = 7.5;
    communication = "Good";
    technicalKnowledge = "Good";
    confidence = "Good";
    feedback.push("Solid response covering key concepts.");
    feedback.push("Consider detailing performance trade-offs or edge-case handling.");
  } else {
    score = 8.8;
    communication = "Very Good";
    technicalKnowledge = "Excellent";
    confidence = "Excellent";
    feedback.push("Detailed response showing good technical depth.");
    feedback.push("Great clarity and structure. Continue giving structured answers.");
  }

  return {
    score,
    communication,
    technicalKnowledge,
    confidence,
    feedback,
  };
};

export const evaluateAnswer = async (question, answer) => {
  try {
    const response = await API.post("/ai/evaluate", {
      question,
      answer,
    });

    if (response.data && response.data.result) {
      return response.data.result;
    }
    return generateFrontendFallback(question, answer);
  } catch (err) {
    console.warn("AI Service Request Warning (using fallback evaluator):", err.message);
    return generateFrontendFallback(question, answer);
  }
};