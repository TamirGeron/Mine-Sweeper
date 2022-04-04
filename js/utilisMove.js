"use strict";
// @CR - If you dont use functions then delete


// get random move
function getMoveDiff() {
    var randNum = getRandomIntInclusive(1, 100);
    if (randNum <= 25) {
        return { i: 0, j: 1 };
    } else if (randNum <= 50) {
        return { i: -1, j: 0 };
    } else if (randNum <= 75) {
        return { i: 0, j: -1 };
    } else {
        return { i: 1, j: 0 };
    }
}

function move(object) {
    // figure out moveDiff, nextLocation, nextCell
    var moveDiff = getMoveDiff();

    var nextLocation = {
        i: object.location.i + moveDiff.i,
        j: object.location.j + moveDiff.j,
    };

    var nextCell = gBoard[nextLocation.i][nextLocation.j];

    // return if cannot move
    if (nextCell === WALL) return;

}
