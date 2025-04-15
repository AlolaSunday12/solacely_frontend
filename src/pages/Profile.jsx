import React, { useEffect, useState } from 'react';
import api from '../api';
import { ToastContainer, toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    category: 'None',
    status: 'Active', // added
    thumbnail: null,
  });

  const categoryOptions = ['None', 'Alpha', 'Bravo', 'Charlie', 'Delta'];
  const statusOptions = ['Active', 'Retired']; // added

  const getProfile = async () => {
    try {
      const res = await api.get('/profile');
      setUser(res.data);
      setFormData({
        username: res.data.username,
        category: res.data.category || 'None',
        status: res.data.status || 'Active', // added
        thumbnail: null,
      });
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, thumbnail: e.target.files[0] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const form = new FormData();
    form.append('username', formData.username);
    form.append('category', formData.category);
    form.append('status', formData.status); // added
    if (formData.thumbnail) {
      form.append('thumbnail', formData.thumbnail);
    }

    try {
      const res = await api.put('/updateProfile', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(res.data.user);
      setIsModalOpen(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      {user ? (
        <div className="space-y-4">
          <img
            src={user.thumbnail || 'default-thumbnail.png'}
            alt="Profile Thumbnail"
            className="w-32 h-32 rounded-full object-cover"
          />
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Squadron:</strong> {user.category}</p>
          <p><strong>Status:</strong> {user.status}</p> {/* added */}

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Squadron</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  {statusOptions.map((stat) => (
                    <option key={stat} value={stat}>{stat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium">Profile Picture</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full"
                />
              </div>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-4"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;



