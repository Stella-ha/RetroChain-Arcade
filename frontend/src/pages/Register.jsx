import { useState } from 'react';
import React from 'react';
import Footer from '../components/Footer'; // optional

export default function Register() {
  const [formData, setFormData] = useState({ email: '', username: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    console.log('Registering user:', formData);
    // TODO: Call backend API
  };

  return (
    <div className="flex flex-col min-h-screen bg-[url('/src/assets/landing-bg2.jpg')] bg-cover bg-no-repeat bg-top">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-800 bg-opacity-90 p-6 rounded shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Create Profile</h2>

          <input
            className="w-full p-3 mb-4 bg-gray-700 rounded text-white placeholder-gray-400"
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            className="w-full p-3 mb-6 bg-gray-700 rounded text-white placeholder-gray-400"
            name="username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
          />

          <button
            className="w-full bg-green-600 py-3 rounded hover:bg-green-700 font-bold"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
