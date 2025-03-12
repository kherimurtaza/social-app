import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profilePicture: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

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
    <div className="profile">
      <h1>Profile</h1>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
          />
          <input type="file" onChange={handleFileUpload} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
          />
          <h2>{user.username}</h2>
          <p>{user.bio}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default Profile;