"use strict";

class Room {

  static useItem(item, withObject) {
    if (item.dataset.gameItem === "signalDial") {
      window.actionLog.push("Looks like this fits into the signal console.");
    } else {
      window.actionLog.push("Not sure where this goes...");
    }
  }

  static onlyDials(slot, item) {
    if (item.dataset.gameItem !== "signalDial") {
      window.actionLog.push("Seems only Signaldials go into this console.");
      return false;
    }
    return true;
  }

  static inspectConsole() {
    window.actionLog.push("Hmmmm.... It looks like the console has three empty slots and a rotating mechanism...");
  }

  static dialInserted(slot, item) {
    window.actionLog.push("Inserted a signal dial into the console.");
    window.inventory.disableItem(item); // lock the dial in place

    item.classList.add("rotatable");
    item.dataset.rotation = "0";

    item.addEventListener("click", () => {
      let rotation = parseInt(item.dataset.rotation);
      rotation = (rotation + 90) % 360;
      item.dataset.rotation = rotation.toString();
      item.style.transform = `rotate(${rotation}deg)`;
      Room.checkAlignment();
    });

    Room.checkAlignment();
  }

  static checkAlignment() {
    const dials = [...document.querySelectorAll("[data-slot='signalConsole'] .item")];
    if (dials.length < 3) return;

    const correctAngles = [180, 90, 270]; // required alignment
    const currentAngles = dials.map(dial => parseInt(dial.dataset.rotation));

    const matches = currentAngles.every((angle, i) => angle === correctAngles[i]);

    if (matches) {
      window.actionLog.push("All dials aligned. The signal tower is now active!");
      window.quests.complete("alignSignal");

      const tower = document.getElementById("tower");
      if (tower) tower.classList.remove("locked");
    }
  }

  static unlockTower() {
    if (!document.getElementById("tower").classList.contains("locked")) {
      window.actionLog.push("Congrats! You repaired tthe tower!");
    } else {
      window.actionLog.push("Seems the tower is still offline, maybe the dials are missaligned?");
    }
  }

  static fullInventory() {
    window.actionLog.push("Your inventory is full!");
  }
}