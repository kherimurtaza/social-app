import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Chip,
  Typography,
  IconButton,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/posts/upload", formData, {
        headers: { "x-auth-token": token, "Content-Type": "multipart/form-data" },
      });
      setImages([...images, res.data.imageUrl]);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const videoUrls = files.map((file) => URL.createObjectURL(file));
    setVideos([...videos, ...videoUrls]);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/posts",
        { content, images, videos, tags },
        { headers: { "x-auth-token": token } }
      );
      onPostCreated(res.data);
      setContent("");
      setImages([]);
      setVideos([]);
      setTags([]);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      {/* Image Upload */}
      <Box sx={{ mt: 2 }}>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="image-upload"
          type="file"
          multiple
          onChange={handleImageUpload}
        />
        <label htmlFor="image-upload">
          <IconButton component="span">
            <AddPhotoAlternateIcon />
          </IconButton>
        </label>
        <Typography variant="caption">Add Images</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`uploaded-${index}`}
              style={{ width: 100, height: 100, objectFit: "cover" }}
            />
          ))}
        </Box>
      </Box>

      {/* Video Upload */}
      <Box sx={{ mt: 2 }}>
        <input
          accept="video/*"
          style={{ display: "none" }}
          id="video-upload"
          type="file"
          multiple
          onChange={handleVideoUpload}
        />
        <label htmlFor="video-upload">
          <IconButton component="span">
            <VideoCameraBackIcon />
          </IconButton>
        </label>
        <Typography variant="caption">Add Videos</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {videos.map((video, index) => (
            <video
              key={index}
              src={video}
              controls
              style={{ width: 100, height: 100, objectFit: "cover" }}
            />
          ))}
        </Box>
      </Box>

      {/* Tag Input */}
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Tag Users"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />
        <Button onClick={handleAddTag} sx={{ mt: 1 }}>
          Add Tag
        </Button>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
            />
          ))}
        </Box>
      </Box>

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Post
      </Button>
    </Box>
  );
};

export default PostForm;
