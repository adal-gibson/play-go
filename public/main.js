/**
 * handles game logic
 * used // https://ayushgp.github.io/Tic-Tac-Toe-Socket-IO/ as a guide
 */

(function(){

    // Types of players
    var P1 = 'white', P2 = 'black';

    var Player = function(name, color) {
        this.name = name;
        this.color = color;
        this.currentTurn = true;
        this.movesPlayed = 0;
    }

    /**
     * Set the bit of the move played by the player
     */
    Player.prototype.updateMovesPlayed = function(tileValue) {
        this.movesPlayed += tileValue;
    }

    Player.prototype.getMovesPlayed = function() {
        console.log("getMovesPlayed called");
        return this.movesPlayed;
    }

    /**
     * Set the currentTurn for player to turn and update UI to reflect the same.
     */
    Player.prototype.setCurrentTurn = function(turn) {
        console.log("setCurrentTurn called");
        this.currentTurn = turn;
        if(turn){
            $('#turn').text('Your turn.');
        }
        else{
            $('#turn').text('Waiting for Opponent');
        }
    }

    Player.prototype.getPlayerName = function() {
        console.log("getPlayerName called");
        return this.name;
    }

    Player.prototype.getPlayerColor = function() {
        console.log("getPlayerColor called");
        return this.color;
    }

    /**
     * Returns currentTurn to determine if it is the player's turn.
     */
    Player.prototype.getCurrentTurn = function() {
        console.log("getCurrentTurn called");
        return this.currentTurn;
    }


    /**
     * Game class
     */
    var Game = function(roomId, boardSize){
        this.roomId = roomId;
        this.board = [];
        this.moves = 0;
        this.boardSize = boardSize;
    }

    /**
     * Create the Game board by attaching event listeners to the buttons.
     */
    Game.prototype.createGameBoard = function(){
        console.log("createGameBoard called");
    }

    /**
     * Remove the menu from DOM, display the gameboard and greet the player.
     */
    Game.prototype.displayBoard = function(message){
        console.log("displayBoard called");
        $('.menu').css('display', 'none');
        $('.gameBoard').css('display', 'block');
        $('#userHello').html(message);
        this.createGameBoard();
    }

    /**
     * Update game board UI
     */
    Game.prototype.updateBoard = function(type, row, col, tile){
        console.log("updateBoard called");
        $('#'+tile).text(type);
        $('#'+tile).prop('disabled', true);
        this.board[row][col] = type;
        this.moves ++;
    }

    Game.prototype.getRoomId = function(){
        console.log("getRoomId called");
        return this.roomId;
    }

    /**
     * Send an update to the opponent to update their UI.
     */
    Game.prototype.playTurn = function(tile){
        console.log("playTurn called");
        var clickedTile = $(tile).attr('id');
        var turnObj = {
            tile: clickedTile,
            room: this.getRoomId()
        };
        // Emit an event to update other player that you've played your turn.
        socket.emit('playTurn', turnObj);
    }

    /**
     * Announce the winner if the current client has won.
     * Broadcast this on the room to let the opponent know.
     */
    Game.prototype.announceWinner = function(){
        console.log("announceWinner called");
        var message = player.getPlayerName() + ' wins!';
        socket.emit('gameEnded', {room: this.getRoomId(), message: message});
        alert(message);
        location.reload();
    }

    /**
     * End the game if the other player won.
     */
    Game.prototype.endGame = function(message) {
        console.log("endGame called");
        alert(message);
        location.reload();
    }





    var socket = io.connect('http://localhost:3000'),
        player,
        game;

    /**
    * Create a new game. Emit newGame event.
    */
    $('#new').on('click', function(){
        console.log("#new clicked");
        var name = $('#player-name-new').val();
        console.log("name: " + name);
        var dim = $('input[name="board-size"]:checked').val();
        console.log("dim: " + dim);
        var color = $('input[name="stone-color"]:checked').val();
        console.log("color: " + color);
        if(!name){
            alert('Please enter your name.');
            return;
        }
        socket.emit('createGame', {name: name, boardSize: dim, stoneColor: color});
        console.log("createGame should have just been emitted");
        player = new Player(name, P1);
    });

    /**
    *  Join an existing game on the entered roomId. Emit the joinGame event.
    */
    $('#join').on('click', function(){
        var name = $('#player-name-join').val();
        var roomID = $('#room-id').val();
        if(!name || !roomID){
            alert('Please enter your name and game ID.');
            return;
        }
        socket.emit('joinGame', {name: name, room: roomID});
        player = new Player(name, P2);
    });

    /**
     * New Game created by current client.
     * Update the UI and create new Game var.
     */
    socket.on('newGame', function(data){
        console.log("newGame called");
        var message = 'Hello, ' + data.name +
        '. Please ask your friend to enter Game ID: ' +
        data.room + '. Waiting for player 2...';

        // Create game for player 1
        game = new Game(data.room);
        game.displayBoard(message);
    });

    /**
     * If player creates the game, he'll be P1(X) and has the first turn.
     * This event is received when opponent connects to the room.
     */
    socket.on('player1', function(data){
        var message = 'Hello, ' + player.getPlayerName();
        $('#userHello').html(message);
        player.setCurrentTurn(true);
    });

    /**
     * Joined the game, so player is P2(O).
     * This event is received when P2 successfully joins the game room.
     */
    socket.on('player2', function(data){
        var message = 'Hello, ' + data.name;

        //Create game for player 2
        game = new Game(data.room);
        game.displayBoard(message);
        player.setCurrentTurn(false);
    });

    /**
     * Opponent played his turn. Update UI.
     * Allow the current player to play now.
     */
    socket.on('turnPlayed', function(data){
        var row = data.tile.split('_')[1][0];
        var col = data.tile.split('_')[1][1];
        var opponentType = player.getPlayerType() == P1 ? P2 : P1;
        game.updateBoard(opponentType, row, col, data.tile);
        player.setCurrentTurn(true);
    });

    /**
     * If the other player wins or game is tied, this event is received.
     * Notify the user about either scenario and end the game.
     */
    socket.on('gameEnd', function(data){
        game.endGame(data.message);
        socket.leave(data.room);
    });

    /**
     * End the game on any err event.
     */
    socket.on('err', function(data){
        game.endGame(data.message);
    });

})();
