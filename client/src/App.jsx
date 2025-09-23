import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Header from "./components/Header/Header";
import axios from "axios";
import useAuth from "./hooks/useAuth";
import UserSkills from "./components/Skills/Skills";
import Contact from "./components/Contact/Contact";
import Education from "./components/Education/Education";
import Achivements from "./components/Achivements/Achivements";

const App = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true); // Track loading state

  // ✅ Wrap fetchUserData inside useCallback
  const fetchUserData = useCallback(
    async (token) => {
      try {
        const res = await axios.get("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false); // ✅ Set loading to false after API call
      }
    },
    [setUser]
  ); // ✅ Include `setUser` in the dependency array

  // ✅ Now it's safe to use fetchUserData inside useEffect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      fetchUserData(token);
    } else {
      setLoading(false); // No token = no need to fetch
    }
  }, [user, fetchUserData]); // ✅ Now ESLint warning is gone

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Header user={user} handleLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Home user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/contact"
          element={user ? <Contact user={user} setUser={setUser}/> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Add the Skills component route (Protected) */}
        <Route
          path="/skills"
          element={
            user ? (
              <UserSkills user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/Achivements"
          element={
            user ? (
              <Achivements user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/education"
          element={
            user ? (
              <Education user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
