import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import kpLogo from "../../assets/kp-logo.png";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
  <div className="login-page">

    {/* Left Side */}

    <div className="left-panel">

      <div className="brand">

        <img
          src={kpLogo}
          alt="KP Logo"
          className="logo"
        />

        <h1>KP Interview</h1>

      </div>

      <span className="badge">
        AI Powered Interview Platform
      </span>

      <h2>
        Crack Your Dream Job
        <br />
        with Confidence.
      </h2>

      <p className="tagline">
        Practice HR, Technical, Aptitude and AI Mock
        Interviews with real-time feedback and resume
        analysis.
      </p>

      <div className="feature-list">

        <div>✔ AI Mock Interviews</div>

        <div>✔ Resume Analyzer</div>

        <div>✔ Technical Questions</div>

        <div>✔ Placement Preparation</div>

      </div>

    </div>

    {/* Right Side */}

    <div className="right-panel">

      <div className="auth-form">

        <img
          src={kpLogo}
          className="login-logo"
          alt="logo"
        />

        <h2>Welcome Back</h2>

        <p className="subtitle">
          Login to continue your interview journey.
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

        <p className="register-text">
          Don't have an account?
          <Link to="/signup"> Create Account</Link>
        </p>

      </div>

    </div>

  </div>
);
};

export default Login;