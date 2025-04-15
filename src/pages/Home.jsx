import React, { useEffect, useState } from 'react'; 
import api from '../api';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categoryOptions = ['All', 'None', 'Alpha', 'Bravo', 'Charlie', 'Delta'];
  const statusOptions = ['All', 'Active', 'Retired'];

  const fetchUsers = async () => {
    try {
      const res = await api.get('/');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Something went wrong while fetching users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, selectedCategory, selectedStatus, searchTerm]);

  const filterUsers = () => {
    let filtered = [...users];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((user) => user.category === selectedCategory);
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter((user) => (user.status || 'Active') === selectedStatus);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const getCategoryCounts = () => {
    const counts = {};
    users.forEach((user) => {
      const cat = user.category || 'None';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  if (loading) return <p className="text-center text-gray-500">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <h1 className="text-xl font-bold mb-4 text-center">All Users</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-3 py-2 rounded-md shadow-sm"
        >
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border px-3 py-2 rounded-md shadow-sm"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md shadow-sm w-48"
        />
      </div>

      {/* Category Counts */}
      <div className="mb-4 flex flex-wrap gap-3 justify-center text-sm text-gray-700">
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <span
            key={cat}
            className="px-3 py-1 bg-gray-100 border rounded-full"
          >
            {cat}: {count}
          </span>
        ))}
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-x-auto text-xs">
        {/* Header */}
        <div className="flex divide-x divide-gray-300 bg-gray-100 font-medium text-gray-700">
          <div className="flex-1 px-2 py-2">Name</div>
          <div className="flex-1 px-2 py-2">Email</div>
          <div className="flex-1 px-2 py-2">Squadron</div>
          <div className="flex-1 px-2 py-2">Status</div>
        </div>

        {/* Rows */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex divide-x divide-gray-200 border-t text-gray-800"
            >
              <div className="flex-1 px-2 py-2 truncate">{user.username}</div>
              <div className="flex-1 px-2 py-2 truncate">{user.email}</div>
              <div className="flex-1 px-2 py-2 truncate">{user.category || 'None'}</div>
              <div className="flex-1 px-2 py-2 truncate">{user.status || 'Active'}</div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default Home;


