var method = Player.prototype;
var Space = require("./space.js");
var Board = require("./board.js");

function Player(color, name) {
    this.color = color;
    this.name = name;
}

module.exports = Player;
