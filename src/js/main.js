(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by USER on 10.07.2015.
 */
module.exports = {

};
},{}],2:[function(require,module,exports){
/**
 * Created by USER on 10.07.2015.
 */
module.exports = {
    width: 1024,
    height: 600,
    inputType: "keyboard",
    backgroundSpeed: 20
};
},{}],3:[function(require,module,exports){
var resources = require("./resources.js");
var Sprite = require("./sprite.js");
var input = require("./input.js");
var model = require("./model.js");
var display_ =  require("./display.js");
var config = require("./config.js");

debugger;
var display = new display_();

function createSprite(url, pos, size, speed, frames, dir, once) {
    "use strict";
    return new Sprite(url, pos, size, speed, frames, dir, once);
}

function getViewport() {
    "use strict";
    return {
        width: config.width,
        height: config.height
    };
}

function render() {
    "use strict";
    display.render();
}

module.exports = {
    loadResources: resources.load,
    getResource: resources.get,
    onResourcesReady: resources.onReady,
    createSprite: createSprite,
    getInput: input,
    createPlayer: model.createPlayer,
    createBackground: model.createBackground,
    createEnemie: model.createEnemie,
    createBonus: model.createBonus,
    player: model.player,
    background: model.background,
    enemies: model.enemies,
    bonuses: model.bonuses,
    render: render,
    clearRender: display.clear,
    renderGameOver: display.renderGameOver,
    hideGameOver: display.hideGameOver,
    setScore: display.setScore,
    getViewport: getViewport
};


},{"./config.js":2,"./display.js":4,"./input.js":6,"./model.js":7,"./resources.js":8,"./sprite.js":9}],4:[function(require,module,exports){
module.exports = function() {
    "use strict";
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
        debugger;
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
        this.clearDisplay();
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

    return CanvasDisplay;
};
},{"./config.js":2,"./core.js":3}],5:[function(require,module,exports){
var world = require("./world.js");
window.addEventListener("load", function() {
    "use strict";
    world(window);
});
},{"./world.js":10}],6:[function(require,module,exports){
/**
 * @param window Global object
 * @param {string} type Can be:keyboard, medicine, smartphone
 * @returns Object which content info about pressed buttons
 * @see getInput
 */
function input(window, type) {    //type - keyboard, medicine, smartphone
    "use strict";
    var pressed = null;
    function handler(event) {
        if (codes.hasOwnProperty(event.keyCode)) {
            var down = event.type === "keydown";
            pressed[codes[event.keyCode]] = down;
            event.preventDefault();
        }
    }

    function clearAll() {
        for (var c in pressed) {
            if (pressed.hasOwnProperty(c))
                pressed[c] = false;
        }
    }

    if (!pressed) {
        pressed = Object.create(null);
        var codesKeyboard = {38: "up"};
        var codes;

        switch (type) {
            case "keyboard":
                codes = codesKeyboard;
                window.addEventListener("keydown", handler);
                window.addEventListener("keyup", handler);
                window.addEventListener("blur", clearAll());
                break;
            default :
                throw new Error("Wrong type of input");
        }
    }
    return pressed;
}

module.exports = input;
},{}],7:[function(require,module,exports){
var player = {};
var enemies = [];
var background = {};
var bonuses = [];
/**
 * Should be call once
 * @param pos
 * @param sprite
 * @returns player
 */
function createPlayer(pos, sprite) {
    "use strict";
    player.pos = pos || [0, 0];
    player.sprite = sprite;
    return player;
}

/**
 * Should be call once
 * @param pos
 * @param sprites
 * @returns background
 */
function createBackground(pos, sprites) {
    "use strict";
    background.pos = pos || [0, 0];
    background.sprites = sprites;
    background.currentSprite = 0;
    background.spritesLength = sprites.length;
    return background;
}
/**
 * Add enemie to enemies
 * @param pos
 * @param sprite
 */
function createEnemie(pos, sprite) {
    "use strict";
    enemies.push({
        pos: pos,
        sprite: sprite
    });
}
/**
 * Add bonus to bonuses
 * @param pos
 * @param sprite
 * @param {string} type Can be: speed, slow, small, big
 */
function createBonus(pos, sprite, type) {
    "use strict";
    bonuses.push({
        pos: pos,
        sprite: sprite,
        type: type
    });
}

module.exports = {
    player: player,
    enemies: enemies,
    background: background,
    bonuses: bonuses,
    createPlayer: createPlayer,
    createEnemie: createEnemie,
    createBonus: createBonus,
    createBackground: createBackground
};
},{}],8:[function(require,module,exports){
var resourceCache = {};
var readyCallbacks = [];

function isReady() {
    var ready = true;
    for (var k in resourceCache) {
        if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
            ready = false;
        }
    }
    return ready;
}

function _load(url) {
    if (resourceCache[url]) {
        return resourceCache[url];
    } else {
        var img = new Image();
        img.onload = function () {
            resourceCache[url] = img;
            if (isReady()) {
                readyCallbacks.forEach(function (func) {
                    func();
                });
            }
        };
        img.src = url;
        resourceCache[url] = false;
    }
}
/**
 * Load image and add them to cache
 *@param {(string|string[])} urlOfArr Array of urls
 * @see loadResources
 */
function load(urlOfArr) {
    if (urlOfArr instanceof Array) {
        urlOfArr.forEach(function (url) {
            _load(url);
        });
    } else {
        _load(urlOfArr);
    }
}
/**
 * Get resource from cache
 * @param {string} url
 * @returns  Image
 * @see getResource
 */
function get(url) {
    return resourceCache[url];
}
/**
 * Add function to functions which will be called then all resources loaded
 * @param func
 * @see onResourcesReady
 */
function onReady(func) {
    readyCallbacks.push(func);
}

module.exports = {
    load: load,
    get: get,
    onReady: onReady,
    isReady: isReady
};

},{}],9:[function(require,module,exports){
var core = require("./core.js");

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
function Sprite(url, pos, size, speed, frames, dir, once) {
    this.pos = pos;
    this.url = url;
    this.size = size;
    this.speed = typeof speed === "number" ? speed : 0;
    this.frames = frames;
    this.dir = dir || "horizontal";
    this.once = once;
    this._index = 0;
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

    ctx.drawImage(core.getResource(this.url), x, y, this.size[0], this.size[1], 0, 0, this.size[0], this.size[1]);
};

module.exports = Sprite;
},{"./core.js":3}],10:[function(require,module,exports){
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
},{"./core.js":3}]},{},[1,2,3,4,5,6,7,8,9,10])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXVkaW8uanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2NvcmUuanMiLCJzcmMvanMvZGlzcGxheS5qcyIsInNyYy9qcy9nYW1lLmpzIiwic3JjL2pzL2lucHV0LmpzIiwic3JjL2pzL21vZGVsLmpzIiwic3JjL2pzL3Jlc291cmNlcy5qcyIsInNyYy9qcy9zcHJpdGUuanMiLCJzcmMvanMvd29ybGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFVTRVIgb24gMTAuMDcuMjAxNS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxufTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBVU0VSIG9uIDEwLjA3LjIwMTUuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHdpZHRoOiAxMDI0LFxyXG4gICAgaGVpZ2h0OiA2MDAsXHJcbiAgICBpbnB1dFR5cGU6IFwia2V5Ym9hcmRcIixcclxuICAgIGJhY2tncm91bmRTcGVlZDogMjBcclxufTsiLCJ2YXIgcmVzb3VyY2VzID0gcmVxdWlyZShcIi4vcmVzb3VyY2VzLmpzXCIpO1xyXG52YXIgU3ByaXRlID0gcmVxdWlyZShcIi4vc3ByaXRlLmpzXCIpO1xyXG52YXIgaW5wdXQgPSByZXF1aXJlKFwiLi9pbnB1dC5qc1wiKTtcclxudmFyIG1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWwuanNcIik7XHJcbnZhciBkaXNwbGF5XyA9ICByZXF1aXJlKFwiLi9kaXNwbGF5LmpzXCIpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnLmpzXCIpO1xyXG5cclxuZGVidWdnZXI7XHJcbnZhciBkaXNwbGF5ID0gbmV3IGRpc3BsYXlfKCk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTcHJpdGUodXJsLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICByZXR1cm4gbmV3IFNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Vmlld3BvcnQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgd2lkdGg6IGNvbmZpZy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IGNvbmZpZy5oZWlnaHRcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW5kZXIoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBsb2FkUmVzb3VyY2VzOiByZXNvdXJjZXMubG9hZCxcclxuICAgIGdldFJlc291cmNlOiByZXNvdXJjZXMuZ2V0LFxyXG4gICAgb25SZXNvdXJjZXNSZWFkeTogcmVzb3VyY2VzLm9uUmVhZHksXHJcbiAgICBjcmVhdGVTcHJpdGU6IGNyZWF0ZVNwcml0ZSxcclxuICAgIGdldElucHV0OiBpbnB1dCxcclxuICAgIGNyZWF0ZVBsYXllcjogbW9kZWwuY3JlYXRlUGxheWVyLFxyXG4gICAgY3JlYXRlQmFja2dyb3VuZDogbW9kZWwuY3JlYXRlQmFja2dyb3VuZCxcclxuICAgIGNyZWF0ZUVuZW1pZTogbW9kZWwuY3JlYXRlRW5lbWllLFxyXG4gICAgY3JlYXRlQm9udXM6IG1vZGVsLmNyZWF0ZUJvbnVzLFxyXG4gICAgcGxheWVyOiBtb2RlbC5wbGF5ZXIsXHJcbiAgICBiYWNrZ3JvdW5kOiBtb2RlbC5iYWNrZ3JvdW5kLFxyXG4gICAgZW5lbWllczogbW9kZWwuZW5lbWllcyxcclxuICAgIGJvbnVzZXM6IG1vZGVsLmJvbnVzZXMsXHJcbiAgICByZW5kZXI6IHJlbmRlcixcclxuICAgIGNsZWFyUmVuZGVyOiBkaXNwbGF5LmNsZWFyLFxyXG4gICAgcmVuZGVyR2FtZU92ZXI6IGRpc3BsYXkucmVuZGVyR2FtZU92ZXIsXHJcbiAgICBoaWRlR2FtZU92ZXI6IGRpc3BsYXkuaGlkZUdhbWVPdmVyLFxyXG4gICAgc2V0U2NvcmU6IGRpc3BsYXkuc2V0U2NvcmUsXHJcbiAgICBnZXRWaWV3cG9ydDogZ2V0Vmlld3BvcnRcclxufTtcclxuXHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWcuanNcIik7XHJcbiAgICB2YXIgY29yZSA9IHJlcXVpcmUoXCIuL2NvcmUuanNcIik7XHJcblxyXG4gICAgZnVuY3Rpb24gZmxpcEhvcml6b250YWxseShjb250ZXh0LCBhcm91bmQpIHtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShhcm91bmQsIDApO1xyXG4gICAgICAgIGNvbnRleHQuc2NhbGUoLTEsIDEpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC1hcm91bmQsIDApO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAc2VlIGRpc3BsYXlcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gQ2FudmFzRGlzcGxheSgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSBjb25maWcud2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gY29uZmlnLmhlaWdodDtcclxuICAgICAgICB0aGlzLnNjb3JlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlXCIpO1xyXG5cclxuICAgICAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lXCIpO1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5jeCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLmNhbnZhcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuY2FudmFzKTtcclxuICAgIH07XHJcblxyXG4gICAgQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuY2xlYXJEaXNwbGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5jeC5maWxsU3R5bGUgPSBcInJnYig1MiwgMTY2LCAyNTEpXCI7XHJcbiAgICAgICAgdGhpcy5jeC5maWxsUmVjdCgwLCAwLCBjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBDYW52YXNEaXNwbGF5LnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24oZW5lbXkpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICB0aGlzLmN4LnNhdmUoKTtcclxuICAgICAgICB0aGlzLmN4LnRyYW5zbGF0ZShlbmVteS5wb3NbMF0sIGVuZW15LnBvc1sxXSk7XHJcbiAgICAgICAgZW5lbXkuc3ByaXRlLnJlbmRlcih0aGlzLmN4KTtcclxuICAgICAgICB0aGlzLmN4LnJlc3RvcmUoKTtcclxuICAgIH07XHJcblxyXG4gICAgQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyQmFja2dyb3VuZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcihjb3JlLmJhY2tncm91bmQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBDYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJFbmVtaWVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3JlLmVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKGNvcmUuZW5lbWllc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBDYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJQbGF5ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl9yZW5kZXIoY29yZS5wbGF5ZXIpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgcmVuZGVyLCByZW5kZXIgYmFja2dyb3VuZCwgcmVuZGVyIGVuZW1pZXMsIHJlbmRlciBwbGF5ZXJcclxuICAgICAqL1xyXG4gICAgQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5jbGVhckRpc3BsYXkoKTtcclxuICAgICAgICB0aGlzLnJlbmRlckJhY2tncm91bmQoKTtcclxuICAgICAgICB0aGlzLnJlbmRlckVuZW1pZXMoKTtcclxuICAgICAgICB0aGlzLnJlbmRlclBsYXllcigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBDYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJHYW1lT3ZlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1vdmVyXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLW92ZXItb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfTtcclxuXHJcbiAgICBDYW52YXNEaXNwbGF5LnByb3RvdHlwZS5oaWRlR2FtZU92ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtb3ZlclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLW92ZXItb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub2RlXCI7XHJcbiAgICB9O1xyXG5cclxuICAgIENhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnNldFNjb3JlID0gZnVuY3Rpb24oc2NvcmUpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLnNjb3JlRWwuaW5uZXJIVE1MID0gc2NvcmUudG9TdHJpbmcoKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIENhbnZhc0Rpc3BsYXk7XHJcbn07IiwidmFyIHdvcmxkID0gcmVxdWlyZShcIi4vd29ybGQuanNcIik7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgd29ybGQod2luZG93KTtcclxufSk7IiwiLyoqXHJcbiAqIEBwYXJhbSB3aW5kb3cgR2xvYmFsIG9iamVjdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBDYW4gYmU6a2V5Ym9hcmQsIG1lZGljaW5lLCBzbWFydHBob25lXHJcbiAqIEByZXR1cm5zIE9iamVjdCB3aGljaCBjb250ZW50IGluZm8gYWJvdXQgcHJlc3NlZCBidXR0b25zXHJcbiAqIEBzZWUgZ2V0SW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIGlucHV0KHdpbmRvdywgdHlwZSkgeyAgICAvL3R5cGUgLSBrZXlib2FyZCwgbWVkaWNpbmUsIHNtYXJ0cGhvbmVcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIHByZXNzZWQgPSBudWxsO1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xyXG4gICAgICAgIGlmIChjb2Rlcy5oYXNPd25Qcm9wZXJ0eShldmVudC5rZXlDb2RlKSkge1xyXG4gICAgICAgICAgICB2YXIgZG93biA9IGV2ZW50LnR5cGUgPT09IFwia2V5ZG93blwiO1xyXG4gICAgICAgICAgICBwcmVzc2VkW2NvZGVzW2V2ZW50LmtleUNvZGVdXSA9IGRvd247XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsZWFyQWxsKCkge1xyXG4gICAgICAgIGZvciAodmFyIGMgaW4gcHJlc3NlZCkge1xyXG4gICAgICAgICAgICBpZiAocHJlc3NlZC5oYXNPd25Qcm9wZXJ0eShjKSlcclxuICAgICAgICAgICAgICAgIHByZXNzZWRbY10gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFwcmVzc2VkKSB7XHJcbiAgICAgICAgcHJlc3NlZCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICAgICAgdmFyIGNvZGVzS2V5Ym9hcmQgPSB7Mzg6IFwidXBcIn07XHJcbiAgICAgICAgdmFyIGNvZGVzO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImtleWJvYXJkXCI6XHJcbiAgICAgICAgICAgICAgICBjb2RlcyA9IGNvZGVzS2V5Ym9hcmQ7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIGNsZWFyQWxsKCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV3JvbmcgdHlwZSBvZiBpbnB1dFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJlc3NlZDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dDsiLCJ2YXIgcGxheWVyID0ge307XHJcbnZhciBlbmVtaWVzID0gW107XHJcbnZhciBiYWNrZ3JvdW5kID0ge307XHJcbnZhciBib251c2VzID0gW107XHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbCBvbmNlXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKiBAcmV0dXJucyBwbGF5ZXJcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVBsYXllcihwb3MsIHNwcml0ZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBwbGF5ZXIucG9zID0gcG9zIHx8IFswLCAwXTtcclxuICAgIHBsYXllci5zcHJpdGUgPSBzcHJpdGU7XHJcbiAgICByZXR1cm4gcGxheWVyO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGwgb25jZVxyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVzXHJcbiAqIEByZXR1cm5zIGJhY2tncm91bmRcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZUJhY2tncm91bmQocG9zLCBzcHJpdGVzKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGJhY2tncm91bmQucG9zID0gcG9zIHx8IFswLCAwXTtcclxuICAgIGJhY2tncm91bmQuc3ByaXRlcyA9IHNwcml0ZXM7XHJcbiAgICBiYWNrZ3JvdW5kLmN1cnJlbnRTcHJpdGUgPSAwO1xyXG4gICAgYmFja2dyb3VuZC5zcHJpdGVzTGVuZ3RoID0gc3ByaXRlcy5sZW5ndGg7XHJcbiAgICByZXR1cm4gYmFja2dyb3VuZDtcclxufVxyXG4vKipcclxuICogQWRkIGVuZW1pZSB0byBlbmVtaWVzXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlRW5lbWllKHBvcywgc3ByaXRlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGVuZW1pZXMucHVzaCh7XHJcbiAgICAgICAgcG9zOiBwb3MsXHJcbiAgICAgICAgc3ByaXRlOiBzcHJpdGVcclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKiBBZGQgYm9udXMgdG8gYm9udXNlc1xyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgQ2FuIGJlOiBzcGVlZCwgc2xvdywgc21hbGwsIGJpZ1xyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlQm9udXMocG9zLCBzcHJpdGUsIHR5cGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYm9udXNlcy5wdXNoKHtcclxuICAgICAgICBwb3M6IHBvcyxcclxuICAgICAgICBzcHJpdGU6IHNwcml0ZSxcclxuICAgICAgICB0eXBlOiB0eXBlXHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBwbGF5ZXI6IHBsYXllcixcclxuICAgIGVuZW1pZXM6IGVuZW1pZXMsXHJcbiAgICBiYWNrZ3JvdW5kOiBiYWNrZ3JvdW5kLFxyXG4gICAgYm9udXNlczogYm9udXNlcyxcclxuICAgIGNyZWF0ZVBsYXllcjogY3JlYXRlUGxheWVyLFxyXG4gICAgY3JlYXRlRW5lbWllOiBjcmVhdGVFbmVtaWUsXHJcbiAgICBjcmVhdGVCb251czogY3JlYXRlQm9udXMsXHJcbiAgICBjcmVhdGVCYWNrZ3JvdW5kOiBjcmVhdGVCYWNrZ3JvdW5kXHJcbn07IiwidmFyIHJlc291cmNlQ2FjaGUgPSB7fTtcclxudmFyIHJlYWR5Q2FsbGJhY2tzID0gW107XHJcblxyXG5mdW5jdGlvbiBpc1JlYWR5KCkge1xyXG4gICAgdmFyIHJlYWR5ID0gdHJ1ZTtcclxuICAgIGZvciAodmFyIGsgaW4gcmVzb3VyY2VDYWNoZSkge1xyXG4gICAgICAgIGlmIChyZXNvdXJjZUNhY2hlLmhhc093blByb3BlcnR5KGspICYmICFyZXNvdXJjZUNhY2hlW2tdKSB7XHJcbiAgICAgICAgICAgIHJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlYWR5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBfbG9hZCh1cmwpIHtcclxuICAgIGlmIChyZXNvdXJjZUNhY2hlW3VybF0pIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VDYWNoZVt1cmxdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmVzb3VyY2VDYWNoZVt1cmxdID0gaW1nO1xyXG4gICAgICAgICAgICBpZiAoaXNSZWFkeSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZWFkeUNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGltZy5zcmMgPSB1cmw7XHJcbiAgICAgICAgcmVzb3VyY2VDYWNoZVt1cmxdID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIExvYWQgaW1hZ2UgYW5kIGFkZCB0aGVtIHRvIGNhY2hlXHJcbiAqQHBhcmFtIHsoc3RyaW5nfHN0cmluZ1tdKX0gdXJsT2ZBcnIgQXJyYXkgb2YgdXJsc1xyXG4gKiBAc2VlIGxvYWRSZXNvdXJjZXNcclxuICovXHJcbmZ1bmN0aW9uIGxvYWQodXJsT2ZBcnIpIHtcclxuICAgIGlmICh1cmxPZkFyciBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgdXJsT2ZBcnIuZm9yRWFjaChmdW5jdGlvbiAodXJsKSB7XHJcbiAgICAgICAgICAgIF9sb2FkKHVybCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIF9sb2FkKHVybE9mQXJyKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogR2V0IHJlc291cmNlIGZyb20gY2FjaGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxyXG4gKiBAcmV0dXJucyAgSW1hZ2VcclxuICogQHNlZSBnZXRSZXNvdXJjZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0KHVybCkge1xyXG4gICAgcmV0dXJuIHJlc291cmNlQ2FjaGVbdXJsXTtcclxufVxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uIHRvIGZ1bmN0aW9ucyB3aGljaCB3aWxsIGJlIGNhbGxlZCB0aGVuIGFsbCByZXNvdXJjZXMgbG9hZGVkXHJcbiAqIEBwYXJhbSBmdW5jXHJcbiAqIEBzZWUgb25SZXNvdXJjZXNSZWFkeVxyXG4gKi9cclxuZnVuY3Rpb24gb25SZWFkeShmdW5jKSB7XHJcbiAgICByZWFkeUNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGxvYWQ6IGxvYWQsXHJcbiAgICBnZXQ6IGdldCxcclxuICAgIG9uUmVhZHk6IG9uUmVhZHksXHJcbiAgICBpc1JlYWR5OiBpc1JlYWR5XHJcbn07XHJcbiIsInZhciBjb3JlID0gcmVxdWlyZShcIi4vY29yZS5qc1wiKTtcclxuXHJcbi8qKlxyXG4gKiBTcHJpdGUgb2YgdGV4dHVyZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsXHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IHBvcyBQb3NpdGlvbiBpbiBzcHJpdGUgc2hlZXRcclxuICogQHBhcmFtIHtudW1iZXJbXX0gc2l6ZSBTaXplIGluIHNwcml0ZSBzaGVldFxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgU3BlZWQgb2YgcGxheWluZyBhbmltYXRpb25cclxuICogQHBhcmFtIHtudW1iZXJbXX0gZnJhbWVzIEZyYW1lcyBvZiBhbmltYXRpb25cclxuICogQHBhcmFtIHtzdHJpbmd9IGRpciBEaXJlY3Rpb24gb24gc3ByaXRlIHNoZWV0XHJcbiAqIEBwYXJhbSB7Ym9vbH0gb25jZSBDb3VudCBvZiBwbGF5aW5nIGFuaW1hdGlvblxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHNlZSBjcmVhdGVTcHJpdGVcclxuICogQHNlZSBjcmVhdGVTcHJpdGVcclxuICovXHJcbmZ1bmN0aW9uIFNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKSB7XHJcbiAgICB0aGlzLnBvcyA9IHBvcztcclxuICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgIHRoaXMuc3BlZWQgPSB0eXBlb2Ygc3BlZWQgPT09IFwibnVtYmVyXCIgPyBzcGVlZCA6IDA7XHJcbiAgICB0aGlzLmZyYW1lcyA9IGZyYW1lcztcclxuICAgIHRoaXMuZGlyID0gZGlyIHx8IFwiaG9yaXpvbnRhbFwiO1xyXG4gICAgdGhpcy5vbmNlID0gb25jZTtcclxuICAgIHRoaXMuX2luZGV4ID0gMDtcclxufVxyXG5cclxuU3ByaXRlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgIHRoaXMuX2luZGV4ICs9IHRoaXMuc3BlZWQgKiBkdDtcclxufTtcclxuU3ByaXRlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoY3R4KSB7XHJcbiAgICB2YXIgZnJhbWU7XHJcbiAgICBpZiAodGhpcy5zcGVlZCA+IDApIHtcclxuICAgICAgICB2YXIgbWF4ID0gdGhpcy5mcmFtZXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBpZHggPSBNYXRoLmZsb29yKHRoaXMuX2luZGV4KTtcclxuICAgICAgICBmcmFtZSA9IHRoaXMuZnJhbWVzW2lkeCAlIG1heF07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uY2UgJiYgaWR4ID49IG1heCkge1xyXG4gICAgICAgICAgICB0aGlzLmRvbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmcmFtZSA9IDA7XHJcbiAgICB9XHJcbiAgICB2YXIgeCA9IHRoaXMucG9zWzBdO1xyXG4gICAgdmFyIHkgPSB0aGlzLnBvc1sxXTtcclxuXHJcbiAgICBpZiAodGhpcy5kaXIgPT09IFwidmVydGljYWxcIikge1xyXG4gICAgICAgIHkgKz0gZnJhbWUgKiB0aGlzLnNpemVbMV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHggKz0gZnJhbWUgKiB0aGlzLnNpemVbMF07XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LmRyYXdJbWFnZShjb3JlLmdldFJlc291cmNlKHRoaXMudXJsKSwgeCwgeSwgdGhpcy5zaXplWzBdLCB0aGlzLnNpemVbMV0sIDAsIDAsIHRoaXMuc2l6ZVswXSwgdGhpcy5zaXplWzFdKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24od2luZG93Xykge1xyXG4gICAgdmFyIGNvcmUgPSByZXF1aXJlKFwiLi9jb3JlLmpzXCIpO1xyXG5cclxuXHJcbiAgICB2YXIgbGFzdFRpbWUsXHJcbiAgICAgICAgaXNHYW1lT3ZlcixcclxuICAgICAgICBzY29yZSxcclxuICAgICAgICBpbnB1dDtcclxuICAgIHZhciB2aWV3cG9ydCA9IGNvcmUuZ2V0Vmlld3BvcnQoKTtcclxuXHJcbiAgICBmdW5jdGlvbiByZXNldCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBjb3JlLmhpZGVHYW1lT3ZlcigpO1xyXG4gICAgICAgIGlzR2FtZU92ZXIgPSBmYWxzZTtcclxuICAgICAgICBzY29yZSA9IDA7XHJcbiAgICAgICAgY29yZS5lbmVtaWVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgY29yZS5jcmVhdGVQbGF5ZXIoXHJcbiAgICAgICAgW3ZpZXdwb3J0LndpZHRoIC8gMiwgdmlld3BvcnQuaGVpZ2h0IC8gMl0sXHJcbiAgICAgICAgY29yZS5jcmVhdGVTcHJpdGUoXCIuLi8uLi9pbWcvcmVjdC5qcGdcIiwgWzAsIDBdLCBbMTAwLCAxMDBdLCAwLCBbMF0pXHJcbiAgICApO1xyXG4gICAgY29yZS5jcmVhdGVCYWNrZ3JvdW5kKFxyXG4gICAgICAgIFswLCAwXSxcclxuICAgICAgICBjb3JlLmNyZWF0ZVNwcml0ZShcIi4uLy4uL2ltZy9ibGFjay5qcGdcIiwgWzAsIDBdLCBbdmlld3BvcnQud2lkdGgsIHZpZXdwb3J0LmhlaWdodF0sIDApXHJcbiAgICApO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUVuaXRpZXMoZHQpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBjb3JlLnBsYXllci5zcHJpdGUudXBkYXRlKGR0KTtcclxuICAgICAgICBjb3JlLmJhY2tncm91bmQucG9zID0gW2NvcmUuYmFja2dyb3VuZC5wb3NbMF0gLSAxMCwgY29yZS5iYWNrZ3JvdW5kLnBvc1sxXV07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdXBkYXRlRW5pdGllcyhkdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVuZGVyKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGNvcmUucmVuZGVyKCk7XHJcbiAgICAgICAgY29yZS5zZXRTY29yZShzY29yZSk7XHJcbiAgICAgICAgaWYgKGlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgY29yZS5yZW5kZXJHYW1lT3ZlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYWluKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIHZhciBkdCA9IChub3cgLSBsYXN0VGltZSkgLyAxMDAwO1xyXG5cclxuICAgICAgICB1cGRhdGUoZHQpO1xyXG4gICAgICAgIHJlbmRlcigpO1xyXG5cclxuICAgICAgICBsYXN0VGltZSA9IG5vdztcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBzY29yZSA9IDA7XHJcbiAgICAgICAgaXNHYW1lT3ZlciA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpbnB1dCA9IGNvcmUuZ2V0SW5wdXQod2luZG93XywgXCJrZXlib2FyZFwiKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXktYWdhaW5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXNldCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxhc3RUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICBtYWluKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29yZS5sb2FkUmVzb3VyY2VzKFtcclxuICAgICAgICBcImltZy9ibGFjay5qcGdcIixcclxuICAgICAgICBcImltZy9yZWN0LmpwZ1wiXHJcbiAgICBdKTtcclxuXHJcbiAgICBjb3JlLm9uUmVzb3VyY2VzUmVhZHkoaW5pdCk7XHJcbn07Il19
