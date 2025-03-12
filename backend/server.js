const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const path = require("path");
const messageRoutes = require("./routes/message");
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);

// Add this line after postRoutes
app.use("/api/messages", messageRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const profileRoutes = require("./routes/profile");
// Add this line after authRoutes
app.use("/api/profile", profileRoutes);

const friendRoutes = require("./routes/friends");
// Add this line after profileRoutes
app.use("/api/friends", friendRoutes);

const postRoutes = require("./routes/posts");
// Add this line after friendRoutes
app.use("/api/posts", postRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
