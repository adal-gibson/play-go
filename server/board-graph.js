/**
 * used https://stackoverflow.com/questions/18188083/javascript-oop-in-nodejs-how as a reference
 */

var Graph = require("graph-data-structure");
var method = BoardGraph.prototype;
var asciiA = 65;

function BoardGraph(size) {
    this._size = size;


    for(var num = 0; i < num; num++) {
        for(var letter = asciiA; letter < asciiA + size; letter++) {
            console.log(letter + num);
        }
    }
}

method.getSize = function() {
    return this._size;
};

// think this should be end of file
module.exports = BoardGraph;
