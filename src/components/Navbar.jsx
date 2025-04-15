import React, { useContext } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex items-center">
      <Link to="/" className="text-lg font-semibold">Home</Link>

      {/* Buttons pushed to the right */}
      <div className="ml-auto flex items-center gap-4">
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
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
