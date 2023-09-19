let gameBoard = [
    ['✕', '', ''],
    ['', 'O', 'O'],
    ['', '', '✕']
];

const gameSquares = document.querySelectorAll(".game-square");

function displayBoard() {
    let i = 0;

    [...gameSquares].forEach((square) => {
        square.textContent = gameBoard[Math.floor(i / 3)][i % 3];
        i++;
    });
}

displayBoard();
