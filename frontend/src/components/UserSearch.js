import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
} from "@mui/material";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/friends/search?query=${query}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setResults(res.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleSendRequest = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/friends/${id}/request`,
        {},
        { headers: { "x-auth-token": token } }
      );
      alert("Friend request sent");
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Search for users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>
        Search
      </Button>
      <List>
        {results.map((user) => (
          <ListItem key={user._id}>
            <ListItemAvatar>
              <Avatar src={user.profilePicture} />
            </ListItemAvatar>
            <ListItemText primary={user.username} />
            <Button
              variant="contained"
              onClick={() => handleSendRequest(user._id)}
            >
              Add Friend
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserSearch;
