/**
 * slidePuzzle.js - Rebekka Burgi 40716597 - Group 7 - SET08101 Web Technologies
 * 
 * This script handles everything related to the sliding tile puzzle mini game.
 * This includes the creation of the mini game window and tiles, the movement logic of the tiles and the winning of the mini game.
 */


/* ----- VARIABLES ----- */
const slidePuzzleConsts = {
    spacing: 50,
    width: 400,
    height: 300,
    margin: 5,
    rows: 6,
    cols: 8,
    numMediumTiles: 4,
    numLargeTiles: 4,
    backgroundImageUrl: "assets/images/slide-puzzle/board.png",
    tileImagesPath: "assets/images/slide-puzzle/"
}

const tileLocations = [
    { x: 3, y: 0 },

    { x: 5, y: 2 },
    { x: 5, y: 3 },
    { x: 2, y: 5 },
    { x: 1, y: 1 },

    { x: 3, y: 3 },
    { x: 2, y: 0 },
    { x: 6, y: 4 },
    { x: 1, y: 4 },
];

const gameGridMatrix = [];
const tiles = [];
let currentTile = null;
let movement = null;

const miniGameWindow = document.getElementById("mini-game");
const puzzleWindow = document.createElement("div");
const gameGrid = document.createElementNS("http://www.w3.org/2000/svg", "svg");

/* ----- PUZZLE WINDOW ----- */

puzzleWindow.style.backgroundImage = `url(${slidePuzzleConsts.backgroundImageUrl})`;
puzzleWindow.style.position = "relative";
puzzleWindow.style.width = `${slidePuzzleConsts.width}px`;
puzzleWindow.style.height = `${slidePuzzleConsts.height}px`;


/* ----- GRID ----- */

gameGrid.setAttribute("width", slidePuzzleConsts.width);
gameGrid.setAttribute("height", slidePuzzleConsts.height);
gameGrid.style.position = "absolute";

puzzleWindow.appendChild(gameGrid);
miniGameWindow.appendChild(puzzleWindow);

function addLine(x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "1");
    gameGrid.appendChild(line);
}

function drawLines() {
    for (let x = slidePuzzleConsts.spacing; x < slidePuzzleConsts.width; x += slidePuzzleConsts.spacing) {
        addLine(x, 0, x, slidePuzzleConsts.height);
    }

    for (let y = slidePuzzleConsts.spacing; y < slidePuzzleConsts.height; y += slidePuzzleConsts.spacing) {
        addLine(0, y, slidePuzzleConsts.width, y)
    }

}

function createGridMatrix() {
    for (let y = 0; y < slidePuzzleConsts.rows; y++) {
        const row = [];
        for (let x = 0; x < slidePuzzleConsts.cols; x++) {
            row.push({
                x: x * slidePuzzleConsts.spacing + slidePuzzleConsts.margin,
                y: y * slidePuzzleConsts.spacing + slidePuzzleConsts.margin,
                object: null
            });
        }
        gameGridMatrix.push(row);
    }
}


/* ----- TILES ----- */

function createTileVars() {
    tiles.push({
        width: 40,
        height: 90,
        x: null,
        y: null,
        goal: true,
        image: slidePuzzleConsts.tileImagesPath + "tin.png"
    });

    for (let i = 0; i < slidePuzzleConsts.numLargeTiles; i++) {
        if (i % 2 == 0) {
            tiles.push({
                width: 140,
                height: 40,
                x: null,
                y: null,
                goal: false,
                image: `${slidePuzzleConsts.tileImagesPath}tile${i + 1}.png`
            });
        } else {
            tiles.push({
                width: 40,
                height: 140,
                x: null,
                y: null,
                goal: false,
                image: `${slidePuzzleConsts.tileImagesPath}tile${i + 1}.png`
            });
        }
    }

    for (let i = 0; i < slidePuzzleConsts.numMediumTiles; i++) {
        if (i % 2 == 0) {
            tiles.push({
                width: 90,
                height: 40,
                x: null,
                y: null,
                goal: false,
                image: `${slidePuzzleConsts.tileImagesPath}tile${i + 1 + slidePuzzleConsts.numLargeTiles}.png`
            });
        } else {
            tiles.push({
                width: 40,
                height: 90,
                x: null,
                y: null,
                goal: false,
                image: `${slidePuzzleConsts.tileImagesPath}tile${i + 1 + slidePuzzleConsts.numLargeTiles}.png`
            });
        }
    }
}

function assignTileLocations() {
    for (let i = 0; i < tiles.length; i++) {
        const location = tileLocations[i];

        if (tiles[i].width > tiles[i].height) {
            if (tiles[i].width >= 140) {
                gameGridMatrix[location.y][location.x + 2].object = tiles[i];
            }
            gameGridMatrix[location.y][location.x + 1].object = tiles[i];
        } else {
            if (tiles[i].height >= 140) {
                gameGridMatrix[location.y + 2][location.x].object = tiles[i];
            }
            gameGridMatrix[location.y + 1][location.x].object = tiles[i];
        }
        gameGridMatrix[location.y][location.x].object = tiles[i];

        tiles[i].x = gameGridMatrix[location.y][location.x].x;
        tiles[i].y = gameGridMatrix[location.y][location.x].y;
    }
}

function createTileDivs() {
    for (let i = 0; i < tiles.length; i++) {
        const tile = document.createElement("div");
        tile.style.width = `${tiles[i].width}px`;
        tile.style.height = `${tiles[i].height}px`;
        tile.style.left = `${tiles[i].x}px`;
        tile.style.top = `${tiles[i].y}px`;
        tile.style.backgroundImage = `url("${tiles[i].image}")`;
        tile.style.backgroundSize = "100% 100%";
        tile.style.backgroundPosition = "center";
        tile.style.backgroundRepeat = "no-repeat";
        tile.style.zIndex = "999";
        tile.style.position = "absolute";
        tile.style.boxSizing = "border-box";
        tile.style.margin = "0";
        tile.tileData = tiles[i];

        tile.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.getSelection().removeAllRanges();
            if (currentTile === tile) {
                stopMovement(currentTile);
                updateTile(currentTile);
                currentTile = null;
            } else if (currentTile === null) {
                currentTile = tile;
                startMovement(e, currentTile);
            }
        });
        puzzleWindow.appendChild(tile);
    }
}

function startMovement(e, tile) {
    let leftMin = null;
    let leftMax = null;
    let topMin = null;
    let topMax = null;

    if (tile.tileData.width > tile.tileData.height) {
        leftMin = slidePuzzleConsts.margin;
        leftMax = slidePuzzleConsts.width - tile.offsetWidth - slidePuzzleConsts.margin;

        const rowIndex = Math.floor((tile.offsetTop / slidePuzzleConsts.spacing));
        const colNum = Math.ceil(tile.offsetWidth / slidePuzzleConsts.spacing);

        for (let i = 0; i < slidePuzzleConsts.cols; i++) {
            if (gameGridMatrix[rowIndex][i].object != null && gameGridMatrix[rowIndex][i].object != tile) {
                const fullField = gameGridMatrix[rowIndex][i];
                if (fullField.x < tile.offsetLeft) {
                    leftMin = fullField.x + slidePuzzleConsts.spacing;
                }
                if (fullField.x >= tile.offsetLeft + (slidePuzzleConsts.spacing * colNum)) {
                    leftMax = fullField.x - (slidePuzzleConsts.spacing * colNum);
                    break;
                }
            }
        }
    }

    if (tile.tileData.height > tile.tileData.width) {
        topMin = slidePuzzleConsts.margin;
        topMax = slidePuzzleConsts.height - tile.offsetHeight - slidePuzzleConsts.margin;

        const colIndex = Math.floor((tile.offsetLeft / slidePuzzleConsts.spacing));
        const rowNum = Math.ceil(tile.offsetHeight / slidePuzzleConsts.spacing);

        for (let i = 0; i < slidePuzzleConsts.rows; i++) {
            if (gameGridMatrix[i][colIndex].object != null && gameGridMatrix[i][colIndex].object != tile) {
                const fullField = gameGridMatrix[i][colIndex];
                if (fullField.y < tile.offsetTop) {
                    topMin = fullField.y + slidePuzzleConsts.spacing;
                }
                if (fullField.y >= tile.offsetTop + (slidePuzzleConsts.spacing * rowNum)) {
                    topMax = fullField.y - (slidePuzzleConsts.spacing * rowNum);
                    break;
                }
            }
        }
    }

    movement = function (e) {
        let cursorX = e.clientX - puzzleWindowRect.left;
        let cursorY = e.clientY - puzzleWindowRect.top;
        let newLeft = cursorX - tile.offsetWidth / 2;
        let newTop = cursorY - tile.offsetHeight / 2;

        if (newLeft < leftMin) {
            newLeft = leftMin;
        }
        if (newLeft > leftMax) {
            newLeft = leftMax;
        }
        if (newTop < topMin) {
            newTop = topMin;
        }
        if (newTop > topMax) {
            newTop = topMax;
        }

        tile.style.left = `${newLeft}px`;
        tile.style.top = `${newTop}px`;
    }

    document.addEventListener("mousemove", movement);
}

function stopMovement(tile) {
    let newLeft = parseFloat(tile.style.left);
    let newTop = parseFloat(tile.style.top);

    let adjustedLeft = Math.round((newLeft - slidePuzzleConsts.margin) / slidePuzzleConsts.spacing) * slidePuzzleConsts.spacing + slidePuzzleConsts.margin;
    let adjustedTop = Math.round((newTop - slidePuzzleConsts.margin) / slidePuzzleConsts.spacing) * slidePuzzleConsts.spacing + slidePuzzleConsts.margin;

    tile.style.left = `${adjustedLeft}px`;
    tile.style.top = `${adjustedTop}px`;

    document.removeEventListener("mousemove", movement);
    movement = null;
}

function updateTile(tile) {
    let newRowIndex = Math.floor(tile.offsetTop / slidePuzzleConsts.spacing);
    let newColIndex = Math.floor(tile.offsetLeft / slidePuzzleConsts.spacing);

    const oldRowIndex = Math.floor(tile.tileData.y / slidePuzzleConsts.spacing);
    const oldColIndex = Math.floor(tile.tileData.x / slidePuzzleConsts.spacing);

    const colNum = Math.ceil(tile.offsetWidth / slidePuzzleConsts.spacing);
    const rowNum = Math.ceil(tile.offsetHeight / slidePuzzleConsts.spacing);

    for (let i = 0; i < colNum; i++) {
        gameGridMatrix[oldRowIndex][oldColIndex + i].object = null;

    }

    for (let i = 0; i < rowNum; i++) {
        gameGridMatrix[oldRowIndex + i][oldColIndex].object = null;
    }

    for (let i = 0; i < colNum; i++) {
        gameGridMatrix[newRowIndex][newColIndex + i].object = tile;
    }

    for (let i = 0; i < rowNum; i++) {
        gameGridMatrix[newRowIndex + i][newColIndex].object = tile;
    }

    tile.tileData.x = gameGridMatrix[newRowIndex][newColIndex].x;
    tile.tileData.y = gameGridMatrix[newRowIndex][newColIndex].y;


    if (tile.tileData.goal) {
        if (tile.tileData.y == 205) {
            receiveItem("Blue Tin", 12);
        }
    }
}


/* ----- DISPLAY ----- */

const puzzleWindowRect = puzzleWindow.getBoundingClientRect();

createGridMatrix();
drawLines();
createTileVars();
assignTileLocations();
createTileDivs();