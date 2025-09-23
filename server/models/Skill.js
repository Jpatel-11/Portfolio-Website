const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skillName: { type: String, required: true },
});

module.exports = mongoose.model("Skill", SkillSchema);
