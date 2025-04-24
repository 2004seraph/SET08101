/**
 * main.js - Rebekka Burgi 40716597 - Group 7 - SET08101 Web Technologies
 * 
 * This script creates a load and start screen, ensures that all images are loaded before the player can start the game,
 * and assigns event listeners to all close buttons.
 */


const welcomeDiv = document.createElement("div");
welcomeDiv.id = "welcome";
welcomeDiv.innerHTML = `
        <p>Loading...</p>
    `;
const imgs = allImageElements.length;
let imgsLoaded = 0;

pause();
pauseButton.disabled = true;
gameWindow.appendChild(welcomeDiv);
displayTutorial();

window.onload = function () {
    imgsLoadedCheck();
}

function imgsLoadedCheck() {
    if (imgsLoaded === imgs) {
        allLoaded();
    } else {
        imgsLoaded = 0;

        allImageElements.forEach(img => {
            img.onload = () => {
                imgsLoaded++;
            }

        });

        setTimeout(() => {
            imgsLoadedCheck();
        }, 100);

    }
}

function allLoaded() {
    welcomeDiv.innerHTML = `
        <p>Welcome to this escape room!</p>
        <p>Press Play to start!</p>
    `;
    pauseButton.disabled = false;
}

const closeButtons = document.querySelectorAll(".close");

closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        button.parentElement.style.visibility = "hidden";
    });
});