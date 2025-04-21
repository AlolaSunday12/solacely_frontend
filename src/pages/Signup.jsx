import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Course4 from '../assets/Course4.jpg';

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await api.post('/auth/signup', form);
      console.log(res.data);
      //alert('Signup successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.errors?.join(', ') || 'Signup failed');
    }
  };

  return (
    <div
          className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{ backgroundImage: `url(${Course4})` }}
        >
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-md mx-4">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 w-full"
      >
        Register
      </button>
    </div>
    </div>
  );
};

export default Signup;
