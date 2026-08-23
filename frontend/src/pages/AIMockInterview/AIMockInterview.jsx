import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mockQuestions } from "../../data/mockQuestions";
import { evaluateAnswer } from "../../services/aiService";
import "./AIMockInterview.css";
import { getUserData, saveUserData, saveInterviewRecord } from "../../utils/storage";
import Navbar from "../../components/Navbar";
import { API_BASE_URL } from "../../config";
const AIMockInterview = () => {
  const navigate = useNavigate();

const branch = getUserData("branch");

  console.log("Selected Branch:", branch);
console.log("Mock Questions:", mockQuestions);
console.log("Questions:", mockQuestions[branch]);

  const attempts =
    Number(localStorage.getItem("aiAttempts")) || 1;

  const questionSet = useMemo(() => {
    
    const questions = mockQuestions[branch] || [];

    if (attempts === 1) return questions.slice(0, 5);

    if (attempts === 2) return questions.slice(5, 10);

    if (attempts === 3) return questions.slice(10, 15);

    return [...questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  }, [attempts, branch]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [evaluations, setEvaluations] =
    useState([]);

  const progress =
    ((currentQuestion + 1) /
      questionSet.length) *
    100;

  const saveEvaluation = async () => {
    setLoading(true);

    try {
      const result =
        await evaluateAnswer(
          questionSet[currentQuestion],
          answer
        );

      const updated = [
        ...evaluations,
        {
          question:
            questionSet[currentQuestion],
          answer,
          score: result.score,
          communication:
            result.communication,
          technicalKnowledge:
            result.technicalKnowledge,
          confidence:
            result.confidence,
          feedback:
            result.feedback,
        },
      ];

      setEvaluations(updated);

      setLoading(false);

      return updated;
    } catch (err) {
      console.error("AI Evaluation Warning:", err);
      setLoading(false);
      return evaluations;
    }
  };

  const nextQuestion = async () => {
    if (!answer.trim()) {
      alert("Please answer the question.");
      return;
    }

    await saveEvaluation();

    setAnswer("");

    setCurrentQuestion(currentQuestion + 1);
  };

 const handleSubmit = async () => {
  if (!answer.trim()) {
    alert("Please answer the question.");
    return;
  }

  // Evaluate the last answer
  const finalData = await saveEvaluation();

  const sessionId = `AI_SESSION_${Date.now()}`;
  saveUserData("aiInterviewSessionId", sessionId);

  // Save locally
  saveUserData(
    "aiInterviewResult",
    finalData
  );

  // Logged-in user
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Calculate average AI score
  const totalScore = finalData.reduce(
    (sum, item) => sum + Number(item.score),
    0
  );

  const averageScore = Math.round(
    totalScore / finalData.length
  );

  saveInterviewRecord({
    interviewType: "AI",
    branch,
    attempt: attempts,
    score: averageScore,
    totalQuestions: questionSet.length,
    answersCount: finalData.length,
    answers: finalData,
    date: new Date().toISOString(),
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/interview/save`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user.email,
          interviewType: "AI",
          branch,
          attempt: attempts,
          score: averageScore,
          totalQuestions: questionSet.length,
          answers: finalData,
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    localStorage.setItem(
      "aiAttempts",
      attempts + 1
    );

  } catch (err) {
    console.log(err);
  }

  alert("AI Mock Interview Completed 🎉");

  navigate("/ai-result");
};

  return (
    <div className="ai-page">
      <Navbar />
      <div className="ai-card">

        <h1>🤖 AI Mock Interview</h1>

        <h3>Domain : {branch}</h3>

        <h4>Attempt {attempts}</h4>

        <div className="progress-info">

          <span>
            Question {currentQuestion + 1}
            {" / "}
            {questionSet.length}
          </span>

          <span>
            {Math.round(progress)}%
          </span>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>

        <div className="question-box">

          <h2>
            {questionSet[currentQuestion]}
          </h2>

        </div>

        <textarea
          className="answer-box"
          placeholder="Type your answer..."
          value={answer}
          onChange={(e) =>
            setAnswer(e.target.value)
          }
        />

        {loading && (
          <h3>
            🤖 AI is evaluating your answer...
          </h3>
        )}

        {currentQuestion <
        questionSet.length - 1 ? (
          <button
            className="next-btn"
            disabled={loading}
            onClick={nextQuestion}
          >
            Next Question
          </button>
        ) : (
          <button
            className="submit-btn"
            disabled={loading}
            onClick={handleSubmit}
          >
            Submit Interview
          </button>
        )}

      </div>
    </div>
  );
};

export default AIMockInterview;