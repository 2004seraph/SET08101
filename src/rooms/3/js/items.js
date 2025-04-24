/**
 * items.js - Rebekka Burgi 40716597 - Group 7 - SET08101 Web Technologies
 * 
 * This script handles all logic involving the player interacting with items.
 * This includes the drag and drop function, the item info window, the inventory and interactions between items.
 */

const inventoryWindow = document.querySelector("#inventory");
const inventoryWindowRect = inventoryWindow.getBoundingClientRect();
const inventory = document.querySelectorAll("#inventory .slot");
const slotItemSize = 45;

const itemInfoWindow = document.getElementById("item-info-window");

let currentItem = null;
let difX = 0;
let difY = 0;
let mouseDownTime = null;
let mouseUpTime = null;


// picking up an item or viewing an items info window
function clickItem(e, item) {
    if (mouseUpTime - mouseDownTime < 500) {
        if (item.parentElement == gameWindow) {
            addItemToSlot(item);
        } else if (e.target.closest(".slot")) {
            const itemImg = document.getElementById("item-pic");
            const itemInfo = document.getElementById("item-info");

            itemImg.src = item.objectData.img;
            itemInfo.innerHTML = item.objectData.info;

            itemInfoWindow.style.visibility = "visible";

        } else {
            console.log("Error: Item in unknown location.");
        }
    }
}

// dragging and dropping an item
function mousedownItem(e) {
    e.preventDefault();
    mouseDownTime = Date.now();

    const targetItem = e.target.closest(".item");

    if (targetItem && targetItem.closest(".slot")) {
        currentItem = targetItem;

        currentItem.style.zIndex = "800";

        const currentItemRect = currentItem.getBoundingClientRect();

        difX = e.clientX - currentItemRect.left;
        difY = e.clientY - currentItemRect.top;

    }
}

function mousemoveItem(e) {
    const gameWindowRect = gameWindow.getBoundingClientRect();
    if (currentItem) {
        currentItem.style.width = `${currentItem.objectData.width}px`;
        currentItem.style.height = `${currentItem.objectData.height}px`;
        currentItem.style.position = "absolute";

        const newLeft = e.clientX - difX;
        const newTop = e.clientY - difY;


        const currentItemRect = currentItem.getBoundingClientRect();
        const offsetX = currentItemRect.left - gameWindowRect.left;
        const offsetY = currentItemRect.top - gameWindowRect.top;

        currentItem.style.left = `${offsetX}px`;
        currentItem.style.top = `${offsetY}px`;

        if (currentItem.parentElement !== gameWindow) {
            gameWindow.appendChild(currentItem);
        }

        if (
            newLeft >= gameWindowRect.left &&
            newLeft <= gameWindowRect.right - currentItem.objectData.width
        ) {
            currentItem.style.left = `${newLeft - gameWindowRect.left}px`;
        };

        if (
            newTop >= gameWindowRect.top &&
            (newTop <= gameWindowRect.bottom - currentItem.objectData.height || newTop < currentItemRect.top)
        ) {
            currentItem.style.top = `${newTop - gameWindowRect.top}px`;
        };

        currentItem.objectData.left = parseFloat(currentItem.style.left);
        currentItem.objectData.top = parseFloat(currentItem.style.top);
    }
}

function mouseupItem(e) {
    mouseUpTime = Date.now();
    if (mouseUpTime - mouseDownTime >= 500) {
        if (currentItem) {
            checkForInteractions(currentItem);
        }

    }
    currentItem = null;
}

// adding to inventory
function receiveItem(itemName, newProgress) {
    allObjects.forEach(item => {
        if (item.objectData.name === itemName && !item.objectData.received) {
            item.objectData.received = true;
            updateProgress(newProgress);
            addItemToSlot(item);
        }
    });
}

function addItemToSlot(item) {
    let slot = null;

    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].children.length === 0) {
            slot = inventory[i];
            break;
        }
    }

    if (slot) {

        if (gameWindow.contains(item)) {
            gameWindow.removeChild(item);
        }

        item.style.left = "";
        item.style.top = "";

        if (item.objectData.width > item.objectData.height) {
            item.style.width = `${slotItemSize}px`;
            item.style.height = `${item.objectData.height * slotItemSize / item.objectData.width}px`;
        } else if (item.objectData.height > item.objectData.width) {
            item.style.height = `${slotItemSize}px`;
            item.style.width = `${item.objectData.width * slotItemSize / item.objectData.height}px`;
        } else {
            item.style.width = `${slotItemSize}px`;
            item.style.height = `${slotItemSize}px`;
        }

        slot.appendChild(item);
        if (item.objectData.name === "Box" && progress === 0) {
            updateProgress(1);
        }

    } else {
        alert("Inventory full!")
    }
}

// item interaction
function checkForInteractions(item) {
    if (item.objectData.name === "Golden Key") {
        allObjects.forEach(target => {
            if (target.objectData.name === "Box") {
                if (overlap(item, target)) {
                    receiveItem("Note", 6);
                    changeInfo("Box", "The box is unlocked and empty now.");
                }
            }
        })
    }

    if (item.objectData.name === "Gray Key") {
        allObjects.forEach(target => {
            if (target.objectData.name === "Door") {
                if (overlap(item, target)) {
                    changeInfo("Gray Key", "Hmmm it does not fit the door... What else could it be for?");
                }
            }
            if (target.objectData.name === "Chest") {
                if (overlap(item, target)) {
                    receiveItem("Another Book", 9);
                    changeInfo("Gray Key", "The key to the big chest in the corner.");
                    allObjects.forEach(o => {
                        if (o.objectData.name === "Shelf") {
                            o.addEventListener("click", function shelfClick() {
                                updateProgress(11);
                                miniGameWindow.style.visibility = "visible";
                                displayTutorial();
                            });
                        }
                    })
                }
            }
        })
    }



    if (item.objectData.name === "Blue Tin") {
        if (overlap(item, gameWindow)) {
            receiveItem("Another Gray Key", 14);
        } else {
        }

    }

    if (item.objectData.name === "Another Gray Key") {
        allObjects.forEach(target => {
            if (target.objectData.name === "Door") {
                if (overlap(item, target)) {
                    won = true;
                }
            }
        })
    }
}

function overlap(item, target) {
    const itemTop = item.objectData.top;
    const itemBottom = itemTop + item.objectData.height;
    const itemLeft = item.objectData.left;
    const itemRight = itemLeft + item.objectData.width;


    let targetTop = null;
    let targetBottom = null;
    let targetLeft = null;
    let targetRight = null;

    if (target.classList.contains("object")) {
        targetTop = target.objectData.top;
        targetBottom = targetTop + target.objectData.height;
        targetLeft = target.objectData.left;
        targetRight = targetLeft + target.objectData.width;
    } else {
        targetTop = 0;
        targetBottom = gameHeight;
        targetLeft = 0;
        targetRight = gameWidth;
    }


    const verticalOverlap =
        (itemTop > targetTop && itemTop < targetBottom) ||
        (itemBottom > targetTop && itemBottom < targetBottom);

    const horizontalOverlap =
        (itemLeft > targetLeft && itemLeft < targetRight) ||
        (itemRight > targetLeft && itemRight < targetRight);

    return verticalOverlap && horizontalOverlap;
}

// changing item info
function changeInfo(itemName, newInfo) {
    allObjects.forEach(item => {
        if (item.objectData.name === itemName) {
            item.objectData.info = newInfo;
        }
    });
}