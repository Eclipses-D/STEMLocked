import { useState, useEffect } from "react";
import CrossMathPuzzle from "./crosspuzzle";
import Timer from "./Timer";
import GameTimer from "./GameTimer";
import EmojiPuzzle from "./emojiPuzzle";
import ClassicPrint from "./classicPrint"; // New puzzle
import BatteryTable from "./batteryTable"; // New puzzle
import DisolvePuzzle from "./dissolvepuzzle"; // New puzzle
import "./App.css";

// FrameAnimation component, now in the same file
const FrameAnimation = ({ 
  animations, 
  currentAnimation, 
  animationSpeed = 200,
  isPlaying = true,
  loop = true,
  width = 'auto',
  height = 'auto'
}) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const frames = animations[currentAnimation] || [];

  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentFrameIndex(prevIndex => (prevIndex + 1) % frames.length);
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, frames, animationSpeed, loop]);

  useEffect(() => {
    setCurrentFrameIndex(0);
  }, [currentAnimation]);

  if (frames.length === 0) {
    return <div>🧑‍💻</div>;
  }

  const frameStyle = {
    width: width,
    height: height,
    maxWidth: '100%',
    maxHeight: '100%',
    imageRendering: 'pixelated',
    imageRendering: '-moz-crisp-edges',
    imageRendering: 'crisp-edges',
    objectFit: 'contain'
  };

  return (
    <img 
      src={frames[currentFrameIndex]} 
      alt="animated sprite" 
      style={frameStyle}
      onError={(e) => {
        console.error('Failed to load sprite:', frames[currentFrameIndex]);
      }}
    />
  );
};

function App() {
  const gridSize = 5;
  const tileSize = 60;
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [puzzleVisible, setPuzzleVisible] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFailMessage, setShowFailMessage] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playerDirection, setPlayerDirection] = useState('idle'); // New state for direction
  
  const puzzleOrder = ["crossMath", "emoji", "classicPrint", "batteryTable", "disolvePuzzle"];
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);

  const puzzleTile = { x: 2, y: 2 };

  const playerAnimations = {
    idle: ["/sprites/standing.png"], 
    walkUp: [
      "/sprites/walkup_001.png",
      "/sprites/walkup_002.png"
    ],
    walkDown: [
      "/sprites/walkdown_001.png", 
      "/sprites/walkdown_002.png"
    ],
    walkLeft: [
      "/sprites/walkleft_001.png",
      "/sprites/walkleft_002.png", 
      "/sprites/walkleft_003.png",
      "/sprites/walkleft_004.png"
    ],
    walkRight: [
      "/sprites/walkright_001.png",
      "/sprites/walkright_002.png",
      "/sprites/walkright_003.png", 
      "/sprites/walkright_004.png"
    ]
  };

  // Handle movement and direction change
  const handleKeyDown = (e) => {
    if (puzzleVisible || isLoading || showFailMessage || gameWon || isPaused) return;

    setPlayerPos((prev) => {
      let { x, y } = prev;
      let newDirection = playerDirection; // Default to current direction

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (y > 0) { y--; newDirection = 'walkUp'; }
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (y < gridSize - 1) { y++; newDirection = 'walkDown'; }
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (x > 0) { x--; newDirection = 'walkLeft'; }
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (x < gridSize - 1) { x++; newDirection = 'walkRight'; }
          break;
        default:
          return prev; // Do nothing for other keys
      }
      setPlayerDirection(newDirection);
      return { x, y };
    });
  };

  // Stop animation when key is released
  const handleKeyUp = () => {
    if (!puzzleVisible && !isLoading && !showFailMessage && !gameWon && !isPaused) {
      setPlayerDirection('idle');
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [puzzleVisible, isLoading, showFailMessage, gameWon, isPaused]);

  useEffect(() => {
    if (
      playerPos.x === puzzleTile.x &&
      playerPos.y === puzzleTile.y &&
      !puzzleSolved &&
      !gameWon
    ) {
      setPuzzleVisible(true);
    }
  }, [playerPos, puzzleSolved, gameWon]);

  const handlePuzzleComplete = () => {
    setPuzzleSolved(true);
    setPuzzleVisible(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setPlayerPos({ x: 0, y: 0 });
      setPuzzleSolved(false);

      const nextIndex = currentPuzzleIndex + 1;
      if (nextIndex < puzzleOrder.length) {
        setCurrentPuzzleIndex(nextIndex);
      } else {
        setGameWon(true);
      }
    }, 2000);
  };
  
  const handleTimeUp = () => {
    setPuzzleVisible(false);
    setShowFailMessage(true);

    setTimeout(() => {
      setShowFailMessage(false);
      setPlayerPos({ x: 0, y: 0 });
      setPuzzleSolved(false);
    }, 2000);
  };

  const getActivePuzzleName = () => puzzleOrder[currentPuzzleIndex];
  
  const getActivePuzzleComponent = () => {
    switch (getActivePuzzleName()) {
      case "crossMath":
        return <CrossMathPuzzle onComplete={handlePuzzleComplete} />;
      case "emoji":
        return <EmojiPuzzle onComplete={handlePuzzleComplete} />;
      case "classicPrint":
        return <ClassicPrint onComplete={handlePuzzleComplete} />;
      case "batteryTable":
        return <BatteryTable onComplete={handlePuzzleComplete} />;
      case "disolvePuzzle":
        return <DisolvePuzzle onComplete={handlePuzzleComplete} />;
      default:
        return null;
    }
  };

  const getPuzzleTime = () => {
    switch (getActivePuzzleName()) {
      case "crossMath":
        return 15;
      case "emoji":
        return 60;
      case "classicPrint":
        return 30;
      case "batteryTable":
        return 45;
      case "disolvePuzzle":
        return 20;
      default:
        return 60;
    }
  };

  return (
    <div className="App">
      <div className="text-container">
        <h1>STEMLocked</h1>
        <p>Use arrow keys or WASD to move.</p>
        <div className="game-controls">
          <button onClick={() => setIsPaused(true)} disabled={isPaused}>Pause</button>
          <button onClick={() => setIsPaused(false)} disabled={!isPaused}>Resume</button>
        </div>
      </div>
      
      {showFailMessage && (
        <div className="fail-message">
          <p>Too Late! Try again!</p>
        </div>
      )}

      {gameWon && (
        <div className="game-won-screen">
          <p>You Win!</p>
        </div>
      )}

      {!gameWon && !showFailMessage && (
        <>
          <div className="game-and-timer-container">
            <div
              className="grid"
              style={{ width: gridSize * tileSize, height: gridSize * tileSize }}
            >
              <div
                className="player"
                style={{
                  transform: `translate(${playerPos.x * tileSize}px, ${
                    playerPos.y * tileSize
                  }px)`,
                }}
              >
                <FrameAnimation
                  animations={playerAnimations}
                  currentAnimation={playerDirection}
                  width={`${tileSize}px`}
                  height={`${tileSize}px`}
                />
              </div>
            </div>
            <GameTimer isRunning={!gameWon && !isPaused} />
          </div>

          {isLoading && (
            <div className="loading-screen">
              <p>Loading...</p>
            </div>
          )}

          {puzzleVisible && (
            <div className="modal">
              <div className="modal-content">
                <h2>{getActivePuzzleName()}</h2>
                <Timer 
                  initialTime={getPuzzleTime()} 
                  onTimeUp={handleTimeUp} 
                  isRunning={puzzleVisible && !isPaused} 
                />
                {getActivePuzzleComponent()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;