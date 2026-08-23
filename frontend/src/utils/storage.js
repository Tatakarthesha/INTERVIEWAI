export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    return null;
  }
};

export const getUserKey = (key) => {
  const user = getUser();

  if (!user || !user.email) return key;

  return `${user.email}_${key}`;
};

export const saveUserData = (key, data) => {
  localStorage.setItem(
    getUserKey(key),
    JSON.stringify(data)
  );
};

export const getUserData = (key) => {
  try {
    return (
      JSON.parse(
        localStorage.getItem(getUserKey(key))
      ) || []
    );
  } catch (e) {
    return [];
  }
};

export const saveInterviewRecord = (record) => {
  const history = getUserData("interviewHistory");
  const updatedHistory = Array.isArray(history) ? [...history, record] : [record];
  saveUserData("interviewHistory", updatedHistory);
};

export const calculateLocalStats = () => {
  const history = getUserData("interviewHistory");

  if (Array.isArray(history) && history.length > 0) {
    const totalInterviews = history.length;
    const scores = history.map((item) => Number(item.score) || 0);
    const bestScore = Math.max(...scores).toFixed(1);
    const sumScores = scores.reduce((acc, s) => acc + s, 0);
    const averageScore = (sumScores / history.length).toFixed(1);

    const aiQuestionsEvaluated = history
      .filter((item) => item.interviewType === "AI")
      .reduce((sum, item) => sum + (item.answersCount || (item.answers ? item.answers.length : 0) || 0), 0);

    return {
      totalInterviews,
      averageScore,
      bestScore,
      aiQuestionsEvaluated,
    };
  }

  // Fallback for legacy single-interview data structure
  const hrAnswers = getUserData("hrAnswers");
  const technicalAnswers = getUserData("technicalAnswers");
  const aptitudeAnswers = getUserData("aptitudeAnswers");
  const aiAnswers = getUserData("aiInterviewResult");

  const scores = [];
  let count = 0;

  if (hrAnswers.length > 0) {
    count++;
    const hrScore = Math.round(
      (hrAnswers.filter(
        (q) => q.answer && q.answer !== "Skipped" && q.answer.trim() !== ""
      ).length /
        hrAnswers.length) *
      10
    );
    scores.push(hrScore);
  }

  if (technicalAnswers.length > 0) {
    count++;
    const technicalScore = Math.round(
      (technicalAnswers.filter(
        (q) => q.answer && q.answer !== "Skipped" && q.answer.trim() !== ""
      ).length /
        technicalAnswers.length) *
      10
    );
    scores.push(technicalScore);
  }

  if (aptitudeAnswers.length > 0) {
    count++;
    const aptitudeScore = Math.round(
      (aptitudeAnswers.filter(
        (q) => q.selectedAnswer === q.correctAnswer
      ).length /
        aptitudeAnswers.length) *
      10
    );
    scores.push(aptitudeScore);
  }

  if (aiAnswers.length > 0) {
    count++;
    const aiAverage = Number(
      (
        aiAnswers.reduce((sum, q) => sum + Number(q.score), 0) /
        aiAnswers.length
      ).toFixed(1)
    );
    scores.push(aiAverage);
  }

  const totalInterviews = count;
  const averageScore = scores.length
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : "0";
  const bestScore = scores.length ? Math.max(...scores).toFixed(1) : "0";
  const aiQuestionsEvaluated = aiAnswers.length;

  return {
    totalInterviews,
    averageScore,
    bestScore,
    aiQuestionsEvaluated,
  };
};