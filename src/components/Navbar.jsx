import React, { useContext } from 'react';
import api from '../api'; // Axios or fetch wrapper
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext); // get user and setUser from context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/'); // Navigate to homepage after logout
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex gap-4">
      <Link to="/" className="text-lg">Home</Link> {/* Home link added here */}
      {!user ? (
        <>
          <Link to="/login" className="text-lg">Login</Link>
          <Link to="/signup" className="text-lg">Signup</Link>
        </>
      ) : (
        <>
          <Link to="/profile" className="text-lg">Profile</Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
