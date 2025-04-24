import React, { useState, useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import Course4 from '../assets/Course4.jpg'; // 👈 Update path as necessary

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log(res.data);
      setUser(res.data);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  const googleLogin = () => {
    window.open('http://localhost:5000/auth/google', '_self');
  };

  const facebookLogin = () => {
    window.open('http://localhost:5000/auth/facebook', '_self');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${Course4})` }}
    >
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <input
          className="border border-gray-300 p-3 w-full mb-4 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border border-gray-300 p-3 w-full mb-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Forgot password link */}
        <div className="text-right text-sm mb-4">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          onClick={loginUser}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-3 w-full rounded mb-4"
        >
          Login
        </button>

        <div className="flex justify-between space-x-4">
          <button
            onClick={googleLogin}
            className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-3 w-full rounded"
          >
            Google
          </button>
          <button
            onClick={facebookLogin}
            className="bg-blue-800 hover:bg-blue-900 transition text-white px-4 py-3 w-full rounded"
          >
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
