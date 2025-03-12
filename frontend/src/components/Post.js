import React from "react";
import { Avatar, Box, Typography, Paper, Chip } from "@mui/material";

const Post = ({ post }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          src={post?.profilePicture || "https://via.placeholder.com/150"}
          sx={{ mr: 2 }}
        />
        <Typography variant="h6">{post?.username || "User"}</Typography>
      </Box>
      <Typography variant="body1">{post?.content || "No content"}</Typography>

      {/* Display Images */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
      {post?.images?.map((image, index) => (
          <img
            key={index}
            src={image.startsWith("http") ? image : `http://localhost:5000${image}`} // Construct full URL
            alt={`post-image-${index}`}
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ))}
      </Box>

      {/* Display Videos */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
      {post?.videos?.map((video, index) => (
          <video
            key={index}
            src={video.startsWith("http") ? video : `http://localhost:5000${video}`} // Construct full URL
            controls
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ))}
      </Box>

      {/* Display Tags */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Tagged Users:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {post?.tags?.map((tag, index) => (
            <Chip key={index} label={tag.username} sx={{ mt: 1 }} />
          ))}
        </Box>
      </Box>

      <Typography variant="caption" color="textSecondary">
        {post?.createdAt
          ? new Date(post.createdAt).toLocaleString()
          : "Unknown date"}
      </Typography>
    </Paper>
  );
};

export default Post;
