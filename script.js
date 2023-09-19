const gameSquares = document.querySelectorAll(".game-square");

const gameBoard = (() => {
    const _currentBoard = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    const displayBoard = (p1Piece, p2Piece) => {
        let i = 0;
        let currentPiece = 0;

        [...gameSquares].forEach((square) => {
            currentPiece = _currentBoard[Math.floor(i / 3)][i % 3];
            square.textContent = currentPiece===1 ? p1Piece : currentPiece===2 ? p2Piece : "";
            i++;
        });
    }
    return {displayBoard};
})();

const Player = (name, gamePiece) => {
    let score = 0;

    return {score, name, gamePiece};
};

const nemina = Player("Nemina", "X");
const devina = Player("Devina", "O");

gameBoard.displayBoard(nemina.gamePiece, devina.gamePiece);
