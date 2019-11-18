var method = NoGo.prototype;
var clone = require('clone');
var Board = require("./board.js");
var Space = require("./space.js");
var Game = require("./game.js");
var Player = require("./player.js");

// constructor
function NoGo() {}

// makes a move, makes sure move is legal
method.move = function(id, color, game) {
    console.log("move called");
    let oldState = game.getCurrentState();
    let newState = clone(oldState);
    let space = newState.getSpaceByLocation(id);
    space.setColor(color);
    if (this.isLegal(space, newState)) {
        // legal move
        game.addState(newState);
        if (this.checkForWin(game.getPlayerByColor(color), newState)) {
            // game is won
            return "won";
        }
        return "legal";
    } else {
        // illegal move
        return "illegal";
    }
};

method.checkForWin = function(player, board) {
    let opponentColor = (player.getColor() === "white") ? "black" : "white";
    return !(this.hasMoves(opponentColor, board));
};

method.isLegal = function(space, board) {
    return !(board.isCaptured(space) || board.madeACapture(space));
};

method.hasMoves = function(color, board) {
    let emptySpaces = board.getEmptySpaces();
    for (let space of emptySpaces) {
        space.setColor(color);
        let isLegal = this.isLegal(space, board);
        space.setColor("empty");
        if (isLegal) {
            return true;
        }
    }
    return false;
};

method.toString = function() {
    return "NoGo";
};

module.exports = NoGo;
