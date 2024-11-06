// Dice.tsx
import React from 'react';
import './Dice.css';

interface DiceProps {
  dice: number[];
  selectDice: (index: number) => void;
  selectedDice: boolean[];
  lockedDice: boolean[]; // Added lockedDice to the props
  isTurnEnded: boolean;
}

const Dice: React.FC<DiceProps> = ({ dice, selectDice, selectedDice, lockedDice, isTurnEnded }) => {
  return (
    <div className="dice-container">
      {dice.map((die, index) => {
        let dieClass = "dice";
        if (selectedDice[index]) dieClass += " selected";
        if (lockedDice[index]) dieClass += " locked"; // Apply locked style if the die is locked

        return (
          <div 
            key={index} 
            className={dieClass} 
            onClick={() => !isTurnEnded && !lockedDice[index] && selectDice(index)} // Prevent selection if locked or turn is ended
          >
            {die}
          </div>
        );
      })}
    </div>
  );
};

export default Dice;
