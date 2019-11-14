var method = Game.prototype;
var Space = require("./space.js");
var Board = require("./board.js");
var Player = require("./player.js");
var AtariGo = require("./atari-go.js");
var NoGo = require("./no-go.js");

function Game(startingState, variation) {
    this.states = [];
    this.states.push(startingState);
    this.variation = variation;
    this.player1 = null;
    this.player2 = null;
    this.turn = "black";
}

method.getStates = function() {
    return this.states;
};

method.setVariation = function(variation) {
    this.variation = variation;
};

method.getVariation = function() {
    return this.variation;
};

method.setPlayer1 = function(player1) {
    this.player1 = player1
};

method.getPlayer1 = function() {
    return this.player1;
};

method.setPlayer2 = function(player2) {
    this.player2 = player2
};

method.getPlayer2 = function() {
    return this.player2;
};

method.getPlayerByColor = function(color) {
    if (this.player1.getColor() === color) {
        return this.player1;
    }
    return this.player2;
};

method.getCurrentState = function() {
    return this.states[this.states.length - 1];
};

method.getTurn = function() {
    return this.turn;
};

method.setTurn = function() {
    if (this.turn === "black") {
        this.turn = "white";
    } else {
        this.turn = "black";
    }
};

method.addState = function(board) {
    this.states.push(board);
};

module.exports = Game;
