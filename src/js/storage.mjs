"use strict";

import { EventSystem } from "./utils.mjs";

export default class StorageManager {

  #eventSystem = new EventSystem();

  // key = save file
  // subkey = individual data fields on a save

  #currentKey = null;       // current save file
  #currentSaveObject = {};  // all of its contents, key-value pairs accessed by this class's
                            // public get/set methods.

  // current save file name
  get user() {
    return this.#currentKey;
  }

  constructor() {
    this.#eventSystem.registerEvent("changed");

    // runs every page load, its job is to work out what current save we were actually using
    this.#currentKey = StorageManager.#getActiveKey();
    this.load(this.#currentKey);
  }

  // events: "changed", runs whenever someone calls the load() function
  addEventListener(name, callback) {
    this.#eventSystem.addEventListener(name, callback);
  }

  // changes the current save file, will create a new one if it doesnt already exist
  load(key, blankSave={}) {
    if (!key || key === "") {
      throw new Error("Invalid key");
    }

    this.#setCurrentKey(key);
    this.#currentSaveObject = StorageManager.#load(this.#currentKey) ?? blankSave;

    this.#eventSystem.dispatchEvent("changed");
  }

  // gets a field from the current save file
  get(subkey) {
    return this.#currentSaveObject[subkey];
  }

  // sets a field on the current save file
  set(subkey, object={}) {
    this.#currentSaveObject[subkey] = object;

    StorageManager.#save(this.#currentKey, this.#currentSaveObject);
  }

  // helpers

  #setCurrentKey(key) {
    this.#currentKey = key;
    StorageManager.#setActiveKey(key);
  }

  // save backend, decoupled from the public API, so it can be changed without breaking
  // stuff.

  // currently configued for the localStorage web API.

  static #prefix = "gameStorage//";

  static #fullyQualified(key) {
    return StorageManager.#prefix + key;
  }

  static #getActiveKey() {
    return localStorage.getItem(StorageManager.#prefix) ?? "default";
  }

  static #setActiveKey(key) {
    localStorage.setItem(StorageManager.#prefix, key);
  }

  static #load(key) {
    return JSON.parse(
      localStorage.getItem(StorageManager.#fullyQualified(key)));
  }

  static #save(key, object) {
    localStorage.setItem(StorageManager.#fullyQualified(key), JSON.stringify(object));
  }

  static {
    window.gameStorage = new StorageManager();
  }
}