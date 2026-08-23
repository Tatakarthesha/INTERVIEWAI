import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./ResumeResult.css";
import { getUserData } from "../../utils/storage";

const ResumeResult = () => {

  const navigate = useNavigate();

const result = getUserData("resumeAnalysis");

  if (!result) {
    return (
      <div className="resume-result-page">
        <Navbar />
        <h1 style={{ color: "#0f172a", marginTop: "40px" }}>No Resume Analysis Found</h1>
      </div>
    );
  }

  return (
    <div className="resume-result-page">
      <Navbar />

      <div className="resume-result-card">

        <h1>
          📄 AI Resume Analysis
        </h1>

        <div className="score-container">

          <div className="score-box">

            <h2>
              Resume Score
            </h2>

            <h1>
              {result.resumeScore}/100
            </h1>

          </div>

          <div className="score-box">

            <h2>
              ATS Score
            </h2>

            <h1>
              {result.atsScore}%
            </h1>

          </div>

        </div>

        <div className="section">

          <h2>💻 Skills Found</h2>

          <div className="chips">

            {result.skills.map((skill, index) => (
              <span
                key={index}
                className="skill-chip"
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

        <div className="section">

          <h2>
            ❌ Missing Skills
          </h2>

          <div className="chips">

            {result.missingSkills.map(
              (skill, index) => (
                <span
                  key={index}
                  className="missing-chip"
                >
                  {skill}
                </span>
              )
            )}

          </div>

        </div>

        <div className="section">

          <h2>
            💪 Strengths
          </h2>

          <ul>

            {result.strengths.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}

          </ul>

        </div>

        <div className="section">

          <h2>
            ⚠ Weaknesses
          </h2>

          <ul>

            {result.weaknesses.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}

          </ul>

        </div>

        <div className="section">

          <h2>
            💡 Suggestions
          </h2>

          <ul>

            {result.suggestions.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}

          </ul>

        </div>

        <button
          className="back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );
};

export default ResumeResult;