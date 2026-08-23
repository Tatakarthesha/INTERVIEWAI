import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { getUser, getUserData } from "../../utils/storage";
import {
  saveCertificate,
  fetchCertificates,
  generateCertificateId,
  downloadCertificateAsPDF,
  getGradeAndBadge,
} from "../../utils/certificateUtils";
import CertificateComponent from "../../components/Certificate/CertificateComponent";
import Navbar from "../../components/Navbar";
import "./AIMockResult.css";

const AIMockResult = () => {
  const navigate = useNavigate();
  const user = getUser();
  const certRef = useRef(null);

  const [currentCert, setCurrentCert] = useState(null);
  const [isDownloadingCert, setIsDownloadingCert] = useState(false);
  const [showCertPreview, setShowCertPreview] = useState(false);

  const result = getUserData("aiInterviewResult") || [];
  const branch = getUserData("branch") || "General Domain";

  const totalScore = result.reduce(
    (sum, item) => sum + Number(item.score || 0),
    0
  );

  const averageScore = result.length > 0
    ? (totalScore / result.length).toFixed(1)
    : "0";

  const communication =
    result.filter(
      (item) =>
        item.communication === "Excellent" ||
        item.communication === "Very Good"
    ).length;

  const technical =
    result.filter(
      (item) =>
        item.technicalKnowledge === "Excellent" ||
        item.technicalKnowledge === "Very Good"
    ).length;

  const confidence =
    result.filter(
      (item) =>
        item.confidence === "Excellent" ||
        item.confidence === "Very Good"
    ).length;

  const { grade, badge } = getGradeAndBadge(averageScore);

  const isProcessingRef = useRef(false);

  // Auto create & save certificate when result is available
  useEffect(() => {
    if (result.length > 0 && user && !isProcessingRef.current) {
      isProcessingRef.current = true;

      const processCertificate = async () => {
        const sessionId = getUserData("aiInterviewSessionId") || `SESSION_${user.email}_${branch}_${averageScore}`;
        
        let existingCerts = [];
        try {
          existingCerts = await fetchCertificates(user.email);
        } catch (e) {
          existingCerts = getUserData("certificates") || [];
        }

        // Search for an existing certificate for this session ID or recent matching interview
        const existingMatch = existingCerts.find((c) => {
          if (c.sessionId && c.sessionId === sessionId) return true;
          const isRecent = c.completionDate && (new Date() - new Date(c.completionDate)) < 300000;
          return isRecent && Number(c.score || c.overallScore) === Number(averageScore) && c.domain === branch;
        });

        let certData;
        if (existingMatch) {
          certData = existingMatch;
        } else {
          const certId = generateCertificateId();
          certData = {
            id: certId,
            certificateId: certId,
            sessionId: sessionId,
            userId: user._id || user.id || user.email,
            candidateName: user.name || "Candidate",
            userName: user.name || "Candidate",
            candidateEmail: user.email,
            userEmail: user.email,
            domain: branch,
            score: averageScore,
            overallScore: Number(averageScore),
            communicationScore: `${communication}/${result.length}`,
            technicalScore: `${technical}/${result.length}`,
            confidenceScore: `${confidence}/${result.length}`,
            grade: grade,
            badge: badge,
            performanceBadge: badge,
            completionDate: new Date().toISOString(),
            issueDate: new Date().toISOString(),
            interviewType: "AI",
          };
          await saveCertificate(certData);
        }
        setCurrentCert(certData);
      };

      processCertificate();
    }
  }, [result.length]);

  if (result.length === 0) {
    return (
      <div className="ai-result-page">
        <Navbar />
        <div className="ai-result-card">
          <h1>No Interview Data Found</h1>

          <button
            className="dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const rating =
    averageScore >= 9
      ? "⭐⭐⭐⭐⭐"
      : averageScore >= 8
      ? "⭐⭐⭐⭐☆"
      : averageScore >= 7
      ? "⭐⭐⭐☆☆"
      : averageScore >= 6
      ? "⭐⭐☆☆☆"
      : "⭐☆☆☆☆";

  const handleDownloadCertificate = async () => {
    if (!certRef.current) return;
    setIsDownloadingCert(true);
    await downloadCertificateAsPDF(
      certRef.current,
      `KP_Interview_Certificate_${currentCert?.id || "AI_Mock"}.pdf`
    );
    setIsDownloadingCert(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("AI Interview Evaluation Report", 20, 20);

    doc.setFontSize(14);

    doc.text(
      `Questions Attempted : ${result.length}`,
      20,
      40
    );

    doc.text(
      `Overall Score : ${averageScore}/10`,
      20,
      50
    );

    doc.text(
      `Communication : ${communication}/${result.length}`,
      20,
      60
    );

    doc.text(
      `Technical Knowledge : ${technical}/${result.length}`,
      20,
      70
    );

    doc.text(
      `Confidence : ${confidence}/${result.length}`,
      20,
      80
    );

    doc.text(
      `Overall Rating : ${rating}`,
      20,
      90
    );

    let y = 110;

    result.forEach((item, index) => {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(16);

      doc.text(
        `Question ${index + 1}`,
        20,
        y
      );

      y += 10;

      doc.setFontSize(12);

      const question = doc.splitTextToSize(
        `Question: ${item.question}`,
        170
      );

      doc.text(question, 20, y);

      y += question.length * 7;

      const answer = doc.splitTextToSize(
        `Answer: ${item.answer}`,
        170
      );

      doc.text(answer, 20, y);

      y += answer.length * 7;

      doc.text(
        `Score: ${item.score}/10`,
        20,
        y
      );

      y += 8;

      doc.text(
        `Communication: ${item.communication}`,
        20,
        y
      );

      y += 8;

      doc.text(
        `Technical: ${item.technicalKnowledge}`,
        20,
        y
      );

      y += 8;

      doc.text(
        `Confidence: ${item.confidence}`,
        20,
        y
      );

      y += 10;

      doc.text("AI Feedback:", 20, y);

      y += 8;

      item.feedback.forEach((tip) => {
        const feedback = doc.splitTextToSize(
          "• " + tip,
          170
        );

        doc.text(feedback, 25, y);

        y += feedback.length * 7;
      });

      y += 12;
    });

    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div className="ai-result-page">
      <Navbar />
      <div className="ai-result-card">

        <h1>🤖 AI Interview Evaluation</h1>

        {/* Certificate Callout & Quick Action Card */}
        <div className="certificate-earn-banner">
          <div className="banner-left">
            <span className="banner-icon">🏆</span>
            <div>
              <h3>Congratulations! Certificate Earned</h3>
              <p>Grade: <strong>{grade}</strong> | Badge: <strong>{badge}</strong></p>
            </div>
          </div>
          <div className="banner-actions">
            <button
              className="cert-download-main-btn"
              onClick={handleDownloadCertificate}
              disabled={isDownloadingCert}
            >
              {isDownloadingCert ? "⏳ Generating PDF..." : "📥 Download Certificate"}
            </button>
            <button
              className="cert-history-btn"
              onClick={() => navigate("/my-certificates")}
            >
              📜 Certificate History
            </button>
          </div>
        </div>

        <div className="summary">

          <div className="summary-box">
            <h2>{result.length}</h2>
            <p>Questions Attempted</p>
          </div>

          <div className="summary-box">
            <h2>{averageScore}/10</h2>
            <p>Overall Score</p>
          </div>

          <div className="summary-box">
            <h2>{communication}/{result.length}</h2>
            <p>Communication</p>
          </div>

          <div className="summary-box">
            <h2>{technical}/{result.length}</h2>
            <p>Technical Knowledge</p>
          </div>

          <div className="summary-box">
            <h2>{confidence}/{result.length}</h2>
            <p>Confidence</p>
          </div>

        </div>

        <div className="overall-rating">

          <h2>Overall Rating</h2>

          <h1>{rating}</h1>

        </div>

        {/* Certificate Live Preview Toggle */}
        <div className="cert-preview-toggle-section">
          <button
            className="toggle-preview-btn"
            onClick={() => setShowCertPreview(!showCertPreview)}
          >
            {showCertPreview ? "🙈 Hide Certificate Preview" : "👁️ View Official Certificate Preview"}
          </button>
        </div>

        {showCertPreview && currentCert && (
          <div className="result-certificate-preview-wrapper">
            <CertificateComponent
              certificate={currentCert}
              refProp={certRef}
            />
          </div>
        )}

        {/* Hidden Certificate element for silent background PDF generation if preview not opened */}
        {!showCertPreview && currentCert && (
          <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
            <CertificateComponent
              certificate={currentCert}
              refProp={certRef}
            />
          </div>
        )}

        <div className="feedback-section">

          {result.map((item, index) => (
            <div
              className="feedback-card"
              key={index}
            >
              <h2>
                Question {index + 1}
              </h2>

              <p>
                <strong>Question</strong>
              </p>

              <p>{item.question}</p>

              <br />

              <p>
                <strong>Your Answer</strong>
              </p>

              <p>{item.answer}</p>

              <br />

              <div className="details">

                <p>
                  🎯 Score : {item.score}/10
                </p>

                <p>
                  💬 Communication :
                  {" "}
                  {item.communication}
                </p>

                <p>
                  🧠 Technical :
                  {" "}
                  {item.technicalKnowledge}
                </p>

                <p>
                  🔥 Confidence :
                  {" "}
                  {item.confidence}
                </p>

              </div>

              <h3>
                🤖 AI Suggestions
              </h3>

              <ul>

                {item.feedback.map(
                  (tip, i) => (
                    <li key={i}>
                      {tip}
                    </li>
                  )
                )}

              </ul>

            </div>
          ))}

        </div>

        <div className="bottom-action-buttons">
          <button
            className="download-btn"
            onClick={downloadPDF}
          >
            📄 Download Evaluation Report
          </button>

          <button
            className="dashboard-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default AIMockResult;