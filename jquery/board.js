$(document).ready(function(){

    // generates the board
    $('#board').ready(function() {
        var dim = 9; // the dimension of the board
        var board = $('<svg class="board" width="100%" height="100%" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg"/>'); // means html will be appended in a div
        var start = 6; // the percentage padding that svg needs to not cut off nodes
        var end = 94; // same percentage that needs to be added
        var gap = (end-start)/(dim-1); // establishes the space between the nodes
        var radius = 4.5; // the radius of the circles
        var id = 0;
        var clickCount = 0;

        // adds lines first so that they are always behind the nodes
        for(var i = 0; i < dim; i++) {
            board.append('<line x1="'+ (start+gap*i) +'" y1="'+ (start) +'" x2="'+ (start+gap*i) +'" y2="'+ (end) +'" />'); // vertical lines
            board.append('<line x1="'+ (start) +'" y1="'+ (start+gap*i) +'" x2="'+ (end) +'" y2="'+ (start+gap*i) +'" />'); // horizontal lines
        }

        for(var i = 0; i < dim; i++) { // x
            for(var j = 0; j < dim; j++) { // y
                // console.log("i: " + i);
                // console.log("j: " + j);
                board.append('<circle id="'+ id +'" class="empty" cx="'+ (start+gap*j) +'" cy="'+ (start+gap*i) +'" r="'+ (radius) +'"/>');

                $(document).on('click', '#'+id, function() {
                    if (clickCount % 2 == 0) {
                        $(this).removeClass('empty').addClass('black');
                    } else {
                        $(this).removeClass('empty').addClass('white');
                    }
                    clickCount++;
                });

                id++;
            }
        }
        $('#board').append(board);
        $("body").html($("body").html()); // workaround for appending svg
    });


});
