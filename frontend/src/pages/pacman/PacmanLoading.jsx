// src/pages/PacmanLoading.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PacmanLoading.css";

export default function PacmanLoading() {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to game page after animation finishes
    const timer = setTimeout(() => {
      navigate("/pacman");
    }, 14000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-black overflow-hidden">
      <div className="loading-sequence">
        <div className="pacman"></div>
        <div className="ghost">
          <div className="eye"></div>
          <div className="eye"></div>
        </div>
      </div>
    </div>
  );
}
