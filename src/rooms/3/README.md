# Escape Room 3

\- Rebekka Burgi 40716597 - Group 7 - SET08101 Web Technologies -

This page is my contribution to our Escape Room group project. It is a fully functioning escape room, with riddles, a click-order puzzle and a tile-sliding mini-game.

## File Structure

- `index.html` – The main HTML file for this page, which is linked from the project's landing page located in the src folder
- `js/` – Contains all JavaScript files used for the game logic and interface
- `css/` – Contains the stylesheet
- `data/` – Contains JSON data files for objects and items
- `assets/images/` – Contains all images used in this page, which were all generated using **ImageFX**

## Features

- Loading logic to ensure all images are loaded before the game can start
- Point-and-click pick-up logic for items
- Item inventory including pop up window for more item information
- Drag-and-drop logic to remove and place items from the inventory
- Interactions between items
- A timer, with pause and play logic
- Text tutorials for the different game mechanics
- Hints to support the player
- Click-order puzzle which is integrated into the room
- Tile-sliding mini-game in a pop-up window

## NOTES

- The drag-and-drop logic can be a little temperamental on smaller items (especially keys), so when picking them up from the inventory it often works better to click just below the graphic itself.
- If the cursor "loses" an item mid-drag and it starts moving again when hovered over, simply click it to return it to the inventory or, if you want to continue dragging it, press down again, move, and let go, as with the normal movement mechanic.
- During the mini-game, resizing the window, scrolling or opening dev tools can cause the tiles to shift in a way they are not meant to, so ideally keep the viewport size consistent while playing for everything to work as intended.
- The page has not been tested on mobile devices yet.