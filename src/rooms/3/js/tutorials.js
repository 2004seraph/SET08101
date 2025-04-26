/**
 * tutorials.js - Rebekka Burgi 40716597 - Group 7 - SET08101 Web Technologies
 * 
 * This script handles the two different text tutorials for escape room 3
 * It includes the creation of the tutorial window and the two separate tutorials for the main game and the mini game.
 */

const tutorialButton = document.getElementById("tutorial-button");

const tutorialWindow = document.createElement("div");
tutorialWindow.classList.add("pop-up");
tutorialWindow.id = "tutorial-window";
tutorialWindow.innerHTML = `
    <button class="close">x</button>
    <p id="tutorial-text"></p>`;

gameWindow.appendChild(tutorialWindow);
const tutorialText = document.getElementById("tutorial-text");



tutorialButton.addEventListener("click", () => {
    displayTutorial();
})

function displayTutorial() {
    if (miniGameWindow.style.visibility === "visible") {
        tutorialText.innerHTML = `
        In this sliding puzzle, dragging works a little differently! <br>
        Click on a tile to select it. <br>
        It will follow your mouse along its allowed path. <br>
        When you're ready to place it click it again. <br>
        Vertical tiles move up and down, and horizontal tiles move side to side. <br>
        `;
    } else {
        tutorialText.innerHTML = `
        There are items hidden which can help you find the key to the door and escape. <br>
        You can add those items to your inventory by clicking. <br>
        Once in your inventory, you can click on any item again to see more details. <br>
        You can remove items from your inventory by dragging them back into the room. <br>
        You cannot move items that are in the room! If you want to move an item that you placed you have to pick it up again and re-place it. <br>
        You can pause the game at any time, which will pause the timer and hide the game state. <br>
        If you are stuck you can use the Hint button to get that inner monologue going. <br>
        You can re-view this tutorial any time by clicking the Tutorial button.
        `;
    }

    tutorialWindow.style.visibility = "visible";
}