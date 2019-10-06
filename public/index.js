/**
 * handles game logic
 * used // https://ayushgp.github.io/Tic-Tac-Toe-Socket-IO/ as a guide
 */

// var express = require("express");
// var app = express();
// var http = require("http").createServer(app);
// var io = require("socket.io")(http);

(function() {
  // Types of players
  var P1 = "white",
    P2 = "black";

  var Player = function(name, color) {
    this.name = name;
    this.color = color;
    this.currentTurn = true;
    this.movesPlayed = 0;
  };

  /**
   * Set the bit of the move played by the player
   */
  Player.prototype.updateMovesPlayed = function(tileValue) {
    console.log("updateMovesPlayed - main.js");
    this.movesPlayed += tileValue;
  };

  Player.prototype.getMovesPlayed = function() {
    console.log("getMovesPlayed - main.js");
    return this.movesPlayed;
  };

  /**
   * Set the currentTurn for player to turn and update UI to reflect the same.
   */
  Player.prototype.setCurrentTurn = function(turn) {
    console.log("setCurrentTurn - main.js");
    this.currentTurn = turn;
    if (turn) {
      $("#turn").text("Your turn.");
    } else {
      $("#turn").text("Waiting for Opponent");
    }
  };

  Player.prototype.getPlayerName = function() {
    console.log("getPlayerName - main.js");
    return this.name;
  };

  Player.prototype.getPlayerColor = function() {
    console.log("getPlayerColor - main.js");
    return this.color;
  };

  /**
   * Returns currentTurn to determine if it is the player's turn.
   */
  Player.prototype.getCurrentTurn = function() {
    console.log("getCurrentTurn main.js");
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
  };

  /**
   * Create the Game board by attaching event listeners to the buttons.
   */
  Game.prototype.createGameBoard = function(data) {
    console.log("createGameBoard called");

    var color = data.color;
    var dim = data.boardSize; // the dimensions of the board
    // console.log("dim: " + dim);
    var board = $(
      '<svg class="board" width="100%" height="100%" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg"/>'
    ); // means html will be appended in a div
    var start = 8; // the percentage padding that svg needs to not cut off nodes
    var end = 92; // same percentage that needs to be added
    var gap = (end - start) / (dim - 1); // establishes the space between the nodes
    var radius = (end - start) / (dim - 1) / 2 - 0.5; // the radius of the circles
    let id = 0; // id of the first node
    var asciiA = 65;

    // adds lines first so that they are always behind the nodes
    for (var i = 0; i < dim; i++) {
      board.append(
        '<text x="' + 2 + '" y="' + (start + gap * i + gap / 11) + '" font-size="' + gap / 3 + '">' + (dim - i) + " </text>"
      ); // numbers - on left
      board.append(
        '<text x="' + 95 + '" y="' + (start + gap * i + gap / 11) + '" font-size="' + gap / 3 + '">' + (dim - i) + " </text>"
      ); // numbers - on right
      board.append(
        '<text x="' + (start + gap * i - gap / 11) + '" y="' + 5 + '" font-size="' + gap / 3 + '">' + String.fromCharCode(asciiA + i) + " </text>"
      ); // letters - top
      board.append(
        '<text x="' + (start + gap * i - gap / 11) + '" y="' + 98 + '" font-size="' + gap / 3 + '">' + String.fromCharCode(asciiA + i) + " </text>"
      ); // letters - bottom
      board.append(
        '<line x1="' + (start + gap * i) + '" y1="' + start + '" x2="' + (start + gap * i) + '" y2="' + end + '" />'
      ); // vertical lines
      board.append(
        '<line x1="' + start + '" y1="' + (start + gap * i) + '" x2="' + end + '" y2="' + (start + gap * i) + '" />'
      ); // horizontal lines
    }

    for (var i = 0; i < dim; i++) {
      // x
      for (var j = 0; j < dim; j++) {
        // y
        board.append(
          '<circle id="' + (id++) + '" class="empty" cx="' + (start + gap * j) + '" cy="' + (start + gap * i) + '" r="' + radius + '"/>'
        );
      }
    }

    $(document).on("click", ".empty", function() {
      console.log("clicked with color " + color);
      // console.log(this);
      $(this)
        .removeClass("empty")
        .addClass(color);
      // console.log(this);

      socket.emit("playTurn", {});
      return false; // was supposed to help but didn't
    });

    $("#board").html(board);
    $("body").html($("body").html()); // workaround for appending svg
  };

  Game.prototype.displayBoard = function(message, data) {
    console.log("displayBoard - main.js");
    // $('.menu').css('display', 'none');
    // $('.gameBoard').css('display', 'block');
    // $('#userHello').html(message);
    // console.log(data.room);
    $("#heading").html(data.room);
    this.createGameBoard({ boardSize: data.boardSize, color: data.color });
  };

  /**
   * Update game board UI
   */
  Game.prototype.updateBoard = function(type, row, col, tile) {
    console.log("updateBoard - main.js");
    // $('#'+tile).text(type);
    // $('#'+tile).prop('disabled', true);
    // this.board[row][col] = type;
    this.moves++;
  };

  Game.prototype.getRoomId = function() {
    console.log("getRoomId - main.js");
    return this.roomId;
  };

  /**
   * Send an update to the opponent to update their UI.
   */
  Game.prototype.playTurn = function(tile) {
    console.log("playTurn - main.js");
    var clickedTile = $(tile).attr("id");
    var turnObj = {
      tile: clickedTile,
      room: this.getRoomId()
    };
    // Emit an event to update other player that you've played your turn.
    socket.emit("playTurn", turnObj);
  };

  /**
   * Announce the winner if the current client has won.
   * Broadcast this on the room to let the opponent know.
   */
  Game.prototype.announceWinner = function() {
    console.log("announceWinner - main.js");
    var message = player.getPlayerName() + " wins!";
    socket.emit("gameEnded", { room: this.getRoomId(), message: message });
    alert(message);
    location.reload();
  };

  /**
   * End the game if the other player won.
   */
  Game.prototype.endGame = function(message) {
    console.log("endGame - main.js");
    alert(message);
    location.reload();
  };

  // var socket = io.connect('http://localhost:3000'),
  //     player,
  //     game;

  var socket = io.connect();
  var player, game;

  /**
   * Create a new game. Emit newGame event.
   */
  $("#new").on("click", function() {
    console.log("#new on click - main.js");
    var name = $("#player-name-new").val();
    // console.log("name: " + name);
    var dim = $('input[name="board-size"]:checked').val();
    // console.log("dim: " + dim);
    var color = $('input[name="stone-color"]:checked').val();
    // console.log("color: " + color);
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
    console.log("#join on click - main.js");
    var name = $("#player-name-join").val();
    var roomID = $("#game-id").val();
    if (!name || !roomID) {
      console.log("there was a problem");
      alert("Please enter your name and game ID.");
      return;
    }
    socket.emit("joinGame", { name: name, room: roomID });
    console.log("joinGame emitted by #join on click")
    player = new Player(name, P2);
  });

  /**
   * New Game created by current client.
   * Update the UI and create new Game var.
   */
  socket.on("newGame", function(data) {
    console.log("newGame - main.js");
    var message =
      "Hello, " +
      data.name +
      ". Please ask your friend to enter Game ID: " +
      data.room +
      ". Waiting for player 2...";

    // Create game for player 1
    game = new Game(data.room);
    game.displayBoard(message, {
      boardSize: data.boardSize,
      color: data.color,
      room: data.room
    });
    console.log("displayBoard called by newGame")
  });


  /**
   * If player creates the game, he'll be P1(X) and has the first turn.
   * This event is received when opponent connects to the room.
   */
  socket.on("player1", function(data) {
    console.log("player1 - main.js");
    console.log("(player1) data: " + JSON.stringify(data, null, 4));
    var message = "Hello, " + player.getPlayerName();
    $("#userHello").html(message);
    // player.setCurrentTurn(true);
  });

  /**
   * Joined the game, so player is P2(O).
   * This event is received when P2 successfully joins the game room.
   */
  socket.on("player2", function(data) {
    console.log("player2 - main.js");
    // console.log("(player2) data: " + JSON.stringify(data, null, 4));
    var message = "Hello, " + data.name;

    //Create game for player 2
    game = new Game(data.room);
    game.displayBoard(message, data);
    console.log("displayBoard called by player2")
    // player.setCurrentTurn(false); need to set turn based on color
  });

  /**
   * Opponent played his turn. Update UI.
   * Allow the current player to play now.
   */
  socket.on("turnPlayed", function(data) {
    console.log("turnPlayed - main.js");
    // var row = data.tile.split('_')[1][0];
    // var col = data.tile.split('_')[1][1];
    var opponentType = player.getPlayerType() == P1 ? P2 : P1;
    // game.updateBoard(opponentType, row, col, data.tile);
    player.setCurrentTurn(true);
  });

  /**
   * If the other player wins or game is tied, this event is received.
   * Notify the user about either scenario and end the game.
   */
  socket.on("gameEnd", function(data) {
    console.log("gameEnd - main.js");
    game.endGame(data.message);
    socket.leave(data.room);
  });

  /**
   * End the game on any err event.
   */
  socket.on("err", function(data) {
    console.log("err - main.js");
    // game.endGame(data.message);
  });


  socket.on("updateList", function() {
    console.log("updateList");

    // $('#selectGame').append("<option>" + "works!" + "</option>");

    // from https://www.w3schools.com/jsref/met_node_appendchild.asp
    // var node = document.createElement("OPTION");
    // var textNode = document.createTextNode("this worked");
    // node.appendChild(textNode);
    // document.getElementById("selectGame").appendChild(node);

    // from https://stackoverflow.com/questions/54430314/iterate-through-rooms-for-a-given-socket
    // Object.keys(socket.rooms).forEach(function(roomName){
    //   $('#selectGame').append("<option>" + roomName + "</option>");
    // });
  });
})();
