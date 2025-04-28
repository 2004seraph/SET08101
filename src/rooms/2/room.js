"use strict";

class Room {
//What happends when you use the dial 
  static useItem(item, withObject) {
    if (item.dataset.gameItem === "signalDial") {
      window.actionLog.push("Looks like this fits into the signal console.");
    } else {
      window.actionLog.push("Not sure where this goes...");
    }
  }
//Check that only dials can enter the console
  static onlyDials(slot, item) {
    if (item.dataset.gameItem !== "signalDial") {
      window.actionLog.push("Seems only Signaldials go into this console.");
      return false;
    }
    return true;
  }
// gives the player a hint when clicking the console
  static inspectConsole() {
    window.actionLog.push("Hmmmm.... It looks like the console has three empty slots and a rotating mechanism...");
  }
//puts the dial into the console and locks it in place
  static dialInserted(slot, item) {
    window.actionLog.push("Inserted a signal dial into the console.");
    window.inventory.disableItem(item); 

    item.classList.add("rotatable");
    item.dataset.rotation = "0";
    slot.appendChild(item);
//Allows the player to rotate the dial by 90 degrees each time they click it
    item.addEventListener("click", () => {
      let rotation = parseInt(item.dataset.rotation);
      rotation = (rotation + 90) % 360;
      item.dataset.rotation = rotation.toString();
      item.style.transform = `rotate(${rotation}deg)`;
      Room.checkAlignment();
    });

    Room.checkAlignment();
  }
//Checks if the dials are aligned correctly-if so the user wins
  static checkAlignment() {
    const dials = [...document.querySelectorAll(".signalConsole .item")];
    if (dials.length < 3) return;

    const correctAngles = [180, 90, 270]; 
    const currentAngles = dials.map(dial => parseInt(dial.dataset.rotation));

    const matches = currentAngles.every((angle, i) => angle === correctAngles[i]);

    if (matches) {
      window.actionLog.push("All dials aligned. The signal tower is now active!");
      window.quests.complete("alignSignal");

      const tower = document.getElementById("tower");
      if (tower) tower.classList.remove("locked");
      Room.unlockTower();
    }
  }
//unlocks the tower
  static unlockTower() {
    if (!document.getElementById("tower").classList.contains("locked")) {
      window.actionLog.push("Congrats! You repaired the tower!");
    } else {
      window.actionLog.push("Seems the tower is still offline, maybe the dials are missaligned?");
    }
  }
//not needed in the room since there arent currently enough items to fill the inventory
  static fullInventory() {
    window.actionLog.push("Your inventory is full!");
  }
}