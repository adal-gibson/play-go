/**
 * handles events, manages game rooms
 * used // https://ayushgp.github.io/Tic-Tac-Toe-Socket-IO/ as a reference
 */

var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.use(express.static("public"));
app.use(express.static("server"));

let rooms = 0;

// controls what happens when a user connects
io.on("connection", function(socket) {
    console.log('a user connected');

    socket.on("createGame", function(data) {
        socket.emit("test", { name: data.name });
        console.log("createGame - index.js");

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
        console.log("joinGame - index.js");

        var room = io.nsps["/"].adapter.rooms[data.room];
        if (room && room.length == 1) {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit("player1", { room: data.room, player2Name: data.name });
            socket.emit("player2", { player2Name: data.name, room: data.room });
        } else {
            socket.emit("err", { message: "Sorry, The room is full!" });
        }
    });

    socket.on("playTurn", function(data) {
        console.log("playTurn - index.js");
        // socket.broadcast.to(data.room).emit("turnPlayed", {
        //     node: data.node,
        //     room: data.room
        // });
        // console.log("turnPlayed emitted by playTurn");
    });

    socket.on("gameEnded", function(data) {
        console.log("gameEnded - index.js");
        // socket.broadcast.to(data.room).emit("gameEnd", data);
        // console.log("gameEnd emitted by gameEnded")
    });

    socket.on("disconnect", function() {
        console.log('user disconnected');
    });

});

// from socket.io documentation
http.listen(3000, function() {
    console.log("listening on *:3000");
});