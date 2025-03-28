"use strict";

// will need to be a module

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