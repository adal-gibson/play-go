/**
 * handles events, manages game rooms
 * used // https://ayushgp.github.io/Tic-Tac-Toe-Socket-IO/ as a reference
 */

var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var Board = require("./board.js");
var Space = require("./space.js");
var Game = require("./game.js");
var Player = require("./player.js");
var FirstCapture = require("./first-capture.js");

app.use(express.static("public"));
app.use(express.static("server"));

let rooms = 0;
var board, game, variation;
var player1, player2;

// controls what happens when a user connects
io.on("connection", function(socket) {
    // console.log('a user connected');

    // console.log(new Board(9));

    socket.on("createGame", function(data) {
        var room = "game-" + (++rooms);
        socket.join(room);
        socket.emit("newGame", {
            name: data.name,
            boardSize: data.boardSize,
            color: data.color,
            room: room
        });
        board = new Board(data.boardSize);
        variation = new FirstCapture();
        game = new Game(board, variation);
        player1 = new Player(data.color, data.name);
        // console.log("player1: " + player1);
        game.setPlayer1(player1);
    });


    socket.on("joinGame", function(data) {
        console.log("joinGame - main.js");

        var room = io.nsps["/"].adapter.rooms[data.room];
        if (room && room.length == 1) {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit("player1", { room: data.room, player2: data.name });
            player2 = new Player(data.color, data.name);
            game.setPlayer2(player2);
        } else {
            socket.emit("err", { message: "Sorry, The room is full!" });
        }
    });


    socket.on("broadcast", function(data) {
        console.log("broadcast: " + JSON.stringify(data, null, 4));
        socket.broadcast.to(data.room).emit("player2", data);
    });


    socket.on("broadcastTurn", function(data) {
        variation.move(data.id, data.color, game);
        var string = game.getCurrentState().getString(game.getCurrentState().getSpaceByLocation(data.id), [], []);
        console.log("string: " + string);
        console.log("string liberties: " + game.getCurrentState().getStringLiberties(string));
        console.log("empty string liberties: " + game.getCurrentState().getEmptyStringLiberties(string));

        io.in(data.room).emit("turnPlayed", { id: data.id, color: data.color });
    });


    socket.on("gameEnded", function(data) {
        console.log("gameEnded");
    });


    socket.on("disconnect", function() {
        // do I need to have something here?
    });

});


// from socket.io documentation
http.listen(3000, function() {
    console.log("listening on *:3000");
});
