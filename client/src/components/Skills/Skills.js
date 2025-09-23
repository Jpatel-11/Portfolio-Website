import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Skills/Skills.css";

function UserSkills({ user, setUser }) {
  const [skills, setSkills] = useState([]);
  const [newSkills, setNewSkills] = useState("");
  // const token = localStorage.getItem("token"); // Retrieve token once to avoid redundant calls

  useEffect(() => {
    const token = localStorage.getItem("token");
    // const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found! User must log in.");
      return;
    }
    if (token) {
      axios
        .get("http://localhost:8000/api/skills", {
          headers: { Authorization: `Bearer ${token}` }, // Fixed header
        })
        .then((response) => {
          console.log("API response:", response.data); // Check the response format

          // Ensure response data is an array
          const skillsData = Array.isArray(response.data) ? response.data : [];

          setSkills(skillsData);
          setUser((prevUser) => ({
            ...prevUser, // Preserve existing user data
            skills: skillsData, // Update only skills
          }));
          // console.log("skills", response.data._id);
          // response.data.forEach(item => {
          // console.log("for loop",item._id);
          // });
        })
        .catch((error) => console.log(error));
    }
  }, [setUser]);

  // Add a new skill
  const addSkills = async () => {
    // const token = localStorage.getItem("token");
    if (newSkills.trim() === "") return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found. User must log in.");
      return;
    } else {
      console.log("User logged in", token);
    }
    try {
      const res = await axios.post(
        "http://localhost:8000/api/skills/add",
        { skillName: newSkills.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSkills([...skills, res.data]); // Update UI
      setNewSkills(""); // Clear input field
    } catch (error) {
      console.error(
        "Error adding skill",
        error.response?.data || error.message
      );
    }
  };

  // Delete a skill
  const deleteSkill = async (skillId) => {
    const token = localStorage.getItem("token");
    console.log("Deleting skill with ID:", skillId);
    try {
      await axios.delete(`http://localhost:8000/api/skills/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSkills((prevSkills) =>
        prevSkills.filter((skill) => skill._id !== skillId)
      );
      // Remove from UI
    } catch (error) {
      console.log("Error deleting skill", error);
    }
  };

  return (
      <div className="skill-container">
        <div className="skills">
        <h1 className="skill-head"><i class="fa-solid fa-bars-progress" id="skill-font"></i>&nbsp;&nbsp;Skills </h1>
          <div className="skills-input">
            <input
              type="text"
              className="skill-control"
              value={newSkills}
              onChange={(e) => setNewSkills(e.target.value)}
              placeholder="Add your skills here"
            />
            <div className="skills-btn">
              <button className="skill-btn" onClick={addSkills}>
                Add
              </button>
            </div>
          </div>
          <div className="skills-align">
            <ul className="skills-output">
              {skills.map((skill) => (
                <div key={skill._id} className="skill-show">
                  <li className="skills-show">{skill.skillName}</li>
                  <div className="skill-delete">
                    <button
                      className="skill-del"
                      onClick={() => {
                        console.log("Deleting skill:", skill._id); // Debugging
                        deleteSkill(skill._id);
                      }}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
}

export default UserSkills;
