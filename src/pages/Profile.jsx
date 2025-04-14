import React, { useEffect, useState } from 'react';
import api from '../api'; // Assuming your api.js is set up with axios or fetch

const Profile = () => {
  const [user, setUser] = useState(null);

  const getProfile = async () => {
    try {
      const res = await api.get('/profile');
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Profile</h2>
      {user ? (
        <div className="mt-4">
          <div className="thumbnail-container mb-4">
            <img
              src={user.thumbnail || 'default-thumbnail.png'}
              alt="Profile Thumbnail"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Squadron:</strong> {user.category}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;