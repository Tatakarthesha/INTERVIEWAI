const { GoogleGenAI } = require("@google/genai");
console.log("API KEY =", process.env.GEMINI_API_KEY);
console.log("Length =", process.env.GEMINI_API_KEY?.length);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeResume = async (resumeText) => {
  const prompt = `
You are an ATS Resume Expert.

Analyze the following resume.

Resume:
${resumeText}

Return ONLY valid JSON.

{
  "resumeScore": 90,
  "atsScore": 85,
  "skills":[
    "React",
    "Node.js",
    "MongoDB"
  ],
  "missingSkills":[
    "Docker",
    "AWS"
  ],
  "strengths":[
    "Good Projects",
    "Strong Technical Skills"
  ],
  "weaknesses":[
    "No Internship Experience"
  ],
  "suggestions":[
    "Add GitHub Links",
    "Improve Project Descriptions",
    "Mention Achievements"
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
};

module.exports = {
  analyzeResume,
};