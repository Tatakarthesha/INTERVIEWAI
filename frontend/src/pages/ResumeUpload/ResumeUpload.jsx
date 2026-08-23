import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import { analyzeResume } from "../../services/resumeService";
import "./ResumeUpload.css";
import { saveUserData } from "../../utils/storage";
import Navbar from "../../components/Navbar";

// PDF Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ResumeUpload = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const extractText = async (pdfFile) => {
    const arrayBuffer = await pdfFile.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      text +=
        content.items
          .map((item) => item.str)
          .join(" ") + "\n";
    }

    return text;
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload your resume.");
      return;
    }

    setLoading(true);

    try {
      const resumeText = await extractText(file);

      const result = await analyzeResume(resumeText);

saveUserData(
  "resumeAnalysis",
  result
);

      navigate("/resume-result");
    } catch (error) {
      console.error(error);
      alert("Resume analysis failed.");
    }

    setLoading(false);
  };

  return (
    <div className="resume-page">
      <Navbar />
      <div className="resume-card">
        <h1>📄 AI Resume Analyzer</h1>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading
            ? "Analyzing Resume..."
            : "Analyze Resume"}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;