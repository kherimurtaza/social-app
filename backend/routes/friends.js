const express = require("express");
const router = express.Router();
const User = require("../models/Users.js");
const auth = require("../middleware/auth");

// Search for users
router.get("/search", auth, async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("-password -friendRequests -friends");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Send friend request
router.post("/:id/request", auth, async (req, res) => {
  try {
    const userToAdd = await User.findById(req.params.id);
    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(req.user.id);
    if (user.friends.includes(userToAdd._id)) {
      return res.status(400).json({ message: "Already friends" });
    }

    if (userToAdd.friendRequests.includes(user._id)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    userToAdd.friendRequests.push(user._id);
    await userToAdd.save();

    res.json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Accept friend request
router.post("/:id/accept", auth, async (req, res) => {
  try {
    const userToAccept = await User.findById(req.params.id);
    if (!userToAccept) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user.friendRequests.includes(userToAccept._id)) {
      return res.status(400).json({ message: "No friend request found" });
    }

    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== userToAccept._id.toString()
    );
    user.friends.push(userToAccept._id);
    userToAccept.friends.push(user._id);

    await user.save();
    await userToAccept.save();

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Reject friend request
router.post("/:id/reject", auth, async (req, res) => {
  try {
    const userToReject = await User.findById(req.params.id);
    if (!userToReject) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(req.user.id);
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== userToReject._id.toString()
    );
    await user.save();

    res.json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get friend requests
router.get("/requests", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("friendRequests", "username profilePicture")
      .select("-password");
    res.json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get friends list
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("friends", "username profilePicture")
      .select("-password");
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;