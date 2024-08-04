// script.js
let board = Array(9)
  .fill()
  .map(() => Array(9).fill(0));
let selectedCell = null;
let timer;
let seconds = 0;

document.addEventListener("DOMContentLoaded", () => {
  createBoard();
  startTimer();
});

function createBoard() {
  const boardElement = document.getElementById("sudoku-board");
  boardElement.innerHTML = "";
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const input = document.createElement("input");
      input.type = "numeric";
      input.min = 1;
      input.max = 9;
      input.value = board[row][col] || "";
      input.addEventListener("input", (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= 9) {
          board[row][col] = value;
        } else {
          e.target.value = "";
          board[row][col] = 0;
        }
      });
      input.addEventListener("click", () => {
        selectedCell = { row, col };
      });
      boardElement.appendChild(input);
    }
  }
}

function solveSudoku() {
  fetch("/solve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grid: board }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.solution) {
        board = data.solution;
        createBoard();
      } else {
        alert("No solution exists");
      }
    });
}

function clearBoard() {
  board = Array(9)
    .fill()
    .map(() => Array(9).fill(0));
  createBoard();
  resetTimer();
}

function getHint() {
  if (selectedCell) {
    fetch("/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grid: board,
        row: selectedCell.row,
        col: selectedCell.col,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.valid) {
          const { row, col, value } = data.hint;
          board[row][col] = value;
          createBoard();
        } else {
          alert("No hints available");
        }
      });
  } else {
    alert("Select a cell first");
  }
}

function validateSudoku() {
  fetch("/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grid: board }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.valid) {
        alert("The board is valid!");
      } else {
        alert("The board is not valid.");
      }
    });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    document.getElementById("time").textContent = `Time: ${seconds}s`;
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  seconds = 0;
  document.getElementById("time").textContent = `Time: 0s`;
  startTimer();
}
