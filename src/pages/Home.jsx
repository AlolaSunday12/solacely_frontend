// Home.js
import React, { useEffect, useState } from 'react'; 
import api from '../api';
import Comment from '../pages/comment';

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
      <h1 className="text-xl font-bold mb-4 text-center">BMTC30 REGULARS</h1>

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
          <span key={cat} className="px-3 py-1 bg-gray-100 border rounded-full">
            {cat}: {count}
          </span>
        ))}
      </div>

      {/* Table */} 
<div className="border rounded-md border-slate-800 overflow-x-auto text-sm">
  {/* Header */}
  <div className="flex border-b border-slate-800 bg-gray-100 font-medium text-gray-800">
    <div className="w-12 px-2 py-2 border-r border-slate-800 text-center">S/N</div>
    <div className="flex-1 px-2 py-2 border-r border-slate-800">Name</div>
    <div className="flex-1 px-2 py-2 border-r border-slate-800">Email</div>
    <div className="flex-1 px-2 py-2 border-r border-slate-800">Squadron</div>
    <div className="flex-1 px-2 py-2">Status</div>
  </div>

  {/* Rows */}
  {filteredUsers.length > 0 ? (
    filteredUsers.map((user, index) => (
      <div
        key={user.id}
        className="flex border-b border-slate-800 text-gray-800 hover:bg-gray-50"
      >
        <div className="w-12 px-2 py-2 border-r border-slate-800 text-center">{index + 1}</div>
        <div className="flex-1 px-2 py-2 border-r border-slate-800 truncate">{user.username}</div>
        <div className="flex-1 px-2 py-2 border-r border-slate-800 truncate">{user.email}</div>
        <div className="flex-1 px-2 py-2 border-r border-slate-800 truncate">{user.category || 'None'}</div>
        <div className="flex-1 px-2 py-2 truncate">{user.status || 'Active'}</div>
      </div>
    ))
  ) : (
    <div className="text-center py-4 text-gray-500">No users found.</div>
  )}
</div>


      <Comment />
    </div>
  );
};

export default Home;



