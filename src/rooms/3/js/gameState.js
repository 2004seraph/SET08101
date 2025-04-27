/**
 * gameState.js - Rebekka Burgi 40716597 - Group 7 - SET08101 Web Technologies
 * 
 * This script handles things related to the current game state.
 * This includes the timer, pause and play button and the game won check.
 */


// timer
let time = 0;
const timer = document.querySelector('#timer p')
let timerInterval = setInterval(updateTimer, 1000);

function updateTimer() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60
    timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    time++;

    if (won) {
        gameWon(minutes, seconds);
        clearInterval(timerInterval);
    }
}


// pause/play/complete
let paused = false;
let won = false;
const pauseWall = document.createElement("div");
const pauseButton = document.querySelector('#pause-button')
const wrapper = document.getElementById("wrapper");

pauseButton.addEventListener("click", pause);

function pause() {
    const welcomeDiv = document.getElementById("welcome");
    if (welcomeDiv) {
        welcomeDiv.remove();
    }

    pauseWall.style.width = `${gameWidth + 20}px`;
    pauseWall.style.height = `${gameHeight + 80}px`;
    pauseWall.style.left = `${gameWindow.offsetLeft - 10}px`;
    pauseWall.style.top = `${gameWindow.offsetTop}px`;
    pauseWall.classList.add("wall");

    if (!won) {
        if (paused) {
            timerInterval = setInterval(updateTimer, 1000);
            pauseButton.textContent = "Pause";

            if (pauseWall) {
                pauseWall.remove()
                tutorialWindow.style.visibility = "hidden";
            }
        } else {
            clearInterval(timerInterval);
            pauseButton.textContent = "Play";

            wrapper.appendChild(pauseWall);
        }
        paused = !paused;
    }
}

function gameWon(m, s) {
    const gameComplete = document.createElement("div");

    gameComplete.style.width = `${gameWidth + 20}px`;
    gameComplete.style.height = `${gameHeight + 80}px`;
    gameComplete.style.left = `${gameWindow.offsetLeft - 10}px`;
    gameComplete.style.top = `${gameWindow.offsetTop}px`;
    gameComplete.classList.add("wall");
    gameComplete.innerHTML = `
        <h1>You escaped!</h1>
        <p>Good Job!</p>
        <p>Escaping the Antique Store's Basement took you ${m} minute(s) and ${s} second(s)!</p>
    `;

    wrapper.appendChild(gameComplete);
}

