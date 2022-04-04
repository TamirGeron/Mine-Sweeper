"use strict";

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
        } else {
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
        if (isPosInArr(curPosNe, gSelectedPoses)) continue;
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

function createHints() {
    var hints = [];
    for (var i = 0; i < 3; i++) {
        hints[i] = 1;
    }
    return hints;
}