/**
 * hints.js - Rebekka Burgi 40716597 - Group 7 - SET08101 Web Technologies
 * 
 * This script handles all hint logic and structure creation.
 * It holds all the different hints, the progress the player has made which changes the hints they receive,
 * and the logic and creation of the pop up which is displayed when clicking the hint button.
 */


const hintButton = document.getElementById("hint-button");

const hints = [
    "Lets look around the room a bit and see if I can find anything to pick up...",
    "Maybe I should keep looking, there has to be something else...",
    "Hmm... Could that riddle in the book be about those five vases?",
    "Maybe pet could mean click? Sure is an odd way to phrase it though...",
    "Maybe I should try clicking them in the order from the riddle, from left to right.",
    "This golden key looks like it would fit into some small box. Probably with a golden lock.",
    "Sun... Heat... Maybe the riddle on that note is talking about a flame? Or well, the lack thereof?",
    "Hmm theres candles over there... And an empty candle holder... The lack of a flame?",
    "Maybe that gray key fits into something pretty close to where I found it...",
    "Hmmm... Knowledge could be referring to other books?",
    "Maybe I should check the book shelf again...",
    "That blue tin looks interesting... If I can get it to the bottom of the board I can pick it up.",
    "Maybe if I throw the tin on the ground it'll open?",
    "I guess placing it on the ground is the next best thing to throwing...",
    "Maybe, just maybe, I should try to use the second gray key to unlock the door..."
]

/*
progress numbers:

start -> 0
when first item picked up -> 1
when 'book' is picked up -> 2
when first 'book' hint is given -> 3
when vase puzzle is failed -> 4
when 'golden key' is picked up -> 5
when 'note' is picked up -> 6
when first 'note' hint is given -> 7
    -> possible split since 'gray key; can be picked up from the start
when 'gray key' is picked up -> 8
when 'another book' is picked up -> 9
when first 'another book' hint is given -> 10
when sliding puzzle is opened -> 11
when 'blue tin' is picked up -> 12
when first 'blue tin' hint is given -> 13
when 'another gray key' is picked up -> 14
*/
let progress = 0;
let splitProgress = null;
let hintSwitched = false;


const hintWindow = document.createElement("div");
hintWindow.classList.add("pop-up");
hintWindow.id = "hint-window";
hintWindow.innerHTML = `
    <button class="close">x</button>
    <p id="hint-text">There's no hint available right now...</p>
    <button id="switch">⟳ </button>
    `;
gameWindow.appendChild(hintWindow);

const hintText = document.getElementById("hint-text");
const switchButton = document.getElementById("switch");

hintButton.addEventListener("click", () => {
    hintSwitched = false;
    if (!paused) {
        hintText.textContent = hints[progress];
        if (splitProgress !== null) {
            switchButton.style.visibility = "visible";
        } else {
            switchButton.style.visibility = "hidden";
            progress = autoProgress(progress);
        }

        hintWindow.style.visibility = "visible";
    }
})

switchButton.addEventListener("click", () => {
    if (hintSwitched) {
        hintText.textContent = hints[progress];
        progress = autoProgress(progress);
        hintSwitched = false;
    } else {
        hintText.textContent = hints[splitProgress];
        splitProgress = autoProgress(splitProgress);
        hintSwitched = true;
    }
})

function autoProgress(currentProgress) {
    if (currentProgress === 2 || currentProgress === 6 || currentProgress === 9 || currentProgress === 12) {
        currentProgress++;
    };
    return currentProgress;
}

function updateProgress(newProgress) {
    if (progress === 0) {
        progress++;
    }

    if (splitProgress !== null) {
        if (newProgress < progress) {
            if (newProgress < 6) {
                splitProgress = newProgress;
            } else {
                splitProgress = null;
            }

        } else {
            progress = newProgress;
        }
    } else {
        if (newProgress === 8 && progress < 6 || newProgress < progress) {
            splitProgress = progress;
        }
        progress = newProgress;
    }

}