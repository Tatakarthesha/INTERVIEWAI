import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/resume`;

export const analyzeResume = async (resumeText) => {
  const response = await axios.post(
    `${API}/analyze`,
    {
      resumeText,
    }
  );

  return response.data.result;
};