"use strict";

// add fading + transitions

(function() {

class ActionLog {
  // message object
  static #Message = class Message {
    #message;
    #element;
    #countdown;

    get message() {
      return this.#message;
    }

    constructor(message, element, timeOut) {
      this.#message = message;
      this.#element = element;

      if (timeOut) {
        this.#countdown = setTimeout(() => {
          this.destroy();
        }, timeOut * 1000);
      }
    }

    destroy() {
      clearTimeout(this.#countdown);
      this.#element.remove();
    }
  }

  // state
  #current = [];

  #config = {
    containerElement: document.querySelector(".action-log"),
    timeOut: 3,
    messageLimit: 3
  }

  constructor(state=[], config={}) {
    this.#config = { ...this.#config, ...config };

    state.reverse().forEach(m => this.push(m));
  }

  push(message) {
    // create element
    this.#current.unshift(this.#createMessage(message));

    // fall off the end of the queue
    this.#current = this.#trimQueue(this.#current);

    //scroll to top of log
    this.#config.containerElement.scrollTo({ top: 0, behavior: "smooth" });
    save(this.#current);
  }

  clearAll() {
    this.#current.forEach(e => e.destroy());
    this.#current = [];
    save(this.#current);
  }

  #createMessage(message) {
    return new ActionLog.#Message(
      message,
      this.#createBubble(message),
      this.#config.timeOut);
  }

  #createBubble(message) {
    // create element and parent it
    const bubble = document.createElement('p');

    bubble.textContent = message;

    this.#config.containerElement.prepend(bubble);
    return bubble;
  }

  #trimQueue(messages) {
    // fall off the end of the queue
    if (this.#config.messageLimit) {
      if (messages.length > this.#config.messageLimit) {
        messages[this.#config.messageLimit].destroy();
        messages.splice(this.#config.messageLimit, 1);
      }
    }

    return messages;
  }
}

const SAVE_KEY = "actions";

function save(actions) {
  actions = actions.map(m => m.message);
  window.saveState?.set(SAVE_KEY, actions);
}

function load() {
  // list of completed quests
  return window.saveState?.get(SAVE_KEY) ?? [];
}

window.actionLog = new ActionLog(
  load(),
  {
    timeOut: false,     // disable
    messageLimit: false // disable
  }
);

})();