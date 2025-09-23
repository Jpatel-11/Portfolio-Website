import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../Home/Home.css";

const Home = ({ user, setUser }) => {
  const [about, setAbout] = useState("");
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    techStack: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (token) {
      try {
        const response = await axios.get("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setAbout(response.data.about || "");
      } catch (error) {
        console.log(error);
      }
    }
  }, [token, setUser]);

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    if (token) {
      try {
        const response = await axios.get("http://localhost:8000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (error) {
        console.log("Error fetching projects:", error);
      }
    }
  }, [token]);

  // Fetch user data and projects on component mount
  useEffect(() => {
    fetchUserData();
    fetchProjects();
  }, [fetchUserData, fetchProjects]); // Include dependencies to avoid warnings

  const handleUpdateAbout = async () => {
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:8000/api/update-about",
        { about },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Updated successfully!");
      setUser((prev) => ({ ...prev, about }));
    } catch (error) {
      console.log("Update failed:", error);
    }
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.techStack) {
      alert("Please fill all fields.");
      return;
    }

    try {
      if (editIndex !== null) {
        // Update existing project
        const updatedProjects = [...projects];
        updatedProjects[editIndex] = newProject;

        await axios.put(
          `http://localhost:8000/api/projects/${projects[editIndex]._id}`,
          newProject,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProjects(updatedProjects);
        setEditIndex(null);
      } else {
        await axios.post(
          "http://localhost:8000/api/projects",
          newProject,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // Refetch all projects to ensure sync with database
        await fetchProjects();
        // console.log(newProject)
      }

      setNewProject({ title: "", description: "", techStack: "" });
    } catch (error) {
      console.log("Error adding/updating project:", error);
    }
  };

  const handleEditProject = (index) => {
    setNewProject(projects[index]);
    setEditIndex(index);
  };

  const handleDeleteProject = async (index) => {
    try {
      const projectId = projects[index]._id;
      await axios.delete(`http://localhost:8000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects(projects.filter((_, i) => i !== index));
    } catch (error) {
      console.log("Error deleting project:", error);
    }
  };

  const genderImage =
    user?.gender === "male"
      ? "/BOY.jpg"
      : user?.gender === "female"
      ? "/GIRL.jpg"
      : "/default.jpg";

  return (
    <div className="home-container">
      <div className="home">
        <div className="gender-image">
          <img
            src={genderImage}
            alt="User"
            className="profile-image"
            height="60"
            width="60"
          />
        </div>
        <h1 id="name" className="mb-0 fw-bold">
          Hi, I'm {user?.name ? user.name.toUpperCase() : "Guest"}!
        </h1>

        <form onSubmit={(e) => e.preventDefault()}>
          <textarea
            id="discript"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows="5"
            cols="50"
            className="home-control"
            placeholder="Write something about yourself here"
          />
          <br />
          <button
            type="button"
            className="home-btns"
            onClick={handleUpdateAbout}
          >
            Save
          </button>
        </form>

        <h1 className="proj-head"><i class="fa-solid fa-star" id="proj-font"></i>&nbsp;&nbsp;Projects</h1>
        <form onSubmit={(e) => e.preventDefault()} className="project-form">
          <input
            type="text"
            name="title"
            className="proj-control"
            value={newProject.title}
            onChange={handleProjectChange}
            placeholder="Project Title"
            required
          />
          <textarea
            name="description"
            className="proj-control"
            value={newProject.description}
            onChange={handleProjectChange}
            placeholder="Project Description"
            rows="3"
            
            required
          />
          <input
            type="text"
            name="techStack"
            className="proj-control"
            value={newProject.techStack}
            onChange={handleProjectChange}
            placeholder="Tech Stack (e.g. React, Node.js)"
            required
          />
          <button className="proj-btn" type="button" onClick={handleAddProject}>
            {editIndex !== null ? "Update Project" : "Add Project"}
          </button>
        </form>

        <div className="project-list">
          {projects.length === 0 ? (
            <p className="proj-alert">No projects added yet ❎</p>
          ) : (
            projects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="proj-output">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p><strong>Tech Stack&nbsp;:&nbsp;</strong> {project.techStack}</p>
                  <button onClick={() => handleEditProject(index)} className="proj-del">Edit</button>
                <button onClick={() => handleDeleteProject(index)} className="proj-del">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

//I'm a skilled MERN Stack Developer | Building Dynamic Web Applications (MongoDB, Express.js, React.js, Node.js) with a passion for creating responsive and engaging web experiences. Combining technical expertise with an eye for detail, I can deliver seamless front-end and back-end solutions to bring innovative ideas to life.