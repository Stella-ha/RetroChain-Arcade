import { Link } from 'react-router-dom';
import React from 'react';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div
        className="min-h-screen bg-[url('/src/assets/landing-bg2.jpg')] bg-cover bg-no-repeat bg-top flex flex-col"
    >
        <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold mb-6">🎮 Welcome to RetroChain Arcade</h1>
        <p className="text-lg mb-8 text-gray-300">
            Play classic games. Earn real rewards. Own your digital legacy on Algorand.
        </p>
        <div className="space-x-4">
            <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
            Get Started
            </Link>
            <Link
            to="/login"
            className="border border-white text-white px-6 py-2 rounded hover:bg-white hover:text-black transition"
            >
            Already have an account?
            </Link>
        </div>
        </main>
        <Footer/>
    </div>
  );
}
