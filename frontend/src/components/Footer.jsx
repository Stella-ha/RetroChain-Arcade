import React from 'react';


export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 text-sm text-gray-400 py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <p>© 2025 RetroChain Arcade. All rights reserved.</p>
        <div className="space-x-4">
          <a
            href="https://github.com/YOUR_GITHUB/retrochain-arcade"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
