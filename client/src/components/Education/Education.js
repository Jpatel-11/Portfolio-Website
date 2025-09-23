import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../Education/Education.css";

const Education = () => {
  const [educationList, setEducationList] = useState([]);
  const [formData, setFormData] = useState({
    institution: "",
    year: "",
    grade: "",
    course: "",
  });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ Memoized Fetch Function to Prevent Unnecessary Renders
  const fetchEducation = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/education", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEducationList(res.data);
    } catch (err) {
      console.error("Error fetching education data", err);
    }
  }, [token]); // ✅ Add token as a dependency

  // ✅ useEffect with Proper Dependency
  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]); // ✅ No ESLint warning now

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://localhost:8000/api/education/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:8000/api/education/add", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ institution: "", year: "", grade: "", course: "" });
      setEditId(null);
      fetchEducation(); // ✅ Refresh Data After Update
    } catch (err) {
      console.error("Error saving education", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/education/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEducation(); // ✅ Refresh Data After Deletion
    } catch (err) {
      console.error("Error deleting education", err);
    }
  };

  const handleEdit = (edu) => {
    setFormData(edu);
    setEditId(edu._id);
  };

  return (
    <div className="education-container">
      <div className="educations">
      <h1 className="edu-head"><i class="fa-solid fa-user-graduate" id="edu-font"></i>&nbsp;&nbsp;Education</h1>
        <form onSubmit={handleSubmit} className="edus-input">
          <input
            type="text"
            name="institution"
            className="edu-control"
            value={formData.institution}
            onChange={handleChange}
            placeholder="Institution"
            required
          />
          <input
            type="text"
            name="year"
            className="edu-control"
            value={formData.year}
            onChange={handleChange}
            placeholder="Year"
            required
          />
          <input
            type="text"
            name="grade"
            className="edu-control"
            value={formData.grade}
            onChange={handleChange}
            placeholder="Grade"
            required
          />
          <input
            type="text"
            name="course"
            className="edu-control"
            value={formData.course}
            onChange={handleChange}
            placeholder="Course"
            required
          />
          <button type="submit" className="edu-btn">
            {editId ? "Update" : "Add"}
          </button>
        </form>
        <ul className="edus-output">
          {educationList.map((edu) => (
            <>
            <li className="edus-show" key={edu._id}>
              <strong>{edu.institution}</strong> - {edu.course} ({edu.year}) - Grade&nbsp;:&nbsp; {edu.grade}
            </li>
            <button onClick={() => handleEdit(edu)} className="edu-del">Edit</button>
            <button onClick={() => handleDelete(edu._id)} className="edu-del">Delete</button>
            </>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Education;
