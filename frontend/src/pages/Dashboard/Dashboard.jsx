import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./Dashboard.css";
import {
  getUser,
  getUserData,
  saveUserData,
  calculateLocalStats,
} from "../../utils/storage";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = getUser();

  const [showBranches, setShowBranches] =
    useState(false);

  const [stats, setStats] = useState(() => calculateLocalStats());

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user || !user.email) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/interview/dashboard/${user.email}`
        );
        if (!response.ok) return;
        const data = await response.json();
        if (data.success) {
          setStats({
            totalInterviews: data.totalInterviews,
            averageScore: Number(data.averageScore).toFixed(1),
            bestScore: Number(data.bestScore).toFixed(1),
            aiQuestionsEvaluated: data.aiQuestionsEvaluated || 0,
          });
        }
      } catch (err) {
        console.log("Error fetching analytics from backend:", err);
      }
    };

    fetchAnalytics();
  }, [user?.email]);

  const branches = [
    "CSE",
    "AI & ML",
    "Data Science",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
  ];

  const selectedBranch = getUserData("branch");

  const handleBranchSelect = (branch) => {
    saveUserData("branch", branch);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.clear();

    alert("Logged Out Successfully");

    navigate("/");
  };

  return (
    <div className="dashboard">

      <Navbar />

      {/* Hero */}
      <section className="hero-section">

        <h1>
          Welcome Back, {user?.name} 👋
        </h1>

        <p>
          Track your interview preparation,
          improve your confidence,
          and land your dream job.
        </p>

      </section>

      {/* Stats */}
      <section className="stats-container">

  <div className="stat-card">

<h2 style={{ color: "red" }}>
  {stats.totalInterviews}
</h2>

    <p>Total Interviews</p>

  </div>

  <div className="stat-card">

<h2 style={{ color: "blue" }}>
  {stats.averageScore}
</h2>

    <p>Average Score</p>

  </div>

  <div className="stat-card">

<h2 style={{ color: "green" }}>
  {stats.bestScore}
</h2>

    <p>Best Score</p>

  </div>

  <div className="stat-card">

<h2 style={{ color: "orange" }}>
  {stats.aiQuestionsEvaluated}
</h2>
    <p>AI Questions Evaluated</p>

  </div>

</section>
      
      {/* Branch Selection */}

      <section className="branch-section">

        <h2>Select Your Domain</h2>

        <button
          className="domain-btn"
          onClick={() =>
            setShowBranches(!showBranches)
          }
        >
          {selectedBranch
            ? `Selected: ${selectedBranch}`
            : "Select Your Domain"}
        </button>

        {showBranches && (
          <div className="branch-grid">

            {branches.map((branch) => (
              <button
                key={branch}
                className="branch-card"
                onClick={() => {
                  handleBranchSelect(branch);
                  setShowBranches(false);
                }}
              >
                {branch}
              </button>
            ))}

          </div>
        )}

      </section>

      {/* Interview Categories */}

      <section className="interview-section">

        <h2>Interview Categories</h2>

        <div className="interview-grid">

          <div className="interview-card">
            <h3>🎯 HR Interview</h3>

            <p>
              Practice communication and
              HR questions.
            </p>

<button
  onClick={() =>
    navigate("/hr-interview")
  }
>
  Start
</button>
          </div>

          <div className="interview-card">
            <h3>💻 Technical Interview</h3>

            <p>
              Questions based on your
              selected branch.
            </p>

<button
  onClick={() =>
    navigate("/technical")
  }
>
  Start
</button>
          </div>

<div className="interview-card">

  <h3>📊 Aptitude Round</h3>

  <p>
    Improve logical and
    quantitative skills.
  </p>

  <button
    onClick={() => {
      const attempts =
        Number(
          localStorage.getItem(
            "aptitudeAttempts"
          )
        ) || 0;

      localStorage.setItem(
        "aptitudeAttempts",
        attempts + 1
      );

      navigate("/aptitude");
    }}
  >
    Start
  </button>

</div>

<div className="interview-card">

  <h3>🤖 AI Mock Interview</h3>

  <p>
    Practice with an AI interviewer and improve your confidence.
  </p>

  <button
    onClick={() => {

      const attempts =
        Number(
          localStorage.getItem(
            "aiAttempts"
          )
        ) || 0;

      localStorage.setItem(
        "aiAttempts",
        attempts + 1
      );

      navigate("/ai-mock");
    }}
  >
    Start
  </button>

</div>
        </div>

      </section>

{/* Career Tools */}

<section className="career-section">

  <h2>Career Tools & Achievements</h2>

  <div className="career-tools">

    <div
      className="career-card"
      onClick={() => navigate("/resume-upload")}
    >
      <h2>📄 Resume Analyzer</h2>
      <p>
        Upload your resume and receive an AI-powered ATS score,
        resume score, strengths, weaknesses, missing skills,
        and personalized improvement suggestions.
      </p>
      <button>Analyze Resume</button>
    </div>

    <div
      className="career-card cert-tool-card"
      onClick={() => navigate("/my-certificates")}
    >
      <h2>🏆 My Certificates</h2>
      <p>
        View and download your official AI Mock Interview achievement certificates,
        complete with grade badges, unique IDs, and performance breakdown.
      </p>
      <button>View Certificates</button>
    </div>

  </div>

</section>
    </div>
  );
};



export default Dashboard;