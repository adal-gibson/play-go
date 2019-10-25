/**
 * used https://stackoverflow.com/questions/18188083/javascript-oop-in-nodejs-how as a reference
 */

var method = Board.prototype;
var asciiA = 65;
var Space = require("./space.js");

function Board(size) {
    this._size = size;
    this._spaces = [];

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

method.getSpaces = function() {
    return this._spaces;
};

method.getSpaceByLocation = function(location) {
    return this._spaces[location[0]][location[1]];
};

method.move = function(id, color) {
    this.getSpaceByLocation(id).setColor(color);
    // console.log(this._spaces);
}




module.exports = Board;
