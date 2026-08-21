// =========================
// GAME SETTINGS
// =========================

var blockSize = 25;
var rows = 20;
var cols = 20;

var board;
var context;


// =========================
// SNAKE
// =========================

var snake = [
    [100, 100]
];

var velocityX = 0;
var velocityY = 0;


// =========================
// FOOD
// =========================

var foodX;
var foodY;


// =========================
// GAME
// =========================

var gameOver = false;


// Get the colour chosen on the Home page
var snakeColour = localStorage.getItem("snakeColour") || "green";


// =========================
// START GAME
// =========================

window.onload = function () {

    board = document.getElementById("board");

    board.width = cols * blockSize;
    board.height = rows * blockSize;

    context = board.getContext("2d");

    placeFood();

    document.addEventListener("keyup", changeDirection);

    setInterval(update, 100);
};


// =========================
// UPDATE GAME
// =========================

function update() {

    if (gameOver) {
        return;
    }

    // Work out where the head will move
    var newHeadX = snake[0][0] + velocityX * blockSize;
    var newHeadY = snake[0][1] + velocityY * blockSize;

    // Check if the new position is food
    var eatingFood = (newHeadX == foodX && newHeadY == foodY);

    // If eating food, remember the tail
    if (eatingFood) {
        var tail = snake[snake.length - 1];
        snake.push([tail[0], tail[1]]);
    }

    // Move the body
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i][0] = snake[i - 1][0];
        snake[i][1] = snake[i - 1][1];
    }

    // Move the head
    snake[0][0] = newHeadX;
    snake[0][1] = newHeadY;

    // If food was eaten, create new food
    if (eatingFood) {
        placeFood();
    }

    // Draw black background
    context.fillStyle = "black";
    context.fillRect(
        0,
        0,
        board.width,
        board.height
    );

    // Draw snake
    context.fillStyle = snakeColour;

    for (let i = 0; i < snake.length; i++) {
        context.fillRect(
            snake[i][0],
            snake[i][1],
            blockSize,
            blockSize
        );
    }

    // Draw food
    context.fillStyle = "red";
    context.fillRect(
        foodX,
        foodY,
        blockSize,
        blockSize
    );

    // Check Game Over
    checkGameOver();
}


// =========================
// FOOD
// =========================

function placeFood() {

    foodX = Math.floor(Math.random() * cols) * blockSize;

    foodY = Math.floor(Math.random() * rows) * blockSize;
}


// =========================
// CONTROLS
// =========================

function changeDirection(e) {

    if (e.code == "ArrowUp" && velocityY != 1) {

        velocityX = 0;
        velocityY = -1;
    }

    else if (e.code == "ArrowDown" && velocityY != -1) {

        velocityX = 0;
        velocityY = 1;
    }

    else if (e.code == "ArrowLeft" && velocityX != 1) {

        velocityX = -1;
        velocityY = 0;
    }

    else if (e.code == "ArrowRight" && velocityX != -1) {

        velocityX = 1;
        velocityY = 0;
    }
}


// =========================
// GAME OVER
// =========================

function checkGameOver() {

    // Hit the walls
    if (
        snake[0][0] < 0 ||
        snake[0][0] >= board.width ||
        snake[0][1] < 0 ||
        snake[0][1] >= board.height
    ) {

        gameOver = true;

        alert("Game Over!");
    }


    // Hit yourself
    for (let i = 1; i < snake.length; i++) {

        if (
            snake[0][0] == snake[i][0] &&
            snake[0][1] == snake[i][1]
        ) {

            gameOver = true;

            alert("Game Over!");
        }
    }
}