import React from 'react';

interface PlayerProps {
  player: {
    name: string;
    totalScore: number;
    currentScore: number;
  };
  isActive: boolean;
}

const Player: React.FC<PlayerProps> = ({ player, isActive }) => {
  return (
    <div className={`player ${isActive ? 'active' : ''}`}>
      <h2>{player.name}</h2>
      <p>Total Score: {player.totalScore}</p>
      <p>Current Round Score: {player.currentScore}</p>
    </div>
  );
};

export default Player;
