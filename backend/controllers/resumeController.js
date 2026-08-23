const { analyzeResume } = require("../services/resumeService");

const analyze = async (req, res) => {
  try {
    const { resumeText } = req.body;

    console.log("Resume analysis request received");
    console.log("Resume text sample:", (resumeText || "").substring(0, 100));

    const result = await analyzeResume(resumeText);

    res.json({
      success: true,
      result,
    });

  } catch (err) {
    console.error("Resume Controller Error:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Failed to analyze resume",
    });
  }
};

module.exports = {
  analyze,
};