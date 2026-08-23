import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import CertificateComponent from "../../components/Certificate/CertificateComponent";
import {
  getCertificates,
  fetchCertificates,
  getGradeAndBadge,
  downloadCertificateAsPDF,
  formatDate,
} from "../../utils/certificateUtils";
import { getUser } from "../../utils/storage";
import "./MyCertificates.css";

const MyCertificates = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [certificates, setCertificates] = useState(() => getCertificates());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedCert, setSelectedCert] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const modalCertRef = useRef(null);
  const hiddenCertRef = useRef(null);
  const [downloadTargetCert, setDownloadTargetCert] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    const loadUserCertificates = async () => {
      setLoading(true);
      const certs = await fetchCertificates(user.email);
      setCertificates(certs);
      setLoading(false);
    };

    loadUserCertificates();
  }, []);

  // Deduplicate certificates to ensure only 1 card per completed interview session is rendered
  const uniqueCertificates = certificates.reduce((acc, cert) => {
    const isDuplicate = acc.some((existing) => {
      if (cert.sessionId && existing.sessionId && cert.sessionId === existing.sessionId) return true;
      if (cert.id && existing.id && cert.id === existing.id) return true;
      const timeDiff = Math.abs(
        new Date(cert.completionDate || cert.issueDate) -
        new Date(existing.completionDate || existing.issueDate)
      );
      return (
        cert.domain === existing.domain &&
        Number(cert.score) === Number(existing.score) &&
        timeDiff < 300000
      );
    });

    if (!isDuplicate) acc.push(cert);
    return acc;
  }, []);

  // Filter logic
  const filteredCertificates = uniqueCertificates.filter((cert) => {
    const domainMatch = cert.domain
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const dateStr = formatDate(cert.completionDate || cert.issueDate);
    const dateMatch = dateStr.toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = cert.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return domainMatch || dateMatch || idMatch;
  });

  // Sort logic
  const sortedCertificates = [...filteredCertificates].sort((a, b) => {
    if (sortBy === "latest") {
      return (
        new Date(b.completionDate || b.issueDate) -
        new Date(a.completionDate || a.issueDate)
      );
    }
    if (sortBy === "oldest") {
      return (
        new Date(a.completionDate || a.issueDate) -
        new Date(b.completionDate || b.issueDate)
      );
    }
    if (sortBy === "highest") {
      return Number(b.score) - Number(a.score);
    }
    if (sortBy === "lowest") {
      return Number(a.score) - Number(b.score);
    }
    return 0;
  });

  const handleDownload = async (cert) => {
    setIsDownloading(true);
    setDownloadTargetCert(cert);

    // Short timeout to let hidden Certificate component render
    setTimeout(async () => {
      if (hiddenCertRef.current) {
        await downloadCertificateAsPDF(
          hiddenCertRef.current,
          `KP_Interview_Certificate_${cert.id}.pdf`
        );
      }
      setIsDownloading(false);
      setDownloadTargetCert(null);
    }, 300);
  };

  return (
    <div className="my-certificates-page">
      <Navbar />

      <div className="my-certificates-container">
        <header className="page-header">
          <div className="title-area">
            <h1>🏆 My Certificates</h1>
            <p>View, verify, and download your earned AI Mock Interview certificates.</p>
          </div>
          <button
            className="take-interview-btn"
            onClick={() => navigate("/ai-mock")}
          >
            🤖 Take New AI Mock Interview
          </button>
        </header>

        {/* Filter and Sort Controls */}
        <div className="controls-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by domain or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ✖
              </button>
            )}
          </div>

          <div className="sort-box">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest Date</option>
              <option value="oldest">Oldest Date</option>
              <option value="highest">Highest Score</option>
              <option value="lowest">Lowest Score</option>
            </select>
          </div>
        </div>

        {/* Certificates List / Grid */}
        {sortedCertificates.length === 0 ? (
          <div className="empty-certificates-card">
            <div className="empty-icon">📜</div>
            <h2>No Certificates Found</h2>
            <p>
              {searchTerm
                ? "No certificates match your search query."
                : "You haven't earned any certificates yet. Complete an AI Mock Interview to generate your certificate!"}
            </p>
            <button
              className="start-ai-btn"
              onClick={() => navigate("/ai-mock")}
            >
              Start AI Mock Interview
            </button>
          </div>
        ) : (
          <div className="certificates-grid">
            {sortedCertificates.map((cert) => {
              const { grade, badge } = getGradeAndBadge(cert.score);
              const percentage = Math.round(Number(cert.score) * 10);

              return (
                <div key={cert.id} className="certificate-card">
                  <div className="card-badge-header">
                    <span className="card-cert-id">{cert.id}</span>
                    <span className="card-badge">{badge}</span>
                  </div>

                  <div className="card-body">
                    <h3 className="card-domain">{cert.domain}</h3>
                    <p className="card-date">
                      📅 Completed on {formatDate(cert.completionDate || cert.issueDate)}
                    </p>

                    <div className="card-score-info">
                      <div className="score-badge">
                        <span className="score-val">{percentage}%</span>
                        <span className="score-sub">({cert.score}/10)</span>
                      </div>
                      <div className="grade-badge">
                        <span className="grade-label">Grade</span>
                        <span className="grade-val">{grade}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="preview-btn"
                      onClick={() => setSelectedCert(cert)}
                    >
                      👁️ View Preview
                    </button>
                    <button
                      className="download-pdf-btn"
                      onClick={() => handleDownload(cert)}
                      disabled={isDownloading}
                    >
                      {isDownloading && downloadTargetCert?.id === cert.id
                        ? "⏳ Generating PDF..."
                        : "📄 Download PDF"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for full Preview */}
        {selectedCert && (
          <div className="certificate-modal-overlay" onClick={() => setSelectedCert(null)}>
            <div
              className="certificate-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Certificate Preview</h2>
                <div className="modal-actions">
                  <button
                    className="modal-download-btn"
                    onClick={() => handleDownload(selectedCert)}
                    disabled={isDownloading}
                  >
                    📄 Download PDF
                  </button>
                  <button
                    className="modal-close-btn"
                    onClick={() => setSelectedCert(null)}
                  >
                    ✖
                  </button>
                </div>
              </div>

              <div className="modal-body-cert">
                <CertificateComponent
                  certificate={selectedCert}
                  refProp={modalCertRef}
                />
              </div>
            </div>
          </div>
        )}

        {/* Hidden Container for crisp PDF Generation when requested */}
        {downloadTargetCert && (
          <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
            <CertificateComponent
              certificate={downloadTargetCert}
              refProp={hiddenCertRef}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCertificates;
