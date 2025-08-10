import { useState } from 'react';
import React from 'react';
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import SweetAlertHelper from '../components/Alert/SweetAlertHelper';
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Register() {
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const sweetAlertHelper = SweetAlertHelper();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    console.log('Registering user:', formData);
    if (!formData.email || !formData.username || !formData.password) {
      sweetAlertHelper.alertPopUp('Please fill in all fields.');
      return;
    }
    
    // TODO: Call backend API
    try{
      console.log("API BASE URL:", API_BASE_URL);
      const response = await axios.post(
        `${API_BASE_URL}/register`,
        formData
      );
      console.log('Registration response:', response);
      if (response.status === 200) {
        const confirmed = await sweetAlertHelper.alertPopUp(
          "Registration successful! Please log in."
        );
        if (confirmed) {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      sweetAlertHelper.alertPopUp('Registration failed. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[url('/src/assets/landing-bg2.jpg')] bg-cover bg-no-repeat bg-top">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-800 bg-opacity-90 p-6 rounded shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Create Profile
          </h2>

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

          <input
            className="w-full p-3 mb-6 bg-gray-700 rounded text-white placeholder-gray-400"
            name="password"
            type="password"
            placeholder="Password"
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
