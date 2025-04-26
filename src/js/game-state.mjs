"use strict";

import { ArrayUtil } from "./utils.mjs";

// For unlocking later rooms

const SAVE_KEY = "progress";
export default class GameManager {

  static #ROOMS = {
    "1": [],
    "2": [ "minigame1" ],
    "3": []
  }

  // all rooms

  static get rooms() {
    return new Set([ ...this.linearRoomPath, ...this.#secretRooms ]);
  }

  static get currentPageIsRoom() {
    return this.rooms.includes(this.currentRoom());
  }

  static get currentRoom() {
    // current directory name
    return window.location.pathname
      .split('/')
      .reverse()
      .find(d => d.length != 0);
  }

  static get unlockedRooms() {
    return GameManager.#load().unlockedRooms ?? [];
  }

  static get #secretRooms() {
    return Object.values(GameManager.#ROOMS).flat();
  }

  // linear progression

  static get linearRoomPath() {
    return Object.keys(GameManager.#ROOMS);
  }

  static get furthestUnlockedLinearRoom() {
    let furthest = this.linearRoomPath[0];
    this.linearRoomPath.forEach(r => {
      if (this.unlockedRooms.includes(r)) {
        furthest = r;
      }
    })
    return furthest;
  }

  static getLinearRoom(room) {
    if (this.linearRoomPath.includes(room)) {
      return room;
    } else {
      return Object.keys(this.#ROOMS).find(r => this.#ROOMS[r].includes(room));
    }
  }
  // false = start
  static get prevLinearRoom() {
    const newIndex = this.#linearIndexOf(this.getLinearRoom(this.currentRoom)) + 1;
    if (this.furthestUnlockedLinearRoom + 1 > this.linearRoomPath.length) {
      return false;
    }

    return this.linearRoomPath[this.furthestUnlockedLinearRoom + 1];
  }
  // false = finished
  static get nextLinearRoom() {
    const newIndex = this.#linearIndexOf(this.furthestUnlockedLinearRoom) + 1;
    if (newIndex == this.linearRoomPath.length) {
      return false;
    }

    return this.linearRoomPath[newIndex];
  }

  static roomUnlocked(name) {
    return this.unlockedRooms.includes(name) &&
    // this is my life now
      this.#linearIndexOf(this.getLinearRoom(name)) <= this.#linearIndexOf(this.furthestUnlockedLinearRoom);
  }

  static redirectToPrevRoom() {
    // for the << button
  }

  // indempotent: check if current room is linear, then check if immediate next room is unlocked, if so, do nothing
  static unlockNextLinearRoom() {
    // just update the save state
    // complete
  }

  static redirectToNextRoom() {
    // do nothing if next room == this room
    const nextRoom = this.nextLinearRoom;
    if (!nextRoom) {
      // go home
    }

    if (!this.roomUnlocked(nextRoom)) {
      return false;
    }

    // for the >> button
    history.pushState(GameManager.#roomNameToUrl(nextRoom));
  }

  static unlockSecondaryRoom(name) {
    if (!this.#secretRooms.includes(name)) {
      throw new Error("Not a secret room");
    }

    let state = this.#load();
    state.unlockedRooms.add(name)

    this.#save(state);
  }

  static redirectToSecretRoom(name) {
    if (!this.roomUnlocked(name)) {
      return false;
    }

    history.pushState(GameManager.#roomNameToUrl(name));
  }

  static #roomNameToUrl(name) {
    // because this website ISN'T hosted at the route of the domain,
    // we need to do magic to preserve the first part of the url to redirect
    // correctly
    const currentPath = ArrayUtil.dropUntil((x) => x != this.currentRoom,
        window.location.pathname
        .split('/')
        .reverse())
      .reverse();

    currentPath.splice(currentPath.length - 1, 1, name.toString())
    return currentPath.join('/');
  }

  static #linearIndexOf(name) {
    return this.linearRoomPath.indexOf(name);
  }

  // persistence

  static #save(progress) {
    window.gameStorage?.set(SAVE_KEY, progress);
  }

  static #load() {
    return window.gameStorage?.get(SAVE_KEY) ?? {
      unlockedRooms: new Set([ this.linearRoomPath[0], this.linearRoomPath[1] ]),
      completedRun: false
    };
  }

  static {
    // maybe force redirect to furthestUnlockedRoom ?
    window.gameState = GameManager;
  }
};