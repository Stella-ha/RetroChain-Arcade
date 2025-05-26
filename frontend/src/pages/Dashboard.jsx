// import PlayerCard from '../components/PlayerCard';
import React from 'react';

export default function Dashboard() {
  const mockUser = {
    username: 'PacLegend',
    wallet: 'ALGO-XYZ-123...',
    tokens: 350,
    score: 1240,
    nfts: ['Pinball Skin', 'Pacman Red', 'Dave Cape'],
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">🏆 Player Dashboard</h2>
      {/* <PlayerCard user={mockUser} /> */}
    </div>
  );
}
