const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  content: String,
});

const UserData = mongoose.model("UserData", userDataSchema);
module.exports = UserData;
