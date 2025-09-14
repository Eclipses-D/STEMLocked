import { useState } from "react";

// The pool of emojis to choose from
const emojis = ["🍎", "🍌", "🍇", "🍓", "🍉", "🍪", "🍩", "🍕", "🐶", "🐱", "🐸", "🐢", "🐘", "🦒"];

// This function will shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Generates a completely new, random puzzle
function generateRandomPuzzle() {
  // Select 3 random emojis for A, B, and C
  const shuffledEmojis = [...emojis];
  shuffleArray(shuffledEmojis);
  const selectedEmojis = {
    A: shuffledEmojis[0],
    B: shuffledEmojis[1],
    C: shuffledEmojis[2],
  };

  // Generate random numerical values for A, B, and C
  const values = {
    A: Math.floor(Math.random() * 5) + 2, // A value from 2-6
    B: Math.floor(Math.random() * 5) + 2, // B value from 2-6
    C: Math.floor(Math.random() * 5) + 2, // C value from 2-6
  };

  // Build the equations dynamically
  const equations = [
    `${selectedEmojis.A} + ${selectedEmojis.A} = ${values.A + values.A}`,
    `${selectedEmojis.A} + ${selectedEmojis.B} = ${values.A + values.B}`,
    `${selectedEmojis.B} + ${selectedEmojis.C} = ${values.B + values.C}`,
  ];

  // Shuffle the order of the equations
  shuffleArray(equations);

  const finalQuestion = `${selectedEmojis.C} + ${selectedEmojis.C} = ?`;
  const correctAnswer = values.C + values.C;

  return {
    equations,
    finalQuestion,
    correctAnswer,
  };
}

function EmojiPuzzle({ onComplete }) {
  const [currentPuzzle] = useState(generateRandomPuzzle());
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const checkAnswer = () => {
    if (parseInt(answer) === currentPuzzle.correctAnswer) {
      setFeedback("Correct!");
      if (onComplete) onComplete();
    } else {
      setFeedback("Wrong! Try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Emoji Algebra Puzzle</h2>
      {currentPuzzle.equations.map((eq, index) => (
        <p key={index}>{eq}</p>
      ))}

      <p>{currentPuzzle.finalQuestion}</p>

      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Your answer"
        style={{ padding: "6px", fontSize: "16px", marginRight: "8px" }}
      />
      
      <button onClick={checkAnswer}>Submit</button>

      {feedback && <p>{feedback}</p>}
    </div>
  );
}

export default EmojiPuzzle;