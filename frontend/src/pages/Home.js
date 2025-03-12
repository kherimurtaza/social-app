import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Grid,
  Paper,
} from "@mui/material";
import FriendList from "../components/FriendList";
import UserSearch from "../components/UserSearch";
import PostForm from "../components/PostForms";
import Post from "../components/Post";

const Home = () => {
  const [user, setUser] = useState({});
  const [feed, setFeed] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profilePicture: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      fetchProfile();

      fetchFeed();
    }
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/profile/me", {
        headers: { "x-auth-token": token },
      });
      setUser(res.data);
      setFormData(res.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/posts/feed", {
        headers: { "x-auth-token": token },
      });
      setFeed(res.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handlePostCreated = (newPost) => {
    setFeed([newPost, ...feed]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      await axios.put("http://localhost:5000/api/profile/me", formData, {
        headers: { "x-auth-token": token },
      });
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setFormData({ ...formData, profilePicture: base64 });

    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/profile/me/upload",
        { profilePicture: base64 },
        { headers: { "x-auth-token": token } }
      );
      fetchProfile();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Left Top Corner: Profile Section */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              src={user.profilePicture || "https://via.placeholder.com/150"}
              sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
            />
            {editMode ? (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ margin: "20px 0" }}
                />
                <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </form>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {user.username}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {user.bio}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setEditMode(true)}
                  sx={{ mt: 2 }}
                >
                  Edit Profile
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Top Center: User Search Bar */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Find Friends
            </Typography>
            <UserSearch />
          </Paper>
        </Grid>

        {/* Right Top Corner: Friend Requests and Friends List */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom></Typography>
            <FriendList />
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Left Column: Profile Section */}
        <Grid item xs={12} md={3}>
          {/* Profile Section (Same as before) */}
        </Grid>

        {/* Center Column: News Feed */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            News Feed
          </Typography>
          <PostForm onPostCreated={handlePostCreated} />
          {feed.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </Grid>

        {/* Right Column: Friend Requests and Friends List */}
        <Grid item xs={12} md={3}>
          {/* Friend Requests and Friends List (Same as before) */}
          {/* <FriendList /> */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
