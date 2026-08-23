import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { aptitudeQuestions } from "../../data/aptitudeQuestions";
import "./Aptitude.css";
import { saveUserData, saveInterviewRecord } from "../../utils/storage";
import Navbar from "../../components/Navbar";
const Aptitude = () => {
  const navigate = useNavigate();

  const attempts =
    Number(
      localStorage.getItem(
        "aptitudeAttempts"
      )
    ) || 1;

  const currentSet = useMemo(() => {
    if (attempts === 1) {
      return aptitudeQuestions.slice(0, 10);
    }

    if (attempts === 2) {
      return aptitudeQuestions.slice(10, 20);
    }

    if (attempts === 3) {
      return aptitudeQuestions.slice(20, 30);
    }

    return [...aptitudeQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  }, [attempts]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedOption, setSelectedOption] =
    useState("");

  const [answers, setAnswers] =
    useState([]);

  const progress =
    ((currentQuestion + 1) /
      currentSet.length) *
    100;

  const nextQuestion = () => {
    if (!selectedOption) {
      alert("Please select an option");
      return;
    }

    const updatedAnswers = [
      ...answers,
      {
        question:
          currentSet[currentQuestion]
            .question,
        selectedAnswer:
          selectedOption,
        correctAnswer:
          currentSet[currentQuestion]
            .answer,
      },
    ];

    setAnswers(updatedAnswers);
    setSelectedOption("");

    if (
      currentQuestion <
      currentSet.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  const handleSubmit = async () => {
  if (!selectedOption) {
    alert("Please select an option");
    return;
  }

  const finalAnswers = [
    ...answers,
    {
      question:
        currentSet[currentQuestion].question,
      selectedAnswer: selectedOption,
      correctAnswer:
        currentSet[currentQuestion].answer,
    },
  ];

  // Save locally
  saveUserData(
    "aptitudeAnswers",
    finalAnswers
  );

  // Logged in user
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Calculate score
  const correctAnswers = finalAnswers.filter(
    (q) =>
      q.selectedAnswer === q.correctAnswer
  ).length;

  const score = Math.round(
    (correctAnswers / currentSet.length) * 10
  );

  const attempt =
    Number(
      localStorage.getItem(
        "aptitudeAttempts"
      )
    ) || 1;

  saveInterviewRecord({
    interviewType: "Aptitude",
    branch: "General",
    attempt,
    score,
    totalQuestions: currentSet.length,
    answersCount: finalAnswers.length,
    answers: finalAnswers,
    date: new Date().toISOString(),
  });

  // Save into MongoDB
  try {
    const response = await fetch(
      "http://localhost:5000/api/interview/save",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          userEmail: user.email,
          interviewType: "Aptitude",
          branch: "General",
          attempt,
          score,
          totalQuestions:
            currentSet.length,
          answers: finalAnswers,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    localStorage.setItem(
      "aptitudeAttempts",
      attempt + 1
    );

  } catch (err) {
    console.log(err);
  }

  alert(
    "Aptitude Test Completed 🎉"
  );

  navigate("/aptitude-result");
};

  const question =
    currentSet[currentQuestion];

  return (
    <div className="aptitude-page">
      <Navbar />
      <div className="aptitude-card">

        <h1>
          📊 Aptitude Round
        </h1>

        <h3 className="attempt-text">
          Attempt {attempts}
        </h3>

        <div className="progress-container">

          <div className="progress-info">

            <span>
              Question {currentQuestion + 1}
              / {currentSet.length}
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

        <div className="question-box">

          <h3 className="question-number">
            Question {currentQuestion + 1}
          </h3>

          <h2>
            {question.question}
          </h2>

        </div>

        <div className="options-container">

          {question.options.map(
            (option, index) => (
              <label
                key={index}
                className={`option-label ${
                  selectedOption === option
                    ? "selected-option"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  value={option}
                  checked={
                    selectedOption ===
                    option
                  }
                  onChange={(e) =>
                    setSelectedOption(
                      e.target.value
                    )
                  }
                />

                {option}
              </label>
            )
          )}

        </div>

        {currentQuestion <
        currentSet.length - 1 ? (
          <button
            className="next-btn"
            onClick={nextQuestion}
          >
            Next Question
          </button>
        ) : (
          <button
            className="submit-btn"
            onClick={handleSubmit}
          >
            Submit Test
          </button>
        )}

      </div>
    </div>
  );
};

export default Aptitude;