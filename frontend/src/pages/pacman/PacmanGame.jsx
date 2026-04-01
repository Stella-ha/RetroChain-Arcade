// PacmanGame.jsx
import React, { useState, useCallback } from "react";
import GameCanvas from "../../components/GameCanvas";
import { initPacmanGame } from "./pacmanEngine";

export default function PacmanGame() {
  const [score, setScore] = useState(0);

  // Memoize initGame so it's stable across renders
  const initGame = useCallback(
    async (ctx, canvas) => {
      return await initPacmanGame(ctx, canvas, setScore);
    },
    []
  );

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <h1 className="text-yellow-400 text-3xl font-bold mb-4">Pac-Man</h1>
      <GameCanvas initGame={initGame} />
      <div className="mt-2 text-white text-2xl font-bold bg-gray-900  rounded">
        Score: {score}
      </div>
    </div>
  );
}
