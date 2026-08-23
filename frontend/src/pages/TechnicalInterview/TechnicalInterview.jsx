import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { technicalQuestions } from "../../data/questions";
import { getUserData, saveUserData, saveInterviewRecord } from "../../utils/storage";
import Navbar from "../../components/Navbar";
import "./TechnicalInterview.css";

const TechnicalInterview = () => {
  const navigate = useNavigate();

const branch = getUserData("branch");

  console.log("Selected Branch:", branch);
console.log("Technical Questions Object:", technicalQuestions);
console.log("Questions for Selected Branch:", technicalQuestions[branch]);

  const allQuestions =
  technicalQuestions[branch] || [];

const attempt =
  Number(
    localStorage.getItem(
      `attempt_${branch}`
    )
  ) || 1;

const questions = useMemo(() => {
  if (attempt === 1) {
    return allQuestions.slice(0, 10);
  }

  if (attempt === 2) {
    return allQuestions.slice(10, 20);
  }

  if (attempt === 3) {
    return allQuestions.slice(20, 30);
  }

  return [...allQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
}, [attempt, allQuestions]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] =
    useState("");

  const [answers, setAnswers] =
    useState([]);

  const progress =
    questions.length > 0
      ? ((currentQuestion + 1) /
          questions.length) *
        100
      : 0;

  // NEXT QUESTION
  const nextQuestion = () => {
    if (!answer.trim()) {
      alert(
        "Please answer the question or click Skip Question"
      );
      return;
    }

    const updatedAnswers = [
      ...answers,
      {
        question:
          questions[currentQuestion],
        answer: answer,
      },
    ];

    setAnswers(updatedAnswers);
    setAnswer("");

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  // SKIP QUESTION
  const skipQuestion = () => {
    if (answer.trim()) {
      alert(
        "You have already written an answer. Click Next Question instead."
      );
      return;
    }

    const updatedAnswers = [
      ...answers,
      {
        question:
          questions[currentQuestion],
        answer: "Skipped",
      },
    ];

    setAnswers(updatedAnswers);

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  // SUBMIT INTERVIEW
const handleSubmit = async () => {
    const finalAnswers = [
      ...answers,
      {
        question:
          questions[currentQuestion],
        answer:
          answer.trim() === ""
            ? "Skipped"
            : answer,
      },
    ];
const user = JSON.parse(localStorage.getItem("user"));

const correctAnswers = finalAnswers.filter(
  (q) => q.answer !== "Skipped"
).length;

const score = Math.round(
  (correctAnswers / questions.length) * 10
);

saveUserData(
  "technicalAnswers",
  finalAnswers
);

saveInterviewRecord({
  interviewType: "Technical",
  branch,
  attempt,
  score,
  totalQuestions: questions.length,
  answersCount: finalAnswers.length,
  answers: finalAnswers,
  date: new Date().toISOString(),
});

    localStorage.setItem(
      `attempt_${branch}`,
      attempt + 1
    );

    alert(
      `Interview Completed 🎉\nAttempt ${attempt} Finished`
    );
try {
  await fetch(
    "http://localhost:5000/api/interview/save",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: user.email,
        interviewType: "Technical",
        branch,
        attempt,
        score,
        totalQuestions: questions.length,
        answers: finalAnswers,
      }),
    }
  );
} catch (err) {
  console.log(err);
}

    navigate("/result");
  };

  return (
    <div className="tech-page">
      <Navbar />
      <div className="tech-card">

        <h1>
          💻 Technical Interview
        </h1>

        <h3>
          Branch: {branch}
        </h3>

        <h3>
          Attempt: {attempt}
        </h3>

        {/* Progress Bar */}
        <div className="progress-container">

          <div className="progress-info">

            <span>
              Question {currentQuestion + 1}
              {" / "}
              {questions.length}
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

        </div>

        {questions.length > 0 ? (
          <>
            <div className="question-box">

              <h2>
                Question {currentQuestion + 1}
              </h2>

              <p>
                {
                  questions[
                    currentQuestion
                  ]
                }
              </p>

            </div>

            <textarea
              className="answer-box"
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) =>
                setAnswer(
                  e.target.value
                )
              }
            />

            {currentQuestion <
            questions.length - 1 ? (
              <div className="button-group">

                <button
                  className="next-btn"
                  onClick={
                    nextQuestion
                  }
                >
                  Next Question
                </button>

                <button
                  className="skip-btn"
                  onClick={
                    skipQuestion
                  }
                >
                  Skip Question
                </button>

              </div>
            ) : (
              <div className="button-group">

                <button
                  className="submit-btn"
                  onClick={
                    handleSubmit
                  }
                >
                  Submit Interview
                </button>

              </div>
            )}
          </>
        ) : (
          <div>

            <h2>
              No Questions Found For{" "}
              {branch}
            </h2>

            <button
              className="submit-btn"
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            >
              Back To Dashboard
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default TechnicalInterview;