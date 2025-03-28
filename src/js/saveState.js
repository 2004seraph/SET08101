"use strict";

/**
 * You do not need to manually use this script,
 * it provides a backend for the other scripts to use
 */

(function() {

class SaveState {
  get(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  set(key, object) {
    localStorage.setItem(key, JSON.stringify(object));
  }
}

window.saveState = new SaveState();

})();