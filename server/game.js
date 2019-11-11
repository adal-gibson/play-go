var method = Game.prototype;
var Space = require("./space.js");
var Board = require("./board.js");
var Player = require("./player.js");
var Referee = require("./referee.js");

function Game(startingState, variation) {
    this.states = [startingState];
    this.variation = variation;
    this.player1 = null;
    this.player2 = null;
}

method.setPlayer1 = function(player1) {
    this.player1 = player1
};

method.setPlayer2 = function(player2) {
    this.player2 = player2
};

method.move = function(id, color) {
    // will want to make new state here and add it to list of states
    this.states[this.states.length -1].getSpaceByLocation(id).setColor(color);
    console.log("liberties: " + this.states[this.states.length -1].getLiberties(this.states[this.states.length -1].getSpaceByLocation(id)));
};

method.getCurrentState = function() {
    return this.states[this.states.length - 1];
};

module.exports = Game;
