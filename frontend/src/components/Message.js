import React from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";

const Message = ({ message, isSender }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isSender ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          maxWidth: "70%",
          backgroundColor: isSender ? "#1976d2" : "#f5f5f5",
          color: isSender ? "#fff" : "#000",
        }}
      >
        <Box display="flex" alignItems="center" mb={1}>
          <Avatar
            src={message.sender.profilePicture}
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          <Typography variant="body2">{message.sender.username}</Typography>
        </Box>
        <Typography variant="body1">{message.content}</Typography>
      </Paper>
    </Box>
  );
};

export default Message;
