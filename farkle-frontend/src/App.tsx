// App.tsx
import React, { useState } from 'react';
import Player from './components/Player';
import Dice from './components/Dice';
import GameControls from './components/GameControls';
import './styles.css';

interface PlayerType {
  name: string;
  totalScore: number;
  currentScore: number;
}

const App: React.FC = () => {
  const [players, setPlayers] = useState<PlayerType[]>([
    { name: "Player 1", totalScore: 0, currentScore: 0 },
    { name: "Player 2", totalScore: 0, currentScore: 0 },
  ]);

  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [dice, setDice] = useState<number[]>([1, 1, 1, 1, 1, 1]);
  const [selectedDice, setSelectedDice] = useState<boolean[]>([false, false, false, false, false, false]);
  const [isTurnEnded, setIsTurnEnded] = useState<boolean>(false);

  const WINNING_SCORE = 5000;

  const rollDice = (): void => {
    const newDice = dice.map((die, index) => {
      // Roll dice only if not selected
      return selectedDice[index] ? die : Math.floor(Math.random() * 6) + 1;
    });

    setDice(newDice);
    setIsTurnEnded(false); // Allow further actions until the end of the turn
  };

  const selectDice = (index: number): void => {
    const newSelectedDice = [...selectedDice];
    newSelectedDice[index] = !newSelectedDice[index]; // Toggle selection state
    setSelectedDice(newSelectedDice);
  };

  const endTurn = (): void => {
    const selectedScore = calculateSelectedScore(); // Get score from selected dice
    const updatedPlayers = [...players];
    
    // Update the player's total score with selected score
    updatedPlayers[currentPlayer].totalScore += selectedScore; 
    setPlayers(updatedPlayers);

    // Check for a winner
    if (updatedPlayers[currentPlayer].totalScore >= WINNING_SCORE) {
      alert(`${updatedPlayers[currentPlayer].name} wins!`);
      resetGame(); // Call resetGame if a player wins
      return;
    }

    // Reset for the next player
    setIsTurnEnded(true); // Mark the turn as ended
    setCurrentPlayer((currentPlayer + 1) % players.length);
    resetDice(); // Reset dice at the end of the turn
  };

  const resetGame = () => {
    const resetPlayers = players.map(player => ({ ...player, totalScore: 0 })); // Reset scores
    setPlayers(resetPlayers);
    setCurrentPlayer(0);
    resetDice(); // Reset dice at the start of the game
  };

  const resetDice = () => {
    setDice([1, 1, 1, 1, 1, 1]);
    setSelectedDice([false, false, false, false, false, false]); // Unselect all dice
  };

  const calculateScore = (): number => {
    const counts = Array(7).fill(0);
    dice.forEach(die => counts[die]++); // Count occurrences of each die face (1-6)

    let score = 0;

    // Scoring logic for three of a kind
    for (let i = 1; i <= 6; i++) {
      if (counts[i] >= 3) {
        switch (i) {
          case 1: score += 1000; break; // Three 1's
          case 2: score += 200; break;   // Three 2's
          case 3: score += 300; break;   // Three 3's
          case 4: score += 400; break;   // Three 4's
          case 5: score += 500; break;   // Three 5's
          case 6: score += 600; break;   // Three 6's
        }

        // Add additional points for more than three of a kind
        const additionalCount = counts[i] - 3;
        score += additionalCount * (i === 1 ? 100 : (i === 5 ? 50 : 0)); // Extra for 1's and 5's
      }
    }

    // Add scores for unselected dice
    for (let i = 1; i <= 6; i++) {
      if (counts[i] > 0 && !selectedDice[i - 1]) {
        score += getDieScore(i);
      }
    }

    return score;
  };

  const calculateSelectedScore = (): number => {
    let score = 0;
    selectedDice.forEach((isSelected, index) => {
      if (isSelected) {
        score += getDieScore(dice[index]); // Calculate score based on selected dice
      }
    });
    return score;
  };

  const getDieScore = (die: number): number => {
    switch (die) {
      case 1: return 100; // For a single 1
      case 5: return 50;  // For a single 5
      default: return 0;   // For other dice
    }
  };

  return (
    <div className="App">
      <h1>Farkle Dice Game</h1>
      <Player player={players[0]} isActive={currentPlayer === 0} />
      <Player player={players[1]} isActive={currentPlayer === 1} />
      <Dice 
        dice={dice} 
        selectDice={selectDice} 
        selectedDice={selectedDice} 
        isTurnEnded={isTurnEnded} 
      />
      <h3>Selected Dice Points: {calculateSelectedScore()}</h3> {/* Display selected dice points */}
      <GameControls rollDice={rollDice} endTurn={endTurn} />
    </div>
  );
};

export default App;
