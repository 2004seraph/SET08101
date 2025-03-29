"use strict";


export default class SaveState {
  static get(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  static set(key, object) {
    localStorage.setItem(key, JSON.stringify(object));
  }

  get(key) {
    return SaveState.get(key);
  }

  set(key, object) {
    return SaveState.set(key, object);
  }
}

window.saveState = new SaveState();
