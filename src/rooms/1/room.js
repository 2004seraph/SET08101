"use strict";

// just to group all the room 5 specific code under Room.*
class Room {

  static clickedSwitchSlot() {
    window.actionLog.push('its missing a switch')
  }

  static openRedDoor(element) {
    window.actionLog.push('it had a bunch of switches inside!')

    element.classList.remove("shut")
    element.classList.add("open")
    // element.style.left = `${700 - 80}px`

    document.querySelectorAll("[data-game-item='switch']").forEach(e => e.style.zIndex = 1)
  }

  static itemIsSwitch(slot, item) {
    // return whether it's allowed
    if (!(item.dataset.gameItem == "switch")) {
      window.actionLog.push("I can only put switches on the switch board")
      return false
    }

    return true
  }

  static escape() {
    if (this.#checkCombination()) {
      alert("You escaped!")
      window.location.replace("/")
    } else {
      window.actionLog.push('Wont budge')
    }
  }

  static switchConnected(slot, item) {
    // prevent user from removing / swapping items on this slot now
    window.inventory.disableItem(item)

    item.addEventListener("click", (e) => {
      if (this.#switchOn(item)) {
        item.src = "assets/switch.png"
      } else {
        item.src = "assets/switch-on.png"
      }
    });
  }

  static #switchOn(e) {
    return e.src.includes("assets/switch-on.png");
  }

  static #checkCombination() {
    const code = [...document.querySelectorAll(".switch")]

    const ON = e => this.#switchOn(e)

    return ON(code[0]) && !ON(code[1]) && ON(code[2]) && ON(code[3])
  }

  // Generics
  // ----------------------------------------------------------------------------------------------------

  static useItem(element, withObject) {
    switch (element.dataset.gameItem) {
      case "switch":
        window.actionLog.push("I think i can connect this to the switch board")
        break

      case "screwdriver":
        if (!withObject) {
          window.actionLog.push("Maybe i can jimmy something open with this")
          break

        } else if (withObject.dataset.gameItem && withObject.dataset.gameItem.includes("switch-")) {
          window.actionLog.push("this switch works fine, just need to attach it to something")
          break

        } else {
          // must be a door or some other item
          window.actionLog.push("I can't use this there")
        }
        break

      case "lockbox":
        window.actionLog.push("There's something inside this box, the lock seems busted though")
        break

      case "key":
        window.actionLog.push("This seems like a regular door key, perhaps i can use it over there")
        break
    }
  }

  static fullInventory() {
    window.actionLog.push("inventory full!")
  }

  static {
    // wowzzers only 8 global objects from the framework
    // and then one from callbacks.

    // setting the horizontal scroll position on page load (game camera view)
    // document.addEventListener('DOMContentLoaded', function() {
    //   const element = document.getElementById("scene-viewport");
    //   element.scrollLeft = 350;
    // });

    window.scrollLook.settings.lockVertical = true;

    // window.onload = function() { // it's either this or defer-ing this script
    // and any script that uses the global objects
      window.inventory.reconfigure(
        {
          fullInventoryCallback: Room.fullInventory
          // debug: true,
        }
      )

      window.inventory.addEventListener("pickupItem", function() {

        if (window.ArrayUtil.equal(
          window.inventory.root.querySelectorAll("[data-game-item]"),
          window.inventory.root.querySelectorAll(
            `[data-slot='${window.inventory.hotbarSlotGroupName}'] > [data-game-item]`))
        ) {

          if (!window.quests.isComplete("pickup")) {
            window.actionLog.push('i got a lotta stuff');
            window.quests.complete("pickup");
          }
        }
      })

      console.log("Items in the scene:", window.inventory.allItems);
    // }
  }
}