import React from 'react';

interface GameControlsProps {
  rollDice: () => void;
  endTurn: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ rollDice, endTurn }) => {
  return (
    <div className="game-controls">
      <button onClick={rollDice}>Roll Dice</button>
      <button onClick={endTurn}>End Turn</button>
    </div>
  );
};

export default GameControls;
