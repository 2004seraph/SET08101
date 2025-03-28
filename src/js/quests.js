"use strict";

// will need to be a module

(function() {

class QuestSystem {
  #config = { }

  get elements() {
    return document.querySelectorAll("[data-quest]");
  }

  get list() {
    return [ ...this.elements ].map(e => e.dataset.quest);
  }

  get completed() {
    return [ ...this.elements ].filter(q => q.dataset.complete).map(q => q.dataset.quest);
  }

  constructor(state=[], config={}) {
    this.#config = { ...this.#config, ...config }

    state.forEach(q => this.complete(q));
  }

  #questById(id) {
    return [ ...this.elements ].find(e => e.dataset.quest == id);
  }

  complete(id) {
    if (!this.list.includes(id)) {
      throw new Error("Undeclared quest");
    }

    const quest = this.#questById(id);

    if (quest.dataset.complete) {
      return;
    }

    new Function(quest.dataset.onComplete)
      .call(this);

    quest.dataset.complete = true;
    quest.style.textDecoration = "line-through";

    save(this.completed);
  }
}

const SAVE_KEY = "quests";

function save(quests) {
  window.saveState?.set(SAVE_KEY, quests);
}

function load() {
  // list of completed quests
  return window.saveState?.get(SAVE_KEY) ?? [];
}

// load save here, do it via the constructor
window.quests = new QuestSystem(load());

})();