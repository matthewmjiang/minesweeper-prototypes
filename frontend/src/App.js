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
  const BOARD_SIZE = 16;
  const NUM_MINES = 40;
  const [grid, setGrid] = useState([]);
  const [gridInitialized, setGridInitialized] = useState(false);
  const [numSafeCells, setNumSafeCells] = useState(-1);
  const [mineCells, setMineCells] = useState([]);

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

    let newMineCells = [];

    while (mines > 0) {
      let cell = Math.floor(Math.random() * cells)
      let row = Math.floor(cell / BOARD_SIZE);
      let col = cell % BOARD_SIZE;
      if (grid[row][col]["value"] !== 9) {
        grid[row][col]["value"] = 9;
        mines -= 1;
        newMineCells.push([row, col]);
      }
    }

    for (let [x, y] of newMineCells) {
      for (let i = -1; i < 2; i++) {  // get 8 surrounding cells
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) continue;
          if (!outOfBounds(x + i, y + j) && grid[x + i][y + j]["value"] !== 9) {
            grid[x + i][y + j]["value"] += 1;
          }
        }
      }
    }
    setMineCells(newMineCells);
    return grid;
  }

  useEffect(() => {
    if (grid.length === 0) {
      setGrid(initializeGrid());
      setGridInitialized(true);
      setNumSafeCells(BOARD_SIZE ** 2 - NUM_MINES);
    }
  }, [])

  useEffect(() => {
    console.log(numSafeCells)
    if(numSafeCells === 0) {
      alert('YOU WIN')
      let newGrid = [...grid];
      for (let [x, y] of mineCells) {
        newGrid[x][y]["flagged"] = true;
      }
      setGrid(newGrid);
    }
  }, [numSafeCells])

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
    if (!isMine(x, y) && !isRevealed(x, y)) {
      return true;
    }
    return false;
  }

  const getCellNeighbors = (queued, x, y) => {
    let neighbors = [];
    for (let i = -1; i < 2; i++) {  // check the 8 surrounding cells
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) continue;
        else if (outOfBounds(x + i, y + j)) continue;
        else if (!(`${x + i}_${y + j}` in queued) && shouldReveal(x + i, y + j)) {
          queued[`${x+i}_${y+j}`] = true;
          neighbors.push([x + i, y + j])
        }
      }
    }
    return neighbors;
  }

  const onCellClick = async (i, j) => {

    const newGrid = [...grid];

    if (grid[i][j]["value"] === 9) {

      alert("YOU LOSE");
      for (let [x, y] of mineCells) {   // show all other bombs
        newGrid[x][y]["revealed"] = true;
      }

    } else {  // reveal zero-value neighbors

      let queue = [[i, j]];
      let queuedCells = {};
      queuedCells[`${i}_${j}`] = true;
      let numCellsRevealed = 0;
      while (queue.length > 0) {
        let [x, y] = queue.shift();
        newGrid[x][y]["revealed"] = true;
        console.log(x, y)
        numCellsRevealed++;
        if (isZero(x, y)) {
          let neighbors = getCellNeighbors(queuedCells, x, y);
          queue = queue.concat(neighbors);
        }

      }
      setNumSafeCells(numSafeCells - numCellsRevealed)
    }
    setGrid(newGrid);

  }
  const onCellRightClick = (i, j) => {
    const newGrid = [...grid];
    if (!newGrid[i][j]["flagged"] && !newGrid[i][j]["revealed"]) {
      newGrid[i][j]["flagged"] = true;
    } else {
      newGrid[i][j]["flagged"] = false;
    }
    setGrid(newGrid);
  }

  return (
    <div className="App">
      <div id="grid-container">
        {gridInitialized &&
          grid.map((row, i) => {
            return (
              row.map((cell, j) => {
                return (
                  <div
                    key={(i, j)}
                    className={
                      `${cell["flagged"] ? "flagged" : ""} ${cell["revealed"] ? "revealed" : "hidden"} color-${cell["revealed"] ? cell["value"] : ""}`
                    }
                    onClick={() => onCellClick(i, j)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      onCellRightClick(i, j);
                    }}>
                    {cell["revealed"] ? cell["value"] : ""}
                  </div>
                )
              })
            )
          })
        }
      </div>
    </div>

  );
}

export default App;
