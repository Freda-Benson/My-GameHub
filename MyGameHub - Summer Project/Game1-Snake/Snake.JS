function changeColour(colour) {
    localStorage.setItem("snakeColour", colour);
}

function playGame() {
    window.location.href = "Game.html";
}

function quitGame() {
    window.location.href = "Websites.html";
}

function changeColour(colour) {
    localStorage.setItem("snakeColour", colour);

    document.body.style.backgroundColor = colour;
}