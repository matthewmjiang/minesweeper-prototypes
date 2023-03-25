import './App.css';
import { useState, useEffect } from 'react';

function App() {
  class Cell {
    constructor(revealed = false, flagged = false, value = 0) {
      this.revealed = revealed;
      this.flagged = flagged;
      this.value = value;
    }
  }
  // const grid = [...Array(10)].map(() => new Array(10).fill(0));
  const BOARD_SIZE = 16;
  const NUM_MINES = 40;
  const [grid, setGrid] = useState([]);

  function initializeGrid() {
    let grid = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      let col = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        col.push(new Cell());
      }
      grid.push(col);
    }
    let mines = NUM_MINES;
    let cells = grid.length * grid[0].length;

    let mineCells = [];

    while (mines > 0) {
      let cell = Math.floor(Math.random() * cells)
      let row = Math.floor(cell / BOARD_SIZE);
      let col = cell % BOARD_SIZE;
      if (grid[row][col]["value"] !== 9) {
        grid[row][col]["value"] = 9;
        mines -= 1;
        mineCells.push([row, col]);
      }
    }

    for (let [x, y] of mineCells) {
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) continue;
          if (!outOfBounds(x + i, y + j) && grid[x + i][y + j]["value"] !== 9) {
            grid[x + i][y + j]["value"] += 1;
          }
        }
      }
    }
    return grid;
  }

  useEffect(() => {
    if (grid.length === 0) {
      setGrid(initializeGrid())
    }
  }, [])

  const outOfBounds = (x, y) => {
    if (x < 0 || x > BOARD_SIZE - 1 || y < 0 || y > BOARD_SIZE - 1) {
      return true;
    }
    return false;
  }

  const isMine = (x, y) => {
    if (grid[x][y]["value"] === 9) {
      return true;
    }
    return false;
  }

  const isZero = (x, y) => {
    if (grid[x][y]["value"] === 0) {
      return true;
    }
    return false;
  }

  const isRevealed = (x, y) => {
    if (grid[x][y]["revealed"] === true) {
      return true;
    }
    return false;
  }

  const shouldReveal = (x, y) => {
    if (!outOfBounds(x, y) && !isMine(x, y) && !isRevealed(x, y)) {
      return true;
    }
    return false;
  }

  const getCellNeighbors = (x, y) => {
    let neighbors = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) continue;
        if (shouldReveal(x + i, y + j)) {
          neighbors.push([x + i, y + j])
        }
      }
    }
    /*
        if (shouldReveal(x + 1, y)) {
          neighbors.push([x + 1, y]);
        }
        if (shouldReveal(x, y - 1)) {
          neighbors.push([x, y - 1]);
        }
        if (shouldReveal(x - 1, y)) {
          neighbors.push([x - 1, y]);
        }
        if (shouldReveal(x, y + 1)) {
          neighbors.push([x, y + 1]);
        } */
    return neighbors;
  }

  const onCellClick = (i, j) => {
    if (grid[i][j]["value"] === 9) {
      alert("YOU LOSE")
      // lose
      // show all other bombs

    } else {  // reveal zero-value neighbors
      const newGrid = [...grid];
      let queue = [[i, j]];

      while (queue.length > 0) {
        let [x, y] = queue.shift();
        newGrid[x][y]["revealed"] = true;
        if (isZero(x, y)) {
          let neighbors = getCellNeighbors(x, y);
          queue = queue.concat(neighbors);
        }
      }

      setGrid(newGrid);
    }

  }
  const onCellRightClick = (i, j) => {
    const newGrid = [...grid];
    newGrid[i][j]["flagged"] = newGrid[i][j]["flagged"] ? false : true;
    setGrid(newGrid);
  }

  return (
    <div className="App">
      <div id="grid-container">
        <table>
          <tbody>
            {grid.map((row, i) => {
              return (
                <tr key={i}>
                  {row.map((cell, j) => {
                    return (
                      <td
                        key={(i, j)}
                        className={
                          `${cell["flagged"] ? "flagged " : ""}${cell["revealed"] ? "revealed" : "hidden"}`
                        }
                        onClick={() => onCellClick(i, j)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          onCellRightClick(i, j);
                        }}>
                        {cell["value"]}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>

  );
}

export default App;
