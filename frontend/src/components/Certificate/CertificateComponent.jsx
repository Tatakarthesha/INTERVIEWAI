import React from "react";
import kpLogo from "../../assets/kp-logo.png";
import { getGradeAndBadge, formatDate } from "../../utils/certificateUtils";
import "./CertificateComponent.css";

const CertificateComponent = ({ certificate, refProp }) => {
  if (!certificate) return null;

  const {
    id = "KPI-CERT-0000",
    candidateName = "Candidate Name",
    domain = "General Domain",
    score = 8.5,
    completionDate = new Date(),
    issueDate = new Date(),
  } = certificate;

  const scoreNum = Number(score) || 0;
  const scorePercentage = Math.round(scoreNum * 10);
  const { grade, badge } = getGradeAndBadge(scoreNum);

  const formattedCompletionDate = formatDate(completionDate);
  const formattedIssueDate = formatDate(issueDate);

  return (
    <div className="certificate-outer-wrapper">
      <div className="certificate-container" ref={refProp}>
        {/* Decorative corner ornaments */}
        <div className="corner-ornament top-left"></div>
        <div className="corner-ornament top-right"></div>
        <div className="corner-ornament bottom-left"></div>
        <div className="corner-ornament bottom-right"></div>

        {/* Double border frame */}
        <div className="certificate-border">
          <div className="certificate-inner">
            
            {/* Header section with Logo & Title */}
            <div className="certificate-header">
              <div className="brand-logo-title">
                <img src={kpLogo} alt="KP Interview Logo" className="cert-logo" />
                <div className="brand-text">
                  <span className="brand-name">KP INTERVIEW</span>
                  <span className="brand-tagline">AI Evaluation System</span>
                </div>
              </div>
              <div className="cert-id-badge">
                <span className="id-label">CERTIFICATE ID</span>
                <span className="id-value">{id}</span>
              </div>
            </div>

            {/* Title */}
            <div className="certificate-title-section">
              <h1 className="cert-main-heading">CERTIFICATE OF ACHIEVEMENT</h1>
              <div className="heading-divider">
                <span className="divider-line"></span>
                <span className="divider-star">✦</span>
                <span className="divider-line"></span>
              </div>
              <p className="cert-sub-text">THIS IS PROUDLY PRESENTED TO</p>
            </div>

            {/* Candidate Name */}
            <div className="candidate-name-section">
              <h2 className="candidate-name">{candidateName}</h2>
              <div className="name-underline"></div>
            </div>

            {/* Achievement Details */}
            <div className="cert-body-text">
              <p>
                for successfully demonstrating outstanding skills and completing the
              </p>
              <h3 className="course-domain-title">
                AI Mock Interview — <span className="domain-highlight">{domain}</span>
              </h3>
            </div>

            {/* Score & Badge Showcase */}
            <div className="performance-card-grid">
              <div className="perf-item score-item">
                <span className="perf-label">OVERALL SCORE</span>
                <span className="perf-val-primary">{scorePercentage}%</span>
                <span className="perf-val-sub">({scoreNum} / 10)</span>
              </div>

              <div className="perf-item grade-item">
                <span className="perf-label">GRADE</span>
                <span className="perf-val-grade">{grade}</span>
              </div>

              <div className="perf-item badge-item">
                <span className="perf-label">PERFORMANCE BADGE</span>
                <span className="perf-val-badge">{badge}</span>
              </div>
            </div>

            {/* Verification Line */}
            <div className="verification-text">
              <span className="shield-icon">🛡️</span> Verified by KP Interview AI Evaluation System
            </div>

            {/* Footer Signatures and Stamp */}
            <div className="certificate-footer">
              <div className="footer-column date-col">
                <div className="meta-pair">
                  <span className="meta-label">Completion Date:</span>
                  <span className="meta-val">{formattedCompletionDate}</span>
                </div>
                <div className="meta-pair">
                  <span className="meta-label">Issue Date:</span>
                  <span className="meta-val">{formattedIssueDate}</span>
                </div>
              </div>

              <div className="footer-column seal-col">
                <div className="official-seal">
                  <div className="seal-outer-ring">
                    <div className="seal-inner-circle">
                      <div className="seal-star">★</div>
                      <div className="seal-text-top">KP INTERVIEW</div>
                      <div className="seal-text-center">OFFICIAL</div>
                      <div className="seal-text-bottom">VERIFIED</div>
                      <div className="seal-star">★</div>
                    </div>
                  </div>
                  <div className="seal-ribbon"></div>
                </div>
              </div>

              <div className="footer-column sig-col">
                <div className="digital-signature-box">
                  <div className="sig-handwriting">KP Evaluation Board</div>
                  <div className="sig-line"></div>
                  <span className="sig-title">Authorized AI Assessment Assessor</span>
                  <span className="sig-sub">KP Interview Verification Authority</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateComponent;
