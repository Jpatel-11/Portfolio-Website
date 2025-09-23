const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // If achievements are linked to users
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Achievement", AchievementSchema);
