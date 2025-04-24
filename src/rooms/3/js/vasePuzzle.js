/**
 * vasePuzzle.js - Rebekka Burgi 40716597 - Group 7 - SET08101 Web Technologies
 * 
 * This script handles the small integrated vase puzzle.
 * It orders the vases according to the riddle and keeps track of the player's attempts to solve it.
 */

const vasesInOrder = new Array(5).fill(null);

let neededVase = 0;

function addVaseOrder(o) {
    if (o.objectData.name === "Broken Vase") {
        vasesInOrder[0] = o;
    }
    if (o.objectData.name === "Small Vase") {
        vasesInOrder[1] = o;
    }
    if (o.objectData.name === "Crumbling Vase") {
        vasesInOrder[2] = o;
    }
    if (o.objectData.name === "Big Vase") {
        vasesInOrder[3] = o;
    }
    if (o.objectData.name === "Golden Vase") {
        vasesInOrder[4] = o;
    }

    o.addEventListener("click", vaseClick);
}

function vaseClick(e) {
    const currentVase = e.currentTarget;

    if (currentVase === vasesInOrder[neededVase]) {
        neededVase++;

        if (neededVase === vasesInOrder.length) {
            receiveItem("Golden Key", 5);
            vasesInOrder.forEach(vase => {
                vase.removeEventListener("click", vaseClick);
            });
        } else {
        }
    } else {

        neededVase = 0;
        updateProgress(4);
    }
}