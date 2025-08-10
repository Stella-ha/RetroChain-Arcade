import React, { useState } from 'react';
import Footer from '../components/Footer';
import { useAuth } from '../context/authContext';
import SweetAlertHelper from "../components/Alert/SweetAlertHelper";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const sweetAlertHelper = SweetAlertHelper();
  const navigate = useNavigate();

  const handleWalletLogin = () => {
    console.log('Wallet login triggered');
    // TODO: Wallet connect logic
    login();
  };

const handleEmailLogin = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, formData);
    if (res.status === 200) {
      login(); // update frontend auth state
      navigate("/dashboard");
    }
  } catch (err) {
    console.error(err);
  }
};

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="flex flex-col min-h-screen bg-[url('/src/assets/landing-bg2.jpg')] bg-cover bg-top bg-no-repeat">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-gray-800 bg-opacity-90 p-6 rounded shadow-lg">
          <h2 className="text-2xl font-semibold mb-8 text-center">Welcome Back!</h2>
          {/* <p className="text-gray-300 mb-6 text-center">
            Choose a login method to continue.
          </p> */}

          <button
            className="w-full bg-blue-600 py-3 rounded hover:bg-blue-700 font-bold"
            onClick={handleWalletLogin}
          >
            Connect Wallet
          </button>

          <div className="border-t border-gray-600 my-6" />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEmailLogin();
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="Email/Username"
              onChange={handleChange}
              className="w-full mb-4 p-3 bg-gray-700 text-white placeholder-gray-400 rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full mb-6 p-3 bg-gray-700 text-white placeholder-gray-400 rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 py-3 rounded hover:bg-green-700 font-bold"
            >
              Login with Email
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
