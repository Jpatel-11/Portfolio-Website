require("dotenv").config();

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users.js");
const Project = require("../models/Project.js");
const Achievement = require("../models/Achivements.js");
const authenticateUser = require("../middlewere/auth.js");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, number, email, gender, password } = req.body;
  // console.log(req.body);
  const hashedPassword = await bcrypt.hash(password, 10); 

  const user = new User({
    name,
    number,
    email,
    gender,
    password: hashedPassword,
  });

  try {
    await user.save();
    res.status(201).send("User registered successfully.");
  } catch (err) {
    res.status(400).send("Error registering user.");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).send("User not found.");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).send("Invalid credentials.");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "365d",
  });
  res.json({ token, user });
});

// Get user data
router.get("/user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  // console.log("Request Headers:", req.headers);

  if (!token)
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    // console.log("Decoded Token:", decoded);
    if (!user) return res.status(404).send("User not found.");
    res.json(user);
    // console.log(user);
  } catch (err) {
    res.status(401).send("Invalid token.");
  }
});

// // 🔹 Update User Data
router.post("/update-about", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { about } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { about },
      { new: true } // Ensures the updated document is returned
    );
    // console.log("user id",decoded.userId);
    console.log("MongoDB Update Result:", user);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.about = about;
    await user.save();
    res.json({ message: "About info updated successfully", about: user.about });
    console.log(user.about);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



// Update User Contact Details (Email & Phone)
router.put("/user/update-contact", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { email, number } = req.body;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with env variable
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { email, number },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Contact details updated successfully",
      user, // ✅ Send full updated user object
    });
  } catch (err) {
    console.error("Error updating contact details:", err);
    res.status(500).json({ error: "Server error" });
  }
});



/* ==========================
   PROJECT ROUTES (CRUD)
=========================== */

// ✅ Add a New Project (Protected)
router.post("/projects", authenticateUser, async (req, res) => {
  const { title, description, techStack } = req.body;
  try {
    const newProject = new Project({ user: req.user._id, title, description, techStack });
    await newProject.save();
    // console.log(newProject)
    res.status(201).json({ message: "Project added successfully!", project: newProject });
  } catch (err) {
    res.status(500).json({ error: "Error adding project" });
  }
});

// ✅ Get All Projects for the Logged-in User (Protected)
router.get("/projects", authenticateUser, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Error fetching projects" });
  }
});

// ✅ Update a Project (Protected)
router.put("/projects/:id", authenticateUser, async (req, res) => {
  const { title, description, techStack } = req.body;

  try {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, techStack },
      { new: true }
    );

    if (!updatedProject) return res.status(404).json({ error: "Project not found or unauthorized" });

    res.json({ message: "Project updated successfully!", project: updatedProject });
  } catch (err) {
    res.status(500).json({ error: "Error updating project" });
  }
});

// ✅ Delete a Project (Protected)
router.delete("/projects/:id", authenticateUser, async (req, res) => {
  try {
    const deletedProject = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!deletedProject) return res.status(404).json({ error: "Project not found or unauthorized" });

    res.json({ message: "Project deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting project" });
  }
});

// ✅ 1. Add Achievement
router.post("/Achivementadd", authenticateUser, async (req, res) => {
  try {
    const { text } = req.body;
    const newAchievement = new Achievement({ text, userId: req.user.id });
    await newAchievement.save();
    res.status(201).json(newAchievement);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ 2. Get All Achievements of User
router.get("/Achivementget", authenticateUser, async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user.id });
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ 3. Delete Achievement
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement || achievement.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "Achievement not found" });
    }
    await achievement.deleteOne();
    res.status(200).json({ message: "Achievement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
