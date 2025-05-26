import React from 'react';

export default function PixelButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-yellow-400 text-black border-2 border-yellow-700 px-4 py-2 font-bold hover:bg-yellow-300 transition"
      style={{ fontFamily: "'Press Start 2P', cursive" }}
    >
      {label}
    </button>
  );
}
