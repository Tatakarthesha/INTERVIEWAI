const axios = require("axios");

// Fallback rule-based evaluation when Gemini API is rate-limited (HTTP 429) or unavailable
const generateFallbackEvaluation = (question, answer) => {
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
    feedback.push("No response was provided. Please try to explain your understanding.");
    feedback.push("Review fundamental principles of this concept.");
  } else if (wordCount < 10) {
    score = 5.5;
    communication = "Satisfactory";
    technicalKnowledge = "Basic";
    confidence = "Moderate";
    feedback.push("Answer is brief. Try to elaborate on technical details and underlying mechanisms.");
    feedback.push("Include practical examples or use-cases to strengthen your answer.");
  } else if (wordCount < 35) {
    score = 7.5;
    communication = "Good";
    technicalKnowledge = "Good";
    confidence = "Good";
    feedback.push("Solid response covering core concepts.");
    feedback.push("Adding specific code snippets, architecture details, or performance trade-offs will enhance technical depth.");
  } else {
    score = 8.8;
    communication = "Very Good";
    technicalKnowledge = "Excellent";
    confidence = "Excellent";
    feedback.push("Comprehensive and detailed explanation showing deep domain knowledge.");
    feedback.push("Great clarity and structure. Continue giving structured answers in your interviews.");
  }

  return JSON.stringify({
    score,
    communication,
    technicalKnowledge,
    confidence,
    feedback,
  });
};

const evaluateAnswer = async (question, answer, retries = 2) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY missing in environment. Using rule-based fallback evaluation.");
    return generateFallbackEvaluation(question, answer);
  }

  const prompt = `
You are a professional technical interviewer.

Evaluate the candidate's answer.

Question:
${question}

Answer:
${answer}

Return ONLY valid JSON in this format:

{
  "score": 8,
  "communication": "Very Good",
  "technicalKnowledge": "Good",
  "confidence": "Excellent",
  "feedback": [
    "Good explanation",
    "Mention key principles",
    "Add real-world example"
  ]
}
`;

  // Gemini models in order of priority
  const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];

  for (let attempt = 0; attempt <= retries; attempt++) {
    for (const model of models) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          },
          { timeout: 12000 }
        );

        if (response.data && response.data.candidates && response.data.candidates[0]?.content?.parts?.[0]?.text) {
          return response.data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        const status = err.response?.status;
        console.error(`Gemini API call failed (model: ${model}, attempt: ${attempt + 1}, status: ${status}): ${err.message}`);

        if (status === 429 && attempt < retries) {
          // Exponential delay before retry (1.5s, 3s)
          const delay = (attempt + 1) * 1500;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }

  console.warn("Gemini API rate limited (HTTP 429) or unavailable after retries. Utilizing fallback evaluator.");
  return generateFallbackEvaluation(question, answer);
};

module.exports = {
  evaluateAnswer,
};