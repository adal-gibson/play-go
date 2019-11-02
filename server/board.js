/**
 * used https://stackoverflow.com/questions/18188083/javascript-oop-in-nodejs-how as a reference
 */

var method = Board.prototype;
var asciiA = 65;
var Space = require("./space.js");


function Board(size) {
    this._size = size;
    this._spaces = [];
    this._turn = "black";

    for(var numLetter = 0; numLetter < size; numLetter++) {
        var charLetter = String.fromCharCode(asciiA + numLetter);
        this._spaces[charLetter] = [];
        for(var num = 1; num <= size; num++) {
            this._spaces[charLetter][num] = new Space(charLetter+num);
        }
    }
}


method.getSize = function() {
    return this._size;
};


method.getLastLetter = function() {
    return String.fromCharCode(asciiA + this._size - 1);
};


method.getSpaces = function() {
    return this._spaces;
};


method.getSpaceByLocation = function(location) {
    return this._spaces[location[0]][location[1]];
};


method.move = function(id, color) {
    this.getSpaceByLocation(id).setColor(color);
    console.log(this.getLiberties(this.getSpaceByLocation(id)));
};


method.getLiberties = function(space) {
    var spaceLocation = space.getLocation();
    var spaceLetter = space.getLetter();
    var spaceLetterCode = spaceLetter.charCodeAt(0);
    var spaceNumber = space.getNumber();
    var liberties = [];

    // get space above
    if (!(spaceNumber === this._size)) {
        var aboveNumber = parseFloat(spaceNumber)+1;
        var aboveLocation = spaceLetter + aboveNumber;
        liberties.push(this.getSpaceByLocation(aboveLocation));
    }

    // get space below
    if (spaceNumber > 1) {
        var belowNumber = parseFloat(spaceNumber)-1;
        var belowLocation = spaceLetter + belowNumber;
        liberties.push(this.getSpaceByLocation(belowLocation));
    }

    // get space left
    if (spaceLetterCode > asciiA) {
        var leftLetter = String.fromCharCode(spaceLetterCode-1);
        var leftLocation = leftLetter + spaceNumber;
        liberties.push(this.getSpaceByLocation(leftLocation));
    }

    // get space right
    if (spaceLetterCode < (parseFloat(asciiA) + parseFloat(this._size) - 1)) {
        var rightLetter = String.fromCharCode(spaceLetterCode+1);
        var rightLocation = rightLetter + spaceNumber;
        liberties.push(this.getSpaceByLocation(rightLocation));
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
    for(var numLetter = 0; numLetter < this._size; numLetter++) {
        var charLetter = String.fromCharCode(asciiA + numLetter);
        for(var num = 1; num <= size; num++) {
            var space = this._spaces[charLetter][num];
            if (space.getColor() === "empty") {
                emptySpaces.push(space);
            }
        }
    }
    return emptySpaces;
};


method.getBlackSpaces = function() {
    var blackSpaces = [];
    for(var numLetter = 0; numLetter < this._size; numLetter++) {
        var charLetter = String.fromCharCode(asciiA + numLetter);
        for(var num = 1; num <= size; num++) {
            var space = this._spaces[charLetter][num];
            if (space.getColor() === "black") {
                blackSpaces.push(space);
            }
        }
    }
    return blackSpaces;
};


method.getWhiteSpaces = function() {
    var whiteSpaces = [];
    for(var numLetter = 0; numLetter < this._size; numLetter++) {
        var charLetter = String.fromCharCode(asciiA + numLetter);
        for(var num = 1; num <= size; num++) {
            var space = this._spaces[charLetter][num];
            if (space.getColor() === "white") {
                whiteSpaces.push(space);
            }
        }
    }
    return whiteSpaces;
};





module.exports = Board;
