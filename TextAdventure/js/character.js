function Character() {
    this.tileFrom = [1, 1];
    this.tileTo = [1, 1];
    this.timeMoved = 0;
    this.dimensions = [30, 30];
    this.position = [45, 45];

    this.delayMove = {};
    this.delayMove[floorTypes.path] = 400;
    this.delayMove[floorTypes.grass] = 800;
    this.delayMove[floorTypes.ice] = 300;
    this.delayMove[floorTypes.conveyorU] = 200;
    this.delayMove[floorTypes.conveyorD] = 200;
    this.delayMove[floorTypes.conveyorL] = 200;
    this.delayMove[floorTypes.conveyorR] = 200;

    this.direction = directions.up;
    this.sprites = {};
    this.sprites[directions.up] = [{ x: 0, y: 120, w: 30, h: 30 }];
    this.sprites[directions.right] = [{ x: 0, y: 150, w: 30, h: 30 }];
    this.sprites[directions.down] = [{ x: 0, y: 180, w: 30, h: 30 }];
    this.sprites[directions.left] = [{ x: 0, y: 210, w: 30, h: 30 }];
}
Character.prototype.placeAt = function (x, y) {
    this.tileFrom = [x, y];
    this.tileTo = [x, y];
    this.position = [((tileW * x) + ((tileW - this.dimensions[0]) / 2)),
    ((tileH * y) + ((tileH - this.dimensions[1]) / 2))];
};

Character.prototype.processMovement = function (t) {
    if (this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1]) { return false; }

    var moveSpeed = this.delayMove[tileTypes[mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1])].type].floor];

    if ((t - this.timeMoved) >= moveSpeed) {
        this.placeAt(this.tileTo[0], this.tileTo[1]);

        if (mapTileData.map[toIndex(this.tileTo[0], this.tileTo[1])].eventEnter != null) {
            mapTileData.map[toIndex(this.tileTo[0], this.tileTo[1])].eventEnter(this);
        }

        var tileFloor = tileTypes[mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1])].type].floor;

        if (tileFloor == floorTypes.ice) {
            if (this.canMoveDirection(this.direction)) {
                this.moveDirection(this.direction, t);
            }
        }
        else if (tileFloor == floorTypes.conveyorL && this.canMoveLeft()) { this.moveLeft(t); }
        else if (tileFloor == floorTypes.conveyorR && this.canMoveRight()) { this.moveRight(t); }
        else if (tileFloor == floorTypes.conveyorU && this.canMoveUp()) { this.moveUp(t); }
        else if (tileFloor == floorTypes.conveyorD && this.canMoveDown()) { this.moveDown(t); }
    }
    else {
        this.position[0] = (this.tileFrom[0] * tileW) + ((tileW - this.dimensions[0]) / 2);
        this.position[1] = (this.tileFrom[1] * tileH) + ((tileH - this.dimensions[1]) / 2);

        if (this.tileTo[0] != this.tileFrom[0]) {
            var diff = (tileW / moveSpeed) * (t - this.timeMoved);
            this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
        }
        if (this.tileTo[1] != this.tileFrom[1]) {
            var diff = (tileH / moveSpeed) * (t - this.timeMoved);
            this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
        }

        this.position[0] = Math.round(this.position[0]);
        this.position[1] = Math.round(this.position[1]);
    }

    return true;
}
Character.prototype.canMoveTo = function (x, y) {
    if (x < 0 || x >= mapW || y < 0 || y >= mapH) { return false; }
    if (typeof this.delayMove[tileTypes[mapTileData.map[toIndex(x, y)].type].floor] == 'undefined') { return false; }
    return true;
};
Character.prototype.canMoveUp = function () { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1); };
Character.prototype.canMoveDown = function () { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1); };
Character.prototype.canMoveLeft = function () { return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]); };
Character.prototype.canMoveRight = function () { return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]); };
Character.prototype.canMoveDirection = function (d) {
    switch (d) {
        case directions.up:
            return this.canMoveUp();
        case directions.down:
            return this.canMoveDown();
        case directions.left:
            return this.canMoveLeft();
        default:
            return this.canMoveRight();
    }
};

Character.prototype.moveLeft = function (t) { this.tileTo[0] -= 1; this.timeMoved = t; this.direction = directions.left; };
Character.prototype.moveRight = function (t) { this.tileTo[0] += 1; this.timeMoved = t; this.direction = directions.right; };
Character.prototype.moveUp = function (t) { this.tileTo[1] -= 1; this.timeMoved = t; this.direction = directions.up; };
Character.prototype.moveDown = function (t) { this.tileTo[1] += 1; this.timeMoved = t; this.direction = directions.down; };
Character.prototype.moveDirection = function (d, t) {
    switch (d) {
        case directions.up:
            return this.moveUp(t);
        case directions.down:
            return this.moveDown(t);
        case directions.left:
            return this.moveLeft(t);
        default:
            return this.moveRight(t);
    }
};

