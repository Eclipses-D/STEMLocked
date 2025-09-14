import { useState, useEffect } from "react";

const GameTimer = ({ isRunning }) => {
  const [timePassed, setTimePassed] = useState(0);

  useEffect(() => {
    // Stop the timer if the game is no longer running
    if (!isRunning) {
      return;
    }

    // Set up the count-up interval
    const intervalId = setInterval(() => {
      setTimePassed((prevTime) => prevTime + 1);
    }, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, [isRunning]);

  return (
    <div className="game-timer-display">
      <p>Total Time: {timePassed}s</p>
    </div>
  );
};

export default GameTimer;