var method = Player.prototype;
var Space = require("./space.js");
var Board = require("./board.js");

function Player(color, name) {
    this.color = color;
    this.name = name;
}

method.toString = function() {
    return "name: " + this.name + ", color: " + this.color;
};

module.exports = Player;
