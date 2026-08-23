const { analyzeResume } = require("../services/resumeService");

const analyze = async (req, res) => {
  try {
    const { resumeText } = req.body;

    console.log("Resume request received");
console.log("Resume text:", resumeText?.substring(0, 100));

let result = await analyzeResume(resumeText);

    result = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    result = JSON.parse(result);

    res.json({
      success: true,
      result,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  analyze,
};