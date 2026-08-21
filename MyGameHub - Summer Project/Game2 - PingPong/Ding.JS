//board 
let board;
let boardwidth = 500;
let boardheight = 500;
let context;

//players
let playerwidth = 10;
let playerheight = 80;

//velocity is the change in position over time
playerVelocityY = 0;

let player1 = {
    // X = Left(-) and Right(+), Y = Up(+) and Down(-)
    x : 10,
    y : boardheight/2,
    width: playerwidth,
    height: playerheight,
    velocityY: playerVelocityY
}

let player2 = {
    x : boardwidth - playerwidth - 10,
    y : boardheight/2,
    width: playerwidth,
    height: playerheight,
    velocityY: playerVelocityY
}

//ball
let ballWidth = 10;
let ballHeight = 10;
let ball = {
    x: boardwidth/2,
    y:boardheight/2,
    width: ballWidth,
    height: ballHeight,
    velocityX: 1,
    velocityY: 2
}

//score
let player1Score = 0;
let player2Score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw intial player1
    context.fillStyle = "#8000B7";
    context.fillRect(player1.x, player1.y, player1.width, playerheight);

    //gameloop
    requestAnimationFrame(update);
    document.addEventListener("keyup", movePlayer)
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.width);

    //player 1
    context.fillStyle = "#8000B7";
    //player1.y += player1.velocityY
    let nextPlayer1Y = player1.y + player1.velocityY;
    if(!outOfBounds(nextPlayer1Y))
        player1.y = nextPlayer1Y;
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    //player2
    context.fillStyle = "#8000B7";
   //player2.y += player2.velocityY
    let nextPlayer2Y = player2.y + player2.velocityY;
    if(!outOfBounds(nextPlayer2Y))
        player2.y = nextPlayer2Y;
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    //ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //if ball touches top or bottom of canvas
    if(ball.y <= 0 || (ball.y + ball.height >= boardheight)) {
        ball.velocityY *= -1 //reverse direction
    }

    //bounce the ball back
    if(detectCollsion(ball, player1)) {
        if(ball.x <= player1.x + playerwidth) {
            // left side of ball touches right side of player1
            ball.velocityX *= -1 //flip x direction
        }
    }
    else if(detectCollsion(ball, player2)) {
        if(ball.x + ballWidth >= player2.x) {
            //right side of ball touches left side if player2
            ball.velocityX *= -1 //flip x direction
        }
    }

    //Game over
    if(ball.x < 0) {
        player2Score++;
        resetGame(1);
    }
    else if(ball.x + ballWidth > boardwidth) {
        player1Score++;
        resetGame(-1);
    }

    //score
    context.font = "45px sans-serif";
    context.fillText(player1Score, boardwidth / 5, 45);
    context.fillText(player2Score, boardwidth * 4 / 5, 45);

// dotted line
for (let i = 10; i < board.height; i += 25) {
    context.fillRect(board.width / 2 - 2.5, i, 5, 5);
}
}

function outOfBounds(yPosition) {
    return(yPosition < 0 || yPosition + playerheight > boardheight)
}

function movePlayer(e) {
    // Player 1 (left paddle)
    if (e.code == "KeyW") {
        player1.velocityY = -3;
    }
    else if (e.code == "KeyS") {
        player1.velocityY = 3;
    }

    // Player 2 (right paddle)
    if (e.code == "ArrowUp") {
        player2.velocityY = -3;
    }
    else if (e.code == "ArrowDown") {
        player2.velocityY = 3;
    }
}

function detectCollsion (a, b) {
    return a.x < b.x + b.width && // a's top left corner doesnt reach b's top right corner
           a.x + b.width > b.x && // a's top right corner passes b's top left corner
           a.y < b.y + b.height && // a's top left corner doesnt reach b's bottom right corner
           a.y + a.height > b.y; // a's bottom left corner doesnt reach b's top left corner
}

function resetGame(direction) {
    ball = {
    x: boardwidth/2,
    y:boardheight/2,
    width: ballWidth,
    height: ballHeight,
    velocityX: direction,
    velocityY: 2
}   
}