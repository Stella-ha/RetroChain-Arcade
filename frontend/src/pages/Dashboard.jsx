import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const games = [
    {
      id: 1,
      title: "PacMan",
      description: "Eat dots, dodge ghosts!",
      image: "src/assets/gameCard/pacman.png",
    },
    {
      id: 2,
      title: "RoadRash",
      description: "Bike, bash, and win races!",
      image: "src/assets/gameCard/roadrash.webp",
    },
    {
      id: 3,
      title: "PinBall",
      description: "Classic pinball arcade fun!",
      image: "src/assets/gameCard/pinball-logo.jpg",
    },
    {
      id: 4,
      title: "Dave",
      description: "Collect treasures, avoid traps!",
      image: "src/assets/gameCard/dave.png",
    },
  ];

  const handlePlay = (gameId) => {
    // Later: navigate to loading screen for the selected game
    navigate(`/games/${gameId}`);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center">
        🏆 Player Dashboard
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-gray-900 p-6 rounded-lg text-center border-2 border-green-500 hover:border-yellow-400 transition duration-200"
          >
            <img
              src={game.image}
              alt={game.title}
              className="w-32 h-32 mx-auto mb-4 object-contain"
            />
            <h3 className="text-xl font-bold mb-2">{game.title}</h3>
            <p className="text-sm text-gray-300 mb-4">{game.description}</p>
            <button
              onClick={() => handlePlay(game.title)}
              className="mt-auto px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded"
            >
              Play Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
