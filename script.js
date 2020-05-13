
let initialBoard;
let person = 'O';
let computer = 'X';
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [6, 4, 2],
    [2, 5, 8],
    [1, 4, 7],
    [0, 3, 6]
];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector('.endgame').style.display = "none";
    document.querySelector('.endgame .text').innerText = "";
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
    }
    var randomValue = Math.random() < 0.5 ? 'Person' : 'Computer';
    selectFirstPlayer(randomValue);
}

function selectFirstPlayer(randomValue) {
    if(randomValue === 'Person') {
        person = 'O';
        computer = 'X';
    } else {
        person = 'X';
        computer = 'O';
    }

    document.querySelector("#turn").innerText = randomValue;
    
    initialBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', turnClick, false);
    }
    if (computer === 'O') {
        turn(bestSpot(), computer);
    }
}

function turnClick(square) {
    if (typeof initialBoard[square.target.id] === 'number') {
        turn(square.target.id, person);
        if (!checkWin(initialBoard, person) && !checkTie())
            turn(bestSpot(), computer);
    }
}

function turn(squareId, player) {
    let lastPlayer = document.querySelector("#turn").innerText;
    let nextPlayer = lastPlayer === 'Person' ? 'Computer' : 'Person';
    document.querySelector("#turn").innerText = nextPlayer;

    initialBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    let gameWon = checkWin(initialBoard, player);
    if (gameWon) gameOver(gameWon);
    checkTie();
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, arr] of winningCombinations.entries()) {
        if (arr.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winningCombinations[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player === person ? "green" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === person ? "You win!" : "You lose");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}
function availableCell() {
    return initialBoard.filter((elm, i) => i === elm);
}

function bestSpot() {
    return minimax(initialBoard, computer).index;
}

function checkTie() {
    if (availableCell().length === 0) {
        for (cell of cells) {
            cell.style.backgroundColor = "green";
            cell.removeEventListener('click', turnClick, false);
        }
        declareWinner("Draw");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = availableCell(newBoard);

    if (checkWin(newBoard, person)) {
        return { score: -10 };
    } else if (checkWin(newBoard, computer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === computer)
            move.score = minimax(newBoard, person).score;
        else
            move.score = minimax(newBoard, computer).score;
        newBoard[availSpots[i]] = move.index;
        if ((player === computer && move.score === 10) || (player === person && move.score === -10))
            return move;
        else
            moves.push(move);
    }

    let bestMove, bestScore;
    if (player === computer) {
        bestScore = -1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        bestScore = 1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}