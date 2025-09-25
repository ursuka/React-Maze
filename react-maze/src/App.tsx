import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [maze, setMaze] = useState<string[][]>([]);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleGenerateMaze = (height: number, width: number) => {
    const matrix: string[][] = [];
    const dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push("wall");
      }
      matrix.push(row);
    }

    const isValidCell = (x: number, y: number) => {
      return (
        y >= 0 && x >= 0 && x < width && y < height && matrix[x][y] === "wall"
      );
    };

    const carvePath = (x: number, y: number) => {
      matrix[x][y] = "path";

      const directions = dirs.sort(() => Math.random() - 0.5);
      for (const [directionX, directionY] of directions) {
        const nextX = x + directionX * 2;
        const nextY = y + directionY * 2;
        if (isValidCell(nextX, nextY)) {
          matrix[y + directionY][x + directionX] = "path";
          carvePath(nextX, nextY);
        }
      }
    };

    carvePath(1, 1);
    matrix[1][0] = "start";
    matrix[height - 2][width - 1] = "end";

    setMaze(matrix);
  };

  useEffect(() => {
    if (btnRef) {
      btnRef.current?.click();
    }
  }, []);

  return (
    <div className="maze-grid">
      <button
        className="maze-btn"
        ref={btnRef}
        onClick={() => handleGenerateMaze(10, 10)}
      >
        Refresh Maze
      </button>
      <div className="maze">
        {maze.map((row, rowIndex) => {
          return (
            <div className="row" key={rowIndex}>
              {row.map((cell, cellIndex) => {
                return <div className={`cell ${cell}`} key={cellIndex}></div>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
