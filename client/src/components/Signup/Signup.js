import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Signup/Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/register", {
        name,
        number,
        email,
        gender,
        password,
      });
      // console.log(res.data);
      setMessage(res.data);
      navigate("/login");
    } catch (err) {
      // console.log(err.response.data);
      setMessage(err.response.data.error);
    }
  };

  return (
    <div className="signup-container">
      <div className="box1">
        <span className="borderLine1"></span>
        <form onSubmit={handleSubmit}>
        <h2><i class="fa-solid fa-user-plus" id="s-font"></i>&nbsp;&nbsp;Sign up</h2>
          <div className="inputBox">
            <input
              type="text"
              placeholder=""
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <span>Name</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input
              type="number"
              placeholder=""
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
            <span>Number</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span>Email</span>
            <i></i>
          </div>
          <div className="inputBox">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="sele-gen"
            >
              <option value="" className="sele-opt">Select Gender</option>
              <option value="male" className="sele-opt">Male</option>
              <option value="female" className="sele-opt">Female</option>
              <option value="other" className="sele-opt">Other</option>
            </select>
            {/* <span>Gender</span> */}
            <i></i>
          </div>
          <div className="inputBox">
            <input
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span>Password</span>
            <i></i>
          </div>
          <p>{message}</p>
          <div className="links">
            <p className="have-acc">
              Already have an account? <Link to="/login" id="log-in">Login</Link>
            </p>
          </div>
          <input type="submit" id="submit" value="Signup" />
        </form>
      </div>
    </div>
  );
};

export default Signup;
