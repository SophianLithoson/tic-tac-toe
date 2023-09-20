const gameSquares = document.querySelectorAll(".game-square");

const gameBoard = (() => {
    const _playerOneName = document.getElementById("player-one-name");
    const _playerOneScore = document.getElementById("player-one-score");
    const _playerTwoName = document.getElementById("player-two-name");
    const _playerTwoScore = document.getElementById("player-two-score");

    // values of the array represent who occupies the space
    // 0 = empty, 1 = player one, 2 = player two

    const currentBoard = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    const resetBoard = () => {
        [...currentBoard].forEach((row) => {
            currentBoard[row] = [0, 0, 0,];
        });
    };

    const updateBoard = (p1Piece, p2Piece) => {
        let i = 0;
        let currentPiece = 0;

        [...gameSquares].forEach((square) => {
            currentPiece = currentBoard[Math.floor(i / 3)][i % 3];
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

    const placePiece = (player, positionRow, positionColumn) => {
        currentBoard[positionRow][positionColumn] = player;
    };

    return {updateBoard, updateScore, placePiece, resetBoard, currentBoard};
})();

const Player = (name, gamePiece) => {
    let score = 0;

    return {score, name, gamePiece};
};

const t3Game = (() => {
    const _nemina = Player("", "");
    const _devina = Player("", "");
    let _currentPlayerTurn = 0;
    let _gameIsActive = false;

    // set click listeners

    [...gameSquares].forEach((square) => {
        square.addEventListener("click", () => {
            if (!_gameIsActive) {
                console.log("game not running");
                return;
            }
            
            let row = undefined;
            let column = undefined;

            if (square.classList.contains("row-three")) {
                row = 0;
            }                
            else if (square.classList.contains("row-two")) {
                row = 1;
            }
            else if (square.classList.contains("row-one")) {
                row = 2;
            }

            if (square.classList.contains("column-a")) {
                column = 0;
            }                
            else if (square.classList.contains("column-b")) {
                column = 1;
            }                
            else if (square.classList.contains("column-c")) {
                column = 2;
            }                

            tryMove(row, column);
        });
    });

    const initializeGame = () => {
        _nemina.name = "Nemina";
        _nemina.gamePiece = "X";
        _devina.name = "Devina";
        _devina.gamePiece = "O";
        _gameIsActive = true;
        _currentPlayerTurn = 1;
        gameBoard.updateScore(_nemina.name, _nemina.score, _devina.name, _devina.score);
    };
    

    
    const tryMove = (positionRow, positionColumn) => {
        console.log(`received positionRow: ${positionRow} and positionColumn: ${positionColumn}`);
        console.log(gameBoard.currentBoard[positionRow][positionColumn]);

        // is spot full? yes: console log error no: place gamePiece and update board
        if (gameBoard.currentBoard[positionRow][positionColumn] === 0) {
            gameBoard.placePiece(_currentPlayerTurn, positionRow, positionColumn);
            gameBoard.updateBoard(_nemina.gamePiece, _devina.gamePiece);
        }
        else {
            console.log("ERROR, square is already full");
            return;
        }

        // examine current board for a win or tie
        // if a win, increment score for winning player, display message, gameIsActive = false
        // if a tie, display tie message

        // else change currentPlayerTurn and change player name containers class
        _currentPlayerTurn = (_currentPlayerTurn === 1) ? 2 : 1;

    }
    return {initializeGame, tryMove};
})();

t3Game.initializeGame();