"use strict";


// make a table 
function printMat(mat, selector) {
  var strHTML = '<table border="2"><tbody class="board">';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell-' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderBoardWithClick(board, selector) {
  var strHTML = '<table border="2"><tbody class="board">';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var className = board[i][j];
      strHTML += `<td data-num="${className}" onclick="cellClicked(${className},this)" class=" cell ${className}">${className}</td>`;
    }
    strHTML += '</tr>';
  }
  var elTable = document.querySelector(selector);
  elTable.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerText = value;
  // if (value === EMPTYBOOM) elCell.classList.remove('bomb')
  if (value === BOMB) elCell.classList.add ('bomb')
}

function createMat(ROWS, COLS) {
  var mat = []
  for (var i = 0; i < ROWS; i++) {
    var row = []
    for (var j = 0; j < COLS; j++) {
      row.push('')
    }
    mat.push(row)
  }
  return mat
}