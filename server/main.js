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

app.use(express.static("public"));
app.use(express.static("server"));

let rooms = 0;

// controls what happens when a user connects
io.on("connection", function(socket) {
    // console.log('a user connected');

    console.log(new Board(9));

    socket.on("createGame", function(data) {
        // socket.emit("test", { name: data.name });
        console.log("createGame - main.js");

        var room = "game-" + (++rooms);
        socket.join(room);
        socket.emit("newGame", {
            name: data.name,
            boardSize: data.boardSize,
            color: data.color,
            room: room
        });
        console.log("newGame emitted by on createGame");
    });

    socket.on("joinGame", function(data) {
        console.log("joinGame - main.js");

        var room = io.nsps["/"].adapter.rooms[data.room];
        if (room && room.length == 1) {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit("player1", { room: data.room, player2: data.name });
            // socket.emit("player2", { player2Name: data.name, room: data.room });
        } else {
            socket.emit("err", { message: "Sorry, The room is full!" });
        }
    });

    socket.on("broadcast", function(data) {
        console.log("broadcast: " + JSON.stringify(data, null, 4));
        socket.broadcast.to(data.room).emit("player2", data);
    });

    socket.on("broadcastTurn", function(data) {
        console.log("broadcast turn, player: " + data.player + ", color: " + data.color + ", id: " + data.id);
        socket.broadcast.to(data.room).emit("getMove", { id: data.id, color: data.color })
    });


    socket.on("gameEnded", function(data) {
        console.log("gameEnded - main.js");
        // socket.broadcast.to(data.room).emit("gameEnd", data);
        // console.log("gameEnd emitted by gameEnded")
    });

    socket.on("disconnect", function() {
        // console.log('user disconnected');
    });

});

// from socket.io documentation
http.listen(3000, function() {
    console.log("listening on *:3000");
});
