"use strict";

// will need to be a module

(function() {
  document.querySelectorAll("[data-quest]").forEach(e => {
    console.log(e.dataset.quest);
  });

  window.completeQuest = function(id) {
    console.log("completed", id);
  }
})();