/**
 * generates the game board
 */


function createBoard(dim) {
    var board = $('<svg class="board" width="100%" height="100%" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg"/>'); // means html will be appended in a div
    var start = 8; // the percentage padding that svg needs to not cut off nodes
    var end = 92; // same percentage that needs to be added
    var gap = (end-start)/(dim-1); // establishes the space between the nodes
    var radius = ((end-start)/(dim-1))/2-0.5; // the radius of the circles
    var id = 0; // id of the first node
    var clickCount = 0; // SUPER HACKY - GOTTA GET RID OF THIS
    var asciiA = 65;

    // adds lines first so that they are always behind the nodes
    for(var i = 0; i < dim; i++) {
        board.append('<text x="'+ 2 +'" y="'+ (start+(gap*(i))+(gap/11)) +'" font-size="'+ gap/3 +'">'+ (dim-i) +' </text>') // numbers - on left
        board.append('<text x="'+ 95 +'" y="'+ (start+(gap*(i))+(gap/11)) +'" font-size="'+ gap/3 +'">'+ (dim-i) +' </text>') // numbers - on right
        board.append('<text x="'+ (start+(gap*(i))-(gap/11)) +'" y="'+ 5 +'" font-size="'+ gap/3 +'">'+ String.fromCharCode(asciiA + i) +' </text>') // letters - top
        board.append('<text x="'+ (start+(gap*(i))-(gap/11)) +'" y="'+ 98 +'" font-size="'+ gap/3 +'">'+ String.fromCharCode(asciiA + i) +' </text>') // letters - bottom
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
}

// $(document).ready(function(){
//
//     // generates the board
//     $('#board').ready(function() {
//         var dim = 9; // the dimensions of the board
//         var board = $('<svg class="board" width="100%" height="100%" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg"/>'); // means html will be appended in a div
//         var start = 8; // the percentage padding that svg needs to not cut off nodes
//         var end = 92; // same percentage that needs to be added
//         var gap = (end-start)/(dim-1); // establishes the space between the nodes
//         var radius = ((end-start)/(dim-1))/2-0.5; // the radius of the circles
//         var id = 0; // id of the first node
//         var clickCount = 0; // SUPER HACKY - GOTTA GET RID OF THIS
//         var asciiA = 65;
//
//         // adds lines first so that they are always behind the nodes
//         for(var i = 0; i < dim; i++) {
//             board.append('<text x="'+ 2 +'" y="'+ (start+(gap*(i))+(gap/11)) +'" font-size="'+ gap/3 +'">'+ (dim-i) +' </text>') // numbers - on left
//             board.append('<text x="'+ 95 +'" y="'+ (start+(gap*(i))+(gap/11)) +'" font-size="'+ gap/3 +'">'+ (dim-i) +' </text>') // numbers - on right
//             board.append('<text x="'+ (start+(gap*(i))-(gap/11)) +'" y="'+ 5 +'" font-size="'+ gap/3 +'">'+ String.fromCharCode(asciiA + i) +' </text>') // letters - top
//             board.append('<text x="'+ (start+(gap*(i))-(gap/11)) +'" y="'+ 98 +'" font-size="'+ gap/3 +'">'+ String.fromCharCode(asciiA + i) +' </text>') // letters - bottom
//             board.append('<line x1="'+ (start+gap*i) +'" y1="'+ (start) +'" x2="'+ (start+gap*i) +'" y2="'+ (end) +'" />'); // vertical lines
//             board.append('<line x1="'+ (start) +'" y1="'+ (start+gap*i) +'" x2="'+ (end) +'" y2="'+ (start+gap*i) +'" />'); // horizontal lines
//         }
//
//         for(var i = 0; i < dim; i++) { // x
//             for(var j = 0; j < dim; j++) { // y
//                 // console.log("i: " + i);
//                 // console.log("j: " + j);
//                 board.append('<circle id="'+ id +'" class="empty" cx="'+ (start+gap*j) +'" cy="'+ (start+gap*i) +'" r="'+ (radius) +'"/>');
//
//                 $(document).on('click', '#'+id, function() {
//                     if (clickCount % 2 == 0) {
//                         $(this).removeClass('empty').addClass('black');
//                     } else {
//                         $(this).removeClass('empty').addClass('white');
//                     }
//                     clickCount++;
//                 });
//
//                 id++;
//             }
//         }
//         $('#board').append(board);
//         $("body").html($("body").html()); // workaround for appending svg
//     });
// });
