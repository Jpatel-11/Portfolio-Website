const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    number: Number,
    email: { type: String, unique: true },
    password: String,
    about: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
  },
  { timestamps: true } // Auto-adds createdAt & updatedAt fields
);

const User = mongoose.model("User", userSchema);

module.exports = User;
