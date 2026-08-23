import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import kpLogo from "../../assets/kp-logo.png";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/auth/register",
        formData
      );

      alert(res.data.message);

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="signup-page">

      {/* LEFT PANEL */}

      <div className="signup-left-panel">

        <div className="signup-brand">

          <img
            src={kpLogo}
            alt="KP Logo"
            className="signup-logo"
          />

          <h1>KP Interview</h1>

        </div>

        <span className="signup-badge">
          AI Powered Interview Platform
        </span>

        <h2>
          Create Your Future
          <br />
          with KP Interview.
        </h2>

        <p className="signup-tagline">
          Register once and begin your complete
          interview preparation journey powered
          by Artificial Intelligence.
        </p>

      </div>

      {/* RIGHT PANEL */}

      <div className="signup-right-panel">

        <div className="signup-form">

          <img
            src={kpLogo}
            alt="KP Logo"
            className="signup-form-logo"
          />

          <h2>Create Account</h2>

          <p className="signup-subtitle">
            Your Journey in KP Interview Starts Here
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Create Account
            </button>

          </form>

          <p className="signup-login-text">
            Already have an account?
            <Link to="/"> Login</Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Signup;