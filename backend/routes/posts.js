const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// Create a post
router.post("/", auth, async (req, res) => {
  try {
    const { content, images, videos, tags } = req.body;
    const user = await User.findById(req.user.id);

    // Validate tagged users
    const taggedUsers = await User.find({ _id: { $in: tags } });
    if (taggedUsers.length !== tags.length) {
      return res.status(400).json({ message: "Invalid user tags" });
    }

    // Create the post
    const post = {
      content,
      images: images || [],
      videos: videos || [],
      tags: tags || [],
    };
    user.posts.push(post);
    await user.save();

    res.status(201).json(user.posts[user.posts.length - 1]);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get news feed (posts from friends)
router.get("/feed", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "friends",
      select: "username profilePicture posts", // Include user details
      populate: {
        path: "posts.tags",
        select: "username profilePicture", // Include tagged user details
      },
    });

    const feed = user.friends.flatMap((friend) =>
      friend.posts.map((post) => ({
        ...post._doc,
        username: friend.username, // Add username of the post creator
        profilePicture: friend.profilePicture, // Add profile picture of the post creator
      }))
    );

    feed.sort((a, b) => b.createdAt - a.createdAt); // Sort by latest posts
    // console.log("Feed data:", feed); // Log the feed data for debugging
    res.json(feed);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Upload an image
router.post("/upload", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // URL to access the uploaded file
    res.status(201).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
