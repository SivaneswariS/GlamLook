import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
  headers: { Authorization: `Bearer ${token}` },
});
        const data = await res.json();
        if (res.ok) {
          setProfile({ name: data.name, email: data.email });
        } else {
          setMessage(data.error || "Failed to load profile");
        }
      } catch (err) {
        setMessage("Error loading profile");
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...profile, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully ✅");
        if (data.token) {
          localStorage.setItem("token", data.token); // refresh token
        }
        setPassword(""); // clear password field
      } else {
        setMessage(data.error || "Update failed");
      }
    } catch (err) {
      setMessage("Error updating profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>
      {message && <p className="text-center text-red-500">{message}</p>}

      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password (leave blank to keep unchanged)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-fuchsia-700 hover:bg-fuchsia-800 text-white py-2 rounded-lg"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
