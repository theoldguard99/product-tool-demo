import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { FaUser, FaUnlock } from "react-icons/fa";

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(); // Simulate login
    navigate("/"); // Navigate to home after login
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <input type="text" placeholder="Username" required />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required />
          <FaUnlock className="icon" />
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Remember me
          </label>
          <a href="#">forgot password?</a>
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>
            Don't have an account? <a href="">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
