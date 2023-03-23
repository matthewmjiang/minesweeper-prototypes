import './App.css';

function App() {
  const grid = [...Array(10)].map(() => new Array(10).fill(0));
  const numMines = 40;

  const randomizeGrid = (grid, numMines) => {
    let mines = numMines;
    let cells = grid.length * grid[0].length;

    while (mines > 0) {
      let cell = Math.floor(Math.random() * cells)
      let row = Math.floor(cell / 10);
      let col = cell % 10;
      if (grid[row][col] !== 1) {
        grid[row][col] = 1;
        mines -= 1;
      }
    }
  }

  randomizeGrid(grid, numMines)
  // console.log(grid)

  return (
    <div className="App">
      <table>
        <tbody>
          {grid.map((row, i) => {
            return (
              <tr key={i}>
                {row.map((cell, j) => {
                  return (
                    <td key={i * 10 + j}>{cell}</td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>

  );
}

export default App;
