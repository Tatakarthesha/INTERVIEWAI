import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./HRResult.css";
import { getUserData } from "../../utils/storage";

const HRResult = () => {
  const navigate = useNavigate();

const answers = getUserData("hrAnswers");

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
    <div className="hr-result-page">
      <Navbar />

      <div className="hr-result-card">

        <h1>🎯 HR Interview Result</h1>

        <div className="hr-score-card">

          <div className="hr-score-item">
            <h2>{answers.length}</h2>
            <p>Total Questions</p>
          </div>

          <div className="hr-score-item">
            <h2>{attempted}</h2>
            <p>Answered</p>
          </div>

          <div className="hr-score-item">
            <h2>{skipped}</h2>
            <p>Skipped</p>
          </div>

        </div>

        <h2 className="hr-review-title">
          Review Answers
        </h2>

        {answers.map((item, index) => (

          <div
            className="hr-answer-card"
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
          className="hr-dashboard-btn"
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

export default HRResult;