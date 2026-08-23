import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hrQuestions } from "../../data/hrQuestions";
import "./HRInterview.css";
import { saveUserData, saveInterviewRecord } from "../../utils/storage";
import Navbar from "../../components/Navbar";

const HRInterview = () => {
  const navigate = useNavigate();

  const questions = hrQuestions;

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

const handleSubmit = async () => {
  const finalAnswers = [
    ...answers,
    {
      question: questions[currentQuestion],
      answer:
        answer.trim() === ""
          ? "Skipped"
          : answer,
    },
  ];

  // Save locally
saveUserData(
  "hrAnswers",
  finalAnswers
);

  // Logged-in user
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // HR is descriptive, so we'll score based on answered questions
  const answeredQuestions = finalAnswers.filter(
    (q) => q.answer !== "Skipped"
  ).length;

  const score = Math.round(
    (answeredQuestions / questions.length) * 10
  );

  const attempt =
    Number(localStorage.getItem("hrAttempts")) || 1;

saveInterviewRecord({
  interviewType: "HR",
  branch: "General",
  attempt,
  score,
  totalQuestions: questions.length,
  answersCount: finalAnswers.length,
  answers: finalAnswers,
  date: new Date().toISOString(),
});

  try {
    const response = await fetch(
      "http://localhost:5000/api/interview/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user.email,
          interviewType: "HR",
          branch: "General",
          attempt,
          score,
          totalQuestions: questions.length,
          answers: finalAnswers,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    localStorage.setItem(
      "hrAttempts",
      attempt + 1
    );

  } catch (err) {
    console.log(err);
  }

  alert(
    "HR Interview Completed Successfully 🎉"
  );

  navigate("/hr-result");
};

  return (
    <div className="tech-page">
      <Navbar />
      <div className="tech-card">

        <h1>
          👔 HR Interview
        </h1>

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
              No HR Questions Found
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

export default HRInterview;