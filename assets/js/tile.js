export default class Tile {
    constructor(x, y, div, first, second) {
        this.x = x;
        this.y = y;

        this.value = 0;

        this.div = div;
        this.first = first;
        this.second = second;

        this.isChanged = false;

        this.classes = [
            `thing`,
            `t-pos-${x}-${y}`,
            `t0`
        ];

        this.updateClass();

        this.second.on('animationend', {self: this}, this.clearClasses)
    }

    setValue(value, animation, isMerged) {
        let old_value = this.value;

        this.value = value;
        this.classes[2] = `t${value}`;

        this.first.addClass(`t${old_value}`);
        this.second.addClass(`t${value}`);

        if (this.isChanged) {
            this.classes.splice(3);
        }

        if (animation === 'tile-new') {
            this.classes.push('tile-new');
        } else {
            if (isMerged) {
                this.classes.push('tile-merged');
            } else {
                this.classes.push('tile-move');
                this.classes.push(`tile-move-${animation}`);
            }
        }

        this.isChanged = true;
        this.updateClass();
    }

    updateClass() {
        this.div.attr('class', this.classes.join(' '));
    }

    clearClasses(event) {
        let self = event.data.self;

        self.isChanged = false;

        self.classes.splice(3);
        self.updateClass();

        self.first.attr('class', 'first');
        self.second.attr('class', 'second');
    }
}