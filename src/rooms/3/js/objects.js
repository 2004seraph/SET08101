/**
 * objects.js - Rebekka Burgi 40716597 - Group 7 - SET08101 Web Technologies
 * 
 * This script creates and manages objects, which are all things that populate the room. 
 * Items are a type of object that can be stored in the inventory, and have additional information about them that the player can view.
 * The objects are loaded in from the objects.json and items.json files in the data folder.
 */

let allObjects = [];
let allImageElements = [];

// loading objects
fetch("data/objects.json")
    .then(res => res.json())
    .then(objects => {

        objects.forEach(object => {
            object.item = false;
            createObject(object);
        });
    })
    .catch(error => console.log("Error loading objects:", error));

fetch("data/items.json")
    .then(res => res.json())
    .then(items => {

        items.forEach(item => {
            item.item = true;
            item.received = false;
            createObject(item);
        });
    })
    .catch(error => console.log("Error loading items:", error));


// creating objects
function createObject(o) {

    const object = document.createElement("div");
    const objectImg = document.createElement("img");
    objectImg.src = o.img;

    objectImg.onerror = () => console.log("Error loading image.", o.img);

    allImageElements.push(objectImg);

    object.appendChild(objectImg);
    object.style.width = `${o.width}px`;
    object.style.height = `${o.height}px`;
    object.style.left = `${o.left}px`;
    object.style.top = `${o.top}px`;
    object.style.zIndex = o.layer;
    object.classList.add("object");
    object.objectData = o;

    if (o.item) {
        object.classList.add("item");
        object.addEventListener("click", (e) => clickItem(e, object));
        object.addEventListener("mousedown", mousedownItem);
        object.addEventListener("mousemove", mousemoveItem);
        object.addEventListener("mouseup", mouseupItem);
    } else {
        addListeners(object);
        if (o.name.includes("Vase")) {
            addVaseOrder(object);
        }
    }

    allObjects.push(object);

    if (o.top !== null && o.left !== null && o.layer !== null) {
        gameWindow.appendChild(object);
    }
}

function addListeners(o) {
    if (o.objectData.name === "Book Pile") {
        o.addEventListener("click", function bookPileClick() {
            receiveItem("Interesting Book", 2);
            o.removeEventListener("click", bookPileClick);
        });
    }

    if (o.objectData.name === "Empty Candle Holder") {
        o.addEventListener("click", function candleHolderClick() {
            receiveItem("Gray Key", 8);
            changeInfo("Note", "This riddle is hinting at the key I already found in the candle holder..");

            o.removeEventListener("click", candleHolderClick);
        });
    }

}