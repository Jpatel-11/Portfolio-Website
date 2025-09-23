import React, { useState } from 'react';
import axios from 'axios';
import "../Contact/Contact.css";

const Contact = ({ user, setUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: user.email,
    number: user.number,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // ✅ Success/Error message
  
  // console.log(user.email, user.number)

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save updated details
  const handleSave = async () => {
    setLoading(true);
    setMessage(""); // Clear previous messages
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("http://localhost:8000/api/user/update-contact", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data)

      setUser(res.data.user); // ✅ Fix: Use res.data.user
      setEditMode(false);
      setMessage("Contact details updated successfully! ✅");
    } catch (err) {
      console.error("Failed to update user details:", err);
      setMessage("❌ Failed to update contact details. Try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log(formData)

  return (
    <div className="contact-container">
      <div className="contact">
      <h1 className="con-head"><i class="fa-solid fa-user" id="con-font"></i>&nbsp;&nbsp;Contact Me </h1>
        {message && <p className="success-message">{message}</p>} {/* ✅ Show success/error message */}
        {editMode ? (
          <div>
            <div className="contact-input">
              <label>Email&nbsp;:&nbsp;</label>
              <input
                className="con-control"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Add your email here"
              />
            </div>
            <div className="contact-input">
              <label>Phone&nbsp;:&nbsp;</label>
              <input
                className="con-control"
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Add your phone no. here"
              />
            </div>
            <button className="con-btns" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button className="con-btns" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        ) : (
          <div>
            <div className="contact-input">
              <p>Email&nbsp;:&nbsp; {user.email}</p>
            </div>
            <div className="contact-input">
              <p>Phone&nbsp;:&nbsp; {user.number}</p>
            </div>
            <button className="con-btns" onClick={() => setEditMode(true)}>Edit</button>
          </div>
        )}
        <a href="https://github.com" className="con-link"><i class="fa-brands fa-github"></i>&nbsp;&nbsp;Github</a>
        <a href="https://linkedin.com" className="con-link"><i class="fa-brands fa-linkedin"></i>&nbsp;&nbsp;LinkedIn</a>
      </div>
    </div>
  );
};

export default Contact;
