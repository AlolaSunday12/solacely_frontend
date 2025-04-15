import React, { useEffect, useState } from 'react';
import api from '../api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('None');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Reflect all valid categories from your Sequelize ENUM
  const categoryOptions = ['None', 'Alpha', 'Bravo', 'Charlie', 'Delta'];

  const getProfile = async () => {
    try {
      const res = await api.get('/profile');
      setUser(res.data);
      setSelectedCategory(res.data.category || 'None');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      const res = await api.put('/updateProfile/:id', {
        category: selectedCategory,
      });
      setUser(res.data.user);
      setMessage('Squadron updated successfully.');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update squadron.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      {user ? (
        <div className="space-y-4">
          <div className="thumbnail-container">
            <img
              src={user.thumbnail || 'default-thumbnail.png'}
              alt="Profile Thumbnail"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <div>
            <label className="block font-semibold mb-1">Squadron</label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span>{user.category}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
            {message && <p className="text-sm text-gray-600 mt-1">{message}</p>}
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
