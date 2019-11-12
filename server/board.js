/**
 * used https://stackoverflow.com/questions/18188083/javascript-oop-in-nodejs-how as a reference
 */

var method = Board.prototype;
var asciiA = 65;
var Space = require("./space.js");


function Board(size) {
    this.size = size;
    this.spaces = [];
    this.turn = "black";

    for(var numLetter = 0; numLetter < size; numLetter++) {
        var charLetter = String.fromCharCode(asciiA + numLetter);
        this.spaces[charLetter] = [];
        for(var num = 1; num <= size; num++) {
            this.spaces[charLetter][num] = new Space(charLetter+num);
        }
    }
}


method.getSize = function() {
    return this.size;
};


method.getLastLetter = function() {
    return String.fromCharCode(asciiA + this.size - 1);
};


method.getSpaces = function() {
    return this.spaces;
};




method.getSpaceByLocation = function(location) {
    return this.spaces[location[0]][location[1]];
};


method.getLiberties = function(space) {
    var liberties = [];
    if(this.getSpaceAbove(space) != null) {
        liberties.push(this.getSpaceAbove(space));
    }
    if(this.getSpaceBelow(space) != null) {
        liberties.push(this.getSpaceBelow(space));
    }
    if(this.getSpaceLeft(space) != null) {
        liberties.push(this.getSpaceLeft(space));
    }
    if(this.getSpaceRight(space) != null) {
        liberties.push(this.getSpaceRight(space));
    }
    return liberties;
};


method.getEmptyLiberties = function(space) {
    var liberties = this.getLiberties(space);
    var numLiberties = liberties.length;
    var emptyLiberties = [];
    for (var i = 0; i < numLiberties; i++) {
        if (liberties[i].getColor() === "empty") {
            emptyLiberties.push(liberties[i]);
        }
    }
    return emptyLiberties;
};


method.getOpponentLiberties = function(space) {
    var liberties = this.getLiberties(space);
    var numLiberties = liberties.length;
    var opponentLiberties = [];
    for (var i = 0; i < numLiberties; i++) {
        if (liberties[i].getColor() != space.getColor()) {
            opponentLiberties.push(liberties[i]);
        }
    }
    return opponentLiberties;
};


method.getSameColorLiberties = function(space) {
    var liberties = this.getLiberties(space);
    var numLiberties = liberties.length;
    var ownLiberties = [];
    for (var i = 0; i < numLiberties; i++) {
        if (liberties[i].getColor() === space.getColor()) {
            ownLiberties.push(liberties[i]);
        }
    }
    return ownLiberties;
};


method.getEmptySpaces = function() {
    var emptySpaces = [];
    for(var numLetter = 0; numLetter < this.size; numLetter++) {
        var charLetter = String.fromCharCode(asciiA + numLetter);
        for(var num = 1; num <= size; num++) {
            var space = this.spaces[charLetter][num];
            if (space.getColor() === "empty") {
                emptySpaces.push(space);
            }
        }
    }
    return emptySpaces;
};


method.getBlackSpaces = function() {
    var blackSpaces = [];
    for(var numLetter = 0; numLetter < this.size; numLetter++) {
        var charLetter = String.fromCharCode(asciiA + numLetter);
        for(var num = 1; num <= size; num++) {
            var space = this.spaces[charLetter][num];
            if (space.getColor() === "black") {
                blackSpaces.push(space);
            }
        }
    }
    return blackSpaces;
};


method.getWhiteSpaces = function() {
    var whiteSpaces = [];
    for(var numLetter = 0; numLetter < this.size; numLetter++) {
        var charLetter = String.fromCharCode(asciiA + numLetter);
        for(var num = 1; num <= size; num++) {
            var space = this.spaces[charLetter][num];
            if (space.getColor() === "white") {
                whiteSpaces.push(space);
            }
        }
    }
    return whiteSpaces;
};


method.getSpaceAbove = function(space) {
    var spaceLocation = space.getLocation();
    var spaceLetter = space.getLetter();
    var spaceLetterCode = spaceLetter.charCodeAt(0);
    var spaceNumber = space.getNumber();

    if (!(spaceNumber === this.size)) {
        var aboveNumber = parseFloat(spaceNumber)+1;
        var aboveLocation = spaceLetter + aboveNumber;
        return this.getSpaceByLocation(aboveLocation);
    }
    return null;
};


method.getSpaceBelow = function(space) {
    var spaceLocation = space.getLocation();
    var spaceLetter = space.getLetter();
    var spaceLetterCode = spaceLetter.charCodeAt(0);
    var spaceNumber = space.getNumber();

    if (spaceNumber > 1) {
        var belowNumber = parseFloat(spaceNumber)-1;
        var belowLocation = spaceLetter + belowNumber;
        return this.getSpaceByLocation(belowLocation);
    }
    return null;
};


method.getSpaceLeft = function(space) {
    var spaceLocation = space.getLocation();
    var spaceLetter = space.getLetter();
    var spaceLetterCode = spaceLetter.charCodeAt(0);
    var spaceNumber = space.getNumber();

    if (spaceLetterCode > asciiA) {
        var leftLetter = String.fromCharCode(spaceLetterCode-1);
        var leftLocation = leftLetter + spaceNumber;
        return this.getSpaceByLocation(leftLocation);
    }
    return null;
};


method.getSpaceRight = function(space) {
    var spaceLocation = space.getLocation();
    var spaceLetter = space.getLetter();
    var spaceLetterCode = spaceLetter.charCodeAt(0);
    var spaceNumber = space.getNumber();

    if (spaceLetterCode < (parseFloat(asciiA) + parseFloat(this.size) - 1)) {
        var rightLetter = String.fromCharCode(spaceLetterCode+1);
        var rightLocation = rightLetter + spaceNumber;
        return this.getSpaceByLocation(rightLocation);
    }
    return null;
};

method.getEmptyStringLiberties = function() {
    return this.getEmptyStringLiberties([]);
};

method.getEmptyStringLiberties = function(stringArr) {
    var liberties = this.getStringLiberties(stringArr);
    var emptyLiberties = [];
    for(var i = 0; i < liberties.length; i++) {
        if(liberties[i].getColor() === "empty") {
            emptyLiberties.push(liberties[i]);
        }
    }
    return emptyLiberties;
};

method.getStringLiberties = function() {
    return this.getStringLiberties([]);
};

method.getStringLiberties = function(stringArr) {
    var color = stringArr[0].getColor();
    var liberties = [];
    for(var i = 0; i < stringArr.length; i++) {
        var spaceLiberties = this.getLiberties(stringArr[i]);
        for(var j = 0; j < spaceLiberties.length; j++) {
            if (spaceLiberties[j].getColor() != color) {
                liberties.push(spaceLiberties[j]);
            }
        }
    }
    return liberties;
};

method.getString = function(space, stringArr, visitedArr) {
    console.log(stringArr);
    console.log(visitedArr);
    var color = space.getColor();

    if(!stringArr.includes(space)) {
        stringArr.push(space);
    }

    if(!visitedArr.includes(space)) {
        visitedArr.push(space);
    }

    var above = this.getSpaceAbove(space);
    if(above != null && above.getColor() === color && !visitedArr.includes(above)) {
        if(!stringArr.includes(above)) {
            stringArr.push(above);
        }
        this.getString(above, stringArr, visitedArr);
    }

    var below = this.getSpaceBelow(space);
    if(below != null && below.getColor() === color && !visitedArr.includes(below)) {
        if(!stringArr.includes(below)) {
            stringArr.push(below);
        }
        this.getString(below, stringArr, visitedArr);
    }

    var left = this.getSpaceLeft(space);
    if(left != null && left.getColor() === color && !visitedArr.includes(left)) {
        if(!stringArr.includes(left)) {
            stringArr.push(left);
        }
        this.getString(left, stringArr, visitedArr);
    }

    var right = this.getSpaceRight(space);
    if(right != null && right.getColor() === color && !visitedArr.includes(right)) {
        if(!stringArr.includes(right)) {
            stringArr.push(right);
        }
        this.getString(right, stringArr, visitedArr);
    }

    return stringArr;
};

method.isCaptured = function(space) {
    if (this.getString(space).length == 0) {
        return true;
    }
    return false;
};

method.madeACapture = function(space) {
    var oppLiberties = this.getOpponentLiberties(space);
    for(var i = 0; i < oppLiberties.length; i++) {
        if (this.isCaptured(oppLiberties[i])) {
            return true;
        }
    }
    return false;
};




module.exports = Board;
