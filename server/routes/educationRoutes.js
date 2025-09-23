const express = require("express");
const authenticateUser = require("../middlewere/auth.js");
const Education = require("../models/Education.js");

const router = express.Router();

// ✅ Add Education (Protected)
router.post("/add", authenticateUser, async (req, res) => {
  const { institution, year, grade, course } = req.body;
  try {
    const newEducation = new Education({
      user: req.user._id,
      institution,
      year,
      grade,
      course,
    });

    await newEducation.save();
    res.status(201).json({ message: "Education added successfully!", education: newEducation });
  } catch (err) {
    res.status(500).json({ error: "Error adding education" });
  }
});

// ✅ Get All Education Records for the User (Protected)
router.get("/", authenticateUser, async (req, res) => {
  try {
    const educationRecords = await Education.find({ user: req.user._id });
    res.json(educationRecords);
  } catch (err) {
    res.status(500).json({ error: "Error fetching education details" });
  }
});

// ✅ Update Education (Protected)
router.put("/:id", authenticateUser, async (req, res) => {
  const { institution, year, grade, course } = req.body;

  try {
    const updatedEducation = await Education.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { institution, year, grade, course },
      { new: true }
    );

    if (!updatedEducation) return res.status(404).json({ error: "Education record not found or unauthorized" });

    res.json({ message: "Education updated successfully!", education: updatedEducation });
  } catch (err) {
    res.status(500).json({ error: "Error updating education" });
  }
});

// ✅ Delete Education (Protected)
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const deletedEducation = await Education.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!deletedEducation) return res.status(404).json({ error: "Education record not found or unauthorized" });

    res.json({ message: "Education deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting education" });
  }
});

module.exports = router;
