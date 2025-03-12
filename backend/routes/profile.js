const express = require("express");
const router = express.Router();
const User = require("../models/Users.js");
const auth = require("../middleware/auth");

// Get user profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Update user profile
router.put("/me", auth, async (req, res) => {
  try {
    const { username, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, bio },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Upload profile picture
router.post("/me/upload", auth, async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;