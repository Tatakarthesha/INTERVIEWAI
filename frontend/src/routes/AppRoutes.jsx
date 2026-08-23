  import { BrowserRouter, Routes, Route } from "react-router-dom";

  import Login from "../pages/Login/Login";
  import Signup from "../pages/Signup/Signup";
  import Dashboard from "../pages/Dashboard/Dashboard";
  import ProtectedRoute from "../components/ProtectedRoute";
  import TechnicalInterview from "../pages/TechnicalInterview/TechnicalInterview";
  import Result from "../pages/Result/Result";
  import HRInterview from "../pages/HRInterview/HRInterview";
  import HRResult from "../pages/HRResult/HRResult";
  import Aptitude from "../pages/Aptitude/Aptitude";
  import AptitudeResult from "../pages/AptitudeResult/AptitudeResult";
  import AIMockInterview from "../pages/AIMockInterview/AIMockInterview";
  import AIMockResult from "../pages/AIMockResult/AIMockResult";
  import ResumeUpload from "../pages/ResumeUpload/ResumeUpload";
  import ResumeResult from "../pages/ResumeResult/ResumeResult";
  import MyCertificates from "../pages/MyCertificates/MyCertificates";

  const AppRoutes = () => {
    return (
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-certificates"
            element={
              <ProtectedRoute>
                <MyCertificates />
              </ProtectedRoute>
            }
          />
  <Route
    path="/resume-upload"
    element={<ResumeUpload />}
  />

  <Route
    path="/resume-result"
    element={<ResumeResult />}
  />
          <Route
            path="/technical"
            element={<TechnicalInterview />}
          />

          <Route
            path="/result"
            element={<Result />}
          />

          <Route
            path="/hr-interview"
            element={<HRInterview />}
          />

            <Route
    path="/ai-mock"
    element={<AIMockInterview />}
  />

  <Route
    path="/ai-result"
    element={<AIMockResult />}
  />
            <Route
    path="/hr-result"
    element={<HRResult />}
  />

  <Route
    path="/aptitude"
    element={<Aptitude />}
  />

  <Route
    path="/aptitude-result"
    element={<AptitudeResult />}
  />
        </Routes>
      </BrowserRouter>
    );
  };



  export default AppRoutes;