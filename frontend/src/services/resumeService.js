import axios from "axios";

const API = "http://localhost:5000/api/resume";

export const analyzeResume = async (resumeText) => {
  const response = await axios.post(
    `${API}/analyze`,
    {
      resumeText,
    }
  );

  return response.data.result;
};