const gameSquares = document.querySelectorAll(".game-square");

const gameBoard = (() => {
    const _playerOneName = document.getElementById("player-one-name");
    const _playerOneScore = document.getElementById("player-one-score");
    const _playerTwoName = document.getElementById("player-two-name");
    const _playerTwoScore = document.getElementById("player-two-score");

    // values of the array represent who occupies the space
    // 0 = empty, 1 = player one, 2 = player two

    let currentBoard = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    const resetBoard = () => {
        currentBoard = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
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

    const indicateTurn = (whoseTurn) => {
        if (whoseTurn === 1) {
            _playerOneName.classList.add("my-turn-now");
            _playerTwoName.classList.remove("my-turn-now");
        }
        else if (whoseTurn === 2) {
            _playerTwoName.classList.add("my-turn-now");
            _playerOneName.classList.remove("my-turn-now");
        }
        else {
            _playerOneName.classList.remove("my-turn-now");
            _playerTwoName.classList.remove("my-turn-now");
        }
    };

    const getWinState = () => {
        if (currentBoard[0][0] !== 0) {
            if (currentBoard[0][0] === currentBoard[0][1] && currentBoard[0][1] === currentBoard[0][2]) {
                return currentBoard[0][0];
            }
            if (currentBoard[0][0] === currentBoard[1][0] && currentBoard[1][0] === currentBoard[2][0]) {
                return currentBoard[0][0];
            }
            if (currentBoard[0][0] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][2]) {
                return currentBoard[0][0];
            }   
        }
        if (currentBoard[0][1] !== 0) {
            if (currentBoard[0][1] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][1]) {
                return currentBoard[0][1];
            }
        }
        if (currentBoard[0][2] !== 0) {
            if (currentBoard[0][2] === currentBoard[1][2] && currentBoard[1][2] === currentBoard[2][2]) {
                return currentBoard[0][2];
            }
            if (currentBoard[0][2] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][0]) {
                return currentBoard[0][2];
            }
        }
        if (currentBoard[1][0] !== 0) {
            if (currentBoard[1][0] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[1][2]) {
                return currentBoard[1][0];
            }
        }
        if (currentBoard[2][0] !== 0) {
            if (currentBoard[2][0] === currentBoard[2][1] && currentBoard[2][1] === currentBoard[2][2]) {
                return currentBoard[2][0];
            }
        }

        if (!currentBoard.flat().includes(0)) {
            return 3;
        }

        return 0;
    };

    return {updateBoard, updateScore, placePiece, resetBoard, getWinState,
            indicateTurn, currentBoard};
})();

const Player = (name, gamePiece) => {
    let score = 0;

    return {score, name, gamePiece};
};

const t3Game = (() => {
    const _newGameButton = document.getElementById("new-game-button");
    const _nemina = Player("", "");
    const _devina = Player("", "");
    const _newGameDialog = document.getElementById("new-game-dialog");
    const _dialogP1 = document.getElementById("p1");
    const _dialogP2 = document.getElementById("p2");
    const _dialogConfirmBtn = document.getElementById("confirm-btn");
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

            // rows and columns are named by Chess convention on page
            // this finds the class labels and converts them to array indices
            // board is stored in array with row 0 on top and col 2 on right

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

    _newGameButton.addEventListener("click", () => {
        _dialogP1.value = "";
        _dialogP2.value = "";
        _newGameDialog.showModal();
    });

    _dialogConfirmBtn.addEventListener("click", (event) => {
        event.preventDefault();
        initializeGame();
        _newGameDialog.close();
    });

    // set methods here

    const initializeGame = () => { 
        _nemina.name = _dialogP1.value;
        _nemina.gamePiece = "X";
        _devina.name = _dialogP2.value;
        _devina.gamePiece = "O";
        _gameIsActive = true;
        _currentPlayerTurn = 1;
        gameBoard.resetBoard();
        gameBoard.updateBoard(_nemina.gamePiece, _devina.gamePiece);
        gameBoard.indicateTurn(_currentPlayerTurn);
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
        switch (gameBoard.getWinState()) {
            case 0:
                console.log("game is not finished, keep going");
                break;
            case 1:
                console.log("player 1 is the winner");
                _nemina.score++;
                _gameIsActive = false;
                gameBoard.indicateTurn(0);
                gameBoard.updateScore(_nemina.name, _nemina.score, _devina.name, _devina.score);
                return;
            case 2:
                console.log("player 2 is the winner");
                _devina.score++;
                _gameIsActive = false;
                gameBoard.indicateTurn(0);
                gameBoard.updateScore(_nemina.name, _nemina.score, _devina.name, _devina.score);
                return;
            case 3:
                console.log("wow it was a tie!");
                _gameIsActive = false;
                gameBoard.indicateTurn(0);
                return;
        }
        // else change currentPlayerTurn and change player name containers class

        _currentPlayerTurn = (_currentPlayerTurn === 1) ? 2 : 1;
        gameBoard.indicateTurn(_currentPlayerTurn);
    }
    return {initializeGame, tryMove};
})();