// Dice.tsx
import React from 'react';
import './Dice.css';

interface DiceProps {
  dice: number[];
  selectDice: (index: number) => void;
  selectedDice: boolean[];
  isTurnEnded: boolean; // Keep the prop to check if the turn has ended
}

const Dice: React.FC<DiceProps> = ({ dice, selectDice, selectedDice, isTurnEnded }) => {
  return (
    <div className="dice-container">
      {dice.map((die, index) => {
        let dieClass = "dice";
        if (selectedDice[index]) {
          dieClass += " selected";
        }

        return (
          <div 
            key={index} 
            className={dieClass} 
            onClick={() => !isTurnEnded && selectDice(index)} // Prevent selection if turn is ended
          >
            {die}
          </div>
        );
      })}
    </div>
  );
};

export default Dice;