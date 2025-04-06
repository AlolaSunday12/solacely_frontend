import React, { useContext } from 'react';
import api from '../api'; // Axios or fetch wrapper
import { Link } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext); // get user and setUser from context

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); // call logout endpoint
      setUser(null); // clear user context
      window.location.href = '/'; // redirect to homepage
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex gap-4">
      {!user ? (
        <>
          <Link to="/">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      ) : (
        <>
          <Link to="/profile">Profile</Link>
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