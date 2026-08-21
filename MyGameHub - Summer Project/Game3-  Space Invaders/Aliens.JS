// board
let tileSize = 32;
let rows = 16;
let columns = 16;
let board;
// 32 x 16
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;
// ship
let shipWidth = tileSize * 3;
let shipHeight = tileSize * 2;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;
let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
};
// ship image
let shipImage = new Image();
let shipVelocityX = tileSize; // ship moving speed
shipImage.onload = function () {
    draw();
};
shipImage.src = "images/Galaxy.png";
// alien
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;
let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; // number of aliens to defeat
let alienVelocityX = 1; // alien moving speed
// bullets
let bulletArray = [];
let bulletVelocityY = -10; // bullet moving speed
// score
let score = 0;
let gameOver = false;
// start game
window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");
    draw();
    alienImg = new Image();
    alienImg.src = "images/Spaceship.png";
    createAliens();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
};
// draw everything
function draw() {
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(
        shipImage,
        ship.x,
        ship.y,
        ship.width,
        ship.height
    );
}
// update
function update() {
    requestAnimationFrame(update);
    // Game Over
    if (gameOver) {
        context.fillStyle = "white";
        context.font = "40px 'Courier New', Courier, monospace";
        context.textAlign = "center";
        context.fillText("GAME OVER", board.width / 2, board.height / 2);
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(
        shipImage,
        ship.x,
        ship.y,
        ship.width,
        ship.height
    );
    // aliens
    for(let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if(alien.alive){
            alien.x += alienVelocityX;
            // if alien touches the borders
            if (alien.x + alien.width >= boardWidth || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;
                // move aliens down by 1 row
                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
            if (alien.y >= ship.y) {
                gameOver = true;
            }
        }
    }
    // bullet
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        // bullet collision with aliens
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }
    // clear the bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift(); // removes the first bullet from the array
    }
    // next level
    if (alienCount == 0) {
        // increase the number of aliens in columns and rows by 1
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2);
        alienRows = Math.min(alienRows + 1, rows - 4);
        alienVelocityX += 0.2; // increases the alien movement speed
        alienArray = [];
        bulletArray = [];
        createAliens();
    }
    // score
    context.fillStyle = "white";
    context.font = "16px 'Courier New', Courier, monospace";
    context.fillText(score, 5, 20);
}
// move ship
function moveShip(e) {
    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; // moving left one tile
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= boardWidth) {
        ship.x += shipVelocityX; // moving right one tile
    }
}
// create aliens
function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img: alienImg,
                x: alienX + c * alienWidth,
                y: alienY + r * alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true
            };
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}
function shoot(e) {
    if (gameOver) {
        return;
    }
    if (e.code == "Space") {
        // shoot
        let bullet = {
            x: ship.x + shipWidth * 15 / 32,
            y: ship.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false
        };
        bulletArray.push(bullet);
    }
}
function detectCollision(a, b) {
    return a.x < b.x + b.width && // a's top left corner doesnt reach b's top right corner
           a.x + a.width > b.x && // a's top right corner passes b's top left corner
           a.y < b.y + b.height && // a's top left corner doesnt reach b's bottom left corner
           a.y + a.height > b.y; // a's bottom left corner passes b's top left corner
}