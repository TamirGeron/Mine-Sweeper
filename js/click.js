"use strict";

function putFlag(elCell, event) {
    if (!isGameOn) return
    event.preventDefault();
    var classArr = elCell.className.split("-")
    var pos = { i: classArr[1], j: classArr[2] }
    if (elCell.innerHTML === FLAG) {
        renderCell(pos, EMPTY)
        gFlagsCount++;
    } else {
        // @CR - It is better to write: !gFlagsCount
        if (gFlagsCount === 0) return
        renderCell(pos, FLAG)
        gFlagsCount--;
    }
    gFlagsLabel.innerText = gFlagsCount + ' flags';
}

function cellClicked(elCell, data) {
    var classArr = elCell.className.split("-")
    var pos = { i: +classArr[1], j: +classArr[2] }

    if (gIsHintClick) {
        hintCellClicked(elCell)
        return;
    }
    if (gIsManual) {
        cellManual(elCell, pos)
        return;
    }
    if (!isGameOn) return;

    if (isFirst) {
        startTimer();
        if (data === -1) {
            initGame()
            elCell = document.querySelector(`.cell-${pos.i}-${pos.j}`)
            cellClicked(elCell, +elCell.dataset.num)
            return
        }
        isFirst = false
    }
    if (data === -1) {
        bombClick()
        renderCell(pos, BOMB)
        if (!gLifeCount) lose();
        return
    } else if (data === 0) {
        emptyClick(pos)
        data = EMPTY;
    } else {
        renderCell(pos, data)
        elCell.classList.add('selected')
        gSelectedPoses.push(pos);
        gCountSelected++
    }
    if (gCountSelected + gBombNum === gSize ** 2) win();
}

function bombClick() {
    gLifeCount--;
    heartStatus();
    sound('boom')
}

function emptyClick(pos) {
    var neighbors = getNeighborsPosition(pos, gBoard)
    neighbors.push(pos);
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


function safeClick() {
    if (gSafeClickCount === 0) return;
    var i = getRandomIntInclusive(0, gSize - 1)
    var j = getRandomIntInclusive(0, gSize - 1)
    var pos = { i: i, j: j };
    if ((isPosInArr(pos, gBombs)) || (isPosInArr(pos, gSelectedPoses))) {
        safeClick();
        return;
    }
    var elCell = document.querySelector(`.cell-${pos.i}-${pos.j}`)
    elCell.classList.add('safeCell')
    setTimeout(clearSafeCell, 500, elCell)
    gSafeClickCount--;
    var elSafe = document.querySelector('.availableSafe')
    elSafe.innerText = `${gSafeClickCount} clicks available`;
}

function clearSafeCell(elCell) {
    elCell.classList.remove('safeCell')
}

function initManual(elButton) {
    gSmile.innerText = '🧐'
    gBombs = []
    gIsManual = true;
    gBombCount = gBombNum
    elButton.innerText = `${gBombCount} Mines`;
}

function cellManual(elCell, pos) {
    gBombs.push(pos);
    renderCell(pos, BOMB);
    elCell.classList.add('bomb')
    gBombCount--;
    if (!gBombCount) setTimeout(initGame, 1000)
    var elButton = document.querySelector('.buildManual')
    elButton.innerText = `${gBombCount} Mines`;
}

function boom7() {
    gBombs = [];
    var count = 0;
    gIsManual = true;
    for (var i = 0; i < gSize; i++) {
        for (var j = 0; j < gSize; j++) {
            count++;
            if (count % 7 === 0) gBombs.push({ i: i, j: j });
        }
    }
    initGame();
}