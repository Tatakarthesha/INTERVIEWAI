const Interview = require("../models/Interview");

// Save Interview
const saveInterview = async (req, res) => {
  try {
    const {
      userEmail,
      interviewType,
      branch,
      attempt,
      score,
      totalQuestions,
      answers,
    } = req.body;

    const interview = new Interview({
      userEmail,
      interviewType,
      branch,
      attempt,
      score,
      totalQuestions,
      answers,
    });

    await interview.save();

    res.status(201).json({
      success: true,
      message: "Interview saved successfully",
      interview,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Dashboard Analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const { userEmail } = req.params;

    const interviews = await Interview.find({
      userEmail,
    });

    const totalInterviews = interviews.length;

    const bestScore =
      interviews.length > 0
        ? Math.max(...interviews.map((i) => i.score))
        : 0;

    const averageScore =
      interviews.length > 0
        ? (
            interviews.reduce(
              (sum, i) => sum + i.score,
              0
            ) / interviews.length
          ).toFixed(1)
        : 0;

    const hrCount = interviews.filter(
      (i) => i.interviewType === "HR"
    ).length;

    const technicalCount = interviews.filter(
      (i) => i.interviewType === "Technical"
    ).length;

    const aptitudeCount = interviews.filter(
      (i) => i.interviewType === "Aptitude"
    ).length;

    const aiCount = interviews.filter(
      (i) => i.interviewType === "AI"
    ).length;

    const aiInterviews = interviews.filter(
      (i) => i.interviewType === "AI"
    );

    const aiQuestionsEvaluated = aiInterviews.reduce(
      (sum, i) => sum + (i.answers ? i.answers.length : 0),
      0
    );

    res.json({
      success: true,
      totalInterviews,
      averageScore,
      bestScore,
      aiQuestionsEvaluated,
      hrCount,
      technicalCount,
      aptitudeCount,
      aiCount,
      interviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveInterview,
  getDashboardAnalytics,
};