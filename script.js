const gameBoard = (() => {
    const _gameSquares = document.querySelectorAll(".game-square");
    const _playerOneName = document.getElementById("player-one-name");
    const _playerOneScore = document.getElementById("player-one-score");
    const _playerTwoName = document.getElementById("player-two-name");
    const _playerTwoScore = document.getElementById("player-two-score");

    const _currentBoard = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    const updateBoard = (p1Piece, p2Piece) => {
        let i = 0;
        let currentPiece = 0;

        [..._gameSquares].forEach((square) => {
            currentPiece = _currentBoard[Math.floor(i / 3)][i % 3];
            square.textContent = currentPiece===1 ? p1Piece : currentPiece===2 ? p2Piece : "";
            i++;
        });
    };

    const updateScore = (p1Name, p1Score, p2Name, p2Score) => {
        _playerOneName.textContent = p1Name;
        _playerOneScore.textContent = p1Score;
        _playerTwoName.textContent = p2Name;
        _playerTwoScore.textContent = p2Score;
    };

    const move = (player, positionRow, positionColumn) => {
        _currentBoard[positionRow][positionColumn] = player;
    }

    return {updateBoard, updateScore, move};
})();

const Player = (name, gamePiece) => {
    let score = 0;

    return {score, name, gamePiece};
};

const t3Game = (() => {
    const run = () => {
        const nemina = Player("Nemina", "X");
        const devina = Player("Devina", "O");

        gameBoard.move(1, 1, 1);
        gameBoard.move(2, 2, 2);
        gameBoard.updateScore(nemina.name, nemina.score, devina.name, devina.score);
        gameBoard.updateBoard(nemina.gamePiece, devina.gamePiece);
    }
    
    return {run};
})();

t3Game.run();