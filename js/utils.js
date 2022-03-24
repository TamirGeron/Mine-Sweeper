"use strict";

function getTime() { } // get the exact current time

function isPosInArr(pos, arr) {
  for (var i = 0; i < arr.length; i++) {
    var curPos = arr[i]
    if ((curPos.i === pos.i) && (curPos.j === pos.j)) return true;
  }
  return false;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get arr with nums
function getNums(size) {
  var nums = [];
  for (var i = 0; i < size; i++) {
    nums.push(i + 1);
  }
  return nums;
}

//Make Sound
function sound(str) {
  var audio = new Audio("sound/" + str + ".mp3")
  audio.play()
}

// get random Color
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// sum col in mat
function sumCol(matrix, colIdx) {
  var sum = 0;
  for (var i = 0; i < matrix.length; i++) {
    var currRow = matrix[i];
    sum += currRow[colIdx];
  }
  return sum;
}

// sum row in mat
function sumRow(matrix, rowIdx) {
  var sum = 0;
  for (var i = 0; i < matrix[rowIdx].length; i++) {
    sum += matrix[rowIdx][i];
  }
  return sum;
}

// find max in mat
function findMax(matrix, colIdx) {
  var max = 0;
  var col = [];
  for (var i = 0; i < matrix.length; i++) {
    var currRow = matrix[i];
    col.push(currRow[colIdx]);
  }
  return (max = Math.max(...col));
}

// find avg in mat
function findAvg(matrix) {
  var sum = 0;
  var avg = null;
  var length = matrix.length * matrix[0].length;
  for (var i = 0; i < matrix.length; i++) {
    var currRow = matrix[i];
    for (var j = 0; j < currRow.length; j++) {
      var currNum = currRow[j];
      sum += currNum;
    }
  }
  return (avg = sum / length);
}

// find the sum in area
function sumArea(matrix, rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd) {
  var sum = 0;
  for (var i = rowIdxStart; i <= rowIdxEnd; i++) {
    var currRow = matrix[i];
    for (var j = colIdxStart; j <= colIdxEnd; j++) {
      var currNum = currRow[j];
      sum += currNum;
    }
  }
  return sum;
}

// check if the mat symmetric
function checkIfSymmetric(mat) {
  for (var i = 0; i < mat.length; i++) {
    var currRow = mat[i];
    for (var j = 0; j < currRow.length; j++) {
      if (mat[i][j] !== mat[j][i]) return false;
    }
  }
  return true;
}

// sum primary diagonal
function printPrimaryDiagonal(mat) {
  var sum = 0;
  for (var d = 0; d < mat.length; d++) {
    var item = mat[d][d];
    sum += item;
  }
  return sum;
}

// sum secondary diagonal
function printSecondaryDiagonal(mat) {
  var sum = 0;
  for (var d = 0; d < mat.length; d++) {
    var item = mat[d][mat.length - d - 1];
    sum += item;
  }
  return sum;
}

// Count neighbors
function countNeighborsValue(cellI, cellJ, mat, value) {
  var neighborsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;
      if (mat[i][j] === value) neighborsCount++;
    }
  }
  return neighborsCount;
}

function getNeighborsPosition(pos, mat) {
  var neighbors = [];
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (i === pos.i && j === pos.j) continue;
      if (j < 0 || j >= mat[i].length) continue;
      neighbors.push({ i: i, j: j });
    }
  }
  return neighbors;
}

function timer() {
  gIntervalTime = setInterval(setTime, 1000);
}

function setTime() {
  ++gTotalSeconds;
  gSecondsLabel.innerText = `${gTotalSeconds} Seconds`
}
