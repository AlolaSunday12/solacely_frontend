import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Navbar from './components/Navbar';

import api from './api';
import { useEffect, useState } from 'react';
import { UserContext } from './context/userContext';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/user'); // <- calls the route above
        setUser(res.data); // ✅ sets logged-in user after redirect
      } catch (err) {
        console.log('User not logged in');
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;