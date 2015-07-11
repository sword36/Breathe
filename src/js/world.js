module.exports = function(window_) {
    var core = require("./core.js");


    var lastTime,
        isGameOver,
        score,
        input;
    var viewport = core.getViewport();

    function reset() {
        "use strict";
        core.hideGameOver();
        isGameOver = false;
        score = 0;
        core.enemies = [];
    }

    core.createPlayer(
        [viewport.width / 2, viewport.height / 2],
        core.createSprite("../../img/rect.jpg", [0, 0], [100, 100], 0, [0])
    );
    core.createBackground(
        [0, 0],
        core.createSprite("../../img/black.jpg", [0, 0], [viewport.width, viewport.height], 0)
    );

    function updateEnities(dt) {
        "use strict";
        core.player.sprite.update(dt);
        core.background.pos = [core.background.pos[0] - 10, core.background.pos[1]];
    }

    function update(dt) {
        "use strict";
        updateEnities(dt);
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

        input = core.getInput(window_, "keyboard");
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
};