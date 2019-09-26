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
    // Player.prototype.updateMovesPlayed = function(tileValue) {
    //     this.movesPlayed += tileValue;
    // }

    Player.prototype.getMovesPlayed = function() {
        return this.movesPlayed;
    }

    /**
     * Set the currentTurn for player to turn and update UI to reflect the same.
     */
    Player.prototype.setCurrentTurn = function(turn) {
        this.currentTurn = turn;
        if(turn){
            $('#turn').text('Your turn.');
        }
        else{
            $('#turn').text('Waiting for Opponent');
        }
    }

    Player.prototype.getPlayerName = function() {
        return this.name;
    }

    Player.prototype.getPlayerColor = function() {
        return this.color;
    }

    /**
     * Returns currentTurn to determine if it is the player's turn.
     */
    Player.prototype.getCurrentTurn = function() {
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
        createBoard(this.boardSize);
      // for(var i=0; i<3; i++) {
      //   this.board.push(['','','']);
      //   for(var j=0; j<3; j++) {
      //     $('#button_' + i + '' + j).on('click', function(){
      //       if(!player.getCurrentTurn()){
      //         alert('Its not your turn!');
      //         return;
      //       }
      //
      //       if($(this).prop('disabled'))
      //         alert('This tile has already been played on!');
      //
      //       var row = parseInt(this.id.split('_')[1][0]);
      //       var col = parseInt(this.id.split('_')[1][1]);
      //
      //       //Update board after your turn.
      //       game.playTurn(this);
      //       game.updateBoard(player.getPlayerType(), row, col, this.id);
      //
      //       player.setCurrentTurn(false);
      //       player.updateMovesPlayed(1 << (row * 3 + col));
      //
      //       game.checkWinner();
      //       return false;
      //     });
      //   }
      // }
    }

    /**
     * Remove the menu from DOM, display the gameboard and greet the player.
     */
    Game.prototype.displayBoard = function(message){
        $('.menu').css('display', 'none');
        $('.gameBoard').css('display', 'block');
        $('#userHello').html(message);
        this.createGameBoard();
    }

    /**
     * Update game board UI
     */
    Game.prototype.updateBoard = function(type, row, col, tile){
        $('#'+tile).text(type);
        $('#'+tile).prop('disabled', true);
        this.board[row][col] = type;
        this.moves ++;
    }

    Game.prototype.getRoomId = function(){
        return this.roomId;
    }

    /**
     * Send an update to the opponent to update their UI.
     */
    Game.prototype.playTurn = function(tile){
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
        var message = player.getPlayerName() + ' wins!';
        socket.emit('gameEnded', {room: this.getRoomId(), message: message});
        alert(message);
        location.reload();
    }

    /**
     * End the game if the other player won.
     */
    Game.prototype.endGame = function(message) {
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
        var name = $('#player-name-new').val();
        var dim = $('input[name="board-size"]:checked').val();
        var color = $('input[name="stone-color"]:checked').val();
        if(!name){
            alert('Please enter your name.');
            return;
        }
        socket.emit('createGame', {name: name, boardSize: dim, stoneColor: color});
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
})();
