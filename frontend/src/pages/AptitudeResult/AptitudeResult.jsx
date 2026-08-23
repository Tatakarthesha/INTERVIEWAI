import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getUserData } from "../../utils/storage";
import "./AptitudeResult.css";

const AptitudeResult = () => {
  const navigate = useNavigate();

const answers = getUserData("aptitudeAnswers");

  const correctAnswers = answers.filter(
    (item) =>
      item.selectedAnswer === item.correctAnswer
  ).length;

  const wrongAnswers =
    answers.length - correctAnswers;

  const score = Math.round(
    (correctAnswers / answers.length) * 100
  );

  return (
    <div className="apt-result-page">
      <Navbar />

      <div className="apt-result-card">

        <h1>📊 Aptitude Result</h1>

        <div className="apt-score-card">

          <div className="apt-score-item">
            <h2>{score}%</h2>
            <p>Score</p>
          </div>

          <div className="apt-score-item">
            <h2>{correctAnswers}</h2>
            <p>Correct</p>
          </div>

          <div className="apt-score-item">
            <h2>{wrongAnswers}</h2>
            <p>Wrong</p>
          </div>

          <div className="apt-score-item">
            <h2>{answers.length}</h2>
            <p>Total Questions</p>
          </div>

        </div>

        <h2 className="apt-review-title">
          Review Answers
        </h2>

        {answers.map((item, index) => {

          const correct =
            item.selectedAnswer ===
            item.correctAnswer;

          return (

            <div
              key={index}
              className={`apt-answer-card ${
                correct
                  ? "correct-card"
                  : "wrong-card"
              }`}
            >

              <h3>
                Q{index + 1}. {item.question}
              </h3>

              <p>

                <strong>Your Answer :</strong>{" "}
                {item.selectedAnswer}

              </p>

              <p>

                <strong>Correct Answer :</strong>{" "}
                {item.correctAnswer}

              </p>

              <span
                className={
                  correct
                    ? "correct-text"
                    : "wrong-text"
                }
              >

                {correct
                  ? "✔ Correct"
                  : "❌ Wrong"}

              </span>

            </div>

          );
        })}

        <button
          className="apt-dashboard-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back To Dashboard
        </button>

      </div>

    </div>
  );
};

export default AptitudeResult;