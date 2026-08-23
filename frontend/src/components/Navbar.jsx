import { useNavigate, useLocation } from "react-router-dom";
import kpLogo from "../assets/kp-logo.png";
import { getUser } from "../utils/storage";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const handleLogout = () => {
    localStorage.clear();
    alert("Logged Out Successfully");
    navigate("/");
  };

  const handleBrandClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <header className="app-header">
      <div className="app-navbar">
        <div
          className="nav-brand"
          onClick={handleBrandClick}
          title="Go to Dashboard"
        >
          <img
            src={kpLogo}
            alt="KP Logo"
            className="nav-logo"
          />
          <span className="nav-title">KP Interview</span>
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              {location.pathname !== "/dashboard" && (
                <button
                  className="nav-btn dashboard-btn-link"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
              )}
              {location.pathname !== "/my-certificates" && (
                <button
                  className="nav-btn cert-btn-link"
                  onClick={() => navigate("/my-certificates")}
                >
                  My Certificates
                </button>
              )}
              <button
                className="nav-btn logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== "/" && (
                <button
                  className="nav-btn login-btn-link"
                  onClick={() => navigate("/")}
                >
                  Login
                </button>
              )}
              {location.pathname !== "/signup" && (
                <button
                  className="nav-btn signup-btn-link"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
