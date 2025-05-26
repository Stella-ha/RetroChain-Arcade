import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../context/authContext';

export default function Header() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`hover:text-blue-400 transition ${
        location.pathname === to ? 'text-blue-400 font-bold' : 'text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-green-400">
          🎮 RetroChain Arcade
        </Link>
        <nav className="flex space-x-6 text-sm">
          {navLink('/', 'Home')}
          {navLink('/register', 'Register')}
          {navLink('/login', 'Login')}
          {isLoggedIn && navLink('/dashboard', 'Dashboard')}
        </nav>
      </div>
    </header>
  );
}
