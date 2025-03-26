"use strict";

// setting the horizontal scroll position on page load
document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById("game")
  element.scrollLeft = 350
})

window.inventory.reconfigure(
  {
    fullInventoryCallback: fullInventory,

    // debug: true,
  }
)

console.log("Items in the scene:", window.inventory.allItems)