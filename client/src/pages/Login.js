import React, { useState } from 'react';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      localStorage.setItem('token', res.data.token); // Store JWT
      alert('Login successful!');
      window.location.href = '/'; // Redirect to home
    } catch (err) {
      alert(err.response.data.msg || 'Login failed.');
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email"  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring" onChange={handleChange} required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
      </form>
      </div>
    </div>
  );
};

export default Login;
