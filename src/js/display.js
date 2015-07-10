/**
 * Created by USER on 10.07.2015.
 */
var config = require("./config.js");
var core = require("./core.js");

function CanvasDisplay() {
    "use strict";
    this.canvas = document.createElement("canvas");
    this.canvas.width = config.width;
    this.canvas.height = config.height;

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

CanvasDisplay.currentBackground = 0;
CanvasDisplay.prototype.drawBackground = function() {
    "use strict";

};

module.exports = {

};