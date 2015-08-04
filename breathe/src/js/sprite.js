var resources = require("./resources.js");
var config = require("./config.js");

/**
 * Sprite of texture
 * @param {string} url
 * @param {number[]} pos Position in sprite sheet
 * @param {number[]} size Size in sprite sheet
 * @param {number} speed Speed of playing animation
 * @param {number[]} frames Frames of animation
 * @param {string} dir Direction on sprite sheet
 * @param {bool} once Count of playing animation
 * @constructor
 * @see createSprite
 * @see createSprite
 */
function Sprite(url, pos, size, speed, sizeToDraw, frames, dir, once) {
    this.url = url;
    this.image = resources.getImg(this.url);

    if (typeof pos != "undefined")
        this.pos = pos;
    else
        this.pos = [0, 0];
    if (typeof size != "undefined")
        this.size = size;
    else
        this.size = [this.image.width, this.image.height];
    this.speed = typeof speed === "number" ? speed : 0;
    if (typeof frames != "undefined")
        this.frames = frames;
    else
        this.frames = [0];
    this.dir = dir || "horizontal";
    if (typeof  once != "undefined")
        this.once = once;
    else
        this.once = false;
    if (typeof sizeToDraw != "undefined")
        this.sizeToDraw = sizeToDraw;
    else
        this.sizeToDraw = this.size;

    this._index = 0;
    this.afterEndOfOnce = null;
}

Sprite.prototype.update = function (dt) {
    this._index += this.speed * dt;
};
Sprite.prototype.render = function (ctx) {
    var frame;
    if (this.speed > 0) {
        var max = this.frames.length;
        var idx = Math.floor(this._index);
        frame = this.frames[idx % max];

        if (this.once && idx >= max) {
            this.done = true;
            if (typeof this.afterEndOfOnce != "undefined") {
                this.afterEndOfOnce();
                max = this.frames.length;
                idx = Math.floor(this._index);
                frame = this.frames[idx % max];
            } else
                return;
        }
    } else {
        frame = 0;
    }
    var x = this.pos[0];
    var y = this.pos[1];

    if (this.dir === "vertical") {
        y += frame * this.size[1];
    } else {
        x += frame * this.size[0];
    }

    ctx.drawImage(this.image, x, y, this.size[0], this.size[1], 0, 0, this.sizeToDraw[0], this.sizeToDraw[1]);
    if (config.debugSprite) {
        ctx.strokeStyle = "#FF0000";
        ctx.strokeRect(0, 0, this.sizeToDraw[0], this.sizeToDraw[1]);
    }
};

Sprite.prototype.setFrames = function(frames, once, afterEnd) {
    "use strict";
    this.frames = frames;
    this._index = 0;
    if (typeof afterEnd != "undefined")
        this.afterEndOfOnce = afterEnd;
    if (once === true)
        this.once = true;
    else
        this.once = false;
};

module.exports = Sprite;