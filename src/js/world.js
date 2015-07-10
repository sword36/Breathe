var core = require("./core.js");

var lastTime;
function main() {
    "use strict";
    var now = Date.now();
    var dt = (now - lastTime) / 1000;

    update();
    render(dt);

    lastTime = now;
    requestAnimationFrame(main);
}

function init() {
    "use strict";
    document.querySelector("#play-again").addEventListener("click", function() {
        reset();
    });
    lastTime = Date.now();
    main();
}

core.loadResources([
    "img/black.jpg",
    "rect.jpg"
]);

core.onResourcesReady(init());

module.exports = {

};