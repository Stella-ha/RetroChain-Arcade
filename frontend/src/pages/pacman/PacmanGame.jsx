// PacmanGame.jsx
import React from "react";
import GameCanvas from "../../components/GameCanvas";
import { initPacman } from "./pacmanEngine";

export default function PacmanGame() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {/* <h2 className="text-3xl font-bold mb-4">Pac-Man</h2> */}
      <GameCanvas initGame={initPacman} />
    </div>
  );
}
