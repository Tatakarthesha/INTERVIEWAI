import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getUserData } from "../../utils/storage";
import "./Result.css";

const Result = () => {
  const navigate = useNavigate();

const answers = getUserData("technicalAnswers");

  const attempted = answers.filter(
    (item) =>
      item.answer &&
      item.answer.trim() !== "" &&
      item.answer !== "Skipped"
  ).length;

  const skipped = answers.filter(
    (item) =>
      !item.answer ||
      item.answer.trim() === "" ||
      item.answer === "Skipped"
  ).length;

  return (
    <div className="tech-result-page">
      <Navbar />

      <div className="tech-result-card">

        <h1>💻 Technical Interview Result</h1>

        <div className="tech-score-card">

          <div className="tech-score-item">
            <h2>{answers.length}</h2>
            <p>Total Questions</p>
          </div>

          <div className="tech-score-item">
            <h2>{attempted}</h2>
            <p>Answered</p>
          </div>

          <div className="tech-score-item">
            <h2>{skipped}</h2>
            <p>Skipped</p>
          </div>

        </div>

        <h2 className="review-title">
          Review Answers
        </h2>

        {answers.map((item, index) => (

          <div
            className="tech-answer-card"
            key={index}
          >

            <h3>
              Q{index + 1}. {item.question}
            </h3>

            <p>

              {item.answer &&
              item.answer !== "Skipped"
                ? item.answer
                : "Not Answered"}

            </p>

          </div>

        ))}

        <button
          className="tech-dashboard-btn"
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

export default Result;