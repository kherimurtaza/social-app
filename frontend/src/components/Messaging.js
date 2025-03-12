import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Avatar, Paper } from "@mui/material";
import Message from "./Message";

const Messaging = ({ friend }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchMessages();
  }, [friend]);

  const fetchMessages = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/messages/${friend._id}`, {
        headers: { "x-auth-token": token },
      });
      setMessages(res.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleSendMessage = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const res = await axios.post(
        "http://localhost:5000/api/messages/send",
        { receiverId: friend._id, content },
        { headers: { "x-auth-token": token } }
      );
      setMessages([...messages, res.data]);
      setContent("");
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Chat with {friend.username}
      </Typography>
      <Box sx={{ height: "400px", overflowY: "auto", mb: 2 }}>
        {messages.map((message) => (
          <Message
            key={message._id}
            message={message}
            isSender={message.sender._id == friend._id}
          />
        ))}
      </Box>
      <Box display="flex" alignItems="center">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button variant="contained" onClick={handleSendMessage} sx={{ ml: 2 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Messaging;