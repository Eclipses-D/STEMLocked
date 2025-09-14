import React, { useState, useEffect } from "react";

const Timer = ({ initialTime, onTimeUp, isRunning }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    // We only start the timer if isRunning is true and there's time left
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0) {
        onTimeUp(); // Call the function to handle time up in the parent
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the interval when the component unmounts or isRunning changes
    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, onTimeUp]);

  // Reset the timer when it's supposed to start again
  useEffect(() => {
    if (isRunning) {
      setTimeLeft(initialTime);
    }
  }, [isRunning, initialTime]);

  return (
    <div className="timer-display">
      <p>Time Left: {timeLeft}</p>
    </div>
  );
};

export default Timer;