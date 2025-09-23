const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true },
  grade: { type: String, required: true },
  course: { type: String, required: true },
});

const Education = mongoose.model("Education", EducationSchema);
module.exports = Education;
