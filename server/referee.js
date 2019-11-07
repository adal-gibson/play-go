/**
 * @author Madeleine Young <madeleine.rgr.young@gmail.com>
 * heavily influenced by Dr. Kyle Burke's referee.java for CS2381 - Data Structures
 */

var method = Referee.prototype;
var Space = require("./space.js");
var Board = require("./board.js");

function Referee(board) {
    // current game state
    this.position = board;
}

/**
 * adds move to game states array
 * switches turns
 */
method.move = function() {

};

/**
 * waits for move from player
 * checks if move was legal
 * ends game if player has no options
 */
method.getNextMove = function() {

};

/**
 * gets the string of stones attached to space
 * returns an array of spaces
 * stringArr and visitedArr are initially an empty arrays
 */
method.getString = function(space, stringArr, visitedArr) {
    var color = space.getColor();

    if(!stringArr.includes(space)) {
        stringArr.push(space);
    }

    if(!visitedArr.includes(space)) {
        visitedArr.push(space);
    }

    var above = this.position.getSpaceAbove(space);
    if(above != null && above.getColor() === color && !visitedArr.includes(above)) {
        if(!stringArr.includes(above)) {
            stringArr.push(above);
        }
        this.getString(above, stringArr);
    }

    var below = this.position.getSpaceBelow(space);
    if(below != null && below.getColor() === color && !visitedArr.includes(above)) {
        if(!stringArr.includes(below)) {
            stringArr.push(below);
        }
        this.getString(below, stringArr);
    }

    var left = this.position.getSpaceLeft(space);
    if(left != null && left.getColor() === color && !visitedArr.includes(above)) {
        if(!stringArr.includes(left)) {
            stringArr.push(left);
        }
        this.getString(left, stringArr);
    }

    var right = this.position.getSpaceRight(space);
    if(right != null && right.getColor() === color && !visitedArr.includes(above)) {
        if(!stringArr.includes(right)) {
            stringArr.push(right);
        }
        this.getString(right, stringArr);
    }

    return stringArr;
};

module.exports = Referee;
