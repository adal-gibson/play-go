/**
 * javascript
 * used // https://ayushgp.github.io/Tic-Tac-Toe-Socket-IO/ as a guide
 */

(function() {

    var socket = io();
    var player, game;

    // Types of players
    // probably going to remove this
    var P1 = "white";
    var P2 = "black";

    var Player = function(name, color) {
        this.name = name;
        this.color = color;
        // this.currentTurn = true;
        this.movesPlayed = 0;
    };

    /**
     * Set the bit of the move played by the player
     */
    Player.prototype.updateMovesPlayed = function(tileValue) {
        console.log("updateMovesPlayed - index.js");
        this.movesPlayed += tileValue;
    };

    Player.prototype.getMovesPlayed = function() {
        console.log("getMovesPlayed - index.js");
        return this.movesPlayed;
    };

    Player.prototype.getPlayerName = function() {
        console.log("getPlayerName - index.js");
        return this.name;
    };

    Player.prototype.getPlayerColor = function() {
        console.log("getPlayerColor - index.js");
        return this.color;
    };

    /**
     * Returns currentTurn to determine if it is the player's turn.
     */
    Player.prototype.getCurrentTurn = function() {
        console.log("getCurrentTurn index.js");
        return this.currentTurn;
    };


    Player.prototype.getGame = function() {
        return this.game;
    };

    Player.prototype.setGame = function(game) {
        this.game = game;
    }

    /**
     * Game class
     */
    var Game = function(roomId, boardSize) {
        this.roomId = roomId;
        this.board = [];
        this.moves = 0;
        this.boardSize = boardSize;
        this.turn = "black";
    };

    /**
     * Create the Game board by attaching event listeners to the buttons.
     */
    Game.prototype.createGameBoard = function(data) {
        console.log("createGameBoard called");

        // console.log(JSON.stringify(data, null, 4));

        var color = data.color;
        var dim = data.boardSize; // the dimensions of the board
        var board = $('<svg class="board" width="100%" height="100%" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg"/>'); // means html will be appended in a div
        var start = 8; // the percentage padding that svg needs to not cut off nodes
        var end = 92; // same percentage that needs to be added
        var gap = (end - start) / (dim - 1); // establishes the space between the nodes
        var radius = (end - start) / (dim - 1) / 2 - 0.5; // the radius of the circles
        let id = 0; // id of the first node
        var asciiA = 65;

        // adds lines first so that they are always behind the nodes
        for (var i = 0; i < dim; i++) {
            board.append('<text x="' + 2 + '" y="' + (start + gap * i + gap / 11) + '" font-size="' + gap / 3 + '">' + (dim - i) + " </text>"); // numbers - on left
            board.append('<text x="' + 95 + '" y="' + (start + gap * i + gap / 11) + '" font-size="' + gap / 3 + '">' + (dim - i) + " </text>"); // numbers - on right
            board.append('<text x="' + (start + gap * i - gap / 11) + '" y="' + 5 + '" font-size="' + gap / 3 + '">' + String.fromCharCode(asciiA + i) + " </text>"); // letters - top
            board.append('<text x="' + (start + gap * i - gap / 11) + '" y="' + 98 + '" font-size="' + gap / 3 + '">' + String.fromCharCode(asciiA + i) + " </text>"); // letters - bottom
            board.append('<line x1="' + (start + gap * i) + '" y1="' + start + '" x2="' + (start + gap * i) + '" y2="' + end + '" />'); // vertical lines
            board.append('<line x1="' + start + '" y1="' + (start + gap * i) + '" x2="' + end + '" y2="' + (start + gap * i) + '" />'); // horizontal lines
        }

        for (var i = 0; i < dim; i++) {
            // x
            for (var j = 0; j < dim; j++) {
                // y
                var spaceId = String.fromCharCode(parseFloat(asciiA+j)) + parseFloat(dim-i);
                board.append('<circle id="' + (spaceId) + '" class="empty" cx="' + (start + gap * j) + '" cy="' + (start + gap * i) + '" r="' + radius + '"/>');
            }
        }

        $(document).on("click", ".empty", function() {
            if (game.turn == color) {
                console.log("clicked with color " + color);
                $(this).removeClass("empty").addClass(color);
                var id = $(this).attr('id');
                socket.emit("broadcastTurn", { player: player.getPlayerName(), color: color, id: id, room: game.getRoomId() });
            } else {
                console.log("FALSE");
            }
        });

        $("#board").html(board);
        $("body").html($("body").html()); // workaround for appending svg
    };

    Game.prototype.getRoomId = function() {
        console.log("getRoomId - index.js");
        return this.roomId;
    };

    Game.prototype.getBoardSize = function() {
        return this.boardSize;
    };

    Game.prototype.setTurn = function(color) {
        if (color === "white") {
            this.turn = "black";
        } else {
            this.turn = "white";
        }
    }

    /**
     * Announce the winner if the current client has won.
     * Broadcast this on the room to let the opponent know.
     */
    Game.prototype.announceWinner = function() {
        console.log("announceWinner - index.js");
        // var message = player.getPlayerName() + " wins!";
        // socket.emit("gameEnded", { room: this.getRoomId(), message: message });
        // alert(message);
        // location.reload();
    };

    /**
     * End the game if the other player won.
     */
    Game.prototype.endGame = function(message) {
        console.log("endGame - index.js");
        alert(message);
        location.reload();
    };

    /**
     * Create a new game. Emit newGame event.
     */
    $("#new").on("click", function() {
        console.log("#new on click - index.js");
        var name = $("#player-name-new").val();
        var dim = $('input[name="board-size"]:checked').val();
        var color = $('input[name="stone-color"]:checked').val();
        if (!name) {
            alert("Please enter your name.");
            return;
        }
        socket.emit("createGame", { name: name, boardSize: dim, color: color });
        console.log("createGame emitted by #new on click");
        player = new Player(name, color);
    });

    /**
     *  Join an existing game on the entered roomId. Emit the joinGame event.
     */
    $("#join").on("click", function() {
        console.log("#join on click - index.js");
        var name = $("#player-name-join").val();
        var gameId = $("#game-id").val();
        if (!name || !gameId) {
            console.log("there was a problem");
            alert("Please enter your name and game ID.");
            return;
        }
        socket.emit("joinGame", { name: name, room: gameId });
        console.log("joinGame emitted by #join on click");
        player = new Player(name, P2);
    });

    /**
     * New Game created by current client.
     * Update the UI and create new Game var.
     */
    socket.on("newGame", function(data) {
        console.log("newGame - index.js");
        var message = "Hello, " + data.name + ". Please ask your friend to enter Game ID: " + data.room + ". Waiting for player 2...";

        $("#heading").html(data.room);
        // Create game for player 1
        game = new Game(data.room, data.boardSize);
        game.createGameBoard({
            name: data.name,
            boardSize: data.boardSize,
            color: data.color,
            room: data.room
        });
    });


    /**
     * This event is received when opponent connects to the room.
     */
    socket.on("player1", function(data) {
        console.log("player1 - index.js");
        $("#heading").html("room: " + data.room + ", player1: " + player.getPlayerName() + ", player2: " + data.player2);
        var color = "white";
        if (player.getPlayerColor() === "white") {
            color = "black";
        }
        socket.emit("broadcast", {
            room: data.room,
            player1: player.getPlayerName(),
            boardSize: game.getBoardSize(),
            color: color
        });
    });


    socket.on("player2", function(data) {
        console.log("player2 - index.js");
        // var message = "Hello, " + data.player2Name;

        //Create game for player 2
        game = new Game(data.room, data.boardSize);
        game.createGameBoard(data);
        $("#heading").html("room: " + data.room + ", player1: " + data.player1 + ", player2: " + player.getPlayerName());
    });

    socket.on("getMove", function(data) {
        console.log("getMove");
        $("#"+data.id).removeClass("empty").addClass(data.color);
    });


    socket.on("turnPlayed", function(data) {
        console.log("turnPlayed - index.js");
        game.setTurn();
    });

    /**
     * If the other player wins or game is tied, this event is received.
     * Notify the user about either scenario and end the game.
     */
    socket.on("gameEnd", function(data) {
        console.log("gameEnd - index.js");
        game.endGame(data.message);
        socket.leave(data.room);
    });

    /**
     * End the game on any err event
     */
    socket.on("err", function(data) {
        console.log("err - index.js");
        // game.endGame(data.message);
    });

})();
