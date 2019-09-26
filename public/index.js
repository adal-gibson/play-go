/**
 * handles events, manages game rooms
 * used // https://ayushgp.github.io/Tic-Tac-Toe-Socket-IO/ as a reference
 */

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.use(express.static('server'));

let rooms = 0;

// loads index.html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// controls what happens when a user connects
io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('createGame', function(data){
        socket.join('game-' + ++rooms);
        socket.emit('newGame', {name: data.name, room: data.room, boardSize: data.boardSize, stoneColor: data.stoneColor});
    });

    socket.on('joinGame', function(data){
        var room = io.nsps['/'].adapter.rooms[data.room];
        if( room && room.length == 1){
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('player1', {});
            socket.emit('player2', {name: data.name, room: data.room });
        }
        else {
            socket.emit('err', {message: 'Sorry, The room is full!'});
        }
    });

    socket.on('playTurn', function(data){
        socket.broadcast.to(data.room).emit('turnPlayed', {
            node: data.node,
            room: data.room
        });
    });

    socket.on('gameEnded', function(data){
        socket.broadcast.to(data.room).emit('gameEnd', data);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});


// from socket.io documentation
http.listen(3000, function(){
    console.log('listening on *:3000');
});
