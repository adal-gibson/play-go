/**
 * @author Madeleine Young <madeleine.rgr.young@gmail.com>
 * heavily influenced by Dr. Kyle Burke's referee.java for CS2381 - Data Structures
 */

// var method = Referee.prototype;
// var Space = require("./space.js");
// var Board = require("./board.js");
// var Game = require("./game.js");
//
// function Referee(board, game) {
//     // current game state
//     this.position = board;
//     this.game = game;
// }

/**
 * adds move to game states array
 * switches turns
 */
// method.move = function() {
//
// };

/**
 * waits for move from player
 * checks if move was legal
 * ends game if player has no options
 */
// method.getNextMove = function() {
//
// };
//
// method.isCaptured = function(space) {
//     if (this.getString(space).length == 0) {
//         return true;
//     }
//     return false;
// };
//
// method.madeACapture = function(space) {
//     var oppLiberties = this.position.getOpponentLiberties(space);
//     for(var i = 0; i < oppLiberties.length; i++) {
//         if (this.isCaptured(oppLiberties[i])) {
//             return true;
//         }
//     }
//     return false;
// };

// method.getEmptyStringLiberties = function(stringArr) {
//     var liberties = this.getStringLiberties(stringArr);
//     var emptyLiberties = [];
//     for(var i = 0; i < liberties.length; i++) {
//         if(liberties[i].getColor() === "empty") {
//             emptyLiberties.push(liberties[i]);
//         }
//     }
//     return emptyLiberties;
// };
//
// method.getStringLiberties = function(stringArr) {
//     var color = stringArr[0].getColor();
//     var liberties = [];
//     for(var i = 0; i < stringArr.length; i++) {
//         var spaceLiberties = this.position.getLiberties(stringArr[i]);
//         for(var j = 0; j < spaceLiberties.length; j++) {
//             if (spaceLiberties[j].getColor() != color) {
//                 liberties.push(spaceLiberties[j]);
//             }
//         }
//     }
//     return liberties;
// };
//
// /**
//  * gets the string of stones attached to space
//  * returns an array of spaces
//  * stringArr and visitedArr are initially an empty arrays
//  */
// method.getString = function(space) {
//     return this.getString(space, [], []);
// };
//
// method.getString = function(space, stringArr, visitedArr) {
//     var color = space.getColor();
//
//     if(!stringArr.includes(space)) {
//         stringArr.push(space);
//     }
//
//     if(!visitedArr.includes(space)) {
//         visitedArr.push(space);
//     }
//
//     var above = this.position.getSpaceAbove(space);
//     if(above != null && above.getColor() === color && !visitedArr.includes(above)) {
//         if(!stringArr.includes(above)) {
//             stringArr.push(above);
//         }
//         this.getString(above, stringArr, visitedArr);
//     }
//
//     var below = this.position.getSpaceBelow(space);
//     if(below != null && below.getColor() === color && !visitedArr.includes(below)) {
//         if(!stringArr.includes(below)) {
//             stringArr.push(below);
//         }
//         this.getString(below, stringArr, visitedArr);
//     }
//
//     var left = this.position.getSpaceLeft(space);
//     if(left != null && left.getColor() === color && !visitedArr.includes(left)) {
//         if(!stringArr.includes(left)) {
//             stringArr.push(left);
//         }
//         this.getString(left, stringArr, visitedArr);
//     }
//
//     var right = this.position.getSpaceRight(space);
//     if(right != null && right.getColor() === color && !visitedArr.includes(right)) {
//         if(!stringArr.includes(right)) {
//             stringArr.push(right);
//         }
//         this.getString(right, stringArr, visitedArr);
//     }
//
//     return stringArr;
// };

// module.exports = Referee;
