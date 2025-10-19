import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LoginPages.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000/api/users/signup";

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(API_URL, { name, email, password });

      if (res.data.success) {
        setMessage("✅ Signup successful! Redirecting...");
        // Optional: store token for logged-in state
        localStorage.setItem("token", res.data.token);

        // Redirect after short delay (1.5 sec for message to show)
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      if (err.response) {
        setMessage(`⚠️ ${err.response.data.message}`);
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="circle blue"></div>
      <div className="circle cyan"></div>

      <div className="login-box">
        <h1>Create Your Account</h1>
        <p className="welcome">Join Expense Monitor today!</p>

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p
              className={`message ${
                message.includes("✅") ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}

          <button type="submit">Sign Up</button>
        </form>

        <div className="signup-text">
          Already have an account?{" "}
          <a href="/" className="signup-link">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}
