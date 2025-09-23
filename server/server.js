const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const authRoutes = require("./routes/authRoutes.js");
const skillRoutes = require("./routes/skillRoutes");
const educationRoutes = require("./routes/educationRoutes.js");
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB")).catch((err) => console.error("MongoDB connection error:", err));


app.use("/api", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/education", educationRoutes);
// app.use("/api/user", require("./routes/authRoutes")); // Make sure this matches

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello jaimin here!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});