import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Login/Login.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      // On successful login, store the token and user data
      localStorage.setItem("token", res.data.token); // Store the token
      setUser(res.data.user);
      navigate("/"); // Redirect to home page
    } catch (err) {
      setMessage(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="login-container" id="loginbar">
      <div className="box2">
        <span className="borderLine2"></span>
        <form onSubmit={handleSubmit}>
        <h2><i class="fa-solid fa-right-to-bracket" id="l-font"></i>&nbsp;&nbsp;Log in</h2>
          <div className="inputBox">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
            <i></i>
          </div>
          <div className="links">
            <Link to="/signup" id="sign-up">Signup</Link>
          </div>
          <input type="submit" id="submit" value="Login" />
          <p id="mess">{message}</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
