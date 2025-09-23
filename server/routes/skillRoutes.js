const express = require("express");
const authMiddleware = require("../middlewere/auth");
const Skill = require("../models/Skill");

const router = express.Router();

// Add Skill
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { skillName } = req.body;
    if (!skillName) return res.status(400).json({ error: "Skill name is required" });

    const newSkill = new Skill({ userId: req.user._id, skillName });
    await newSkill.save();
    res.status(201).json(newSkill);
    console.log("Skill added successfully"); // Debugging messagee.log("Skill added successfully", newSkill); // Debugging message
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get User Skills
router.get("/", authMiddleware, async (req, res) => {
  // console.log("hello", req.body);
  try {
    const skills = await Skill.find({ userId: req.user._id }); // Fixed query
    // console.log("Skills fetched successfully", skills); // Debugging message
    res.json(skills);
  } catch (error) {
    console.log("Error fetching skills:", error); // Debugging message
    res.status(500).json({ error: "Server error" });
  }
});


// Delete Skill
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    console.log("Skills fetched successfully for delete", skill);
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    if (skill.userId.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
