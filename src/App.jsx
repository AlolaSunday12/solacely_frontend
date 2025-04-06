import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import axios from 'axios';
import api from './api';
import { useEffect, useState } from 'react';
import { UserContext } from './context/userContext';

function App() {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;