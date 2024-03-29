/**
 * handles events, manages game rooms
 * used // https://ayushgp.github.io/Tic-Tac-Toe-Socket-IO/ as a reference
 */

var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

// used https://flaviocopes.com/node-mongodb/ as a reference for mongodb stuff
require('dotenv').config();
const mongo = require("mongodb").MongoClient;
// const url = "mongodb+srv://" + process.env.DB_URL;
const url = "mongodb://127.0.0.1:27017";


var Board = require("./board.js");
var Space = require("./space.js");
var Game = require("./game.js");
var Player = require("./player.js");
var AtariGo = require("./atari-go.js");
var NoGo = require("./no-go.js");
var PaperPencilGo = require("./paper-pencil-go.js");

app.use(express.static("public"));
app.use(express.static("server"));

let rooms = 0;
var board, game, variation, roomId;
var player1, player2;

// controls what happens when a user connects
io.on("connection", function(socket) {

    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            console.error(err);
            return;
        }

        const db = client.db("goDB");
        const collection = db.collection("rooms");

        collection.find().toArray((err, items) => {
            // update rooms
            io.emit("updateRooms", items);
        });

        socket.on("createGame", function(data) {
            var room = "game-" + (++rooms);
            roomId = room;
            socket.join(room);
            socket.emit("newGame", {
                name: data.name,
                boardSize: data.boardSize,
                color: data.color,
                room: room,
                variation: data.variation
            });

            board = new Board(data.boardSize);
            variation = new AtariGo();
            if (data.variation === "NoGo") {
                variation = new NoGo();
            } else if (data.variation ==="Paper & Pencil Go") {
                variation = new PaperPencilGo();
            }

            game = new Game(board, variation);
            // console.log(JSON.stringify(game, null, 4));
            player1 = new Player(data.color, data.name);
            // console.log("player1: " + player1);
            game.setPlayer1(player1);

            // add to database, update lists
            let color = (data.color === "white") ? "black" : "white";
            collection.insertOne({room: room, variation: data.variation, color: color, size: data.boardSize});
            collection.find().toArray((err, items) => {
                io.emit("updateRooms", items);
            });
        });


        socket.on("joinGame", function(data) {
            roomId = data.room;
            var room = io.nsps["/"].adapter.rooms[data.room];
            if (room && room.length == 1) {
                socket.join(data.room);
                socket.broadcast.to(data.room).emit("player1", { room: data.room, player2: data.name });

                player2 = new Player(data.color, data.name);
                game.setPlayer2(player2);

                // remove from db once full, update lists
                collection.deleteMany({room: data.room});
                collection.find().toArray((err, items) => {
                    io.emit("updateRooms", items);
                });

            } else {
                socket.emit("err", { message: "Sorry, The room is full!" });
            }
        });


        socket.on("broadcast", function(data) {
            socket.broadcast.to(data.room).emit("player2", data);
        });


        socket.on("checkMove", function(data) {
            var status = variation.move(data.id, data.color, game);
            if (status === "legal") {
                // game continues
                io.in(data.room).emit("turnPlayed", { id: data.id, color: data.color });
            } else if (status === "black") {
                // black won
                // emit winning move
                io.in(data.room).emit("turnPlayed", { id: data.id, color: data.color });
                // declare winner
                io.in(data.room).emit("gameOver", { color: "black", player: data.player, room: data.room });

                // from https://github.com/socketio/socket.io/issues/3042
                io.of('/').in(data.room).clients((error, socketIds) => {
                    if (error) throw error;
                    socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(data.room));
                });
            } else if (status === "white") {
                // white won
                // emit winning move
                io.in(data.room).emit("turnPlayed", { id: data.id, color: data.color });
                // declare winner
                io.in(data.room).emit("gameOver", { color: "white", player: data.player, room: data.room });

                // from https://github.com/socketio/socket.io/issues/3042
                io.of('/').in(data.room).clients((error, socketIds) => {
                    if (error) throw error;
                    socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(data.room));
                });
            } else if (status === "tie") {
                // need to figure out what to do here
            } else {
                // illegal move, try again, sends message back to self
                socket.emit("illegalMove", { id: data.id, color: data.color });
            }
        });


        socket.on("message-sent", function(msg) {
            console.log(msg.from);
            io.in(roomId).emit("message-received", { message: msg.message, from: msg.from });
        });


        socket.on("disconnect", function() {
            // do I need to have something here?
            // disconnect from db?
        });
    });
});


// from socket.io documentation
http.listen(3000, function() {
    console.log("listening on *:3000");
});
