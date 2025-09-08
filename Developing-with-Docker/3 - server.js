const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection (replace with your connection string)
mongoose
  .connect("mongodb://admin:password@127.0.0.1:27017", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Profile schema
const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  interests: String
});

const Profile = mongoose.model("Profile", profileSchema);

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API: get all profiles
app.get("/profiles", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
});

// API: add profile
app.post("/add", async (req, res) => {
  try {
    const newProfile = new Profile({
      name: req.body.name,
      email: req.body.email,
      interests: req.body.interests
    });
    await newProfile.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ error: "Failed to add profile" });
  }
});

// API: delete profile
app.post("/delete/:id", async (req, res) => {
  try {
    await Profile.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ error: "Failed to delete profile" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
