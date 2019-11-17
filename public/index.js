/**
 * javascript
 * used // https://ayushgp.github.io/Tic-Tac-Toe-Socket-IO/ as a guide
 */

(function() {

    var socket = io();
    var player, game;
    var P1;
    var P2;

    var Player = function(name, color) {
        this.name = name;
        this.color = color;
        // this.currentTurn = true;
        // this.movesPlayed = 0;
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
     * Game class
     */
    var Game = function(roomId, boardSize, variation) {
        this.roomId = roomId;
        this.board = [];
        this.moves = 0;
        this.boardSize = boardSize;
        this.turn = "black";
        this.variation = variation;
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
            if (game.turn === color) {
                console.log("clicked with color " + color);
                $(this).removeClass("empty").addClass(color);
                var id = $(this).attr('id');
                socket.emit("checkMove", { player: player.getPlayerName(), color: color, id: id, room: game.getRoomId() });
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

    Game.prototype.getVariation = function() {
        return this.variation;
    };

    Game.prototype.setTurn = function(color) {
        if (color === "white") {
            console.log("black's turn");
            this.turn = "black";
        } else {
            console.log("white's turn");
            this.turn = "white";
        }
    }

    Game.prototype.resetTurn = function(color) {
        this.turn = color;
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
        $("#board").show();
        $("#menu").hide();
        console.log("#new on click - index.js");
        var name = $("#player-name-new").val();
        var dim = $('input[name="board-size"]:checked').val();
        var color = $('input[name="stone-color"]:checked').val();
        var variation = $("#select-variation").val();
        if (!name) {
            alert("Please enter your name.");
            return;
        }
        socket.emit("createGame", { name: name, boardSize: dim, color: color, variation:  variation});
        console.log("createGame emitted by #new on click");
        player = new Player(name, color);
    });


    /**
     *  Join an existing game on the entered roomId. Emit the joinGame event.
     */
    $("#join").on("click", function() {
        console.log("#join on click - index.js");
        var name = $("#player-name-join").val();
        var gameId = $("#select-game").val();
        if (!name || !gameId) {
            console.log("there was a problem");
            alert("Please enter your name and game ID.");
            return;
        }
        $("#board").show();
        $("#menu").hide();
        socket.emit("joinGame", { name: name, room: gameId });
        console.log("joinGame emitted by #join on click");
        player = new Player(name, P2);
    });


    socket.on("updateRooms", function(rooms) {
        console.log(rooms);

        $("#select-game").children().remove();

        let existingOptions = [];
        // $("#select-game").each((index, obj) => {
        //     existingOptions.push($(obj).val());
        // });
        //
        for(let room of rooms) {
            let optionText = room.variation + ": " + room.color + ", " + room.size + "x" + room.size;
            if(!existingOptions.includes(room.room)) {
                $("#select-game").append(new Option(optionText, room.room));
                existingOptions.push(room.room);
            }
        }
    });


    /**
     * New Game created by current client.
     * Update the UI and create new Game var.
     */
    socket.on("newGame", function(data) {
        console.log("newGame - index.js");

        $("#heading").html(data.variation + ": " + player.getPlayerName() + " vs. ???");
        // Create game for player 1
        game = new Game(data.room, data.boardSize, data.variation);
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
        $("#heading").html(game.getVariation() + ": " + player.getPlayerName() + " vs. " + data.player2);
        var color = "white";
        if (player.getPlayerColor() === "white") {
            color = "black";
        }
        socket.emit("broadcast", {
            room: data.room,
            player1: player.getPlayerName(),
            boardSize: game.getBoardSize(),
            color: color,
            variation: game.getVariation()
        });
        alert("You opponent, " + data.player2 + ", has joined!");
    });


    socket.on("player2", function(data) {
        console.log("player2 - index.js");

        //Create game for player 2
        game = new Game(data.room, data.boardSize, data.variation);
        game.createGameBoard(data);
        $("#heading").html(data.variation + ": " + data.player1 + " vs. " + player.getPlayerName());
    });

    socket.on("turnPlayed", function(data) {
        $("#"+data.id).removeClass("empty").addClass(data.color);
        game.setTurn(data.color);
    });

    /**
     * If the other player wins or game is tied, this event is received.
     * Notify the user about either scenario and end the game.
     */
    socket.on("gameOver", function(data) {
        // console.log("gameEnd - index.js");
        // game.endGame(data.message);
        // socket.leave(data.room);
        alert("Game Over! " + data.player + " won!");
        $("#board").hide();
        $("#menu").show();
        $("#heading").html("Play Go");
    });

    socket.on("illegalMove", function(data) {
        $("#"+data.id).removeClass(data.color).addClass("empty");
        game.resetTurn(data.color);
        alert("That was an illegal move, please try again!");
    });

    /**
     * End the game on any err event
     */
    socket.on("err", function(data) {
        console.log("err - index.js");
        $("#board").hide();
        $("#menu").show();
        alert("Sorry, that game is full, please enter another ID!");
    });

})();
