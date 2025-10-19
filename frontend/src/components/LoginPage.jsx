import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LoginPages.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // clear previous message

    try {
      const response = await axios.post("http://localhost:5000/api/users/signin", {
        email,
        password,
      });

      if (response.data.success) {
        // Save token in localStorage
        localStorage.setItem("token", response.data.token);

        setMessage("✅ Login Successful!");
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        setMessage("❌ " + response.data.message);
      }
    } catch (error) {
      if (error.response) {
        setMessage("❌ " + error.response.data.message);
      } else {
        setMessage("❌ Network Error. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="circle blue"></div>
      <div className="circle cyan"></div>

      <div className="login-box">
        <h1>Login to Expense Monitor</h1>
        <p className="welcome">Welcome back! Please enter your details.</p>

        <form onSubmit={handleLogin}>
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

          {message && (
            <p
              className={`message ${
                message.includes("✅") ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}

          <button type="submit">Sign In</button>
        </form>

        <div className="signup-text">
          Don’t have an account?{" "}
          <a href="/signup" className="signup-link">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
