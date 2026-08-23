const axios = require("axios");

// Fallback ATS evaluator when Gemini API is rate-limited (HTTP 429) or unavailable
const generateFallbackResumeAnalysis = (resumeText) => {
  const text = (resumeText || "").toLowerCase();

  const knownSkills = [
    "JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB",
    "Python", "Java", "C++", "HTML", "CSS", "SQL", "Git", "Docker", "AWS",
    "REST API", "Redux", "Tailwind", "Bootstrap", "PostgreSQL", "Next.js"
  ];

  const foundSkills = knownSkills.filter(skill => text.includes(skill.toLowerCase()));
  const missingSkills = knownSkills.filter(skill => !text.includes(skill.toLowerCase())).slice(0, 4);

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  let resumeScore = 72;
  let atsScore = 68;
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  if (foundSkills.length >= 4) {
    resumeScore += 16;
    atsScore += 18;
    strengths.push(`Good technical skills detected (${foundSkills.slice(0, 5).join(", ")})`);
  } else {
    weaknesses.push("Relatively low technical skill density found in text");
    suggestions.push("Add a dedicated Skills section listing programming languages, tools, and frameworks");
  }

  if (wordCount > 100) {
    resumeScore += 10;
    atsScore += 10;
    strengths.push("Good length and content structure");
  } else {
    weaknesses.push("Resume content is short or missing detailed descriptions");
    suggestions.push("Elaborate on core projects, responsibilities, and measurable outcomes");
  }

  if (text.includes("project") || text.includes("developed") || text.includes("built")) {
    strengths.push("Demonstrates hands-on project implementation");
  } else {
    suggestions.push("Include key project highlights with bullet points");
  }

  return {
    resumeScore: Math.min(95, resumeScore),
    atsScore: Math.min(95, atsScore),
    skills: foundSkills.length > 0 ? foundSkills : ["JavaScript", "HTML/CSS", "Git"],
    missingSkills: missingSkills.length > 0 ? missingSkills : ["Docker", "AWS", "TypeScript"],
    strengths: strengths.length > 0 ? strengths : ["Clear structure and standard sections"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Could benefit from additional metrics and achievements"],
    suggestions: suggestions.length > 0 ? suggestions : ["Add quantifiable achievements (e.g. improved performance by 20%)"],
  };
};

const analyzeResume = async (resumeText) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY missing in environment. Using fallback resume analyzer.");
    return generateFallbackResumeAnalysis(resumeText);
  }

  const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the following resume text and provide feedback.

Resume:
${resumeText || "No resume text provided."}

Return ONLY valid JSON matching this exact structure:
{
  "resumeScore": 85,
  "atsScore": 80,
  "skills": ["React", "Node.js", "MongoDB"],
  "missingSkills": ["Docker", "AWS"],
  "strengths": ["Strong project portfolio", "Clear layout"],
  "weaknesses": ["Lack of quantifiable metrics"],
  "suggestions": ["Add GitHub links", "Include metrics for project impact"]
}
`;

  // Gemini models in order of priority
  const models = ["gemini-1.5-flash", "gemini-2.0-flash"];

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
        { timeout: 15000 }
      );

      if (response.data && response.data.candidates && response.data.candidates[0]?.content?.parts?.[0]?.text) {
        let rawText = response.data.candidates[0].content.parts[0].text;

        // Clean up markdown formatting
        rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed && typeof parsed.resumeScore === "number") {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.error(`Gemini API resume analysis failed (model: ${model}):`, err.message);
    }
  }

  console.warn("Gemini API call failed or rate-limited. Utilizing fallback resume analyzer.");
  return generateFallbackResumeAnalysis(resumeText);
};

module.exports = {
  analyzeResume,
};