"use strict";

function clickedSwitchSlot() {
  Notify.push('its missing a switch')
}

function openRedDoor(element) {
  Notify.push('it had a bunch of switches inside!')

  element.classList.remove("shut")
  element.classList.add("open")
  element.style.left = `${700 - 80}px`

  document.querySelectorAll("[data-game-item='switch']").forEach(e => e.style.zIndex = 10)
}

function itemIsSwitch(slot, item) {
  // return whether it's allowed
  if (!(item.dataset.gameItem == "switch")) {
    Notify.push("I can only put switches on the switch board")
    return false
  }

  return true
}

function switchConnected(slot, item) {
  // prevent user from removing / swapping items on this slot now
  window.inventory.disableItem(item)

  const ON = e => e.src.includes("assets/switch-on.png")

  item.addEventListener("click", (e) => {
    if (ON(item)) {
      item.src = "assets/switch.png"
    } else {
      item.src = "assets/switch-on.png"
    }

    const code = [...document.querySelectorAll(".switch")]

    if (ON(code[0]) && !ON(code[1]) && ON(code[2]) && ON(code[3])) {
      alert("You're Winner!")
    }
  });
}

// Generics
// ----------------------------------------------------------------------------------------------------

function useItem(element, withObject) {
  switch (element.dataset.gameItem) {
    case "switch":
      Notify.push("I think i can connect this to the switch board")
      break

    case "screwdriver":
      if (!withObject) {
        Notify.push("Maybe i can jimmy something open with this")
        break

      } else if (withObject.dataset.gameItem && withObject.dataset.gameItem.includes("switch-")) {
        Notify.push("this switch works fine, just need to attach it to something")
        break

      } else {
        // must be a door or some other item
        Notify.push("I can't use this there")
      }
      break

    case "lockbox":
      Notify.push("There's something inside this box, the lock seems busted though")
      break

    case "key":
      Notify.push("This seems like a regular door key, perhaps i can use it over there")
      break
  }
}

function fullInventory() {
  Notify.push("inventory full!")
}