var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('jquery')); // sets path for jquery folder
app.use(express.static('styles')); // sets path for styles folder

// loads index.html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// controls what happens when a user connects
io.on('connection', function(socket){
    console.log('a user connected');

    // https://ayushgp.github.io/Tic-Tac-Toe-Socket-IO/
    socket.on('createGame', function(data){
        socket.join('room-' + ++rooms);
        socket.emit('newGame', {name: data.name, room: 'room-'+rooms});
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
