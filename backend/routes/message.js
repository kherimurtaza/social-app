const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const auth = require("../middleware/auth");

// Send a message
router.post("/send", auth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    // Validate receiver
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Check if receiver is a friend
    const sender = await User.findById(senderId);
    if (!sender.friends.includes(receiverId)) {
      return res.status(400).json({ message: "You can only message friends" });
    }

    // Save the message to both sender and receiver
    const message = { sender: senderId, receiver: receiverId, content };
    sender.messages.push(message);
    receiver.messages.push(message);
    await sender.save();
    await receiver.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Fetch messages between two users
router.get("/:friendId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.friendId;

    // Fetch messages where the user is either the sender or receiver
    const user = await User.findById(userId).populate({
      path: "messages",
      match: {
        $or: [
          { sender: friendId, receiver: userId },
          { sender: userId, receiver: friendId },
        ],
      },
      populate: {
        path: "sender receiver",
        select: "username profilePicture",
      },
    });

    res.json(user.messages);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
