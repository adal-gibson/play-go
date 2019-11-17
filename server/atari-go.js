var method = AtariGo.prototype;
var clone = require('clone');
var Board = require("./board.js");
var Space = require("./space.js");
var Game = require("./game.js");
var Player = require("./player.js");

// constructor
function AtariGo() {}

// makes a move, makes sure move is legal
method.move = function(id, color, game) {
    console.log("move called");
    let oldState = game.getCurrentState();
    let newState = clone(oldState);
    let space = newState.getSpaceByLocation(id);
    space.setColor(color); // this is ok because it's setting the color of a space in a board that will only be logged if move is legal
    if (this.isLegal(space, newState)) {
        // legal
        if (this.checkForWin(space, newState)){
            // game is won
            game.addState(newState);
            return "won";
        }
        // legal move, but not over
        game.addState(newState);
        return "legal";
    } else {
        // illegal move
        return "illegal";
    }
};

method.checkForWin = function(space, board) {
    return board.madeACapture(space);
};

method.isLegal = function(space, board) {
    return !(board.isCaptured(space));
};

method.toString = function() {
    return "Atari Go";
};

module.exports = AtariGo;
