// App.tsx
import React, { useState, useEffect } from 'react';
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
  const [lockedDice, setLockedDice] = useState<boolean[]>([false, false, false, false, false, false]);
  const [isTurnEnded, setIsTurnEnded] = useState<boolean>(false);
  const [currentRoundScore, setCurrentRoundScore] = useState<number>(0);

  const WINNING_SCORE = 5000;

  useEffect(() => {
    // Roll dice automatically at the start of each round
    rollDice();
  }, [currentPlayer]);

  const rollDice = (): void => {
    // Ensure at least one die is selected before allowing a reroll
    if (selectedDice.includes(true)) {
      const newDice = dice.map((die, index) => {
        return selectedDice[index] ? die : Math.floor(Math.random() * 6) + 1;
      });

      setDice(newDice);

      // Calculate score from the new roll
      const rollScore = calculateSelectedScore(newDice, selectedDice);

      if (rollScore === 0) {
        // If no scoring dice, lose round points and end turn
        alert("No scoring dice! You lose your round points.");
        endTurn(true); // true to indicate losing points
      } else {
        setCurrentRoundScore(currentRoundScore + rollScore);
        setIsTurnEnded(false);

        // Lock the dice that were selected during this roll
        const newLockedDice = lockedDice.map((locked, index) => locked || selectedDice[index]);
        setLockedDice(newLockedDice);
      }
    } else if (currentRoundScore === 0) {
      // First roll of the round, no selection needed
      const newDice = dice.map(() => Math.floor(Math.random() * 6) + 1);
      setDice(newDice);

      // Calculate score for the initial roll
      const rollScore = calculateSelectedScore(newDice, Array(6).fill(true));

      if (rollScore === 0) {
        alert("No scoring dice! You lose your round points.");
        endTurn(true); // End turn if no score on first roll
      } else {
        setCurrentRoundScore(rollScore);
        setIsTurnEnded(false);
      }
    } else {
      alert("You must select at least one die before rolling again.");
    }
  };

  const selectDice = (index: number): void => {
    // Allow selecting only if the dice isn't locked
    if (!lockedDice[index]) {
      const newSelectedDice = [...selectedDice];
      newSelectedDice[index] = !newSelectedDice[index];
      setSelectedDice(newSelectedDice);
    }
  };

  const endTurn = (losePoints: boolean = false): void => {
    const updatedPlayers = [...players];

    if (!losePoints) {
      updatedPlayers[currentPlayer].totalScore += currentRoundScore;
    }

    setPlayers(updatedPlayers);

    if (updatedPlayers[currentPlayer].totalScore >= WINNING_SCORE) {
      alert(`${updatedPlayers[currentPlayer].name} wins!`);
      resetGame();
      return;
    }

    setIsTurnEnded(true);
    setCurrentPlayer((currentPlayer + 1) % players.length);
    setCurrentRoundScore(0);
    resetDice();
  };

  const resetGame = () => {
    const resetPlayers = players.map(player => ({ ...player, totalScore: 0 }));
    setPlayers(resetPlayers);
    setCurrentPlayer(0);
    resetDice();
  };

  const resetDice = () => {
    setDice([1, 1, 1, 1, 1, 1]);
    setSelectedDice([false, false, false, false, false, false]);
    setLockedDice([false, false, false, false, false, false]);
  };

  const calculateScore = (): number => {
    return calculateSelectedScore(dice, Array(6).fill(true));
  };

  const calculateSelectedScore = (diceSet: number[], selectedSet: boolean[]): number => {
    const counts = Array(7).fill(0);
    diceSet.forEach((die, index) => {
      if (selectedSet[index]) counts[die]++;
    });

    let score = 0;

    for (let i = 1; i <= 6; i++) {
      if (counts[i] >= 3) {
        let baseScore = 0;

        switch (i) {
          case 1: baseScore = 1000; break;
          case 2: baseScore = 200; break;
          case 3: baseScore = 300; break;
          case 4: baseScore = 400; break;
          case 5: baseScore = 500; break;
          case 6: baseScore = 600; break;
        }

        if (counts[i] === 4) {
          score += baseScore * 2;
        } else if (counts[i] === 5) {
          score += baseScore * 4;
        } else if (counts[i] === 6) {
          score += baseScore * 8;
        } else {
          score += baseScore;
        }

        counts[i] -= 3;
      }
    }

    score += counts[1] * 100; // Each remaining 1 is worth 100 points
    score += counts[5] * 50;  // Each remaining 5 is worth 50 points

    return score;
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
        lockedDice={lockedDice} 
        isTurnEnded={isTurnEnded} 
      />
      <h3>Current Round Points: {currentRoundScore}</h3>
      <GameControls rollDice={rollDice} endTurn={() => endTurn(false)} />
    </div>
  );
};

export default App;
