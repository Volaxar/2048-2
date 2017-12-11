import Tile from './tile'

export default class Grid {
    constructor(size) {
        this.playField = $('#playfield');
        this.scoreField = $('#score');
        this.messageField = $('#message');
        this.restartButton = $('#restart');

        this.cells = [];
        this.size = size;
        this.startTiles = 1;

        this.score = 0;
        this.over = false;
        this.won = false;

        this.restart();
    }

    restart() {
        this.setup();

        for (let i = 0; i < this.startTiles; i++) {
            this.addRandomTile();
        }
    }

    setup() {
        this.playField.empty();
        this.scoreField.text('0');
        this.messageField.text('');

        for (let y = 0; y < this.size; y++) {
            let row = this.cells[y] = [];

            for (let x = 0; x < this.size; x++) {
                let blank = $('<div>');
                let first = $('<div class="first">');
                let second = $('<div class="second">');

                blank.append(first, second);

                this.playField.append(blank);

                row.push(new Tile(x, y, blank, first, second))
            }
        }
    }

    addRandomTile() {
        let cells = this.getTiles();
        let tile = cells[Math.floor(Math.random() * cells.length)];

        tile.setValue(Math.random() < 0.9 ? 2 : 4, 'tile-new', false);
    }

    move(direction) {
        console.clear();

        if (this.isTerminated()) return;

        let cells = this.getTiles(false);
        let vector = this.getVector(direction);
        let moved = false;

        for (let row of this.cells) {
            for (let cell of row) {
                if (cell.first.css('animation-name') !== 'none' ||
                    cell.second.css('animation-name') !== 'none') {

                    cell.clearClasses({data: {self: cell}});
                }
            }
        }

        cells = this.sortTiles(cells, vector);

        for (let cell of cells) {
            let previous;
            let pos = {x: cell.x, y: cell.y};

            do {
                previous = this.cells[pos.y][pos.x];
                pos = {x: pos.x + vector.x, y: pos.y + vector.y};

            } while (!this.isPosOutRange(pos) && !this.isPosBusy(pos));

            if (this.isPosOutRange(pos)) {
                if (this.moveTile(cell, previous, cell.value, direction)) {
                    moved = true;
                }
            } else {
                let next = this.cells[pos.y][pos.x];

                if (cell.value !== next.value) {
                    if (this.moveTile(cell, previous, cell.value, direction)) {
                        moved = true;
                    }
                } else {
                    if (this.moveTile(cell, next, next.value * 2, direction, true)) {
                        moved = true;
                    }

                    this.score += next.value;
                    this.scoreField.text(this.score);

                    if (next.value === 2048) {
                        this.won = true;
                        this.messageField.text('Вы выиграли!');

                        return;
                    }
                }
            }
        }

        if (moved) {
            this.addRandomTile();

            if (!this.getTiles()) {
                this.over = true;
                this.messageField.text('Игра окончена!');
            }
        }
    }

    isPosOutRange(pos) {
        return pos.x < 0 || pos.x >= this.size || pos.y < 0 || pos.y >= this.size
    }

    isPosBusy(pos) {
        return this.cells[pos.y][pos.x].value > 0
    }

    isPosEqual(a, b) {
        return a.x === b.x && a.y === b.y
    }

    moveTile(from, to, value, direction, isMerged = false) {
        if (!this.isPosEqual(from, to)) {
            to.setValue(value, direction, isMerged);
            from.setValue(0, direction, false);

            return true;
        }
    }

    sortTiles(cells, vector) {

        let func = (a, b) => {
            if (vector.x < 0) {
                return a.x - b.x;
            } else if (vector.x > 0) {
                return b.x - a.x;
            } else if (vector.y < 0) {
                return a.y - b.y;
            } else if (vector.y > 0) {
                return b.y - a.y;
            }
        };

        return cells.sort(func);
    }

    getVector(direction) {
        let map = {
            'up': {x: 0, y: -1},
            'right': {x: 1, y: 0},
            'down': {x: 0, y: 1},
            'left': {x: -1, y: 0}
        };

        return map[direction];
    }

    getTiles(isFree = true) {
        let cells = [];

        for (let row of this.cells) {
            for (let cell of row) {
                if (Boolean(cell.value) !== isFree) {
                    cells.push(cell);
                }
            }
        }

        return cells;
    }

    isTerminated() {
        return this.over || this.won
    }
}