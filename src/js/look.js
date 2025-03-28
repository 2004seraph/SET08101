"use strict";

(function() {
  // config
  const panArea = 100;
  const acceleration = 4;

  // state
  const scrollDivs = new Set();
  let mousePos = {
    x: 0,
    y: 0
  }

  function lerp(start, end, amount) {
    return start * (1.0 - amount) + end * amount;
  }

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
  }

  function pan(element) {
    const rect = element.getBoundingClientRect();
    const relativeMousePos = [mousePos.x - rect.left, mousePos.y - rect.top];

    // leftwards:
    // 0 --- X  panArea
    //    M     range: 0 -> X
    // 1 --- 0  intent
    // amount = clamp(X - M, 0, X) / X
    // intent = lerp(1, 0, amount)

    // rightwards:
    // X --- rect.width
    //    M
    // amount = clamp(M - X, 0, (rect.width - X)) / (rect.width - X)
    // intent = lerp(0, 1, amount)

    // leftAreaStart is 0
    const rightAreaStart = rect.width - panArea;
    let horizontalPan =
      (-1 * lerp(0, 1, clamp(panArea - relativeMousePos[0], 0, panArea) / panArea)) // leftwards
      + (lerp(0, 1, clamp(relativeMousePos[0] - rightAreaStart, 0, panArea) / panArea)); // rightwards
    horizontalPan = horizontalPan * 2;
    horizontalPan = horizontalPan * Math.abs(horizontalPan);

    const bottomAreaStart = rect.height - panArea;
    let verticalPan =
      (-1 * lerp(0, 1, clamp(panArea - relativeMousePos[1], 0, panArea) / panArea)) // leftwards
      + (lerp(0, 1, clamp(relativeMousePos[1] - bottomAreaStart, 0, panArea) / panArea)); // rightwards
    verticalPan = verticalPan * 2;
    verticalPan = verticalPan * Math.abs(verticalPan);

    element.scroll({ left: element.scrollLeft + horizontalPan * acceleration, top: element.scrollTop + verticalPan * acceleration });
  }

  document.querySelectorAll(".gimbalLook").forEach(v => {
    v.addEventListener("mouseenter", (e) => {
      scrollDivs.add(v);
    });
    v.addEventListener("mouseleave", (e) => {
      scrollDivs.delete(v);
    });
    v.addEventListener("mousemove", (e) => {
      mousePos = { x: e.clientX, y: e.clientY }
    });
  });

  function main() {
    scrollDivs.forEach(d => pan(d));

    requestAnimationFrame(main);
  }

  requestAnimationFrame(main);

})();