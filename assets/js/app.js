import '../scss/style.scss'

import Grid from './grid'

$(document).ready(function () {
    let grid = new Grid(4);

    let clickStartX, clickStartY;

    grid.playField.mousedown((event) => {
        event.preventDefault();

        clickStartX = event.pageX;
        clickStartY = event.pageY;
    });

    grid.playField.mouseup((event) => {
        event.preventDefault();

        let clickEndX, clickEndY;

        clickEndX = event.pageX;
        clickEndY = event.pageY;

        let dx = clickEndX - clickStartX;
        let absDx = Math.abs(dx);

        let dy = clickEndY - clickStartY;
        let absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) > 10) {
            grid.move(absDx > absDy ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
        }
    });

    grid.restartButton.click((event) => {
        event.preventDefault();

        grid.restart();
    });
});