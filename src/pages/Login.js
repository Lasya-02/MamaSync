import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./css/Login.css";
import "./css/Shared.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const blobs = document.querySelectorAll(".blob");
      blobs.forEach((blob, i) => {
        const speed = 0.05 + i * 0.02;
        const x = (e.clientX - window.innerWidth / 2) * speed;
        const y = (e.clientY - window.innerHeight / 2) * speed;
        blob.style.transform = `translate(${x}px, ${y}px) scale(1.2)`;
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="login-page">
      <div className="background-blobs">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
        <div className="blob blob4"></div>
        <div className="blob blob5"></div>
        <div className="blob blob6"></div>
        <div className="blob blob7"></div>
        <div className="blob blob8"></div>


      </div>

      <div className="login-content">
        {/* Left: Header */}
        <div className="login-left">
          <h1 className="brand-title">MamaSync</h1>
          <p className="brand-tagline">Caring, tracking, and bonding — all in one place.</p>
        </div>

        {/* Right: Login Card */}
        <div className="login-right">
          <div className="login-box">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Let’s reconnect</p>
            </div>
            <form onSubmit={handleSubmit} className="login-form">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Log In</button>
            </form>
            <div className="login-footer">
              <span>
                New here? <Link to="/register">Create an account</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
