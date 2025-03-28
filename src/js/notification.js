"use strict";

// add fading + transitions

class Notify {
  // config
  static containerElement = document.querySelector(".notifications");
  static #temp = false;
  static #timeOut = 3;
  static #maximum = 3;

  // state
  static #current = [];
  static #Message = class {
    #element;
    #countdown;

    constructor(element, timeOut) {
      this.#element = element;

      if (Notify.#temp) {
        this.#countdown = setTimeout(() => {
          this.destroy();
        }, timeOut * 1000);
      }
    }

    destroy() {
      this.#element.remove();
      clearTimeout(this.#countdown);
    }
  }

  static #createBubble(message) {
    // create element and parent it
    const bubble = document.createElement('div');

    bubble.textContent = message;

    this.containerElement.prepend(bubble);
    return bubble;
  }

  static push(message) {
    // create element

    this.#current.unshift(
      new this.#Message(
        this.#createBubble(message),
        this.#timeOut)
      );

    // fall off the end of the queue
    if (this.#current.length > this.#maximum) {
      this.#current[this.#maximum].destroy();
      this.#current.splice(this.#maximum, 1);
    }
  }

  static clearAll() {
    this.#current.forEach(e => e.destroy());
    this.#current = [];
  }
}