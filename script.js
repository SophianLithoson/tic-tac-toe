let depth_limit = 10;
const gameSquares = document.querySelectorAll(".game-square");

const gameBoard = (() => {
    const _playerOneName = document.getElementById("player-one-name");
    const _playerOneScore = document.getElementById("player-one-score");
    const _playerTwoName = document.getElementById("player-two-name");
    const _playerTwoScore = document.getElementById("player-two-score");

    // values of the array represent who occupies the space
    // 0 = empty, X = player one, O = player two

    const currentBoard = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    const resetBoard = () => {
        currentBoard[0] = [0, 0, 0];
        currentBoard[1] = [0, 0, 0];
        currentBoard[2] = [0, 0, 0];
    };

    const updateBoard = (p1Piece, p2Piece) => {
        let _i = 0;
        let _currentPiece = 0;

        [...gameSquares].forEach((square) => {
            _currentPiece = currentBoard[Math.floor(_i / 3)][_i % 3];
            square.textContent = _currentPiece==="X" ? p1Piece : _currentPiece==="O" ? p2Piece : "";
            _i++;
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
        if (whoseTurn === "X") {
            _playerOneName.classList.add("my-turn-now");
            _playerTwoName.classList.remove("my-turn-now");
        }
        else if (whoseTurn === "O") {
            _playerTwoName.classList.add("my-turn-now");
            _playerOneName.classList.remove("my-turn-now");
        }
        else {
            _playerOneName.classList.remove("my-turn-now");
            _playerTwoName.classList.remove("my-turn-now");
        }
    };

    const getWinState = (board) => {
        if (board[0][0] !== 0) {
            if (board[0][0] === board[0][1] && board[0][1] === board[0][2]) {
                return board[0][0];
            }
            if (board[0][0] === board[1][0] && board[1][0] === board[2][0]) {
                return board[0][0];
            }
            if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
                return board[0][0];
            }   
        }
        if (board[0][1] !== 0) {
            if (board[0][1] === board[1][1] && board[1][1] === board[2][1]) {
                return board[0][1];
            }
        }
        if (board[0][2] !== 0) {
            if (board[0][2] === board[1][2] && board[1][2] === board[2][2]) {
                return board[0][2];
            }
            if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
                return board[0][2];
            }
        }
        if (board[1][0] !== 0) {
            if (board[1][0] === board[1][1] && board[1][1] === board[1][2]) {
                return board[1][0];
            }
        }
        if (board[2][0] !== 0) {
            if (board[2][0] === board[2][1] && board[2][1] === board[2][2]) {
                return board[2][0];
            }
        }

        if (!board.flat().includes(0)) {
            return 3;
        }

        return 0;
    };

    const bestNextMove = () => {    
        let moveToMake = _minimax(currentBoard, true, 0);
        return {row: (Math.floor(moveToMake / 3)), column: (moveToMake % 3)};
    };

    function _minimax([...passedBoard], isAITurn, depth) {
        if (depth !== 0) {
            switch (getWinState(passedBoard)) {
                case "X":
                    return depth - 100;
                case "O":
                    return 100 - depth;
                case 3:
                    return depth - 50;
            }
        }

        const _validMoves = [];
        const _squareScores = [];
        const _testBoard = passedBoard.flat();
        let boardToPass = [[0, 0, 0],[0, 0, 0],[0, 0, 0]];

        for (let i=0; i < _testBoard.length; i++) {
            if (_testBoard[i] === 0) {
                _validMoves.push(i);
            }
        }

        if (depth >= depth_limit) {
            return depth - 50;
        }

        [..._validMoves].forEach((moveIndex) => {
            boardToPass[0] = passedBoard[0].slice(0);
            boardToPass[1] = passedBoard[1].slice(0);
            boardToPass[2] = passedBoard[2].slice(0);
            boardToPass[Math.floor(moveIndex / 3)][moveIndex % 3] = (isAITurn) ? "O" : "X";
            _squareScores[moveIndex] = _minimax(boardToPass, !isAITurn, depth + 1);
        });

        if (isAITurn) {
            let _largestSoFar = -100;

            for (let k=0; k < _squareScores.length; k++) {
                if (_squareScores[k] === undefined) {
                    continue;
                }
                if (_largestSoFar < _squareScores[k]) {
                    _largestSoFar = _squareScores[k];
                }
            }

            if (depth === 0) {
                return _squareScores.indexOf(_largestSoFar);
            }
            
            return _largestSoFar;
        }

        if (!isAITurn) {
            let _smallestSoFar = 100;

            for (let a=0; a < _squareScores.length; a++) {
                if (_squareScores[a] === undefined) {
                    continue;
                }
                if (_smallestSoFar > _squareScores[a]) {
                    _smallestSoFar = _squareScores[a];
                }
            }

            if (depth === 0) {
                return _squareScores.indexOf(_smallestSoFar);
            }
            
            return _smallestSoFar;
        }
    }

    return {updateBoard, updateScore, placePiece, resetBoard, getWinState,
            indicateTurn, bestNextMove, currentBoard};
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
    const _dialogAILevel = document.getElementById("ai-level");
    const _dialogConfirmBtn = document.getElementById("confirm-btn");
    let _currentPlayerTurn = "X";
    let _gameIsActive = false;
    let _aiGame = false;

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
        if (_nemina.name === "" && _devina.name === "") {
            _dialogP1.value = "";
            _dialogP2.value = "";
            _newGameDialog.showModal();
        }

        else {
            initializeGame();
        }
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
        _currentPlayerTurn = "X";

        if (_dialogAILevel.options[_dialogAILevel.selectedIndex].value !== "none") {
            depth_limit = _dialogAILevel.options[_dialogAILevel.selectedIndex].value;
            _aiGame = true;
        }

        _gameIsActive = true;
        gameBoard.resetBoard();
        gameBoard.updateBoard(_nemina.gamePiece, _devina.gamePiece);
        gameBoard.indicateTurn(_currentPlayerTurn);
        gameBoard.updateScore(_nemina.name, _nemina.score, _devina.name, _devina.score);
    };
    

    
    const tryMove = (positionRow, positionColumn) => {
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
        switch (gameBoard.getWinState(gameBoard.currentBoard)) {
            case 0:
                break;
            case "X":
                console.log("player 1 is the winner");
                _nemina.score++;
                _gameIsActive = false;
                gameBoard.indicateTurn(0);
                gameBoard.updateScore(_nemina.name, _nemina.score, _devina.name, _devina.score);
                return;
            case "O":
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

        _currentPlayerTurn = (_currentPlayerTurn === "X") ? "O" : "X";
        gameBoard.indicateTurn(_currentPlayerTurn);

        if (_currentPlayerTurn === "O" && _aiGame) {
            let nextMove = gameBoard.bestNextMove();
            tryMove(nextMove.row, nextMove.column);
        }
    }
    return {initializeGame, tryMove};
})();