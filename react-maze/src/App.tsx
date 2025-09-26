import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [maze, setMaze] = useState<string[][]>([]);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const initialMaze = [
    ["wall", "wall", "wall", "wall", "wall"],
    ["start", "path", "path", "wall", "wall"],
    ["wall", "wall", "path", "wall", "wall"],
    ["wall", "wall", "path", "path", "end"],
    ["wall", "wall", "wall", "wall", "wall"],
  ];
  const [width, setWidth] = useState<number>(initialMaze[0].length);
  const [height, setHeight] = useState<number>(initialMaze.length);
  const [timeout, setTimeoutID] = useState<number[]>([]);

  const handleGenerateMaze = (settedHeight: number, settedWidth: number) => {
    const matrix: string[][] = [];

    for (let i = 0; i < settedHeight; i++) {
      const row = [];
      for (let j = 0; j < settedWidth; j++) {
        row.push("wall");
      }
      matrix.push(row);
    }

    const isValidCell = (x: number, y: number) => {
      return (
        y >= 0 &&
        x >= 0 &&
        x < settedWidth &&
        y < settedHeight &&
        matrix[x][y] === "wall"
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
    matrix[settedHeight - 2][settedWidth - 1] = "end";

    setWidth(matrix[0].length);
    setHeight(matrix.length);
    setMaze(matrix);
  };

  useEffect(() => {
    if (btnRef) {
      btnRef.current?.click();
    }
  }, []);

  const bfs = (startNode: [number, number]) => {
    const queue = [startNode];
    const visited = new Set(`${startNode[0]}, ${startNode[1]}`);

    const visitCell = ([x, y]: number[]) => {
      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) => {
          return row.map((cell, cellIndex) => {
            if (rowIndex === x && cellIndex === y) {
              return cell === "end" ? "end" : "visited";
            }
            return cell;
          });
        })
      );
      if (maze[x][y] === "end") {
        console.log("path Found!");
        return true;
      }
      return false;
    };

    const step = () => {
      if (queue.length === 0) return;
      const shifted = queue.shift();
      if (!shifted) return;
      const [x, y] = shifted;
      for (const [directionX, directionY] of dirs) {
        const newX = directionX + x;
        const newY = directionY + y;
        if (
          newX >= 0 &&
          newX < width &&
          newY >= 0 &&
          newY < height &&
          !visited.has(`${newX}, ${newY}`)
        ) {
          visited.add(`${newX}, ${newY}`);
          if (maze[newX][newY] === "path" || maze[newX][newY] === "end") {
            if (visitCell([newX, newY])) {
              return true;
            }
            queue.push([newX, newY]);
          }
        }
      }

      const timeoutID = setTimeout(step, 200);
      setTimeoutID((prevItem) => [...prevItem, timeoutID]);
    };

    step();
    return false;
  };

  const dfs = (startNode: [number, number]) => {
    const stack = [startNode];
    const visited = new Set(`${startNode[0]}, ${startNode[1]}`);

    const visitCell = ([x, y]: [number, number]) => {
      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) => {
          return row.map((cell, cellIndex) => {
            if (rowIndex === x && cellIndex === y) {
              return cell === "end" ? "end" : "visited";
            }
            return cell;
          });
        })
      );
      if (maze[x][y] === "end") {
        return true;
      }
      return false;
    };

    const step = () => {
      if (stack.length === 0) return;
      const popped = stack.pop();
      if (!popped) return;
      const [x, y] = popped;

      for (const [directionX, directionY] of dirs) {
        const newX = directionX + x;
        const newY = directionY + y;
        if (
          newX >= 0 &&
          newX < width &&
          newY >= 0 &&
          newY < height &&
          !visited.has(`${newX}, ${newY}`)
        ) {
          visited.add(`${newX}, ${newY}`);
          if (maze[newX][newY] === "path" || maze[newX][newY] === "end") {
            if (visitCell([newX, newY])) {
              return true;
            }
            stack.push([newX, newY]);
          }
        }
      }
      const timeoutID = setTimeout(step, 200);
      setTimeoutID((prevItem) => [...prevItem, timeoutID]);
    };

    step();
    return false;
  };

  const refreshMaze = (height: number, width: number) => {
    timeout.forEach(clearTimeout);
    setTimeoutID([]);
    handleGenerateMaze(height, width);
  };

  return (
    <div className="maze-grid">
      <div className="maze-btn-group">
        <button
          className="maze-btn"
          ref={btnRef}
          onClick={() => refreshMaze(11, 11)}
        >
          Refresh Maze
        </button>
        <button
          className="maze-btn"
          onClick={() => {
            bfs([1, 0]);
          }}
        >
          Breadth-first Search
        </button>
        <button
          className="maze-btn"
          onClick={() => {
            dfs([1, 0]);
          }}
        >
          Depth-first Search
        </button>
      </div>
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
