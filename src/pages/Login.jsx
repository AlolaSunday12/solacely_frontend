import React, { useState } from 'react';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log(res.data);
      alert('Login successful!');
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
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={loginUser}
        className="bg-blue-600 text-white px-4 py-2 w-full"
      >
        Login
      </button>
      <div className="flex justify-between mt-4">
        <button onClick={googleLogin} className="bg-red-500 text-white px-4 py-2 w-full mr-2">Google</button>
        <button onClick={facebookLogin} className="bg-blue-800 text-white px-4 py-2 w-full ml-2">Facebook</button>
      </div>
    </div>
  );
};

export default Login;