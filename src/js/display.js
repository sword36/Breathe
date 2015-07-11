var config = require("./config.js");
var core = require("./core.js");

function flipHorizontally(context, around) {
    context.translate(around, 0);
    context.scale(-1, 1);
    context.translate(-around, 0);
}
/**
 *
 * @constructor
 * @see display
 */
function CanvasDisplay() {
    "use strict";
    this.canvas = document.createElement("canvas");
    this.canvas.width = config.width;
    this.canvas.height = config.height;
    this.scoreEl = document.querySelector("#score");

    var parent = document.querySelector("#game");
    parent.appendChild(this.canvas);
    this.cx = this.canvas.getContext('2d');
}

CanvasDisplay.prototype.clear = function() {
    "use strict";
    this.canvas.parentNode.removeChild(this.canvas);
};

CanvasDisplay.prototype.clearDisplay = function() {
    "use strict";
    this.cx.fillStyle = "rgb(52, 166, 251)";
    this.cx.fillRect(0, 0, config.width, config.height);
};

CanvasDisplay.prototype._render = function(enemy) {
    "use strict";
    this.cx.save();
    this.cx.translate(enemy.pos[0], enemy.pos[1]);
    enemy.sprite.render(this.cx);
    this.cx.restore();
};

CanvasDisplay.prototype.renderBackground = function() {
    "use strict";
    this._render(core.background);
};

CanvasDisplay.prototype.renderEnemies = function() {
    "use strict";
    for (var i = 0; i < core.enemies.length; i++) {
        this._render(core.enemies[i]);
    }
};

CanvasDisplay.prototype.renderPlayer = function() {
    "use strict";
    this._render(core.player);
};
/**
 * Clear render, render background, render enemies, render player
 */
CanvasDisplay.prototype.render = function() {
    "use strict";
    this.clear();
    this.renderBackground();
    this.renderEnemies();
    this.renderPlayer();
};

CanvasDisplay.prototype.renderGameOver = function() {
    document.getElementById("game-over").style.display = "block";
    document.getElementById("game-over-overlay").style.display = "block";
};

CanvasDisplay.prototype.hideGameOver = function() {
    "use strict";
    document.getElementById("game-over").style.display = "none";
    document.getElementById("game-over-overlay").style.display = "node";
};

CanvasDisplay.prototype.setScore = function(score) {
    "use strict";
    this.scoreEl.innerHTML = score.toString();
};
module.exports = function() {
    return new CanvasDisplay();
};