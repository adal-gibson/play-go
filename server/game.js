var method = Game.prototype;
var Space = require("./space.js");
var Board = require("./board.js");
var Player = require("./player.js");
var Referee = require("./player.js");

function Game(player1, player2, referee, startingState, variation) {
    this.player1 = player1;
    this.player2 = player2;
    this.referee = referee;
    this.states = [startingState];
    this.variation = variation;
}

module.exports = Game;
