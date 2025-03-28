"use strict";

(function() {

const areSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

// setting the horizontal scroll position on page load
document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById("scene-viewport")
  element.scrollLeft = 350
})

window.inventory.reconfigure(
  {
    fullInventoryCallback: Room.fullInventory
    // debug: true,
  }
)

window.inventory.addEventListener("pickupItem", () => {

  if (areSetsEqual(
    new Set(window.inventory.root.querySelectorAll("[data-game-item]")),
    new Set(window.inventory.root.querySelectorAll(
      `[data-slot='${window.inventory.hotbarSlotGroupName}'] > [data-game-item]`))
  )) {

    if (!window.quests.isComplete("pickup")) {
      window.actionLog.push('i got a lotta stuff');
      window.quests.complete("pickup");
    }
  }
})

console.log("Items in the scene:", window.inventory.allItems);

})();