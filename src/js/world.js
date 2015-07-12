var core = require("./core.js");
var config = require("./config.js");

var lastTime,
    isGameOver,
    score,
    input;
var viewport = core.getViewport();

function collides(x, y, r, b, x2, y2, r2, b2) {
    return (r >= x2 && x < r2 && y < b2 && b >= y2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1], pos[0] + size[0], pos[1] + size[1],
        pos2[0], pos2[1], pos2[0] + size2[0], pos2[1] + size2[1]);
}

function reset() {
    "use strict";
    core.hideGameOver();
    isGameOver = false;
    score = 0;
    core.enemies = [];
}

core.createPlayer(
    [100, 100],
    core.createSprite("img/rect.jpg", [0, 0], [100, 100], 0, [0])
);
core.createBackground(
    [0, 0],
    [core.createSprite("img/black.jpg", [0, 0], [viewport.width * 3, viewport.height], 0)]
);

function updateBackground(dt) {
    "use strict";
    core.background.pos = [core.background.pos[0] - config.backgroundSpeed * dt, core.background.pos[1]];
}

function updatePlayer(dt) {
    "use strict";
    core.player.speed.y += config.gravity * dt;
    var motion = core.player.speed.y * dt;
    core.player.pos = [core.player.pos[0], core.player.pos[1] + motion];
}

function updateEnities(dt) {
    "use strict";

    core.player.sprite.update(dt);
}

function update(dt) {
    "use strict";
    updateEnities(dt);
    updateBackground(dt);
    updatePlayer(dt);
}

function render() {
    "use strict";
    core.render();
    core.setScore(score);
    if (isGameOver) {
        core.renderGameOver();
    }
}

function main() {
    "use strict";
    var now = Date.now();
    var dt = (now - lastTime) / 1000;

    update(dt);
    render();

    lastTime = now;
    requestAnimationFrame(main);
}

function init() {
    "use strict";
    score = 0;
    isGameOver = false;

    input = core.getInput(window, "keyboard");
    document.querySelector("#play-again").addEventListener("click", function() {
        reset();
    });
    lastTime = Date.now();
    main();
}

core.loadResources([
    "img/black.jpg",
    "img/rect.jpg"
]);

core.onResourcesReady(init);

module.exports = function() {
};