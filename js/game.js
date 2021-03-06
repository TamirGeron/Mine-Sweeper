"use strict";

const BOMB = '💣';
const FLAG = '🚩';
const EMPTY = ' ';
const LIFE = '❤';

var gBombs;
var gBoard;
var gBoardClean;
var isFirst;
var gLifeCount;
var gSmile = document.querySelector('.smile')
var gStatus = document.querySelector('.statusGame')
var gTotalSeconds;
var gIntervalTime;
var gSecondsLabel = document.querySelector('.timer');
var gFlagsCount;
var gFlagsLabel = document.querySelector('.flags');
var gCountSelected;
var gSize = 4;
var gBombNum = 2;
var isGameOn;
var gSelectedPoses;
var gHints;
var gIsHintClick;
var gSafeClickCount;
var gIsManual = false;
var gBombCount

function initGame() {
    restGame();
    gBoard = buildBoard();
    renderBoard(gBoardClean, ".board");
    gHints = createHints();
    renderHints();
    gBombNum = gBombs.length
}

function restGame() {
    gIsHintClick = false
    gSelectedPoses = [];
    isGameOn = true;
    gCountSelected = 0
    clearInterval(gIntervalTime)
    gFlagsCount = gBombNum;
    gFlagsLabel.innerText = gFlagsCount + ' flags';
    gTotalSeconds = 0;
    gSecondsLabel.innerText = `${gTotalSeconds} Seconds`;
    isFirst = true;
    gLifeCount = 3;
    gSmile.innerText = '😀'
    heartStatus();
    showScore()
    gSafeClickCount = 3
    var elSafe = document.querySelector('.availableSafe')
    elSafe.innerText = `${gSafeClickCount} clicks available`;
}

function setLevel(size, bombNum) {
    gSize = size;
    gBombNum = bombNum;
    initGame();
}

function heartStatus() {
    gStatus.innerText = '';
    for (var i = 0; i < gLifeCount; i++) {
        gStatus.innerText += LIFE
    }
}

function win() {
    endGame('Victory')
    gSmile.innerText = '😎'
    scoreBoard();
}

function scoreBoard() {
    var level;
    if (gSize === 4) level = 'beginner'
    else if (gSize === 8) level = 'medium'
    else level = 'expert'
    var bestScore = +localStorage.getItem(`${level}`);
    if (!bestScore) bestScore = gTotalSeconds;
    bestScore = (gTotalSeconds < bestScore) ? gTotalSeconds : bestScore
    localStorage.setItem(`${level}`, bestScore)
    showScore()
}

function showScore() {
    var score=localStorage.getItem('beginner')
    if(score) document.getElementById('beginner').innerHTML = 'Beginner: ' + score + ' seconds';
    var score=localStorage.getItem('medium')
    if(score) document.getElementById('medium').innerHTML = 'Medium: ' + score + ' seconds';
    var score=localStorage.getItem('expert')
    if(score) document.getElementById('expert').innerHTML = 'Expert: ' + score + ' seconds';
}

function endGame(msg) {
    gStatus.innerText = msg;
    clearInterval(gIntervalTime)
    isGameOn = false;
}

function lose() {
    for (var i = 0; i < gBombs.length; i++) {
        renderCell(gBombs[i], BOMB)
    }
    gSmile.innerText = '🤯'
    endGame('You Lose');
}

function renderBoard(board, selector) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            // @CR - dataName? - cell is better name 
            var cell = gBoard[i][j];
            if (cell === BOMB) cell = -1
            var className = `cell cell-${i}-${j}`
            strHTML += `<td data-num="${cell}"   oncontextmenu="putFlag(this,event)" onclick="cellClicked(this,${cell})"  class="${className}"></td>`;
        }
        strHTML += '</tr>';
    }
    var elTable = document.querySelector(selector);
    elTable.innerHTML = strHTML;
}

function buildBoard(pos) {
    var board = [];
    gBoardClean = [];
    if (!gIsManual) {
        gBombs = []
        getBombs(gBombNum, gSize);
    }
    gIsManual = false;
    for (var i = 0; i < gSize; i++) {
        board.push([]);
        gBoardClean.push([]);
        for (var j = 0; j < gSize; j++) {
            var pos = { i: i, j: j };
            board[i][j] = isPosInArr(pos, gBombs) ? BOMB : EMPTY
            gBoardClean[i][j] = EMPTY
        }
    }
    var board = setMinesCount(board, gSize)
    return board;
}

function setMinesCount(board, size) {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (board[i][j] !== BOMB) {
                var bombCount = countNeighborsValue(i, j, board, BOMB);
                board[i][j] = bombCount
            }
        }
    }
    return board;
}


function getBombs(BombNum, size) {
    for (var i = 0; i < BombNum; i++) {
        var posI = getRandomIntInclusive(0, size - 1)
        var posJ = getRandomIntInclusive(0, size - 1)
        gBombs.push({ i: posI, j: posJ })
    }
}