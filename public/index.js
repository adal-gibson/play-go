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
    console.log("createGame - index.js");
    socket.name1 = data.name;
    socket.boardSize = data.boardSize;
    socket.color = data.color;

    // console.log("socket: " + JSON.stringify(socket, null, 4));

    // console.log("createGame - index.js");
    // console.log("COLOR: " + data.color);
    var room = "game-" + (++rooms);
    socket.join(room);
    socket.emit("updateList", {});
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
    // console.log("(joinGame) data: " + JSON.stringify(data, null, 4));
    // console.log("(joinGame) socket: " + JSON.stringify(socket, null, 4));
    var room = io.nsps["/"].adapter.rooms[data.room];
    if (room && room.length == 1) {
      // console.log("joinGame successfully emitted");
      socket.emit("updateList", {});
      socket.join(data.room);
      socket.broadcast.to(data.room).emit("player1", {});
      console.log("player1 emitted by joinGame");
      socket.emit("player2", { name: data.name, room: data.room });
      console.log("player2 emitted by joinGame");
      // socket.emit("existingGame", { name: socket.name, color: socket.color, room: data.room });
    } else {
      socket.emit("err", { message: "Sorry, The room is full!" });
    }
  });

  socket.on("playTurn", function(data) {
    console.log("playTurn - index.js");
    socket.broadcast.to(data.room).emit("turnPlayed", {
      node: data.node,
      room: data.room
    });
    console.log("turnPlayed emitted by playTurn");
  });

  socket.on("gameEnded", function(data) {
    console.log("gameEnded - index.js");
    socket.broadcast.to(data.room).emit("gameEnd", data);
    console.log("gameEnd emitted by gameEnded")
  });

  socket.on("disconnect", function() {
    console.log('user disconnected');
  });

  socket.on("updateList", function() {
    console.log("updateList");

    // $('#selectGame').append("<option>" + "works!" + "</option>");

    // from https://www.w3schools.com/jsref/met_node_appendchild.asp
    var node = document.createElement("OPTION");
    var textNode = document.createTextNode("this worked");
    node.appendChild(textNode);
    document.getElementById("selectGame").appendChild(node);

    // from https://stackoverflow.com/questions/54430314/iterate-through-rooms-for-a-given-socket
    // Object.keys(socket.rooms).forEach(function(roomName){
    //   $('#selectGame').append("<option>" + roomName + "</option>");
    // });
  });
});

// from socket.io documentation
http.listen(3000, function() {
  console.log("listening on *:3000");
});
