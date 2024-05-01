
const gameboard = (function Gameboard() {

    const row = 3;
    const col = 3;
    const board = [];
    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < col; j++) {
            board[i][j] = Cell();
        }
    }
    const printBoard = () => {
        const boardprinted = board.map(row => row.map(cell => cell.getVal()).join(" ")).join("\n");
        console.log(boardprinted);
    };

    const getBoard = () => board;
    const dropToken = function (row, col, player) {
        if (board[row][col].getVal() === "") {
            // console.log("h");
            board[row][col].setToken(player.token);
            return true;
        }
    };

    return {
        dropToken,
        getBoard,
        printBoard
    };

})();
function Cell() {

    let val = "";
    const getVal = () => val;
    const setToken = function (token) {
        val = token;
    }
    function clearVal() {
        val = "";
    }
    return {
        getVal,
        clearVal,
        setToken
    };
}
function GameController(
    //playerone = "KingShuk",
    playerone = "p1",
    playertwo = "p2",
) {

    const game_board = gameboard;
    const players = [
        { name: playerone, token: "X" },
        { name: playertwo, token: "O" }
    ];
    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;
    const switchPlayer = function () {
        activePlayer = (activePlayer == players[0]) ? players[1] : players[0]
    }

    const gamestatus = () => gameWon;
    const playRound = function (row, col) {
        let player = getActivePlayer();
        let k = game_board.dropToken(row, col, player);
        check_wins();
        check_Tie();
        if (gameWon) {
            console.log("WON");
            // switchPlayer();
            newGame();
            return;
        } else if (isTie) {
            console.log("TIE");
            // switchPlayer();
            newGame();
            return;
        } else if (k) {
            switchPlayer();
        }

    }

    let gameWon = false;
    let isTie = false;
    let winCount = [];

    const playerOneScore = () => {
        const ans = winCount.filter((item) => item === players[0].token).length;

        return ans;
    };

    const playerTwoScore = () => {
        const ans = winCount.filter((item) => item === players[1].token).length;
        return ans;
    };

    const check_wins = function () {
        const [
            [cell0, cell1, cell2],
            [cell3, cell4, cell5],
            [cell6, cell7, cell8]

        ] = game_board.getBoard();
        const win_combinations =
            [
                //rows
                [cell0, cell1, cell2],
                [cell3, cell4, cell5],
                [cell6, cell7, cell8],
                //diagnonals
                [cell0, cell4, cell8],
                [cell6, cell4, cell2],
                //cols
                [cell0, cell3, cell6],
                [cell1, cell4, cell7],
                [cell2, cell5, cell8],
            ]
        for (let i = 0; i < win_combinations.length; i++) {
            let row = win_combinations[i];
            let cell1 = row[0]; let cell2 = row[1]; let cell3 = row[2];
            if (cell1.getVal() != "" && cell2.getVal() != "" && cell3.getVal() != "") {
                if (cell1.getVal() === cell2.getVal() && cell2.getVal() === cell3.getVal() &&
                    cell3.getVal() === cell1.getVal()) {
                    gameWon = true;

                    winCount.push(getActivePlayer().token);

                    break;
                }
            }
        }
    }
    const check_Tie = function () {
        let availablecells = 0;
        game_board.getBoard().forEach(row => {
            row.forEach(col => {
                if (col.getVal() === '') {
                    availablecells++;
                }
            });
        });
        if (!gameWon && availablecells == 0) {


            isTie = true;
            return;

        }

    }
    const resetGame = function () {
        winCount = [];

        newGame();
    }
    const newGame = function () {
        switchPlayer();
        isTie = false;
        gameWon = false;
        let arr = game_board.getBoard();
        arr.forEach(row => {
            row.forEach(col => {
                col.clearVal();
            });
        });
    }
    function playersreturn(i){
        return players[i].name;
    }
    function seyplayer(i,pname){
        players[i].name = pname;
    }
    return {
        getBoard: game_board.getBoard,
        printBoard: game_board.printBoard,
        getActivePlayer,
        switchPlayer,
        playRound,
        newGame,
        playerOneScore,
        playerTwoScore,
        check_Tie,
        check_wins,
        resetGame,
        gamestatus,
        seyplayer

    }
};
const ScreenController = (function ScreenController() {
    const modal = document.querySelector('.Modal')
    const button = document.querySelector('#submit')

    


    const reset = document.querySelector('.btn-light');
    const newGame = document.querySelector('.btn-dark');

    const game = GameController();
    const playerturnDiv = document.querySelector('.turn');// update here
    const boardDiv = document.querySelector(".board");
    button.addEventListener('click',function(e){
        e.preventDefault();
        // game.playerone=document.querySelector("#playerOne").value;
        game.seyplayer(0, document.querySelector("#playerOne").value);
        game.seyplayer(1, document.querySelector("#playerTwo").value);

        // console.log(GameController.playerone);

        modal.style.display = "none";
        updateScreen();
    })
    function updateScreen(e) {

        boardDiv.textContent = "";
        // get current board 
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const playerOneScore = game.playerOneScore();
        const playerTwoScore = game.playerTwoScore();
        const score1 = document.querySelector('#score1');
        const score2 = document.querySelector('#score2');
        score1.value = playerOneScore;
        console.log(game.players);
        score2.value = playerTwoScore;

        //add cell css  to that 

        playerturnDiv.textContent = `${activePlayer.name}'s turn...`;

        board.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                const cell = document.createElement("button");
                cell.classList.add("cell");
                cell.dataset.row = rowIndex;
                cell.dataset.column = columnIndex;
                cell.textContent = column.getVal();
                boardDiv.appendChild(cell);
            });
        });

    }
    newGame.addEventListener('click', function () {
        alert("newgame")
        game.newGame();
        updateScreen();
    });
    reset.addEventListener('click', function () {
        alert("reset")
        game.resetGame();
        updateScreen();
    })

    function clickBoard(e) {
        const rowVal = e.target.dataset.row;
        const colVal = e.target.dataset.column;
        if (!rowVal) return;
        if (!colVal) return;
        const gameWon = game.gamestatus();
        if (gameWon) return;
        game.playRound(rowVal, colVal, game.getActivePlayer());


        updateScreen();
    }
    updateScreen();
    boardDiv.addEventListener("click", clickBoard);



})();
// ScreenController();



