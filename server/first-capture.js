var method = FirstCapture.prototype;
var clone = require('clone');
var Board = require("./board.js");
var Space = require("./space.js");
var Game = require("./game.js");
var Player = require("./player.js");

function FirstCapture() {

}

method.hasMoves = function(player, board) {

};

method.move = function(id, color, game) {
    console.log("move called");
    var oldState = game.getCurrentState();
    var newState = clone(oldState);
    var space = newState.getSpaceByLocation(id)
    space.setColor(color);
    if (newState.isCaptured(space)) {
        // illegal move
        console.log("illegal move!!");
    } else if (newState.madeACapture(space)){
        // game is won
        console.log("game ended");
        game.addState(newState);
    } else {
        // legal move
        console.log("that was a legal move!");
        game.addState(newState);
    }
};

method.declareWinner = function(player) {

};

method.toString = function() {
    return "First Capture";
};

module.exports = FirstCapture;
