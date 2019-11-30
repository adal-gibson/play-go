var method = PaperPencilGo.prototype;
var clone = require('clone');
var Board = require("./board.js");
var Space = require("./space.js");
var Game = require("./game.js");
var Player = require("./player.js");

// constructor
function PaperPencilGo() {}

method.move = function(id, color, game) {
    let oldState = game.getCurrentState();
    let newState = clone(oldState);
    let space = newState.getSpaceByLocation(id);
    space.setColor(color);
    if (this.isLegal(space, newState)) {
        if (this.checkForGameOver(space, newState)) {
            // game over
            game.addState(newState);
            let whitePoints = this.getWhitePoints(newState);
            let blackPoints = this.getBlackPoints(newState);

            if (whitePoints > blackPoints) {
                return "white";
            } else if (whitePoints < blackPoints) {
                return "black";
            } else {
                return "tie";
            }
        } else {
            // game continues
            game.addState(newState);
            return "legal";
        }
    } else {
        // illegal move
        return "illegal";
    }

};

method.isLegal = function(space, board) {
    return !(board.isCaptured(space));
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

method.checkForGameOver = function(space, board) {
    return !(this.hasMoves(space.getColor(), board));
};

method.getWhitePoints = function(board) {
    let blackSpaces = board.getBlackSpaces();
    let points = 0;
    for (let space of blackSpaces) {
        if (board.isCaptured(space)) {
            points++;
        }
    }
    return points;
};

method.getBlackPoints = function(board) {
    let whiteSpaces = board.getWhiteSpaces();
    let points = 0;
    for (let space of whiteSpaces) {
        if (board.isCaptured(space)) {
            points++;
        }
    }
    return points;
};



method.toString = function() {
    return "Paper & Pencil Go";
};

module.exports = PaperPencilGo;
