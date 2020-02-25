
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
    document.querySelector('.gameOver').style.display = "none";
    document.querySelector('.gameOver').innerText = "";
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
    document.querySelector(".gameOver").style.display = "block";
    document.querySelector(".gameOver").innerText = who;
}
function availableCell() {
    return initialBoard.filter((elm, i) => i === elm);
}

function bestSpot() {
    return availableCell()[0];
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