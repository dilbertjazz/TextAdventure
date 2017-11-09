var ctx = null;
var gameMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 2, 2, 2, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 2, 1, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 2, 1, 0, 2, 2, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 2, 1, 0, 2, 2, 0, 4, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    0, 1, 1, 2, 2, 2, 2, 2, 0, 4, 4, 4, 1, 1, 1, 0, 2, 2, 2, 0,
    0, 1, 1, 2, 1, 0, 2, 2, 0, 1, 1, 4, 1, 1, 1, 0, 2, 2, 2, 0,
    0, 1, 1, 2, 1, 0, 2, 2, 0, 1, 1, 4, 1, 1, 1, 0, 2, 2, 2, 0,
    0, 1, 1, 2, 1, 0, 0, 0, 0, 1, 1, 4, 1, 1, 0, 0, 0, 2, 0, 0,
    0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 2, 2, 2, 2, 0,
    0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 4, 4, 1, 1, 0, 2, 2, 2, 2, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 0, 2, 2, 2, 2, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 0, 2, 2, 2, 2, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
var mapTileData = new TileMap();

var roofList = [
    {
        x: 5, y: 3, w: 4, h: 7, data: [
            10, 10, 11, 11,
            10, 10, 11, 11,
            10, 10, 11, 11,
            10, 10, 11, 11,
            10, 10, 11, 11,
            10, 10, 11, 11,
            10, 10, 11, 11
        ]
    },
    {
        x: 15, y: 5, w: 5, h: 4, data: [
            10, 10, 11, 11, 11,
            10, 10, 11, 11, 11,
            10, 10, 11, 11, 11,
            10, 10, 11, 11, 11
        ]
    },
    {
        x: 14, y: 9, w: 6, h: 7, data: [
            10, 10, 10, 11, 11, 11,
            10, 10, 10, 11, 11, 11,
            10, 10, 10, 11, 11, 11,
            10, 10, 10, 11, 11, 11,
            10, 10, 10, 11, 11, 11,
            10, 10, 10, 11, 11, 11,
            10, 10, 10, 11, 11, 11
        ]
    }
];

var tileW = 40, tileH = 40;
var mapW = 20, mapH = 20;
var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;

var tileset = null, tilesetURL = "../image/tileset.png", tilesetLoaded = false;

var gameTime = 0;
var gameSpeeds = [
    { name: "Normal", mult: 1 },
    { name: "Slow", mult: 0.3 },
    { name: "Fast", mult: 3 },
    { name: "Paused", mult: 0 }
];
var currentSpeed = 0;

var floorTypes = {
    solid: 0,
    path: 1,
    water: 2,
    ice: 3,
    conveyorU: 4,
    conveyorD: 5,
    conveyorL: 6,
    conveyorR: 7,
    grass: 8
};
var tileTypes = {
    0: { colour: "#685b48", floor: floorTypes.solid, sprite: [{ x: 0, y: 0, w: 40, h: 40 }] },
    1: { colour: "#5aa457", floor: floorTypes.grass, sprite: [{ x: 40, y: 0, w: 40, h: 40 }] },
    2: { colour: "#e8bd7a", floor: floorTypes.path, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] },
    3: { colour: "#286625", floor: floorTypes.solid, sprite: [{ x: 120, y: 0, w: 40, h: 40 }] },
    4: {
        colour: "#678fd9", floor: floorTypes.water, sprite: [
            { x: 160, y: 0, w: 40, h: 40, d: 200 }, { x: 200, y: 0, w: 40, h: 40, d: 200 },
            { x: 160, y: 40, w: 40, h: 40, d: 200 }, { x: 200, y: 40, w: 40, h: 40, d: 200 },
            { x: 160, y: 40, w: 40, h: 40, d: 200 }, { x: 200, y: 0, w: 40, h: 40, d: 200 }
        ]
    },
    5: { colour: "#eeeeff", floor: floorTypes.ice, sprite: [{ x: 120, y: 120, w: 40, h: 40 }] },
    6: {
        colour: "#cccccc", floor: floorTypes.conveyorL, sprite: [
            { x: 0, y: 40, w: 40, h: 40, d: 200 }, { x: 40, y: 40, w: 40, h: 40, d: 200 },
            { x: 80, y: 40, w: 40, h: 40, d: 200 }, { x: 120, y: 40, w: 40, h: 40, d: 200 }
        ]
    },
    7: {
        colour: "#cccccc", floor: floorTypes.conveyorR, sprite: [
            { x: 120, y: 80, w: 40, h: 40, d: 200 }, { x: 80, y: 80, w: 40, h: 40, d: 200 },
            { x: 40, y: 80, w: 40, h: 40, d: 200 }, { x: 0, y: 80, w: 40, h: 40, d: 200 }
        ]
    },
    8: {
        colour: "#cccccc", floor: floorTypes.conveyorD, sprite: [
            { x: 160, y: 200, w: 40, h: 40, d: 200 }, { x: 160, y: 160, w: 40, h: 40, d: 200 },
            { x: 160, y: 120, w: 40, h: 40, d: 200 }, { x: 160, y: 80, w: 40, h: 40, d: 200 }
        ]
    },
    9: {
        colour: "#cccccc", floor: floorTypes.conveyorU, sprite: [
            { x: 200, y: 80, w: 40, h: 40, d: 200 }, { x: 200, y: 120, w: 40, h: 40, d: 200 },
            { x: 200, y: 160, w: 40, h: 40, d: 200 }, { x: 200, y: 200, w: 40, h: 40, d: 200 }
        ]
    },

    10: { colour: "#ccaa00", floor: floorTypes.solid, sprite: [{ x: 40, y: 120, w: 40, h: 40 }] },
    11: { colour: "#ccaa00", floor: floorTypes.solid, sprite: [{ x: 80, y: 120, w: 40, h: 40 }] }
};

function Tile(tx, ty, tt) {
    this.x = tx;
    this.y = ty;
    this.type = tt;
    this.roof = null;
    this.roofType = 0;
    this.eventEnter = null;
}

function TileMap() {
    this.map = [];
    this.w = 0;
    this.h = 0;
}
TileMap.prototype.buildMapFromData = function (d, w, h) {
    this.w = w;
    this.h = h;

    if (d.length != (w * h)) { return false; }

    this.map.length = 0;

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            this.map.push(new Tile(x, y, d[((y * w) + x)]));
        }
    }

    return true;
};
TileMap.prototype.addRoofs = function (roofs) {
    for (var i in roofs) {
        var r = roofs[i];

        if (r.x < 0 || r.y < 0 || r.x >= this.w || r.y >= this.h ||
            (r.x + r.w) > this.w || (r.y + r.h) > this.h ||
            r.data.length != (r.w * r.h)) {
            continue;
        }

        for (var y = 0; y < r.h; y++) {
            for (var x = 0; x < r.w; x++) {
                var tileIdx = (((r.y + y) * this.w) + r.x + x);

                this.map[tileIdx].roof = r;
                this.map[tileIdx].roofType = r.data[((y * r.w) + x)];
            }
        }
    }
};

var directions = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
};

var keysDown = {
    37: false,
    38: false,
    39: false,
    40: false
};

var viewport = {
    screen: [0, 0],
    startTile: [0, 0],
    endTile: [0, 0],
    offset: [0, 0],
    update: function (px, py) {
        this.offset[0] = Math.floor((this.screen[0] / 2) - px);
        this.offset[1] = Math.floor((this.screen[1] / 2) - py);

        var tile = [Math.floor(px / tileW), Math.floor(py / tileH)];

        this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0] / 2) / tileW);
        this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1] / 2) / tileH);

        if (this.startTile[0] < 0) { this.startTile[0] = 0; }
        if (this.startTile[1] < 0) { this.startTile[1] = 0; }

        this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0] / 2) / tileW);
        this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1] / 2) / tileH);

        if (this.endTile[0] >= mapW) { this.endTile[0] = mapW - 1; }
        if (this.endTile[1] >= mapH) { this.endTile[1] = mapH - 1; }
    }
};

var player = new Character();

function toIndex(x, y) {
    return ((y * mapW) + x);
}

function getFrame(sprite, duration, time, animated) {
    if (!animated) { return sprite[0]; }
    time = time % duration;

    for (x in sprite) {
        if (sprite[x].end >= time) { return sprite[x]; }
    }
}

window.onload = function () {
    ctx = document.getElementById('game').getContext("2d");
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";

    window.addEventListener("keydown", function (e) {
        if (e.keyCode >= 37 && e.keyCode <= 40) { keysDown[e.keyCode] = true; }
    });
    window.addEventListener("keyup", function (e) {
        if (e.keyCode >= 37 && e.keyCode <= 40) { keysDown[e.keyCode] = false; }
        if (e.keyCode == 83) {
            currentSpeed = (currentSpeed >= (gameSpeeds.length - 1) ? 0 : currentSpeed + 1);
        }
    });

    viewport.screen = [document.getElementById('game').width,
    document.getElementById('game').height];

    tileset = new Image();
    tileset.onerror = function () {
        ctx = null;
        alert("Failed loading tileset.");
    };
    tileset.onload = function () { tilesetLoaded = true; };
    tileset.src = tilesetURL;

    for (x in tileTypes) {
        tileTypes[x]['animated'] = tileTypes[x].sprite.length > 1 ? true : false;

        if (tileTypes[x].animated) {
            var t = 0;

            for (s in tileTypes[x].sprite) {
                tileTypes[x].sprite[s]['start'] = t;
                t += tileTypes[x].sprite[s].d;
                tileTypes[x].sprite[s]['end'] = t;
            }

            tileTypes[x]['spriteDuration'] = t;
        }
    }

    mapTileData.buildMapFromData(gameMap, mapW, mapH);
    mapTileData.addRoofs(roofList);
    mapTileData.map[((2 * mapW) + 2)].eventEnter = function ()
    { console.log("Entered tile 2,2"); };
};

function drawGame() {
    if (ctx == null) { return; }
    if (!tilesetLoaded) { requestAnimationFrame(drawGame); return; }

    var currentFrameTime = Date.now();
    var timeElapsed = currentFrameTime - lastFrameTime;
    gameTime += Math.floor(timeElapsed * gameSpeeds[currentSpeed].mult);

    var sec = Math.floor(Date.now() / 1000);
    if (sec != currentSecond) {
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    }
    else { frameCount++; }

    if (!player.processMovement(gameTime) && gameSpeeds[currentSpeed].mult != 0) {
        if (keysDown[38] && player.canMoveUp()) { player.moveUp(gameTime); }
        else if (keysDown[40] && player.canMoveDown()) { player.moveDown(gameTime); }
        else if (keysDown[37] && player.canMoveLeft()) { player.moveLeft(gameTime); }
        else if (keysDown[39] && player.canMoveRight()) { player.moveRight(gameTime); }
    }

    viewport.update(player.position[0] + (player.dimensions[0] / 2),
        player.position[1] + (player.dimensions[1] / 2));

    var playerRoof1 = mapTileData.map[toIndex(
        player.tileFrom[0], player.tileFrom[1])].roof;
    var playerRoof2 = mapTileData.map[toIndex(
        player.tileTo[0], player.tileTo[1])].roof;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);

    for (var y = viewport.startTile[1]; y <= viewport.endTile[1]; ++y) {
        for (var x = viewport.startTile[0]; x <= viewport.endTile[0]; ++x) {
            var tile = tileTypes[mapTileData.map[toIndex(x, y)].type];

            var sprite = getFrame(tile.sprite, tile.spriteDuration,
                gameTime, tile.animated);
            ctx.drawImage(tileset,
                sprite.x, sprite.y, sprite.w, sprite.h,
                viewport.offset[0] + (x * tileW), viewport.offset[1] + (y * tileH),
                tileW, tileH);

            if (mapTileData.map[toIndex(x, y)].roofType != 0 &&
                mapTileData.map[toIndex(x, y)].roof != playerRoof1 &&
                mapTileData.map[toIndex(x, y)].roof != playerRoof2) {
                tile = tileTypes[mapTileData.map[toIndex(x, y)].roofType];
                sprite = getFrame(tile.sprite, tile.spriteDuration,
                    gameTime, tile.animated);
                ctx.drawImage(tileset,
                    sprite.x, sprite.y, sprite.w, sprite.h,
                    viewport.offset[0] + (x * tileW),
                    viewport.offset[1] + (y * tileH),
                    tileW, tileH);
            }
        }
    }

    var sprite = player.sprites[player.direction];
    ctx.drawImage(tileset,
        sprite[0].x, sprite[0].y, sprite[0].w, sprite[0].h,
        viewport.offset[0] + player.position[0], viewport.offset[1] + player.position[1],
        player.dimensions[0], player.dimensions[1]);

    ctx.fillStyle = "#ff0000";
    ctx.fillText("FPS: " + framesLastSecond, 10, 20);
    ctx.fillText("Game speed: " + gameSpeeds[currentSpeed].name, 10, 40);

    lastFrameTime = currentFrameTime;
    requestAnimationFrame(drawGame);
}