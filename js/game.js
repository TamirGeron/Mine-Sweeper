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

function initGame() {
    restGame();
    gBoard = buildBoard();
    renderBoard(gBoardClean, ".board");
    gHints = buildHints();
    renderHints();
}

function restGame() {
    gIsHintClick = false
    gSelectedPoses = [];
    isGameOn = true;
    gCountSelected = 0
    clearInterval(gIntervalTime)
    gFlagsCount = gBombNum;
    gFlagsLabel.innerText = gFlagsCount;
    gTotalSeconds = 0;
    gSecondsLabel.innerText = gTotalSeconds;
    gBombs = [];
    isFirst = true;
    gLifeCount = 3;
    gSmile.innerText = '😀'
    heartStatus();
}

function hintClicked(elHint, data) {
    if (data !== 1) return;
    gIsHintClick = true;
    elHint.innerText = '❌'
    elHint.dataset.num = -1
}

function hintCellClicked(elCell) {
    var classArr = elCell.className.split("-")
    var pos = { i: +classArr[1], j: +classArr[2] }
    var cellsToShow = getNeighborsPosition(pos, gBoard)
    cellsToShow.push(pos)
    for (var i = 0; i < cellsToShow.length; i++) {
        var curPosNe = cellsToShow[i];
        var elCurNe = document.querySelector(`.cell-${curPosNe.i}-${curPosNe.j}`);
        var value = +elCurNe.dataset.num
        if (value === -1) {
            value = BOMB
        }else{
            elCurNe.classList.add('selected')
            if (value === 0) value = EMPTY;
        }
        renderCell(curPosNe, value)
    }
    setTimeout(clearCellsHint, 1000, cellsToShow)
}

function clearCellsHint(cellsToHide) {
    for (var i = 0; i < cellsToHide.length; i++) {
        var curPosNe = cellsToHide[i];
        renderCell(curPosNe, EMPTY);
        var elCurNe = document.querySelector(`.cell-${curPosNe.i}-${curPosNe.j}`);

        elCurNe.classList.remove('selected')
        elCurNe.classList.remove('bomb')
    }
    gIsHintClick = false
}

function renderHints() {
    var strHTML = '';
    for (var i = 0; i < gHints.length; i++) {
        var dataValue = gHints[i];
        strHTML += '<tr>';
        var className = `hintCell hint-${i}`
        strHTML += `<td data-num="${dataValue}" onclick="hintClicked(this,${dataValue})" class="${className}">💡</td>`;
        strHTML += '</tr>';
    }
    var elTable = document.querySelector('.hints');
    elTable.innerHTML = strHTML;
}

function buildHints() {
    var hints = [];
    for (var i = 0; i < 3; i++) {
        hints[i] = 1;
    }
    return hints;
}

function level(size, bombNum) {
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

function putFlag(elCell, event) {
    if (!isGameOn) return
    event.preventDefault();
    var classArr = elCell.className.split("-")
    var pos = { i: classArr[1], j: classArr[2] }
    if (elCell.innerHTML === FLAG) {
        renderCell(pos, EMPTY)
        gFlagsCount++;
    } else {
        renderCell(pos, FLAG)
        gFlagsCount--;
    }
    gFlagsLabel.innerText = gFlagsCount;
}

function cellClicked(elCell, dataName) {
    if (gIsHintClick) {
        hintCellClicked(elCell)
        return;
    }
    if (!isGameOn) return;
    var classArr = elCell.className.split("-")
    var pos = { i: +classArr[1], j: +classArr[2] }

    if (isFirst) {
        timer();
        if (dataName === -1) {
            initGame()
            elCell = document.querySelector(`.cell-${pos.i}-${pos.j}`)
            cellClicked(elCell, +elCell.dataset.num)
            return
        }
        isFirst = false
    }
    if (dataName === -1) {
        bombClick()
        renderCell(pos, BOMB)
        if (gLifeCount === 0) lose();
        else setTimeout(clearBomb, 500, pos, elCell)
        return
    } else if (dataName === 0) {
        emptyClick(pos)
        dataName = EMPTY;
    } else {
        renderCell(pos, dataName)
        elCell.classList.add('selected')
        gSelectedPoses.push(pos);
        gCountSelected++
    }
    if (gCountSelected + gBombNum === gSize ** 2) win();
}

function win() {
    endGame('Victory')
    gSmile.innerText = '😎'
}

function bombClick() {
    gLifeCount--;
    heartStatus();
    sound('boom')
}

function emptyClick(pos) {
    var neighbors = getNeighborsPosition(pos, gBoard)
    for (var i = 0; i < neighbors.length; i++) {
        var curPosNe = neighbors[i];
        if (isPosInArr(curPosNe, gSelectedPoses)) continue;
        var elCell = document.querySelector(`.cell-${curPosNe.i}-${curPosNe.j}`);
        var value = +elCell.dataset.num
        gSelectedPoses.push(curPosNe);
        elCell.classList.add('selected')
        if (value === 0) {
            renderCell(curPosNe, EMPTY)
            emptyClick(curPosNe)
        } else renderCell(curPosNe, value)

        gCountSelected++;
    }
}

function clearBomb(pos, elCell) {
    // elCell.style.backgroundColor = 'lightgrey'
    elCell.classList.remove('bomb')
    renderCell(pos, EMPTY)
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
            var dataName = gBoard[i][j];
            if (dataName === BOMB) dataName = -1
            var className = `cell cell-${i}-${j}`
            strHTML += `<td data-num="${dataName}"   oncontextmenu="putFlag(this,event)" onclick="cellClicked(this,${dataName})"  class="${className}"></td>`;
        }
        strHTML += '</tr>';
    }
    var elTable = document.querySelector(selector);
    elTable.innerHTML = strHTML;
}

function buildBoard(pos) {
    var board = [];
    gBoardClean = [];
    getBombs(gBombNum, gSize);
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
        var isFirstTouchBomb = true;
        var posI = getRandomIntInclusive(0, size - 1)
        var posJ = getRandomIntInclusive(0, size - 1)
        gBombs.push({ i: posI, j: posJ })
    }
}