import { useState } from "react";

function CrossMathPuzzle({ onComplete }) {
  // Solvable 3x3 Cross Math puzzle
  const initialGrid = [
    [null, "+", 3, "=", 5],
    [2, "-", null, "=", 1],
    [2, "+", null, "=", 4],
  ];

  const [grid, setGrid] = useState(initialGrid);

  // Handle input (store as string for editable input)
  const handleChange = (row, col, value) => {
    const newGrid = grid.map((r) => [...r]);
    if (/^\d*$/.test(value)) { // allow empty string or digits
      newGrid[row][col] = value; // store as string
      setGrid(newGrid);
    }
  };

  const checkSolution = () => {
    for (let i = 0; i < grid.length; i++) {
      let expr = "";
      let target = null;
  
      for (let j = 0; j < grid[i].length; j++) {
        const cell = grid[i][j];
        if (cell === "=") {
          target = Number(grid[i][j + 1]);
          break;
        }
        if (cell === null || cell === "") {
          alert(`Row ${i + 1} incomplete!`);
          return;
        }
        expr += cell.toString(); // make sure everything is a string
      }
  
      if (eval(expr) !== target) {
        alert(`Row ${i + 1} is incorrect!`);
        return;
      }
    }
  
    alert("✅ Correct! Puzzle solved!");
    onComplete();
  };
  

  return (
    <div className="puzzle-box">
      <table>
        <tbody>
          {grid.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>
                  {cell === "+" || cell === "-" || cell === "=" || typeof cell === "number" ? (
                    <span>{cell}</span>
                  ) : (
                    <input
                      type="text"
                      value={cell || ""}
                      onChange={(e) => handleChange(i, j, e.target.value)}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={checkSolution} style={{ marginTop: "10px" }}>
        Unlock
      </button>
    </div>
  );
}

export default CrossMathPuzzle;
