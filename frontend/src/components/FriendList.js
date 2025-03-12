import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Typography,
  Box,
  Dialog,
} from "@mui/material";
import Messaging from "./Messaging";

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);


  

  const handleMessageClick = (friend) => {
    console.log("Selected friend:", friend); // Debugging
    setSelectedFriend(friend);
  };

  const fetchFriends = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const res = await axios.get("http://localhost:5000/api/friends", {
        headers: { "x-auth-token": token },
      });
      setFriends(res.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/friends/requests",
        {
          headers: { "x-auth-token": token },
        }
      );
      setRequests(res.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/friends/${id}/accept`,
        {},
        { headers: { "x-auth-token": token } }
      );
      fetchFriends();
      fetchFriendRequests();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/friends/${id}/reject`,
        {},
        { headers: { "x-auth-token": token } }
      );
      fetchFriendRequests();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Friend Requests
      </Typography>
      <List>
        {requests.map((user) => (
          <ListItem key={user._id}>
            <ListItemAvatar>
              <Avatar src={user.profilePicture} />
            </ListItemAvatar>
            <ListItemText primary={user.username} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAcceptRequest(user._id)}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleRejectRequest(user._id)}
              sx={{ ml: 2 }}
            >
              Reject
            </Button>
          </ListItem>
        ))}
      </List>
      <Typography variant="h6" gutterBottom>
        Friends
      </Typography>
      <List>
        {friends.map((friend) => (
          <><ListItem key={friend._id}>
            <ListItemAvatar>
              <Avatar src={friend.profilePicture} />
            </ListItemAvatar>
            <ListItemText primary={friend.username} />
          </ListItem><ListItem>
              <Button
                variant="contained"
                onClick={() => handleMessageClick(friend)}
              >
                Message
              </Button>
            </ListItem></>
          
        ))}
      </List>
      {/* Messaging Dialog */}
      <Dialog
        open={!!selectedFriend}
        onClose={() => setSelectedFriend(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedFriend && (
          <Messaging
            friend={selectedFriend}
            onClose={() => setSelectedFriend(null)}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default FriendList;
