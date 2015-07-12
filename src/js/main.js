// modules are defined as an array
// [ module function, map of requireuires ]
//
// map of requireuires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the requireuire for previous bundles

(function outer (modules, cache, entry) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof require == "function" && require;

    function newRequire(name, jumped){
        if(!cache[name]) {
            if(!modules[name]) {
                // if we cannot find the the module within our internal map or
                // cache jump to the current global require ie. the last bundle
                // that was added to the page.
                var currentRequire = typeof require == "function" && require;
                if (!jumped && currentRequire) return currentRequire(name, true);

                // If there are other bundles on this page the require from the
                // previous one is saved to 'previousRequire'. Repeat this as
                // many times as there are bundles until the module is found or
                // we exhaust the require chain.
                if (previousRequire) return previousRequire(name, true);
                throw new Error('Cannot find module \'' + name + '\'');
            }
            var m = cache[name] = {exports:{}};
            modules[name][0].call(m.exports, function(x){
                var id = modules[name][1][x];
                return newRequire(id ? id : x);
            },m,m.exports,outer,modules,cache,entry);
        }
        return cache[name].exports;
    }
    for(var i=0;i<entry.length;i++) newRequire(entry[i]);

    // Override the current require with this new one
    return newRequire;
})({1:[function(require,module,exports){
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

var display = new display_.CanvasDisplay();

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

function clearDisplay() {
    "use strict";
    display.clearDisplay();
}

function renderGameOver() {
    "use strict";
    display.renderGameOver();
}

function hideGameOver() {
    "use strict";
    display.hideGameOver();
}

function setScore(score) {
    "use strict";
    display.setScore(score)
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
    clearRender: clearDisplay,
    renderGameOver: renderGameOver,
    hideGameOver: hideGameOver,
    setScore: setScore,
    getViewport: getViewport
};


},{"./config.js":2,"./display.js":4,"./input.js":6,"./model.js":7,"./resources.js":8,"./sprite.js":9}],4:[function(require,module,exports){
var config = require("./config.js");
//var core = require("./core.js");
var model = require("./model.js");

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

CanvasDisplay.prototype.renderBackground = function() {  //WTF?!
    "use strict";
    this.cx.save();
    this.cx.translate(model.background.pos[0], model.background.pos[1]);
    model.background.sprites[model.background.currentSprite].render(this.cx);
    this.cx.restore();
};

CanvasDisplay.prototype.renderEnemies = function() {
    "use strict";
    for (var i = 0; i < model.enemies.length; i++) {
        this._render(model.enemies[i]);
    }
};

CanvasDisplay.prototype.renderPlayer = function() {
    "use strict";
    this._render(model.player);
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

module.exports = {
    CanvasDisplay: CanvasDisplay
};
},{"./config.js":2,"./model.js":7}],5:[function(require,module,exports){
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
function input(window_, type) {    //type - keyboard, medicine, smartphone
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
                window_.addEventListener("keydown", handler);
                window_.addEventListener("keyup", handler);
                window_.addEventListener("blur", clearAll());
                break;
            default :
                throw new Error("Wrong type of input");
        }
    }
    return pressed;
}

module.exports = input;
},{}],7:[function(require,module,exports){
module.exports.player = {};
module.exports.enemies = [];
module.exports.background = {};
module.exports.bonuses = [];
/**
 * Should be call once
 * @param pos
 * @param sprite
 * @returns player
 */
module.exports.createPlayer = function createPlayer(pos, sprite) {
    "use strict";
    module.exports.player.pos = pos || [0, 0];
    module.exports.player.sprite = sprite;
    return module.exports.player;
};

/**
 * Should be call once
 * @param pos
 * @param sprites
 * @returns background
 */
module.exports.createBackground = function createBackground(pos, sprites) {
    "use strict";
    module.exports.background.pos = pos || [0, 0];
    module.exports.background.sprites = sprites;
    module.exports.background.currentSprite = 0;
    module.exports.background.spritesLength = sprites.length || 1;
    return module.exports.background;
};
/**
 * Add enemie to enemies
 * @param pos
 * @param sprite
 */
module.exports.createEnemie = function createEnemie(pos, sprite) {
    "use strict";
    module.exports.enemies.push({
        pos: pos,
        sprite: sprite
    });
};
/**
 * Add bonus to bonuses
 * @param pos
 * @param sprite
 * @param {string} type Can be: speed, slow, small, big
 */
module.exports.createBonus = function createBonus(pos, sprite, type) {
    "use strict";
    module.exports.bonuses.push({
        pos: pos,
        sprite: sprite,
        type: type
    });
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
var resources = require("./resources.js");

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

    ctx.drawImage(resources.get(this.url), x, y, this.size[0], this.size[1], 0, 0, this.size[0], this.size[1]);
};

module.exports = Sprite;
},{"./resources.js":8}],10:[function(require,module,exports){
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
    core.createSprite("img/rect.jpg", [0, 0], [100, 100], 0, [0])
);
core.createBackground(
    [0, 0],
    [core.createSprite("img/black.jpg", [0, 0], [viewport.width, viewport.height], 0)]
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
},{"./core.js":3}]},{},[1,2,3,4,5,6,7,8,9,10])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXVkaW8uanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2NvcmUuanMiLCJzcmMvanMvZGlzcGxheS5qcyIsInNyYy9qcy9nYW1lLmpzIiwic3JjL2pzL2lucHV0LmpzIiwic3JjL2pzL21vZGVsLmpzIiwic3JjL2pzL3Jlc291cmNlcy5qcyIsInNyYy9qcy9zcHJpdGUuanMiLCJzcmMvanMvd29ybGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBtb2R1bGVzIGFyZSBkZWZpbmVkIGFzIGFuIGFycmF5XHJcbi8vIFsgbW9kdWxlIGZ1bmN0aW9uLCBtYXAgb2YgcmVxdWlyZXVpcmVzIF1cclxuLy9cclxuLy8gbWFwIG9mIHJlcXVpcmV1aXJlcyBpcyBzaG9ydCByZXF1aXJlIG5hbWUgLT4gbnVtZXJpYyByZXF1aXJlXHJcbi8vXHJcbi8vIGFueXRoaW5nIGRlZmluZWQgaW4gYSBwcmV2aW91cyBidW5kbGUgaXMgYWNjZXNzZWQgdmlhIHRoZVxyXG4vLyBvcmlnIG1ldGhvZCB3aGljaCBpcyB0aGUgcmVxdWlyZXVpcmUgZm9yIHByZXZpb3VzIGJ1bmRsZXNcclxuXHJcbihmdW5jdGlvbiBvdXRlciAobW9kdWxlcywgY2FjaGUsIGVudHJ5KSB7XHJcbiAgICAvLyBTYXZlIHRoZSByZXF1aXJlIGZyb20gcHJldmlvdXMgYnVuZGxlIHRvIHRoaXMgY2xvc3VyZSBpZiBhbnlcclxuICAgIHZhciBwcmV2aW91c1JlcXVpcmUgPSB0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZTtcclxuXHJcbiAgICBmdW5jdGlvbiBuZXdSZXF1aXJlKG5hbWUsIGp1bXBlZCl7XHJcbiAgICAgICAgaWYoIWNhY2hlW25hbWVdKSB7XHJcbiAgICAgICAgICAgIGlmKCFtb2R1bGVzW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSBjYW5ub3QgZmluZCB0aGUgdGhlIG1vZHVsZSB3aXRoaW4gb3VyIGludGVybmFsIG1hcCBvclxyXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUganVtcCB0byB0aGUgY3VycmVudCBnbG9iYWwgcmVxdWlyZSBpZS4gdGhlIGxhc3QgYnVuZGxlXHJcbiAgICAgICAgICAgICAgICAvLyB0aGF0IHdhcyBhZGRlZCB0byB0aGUgcGFnZS5cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50UmVxdWlyZSA9IHR5cGVvZiByZXF1aXJlID09IFwiZnVuY3Rpb25cIiAmJiByZXF1aXJlO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFqdW1wZWQgJiYgY3VycmVudFJlcXVpcmUpIHJldHVybiBjdXJyZW50UmVxdWlyZShuYW1lLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgb3RoZXIgYnVuZGxlcyBvbiB0aGlzIHBhZ2UgdGhlIHJlcXVpcmUgZnJvbSB0aGVcclxuICAgICAgICAgICAgICAgIC8vIHByZXZpb3VzIG9uZSBpcyBzYXZlZCB0byAncHJldmlvdXNSZXF1aXJlJy4gUmVwZWF0IHRoaXMgYXNcclxuICAgICAgICAgICAgICAgIC8vIG1hbnkgdGltZXMgYXMgdGhlcmUgYXJlIGJ1bmRsZXMgdW50aWwgdGhlIG1vZHVsZSBpcyBmb3VuZCBvclxyXG4gICAgICAgICAgICAgICAgLy8gd2UgZXhoYXVzdCB0aGUgcmVxdWlyZSBjaGFpbi5cclxuICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c1JlcXVpcmUpIHJldHVybiBwcmV2aW91c1JlcXVpcmUobmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIG1vZHVsZSBcXCcnICsgbmFtZSArICdcXCcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbSA9IGNhY2hlW25hbWVdID0ge2V4cG9ydHM6e319O1xyXG4gICAgICAgICAgICBtb2R1bGVzW25hbWVdWzBdLmNhbGwobS5leHBvcnRzLCBmdW5jdGlvbih4KXtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IG1vZHVsZXNbbmFtZV1bMV1beF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3UmVxdWlyZShpZCA/IGlkIDogeCk7XHJcbiAgICAgICAgICAgIH0sbSxtLmV4cG9ydHMsb3V0ZXIsbW9kdWxlcyxjYWNoZSxlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYWNoZVtuYW1lXS5leHBvcnRzO1xyXG4gICAgfVxyXG4gICAgZm9yKHZhciBpPTA7aTxlbnRyeS5sZW5ndGg7aSsrKSBuZXdSZXF1aXJlKGVudHJ5W2ldKTtcclxuXHJcbiAgICAvLyBPdmVycmlkZSB0aGUgY3VycmVudCByZXF1aXJlIHdpdGggdGhpcyBuZXcgb25lXHJcbiAgICByZXR1cm4gbmV3UmVxdWlyZTtcclxufSkiLCIvKipcclxuICogQ3JlYXRlZCBieSBVU0VSIG9uIDEwLjA3LjIwMTUuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbn07IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgVVNFUiBvbiAxMC4wNy4yMDE1LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB3aWR0aDogMTAyNCxcclxuICAgIGhlaWdodDogNjAwLFxyXG4gICAgaW5wdXRUeXBlOiBcImtleWJvYXJkXCIsXHJcbiAgICBiYWNrZ3JvdW5kU3BlZWQ6IDIwXHJcbn07IiwidmFyIHJlc291cmNlcyA9IHJlcXVpcmUoXCIuL3Jlc291cmNlcy5qc1wiKTtcclxudmFyIFNwcml0ZSA9IHJlcXVpcmUoXCIuL3Nwcml0ZS5qc1wiKTtcclxudmFyIGlucHV0ID0gcmVxdWlyZShcIi4vaW5wdXQuanNcIik7XHJcbnZhciBtb2RlbCA9IHJlcXVpcmUoXCIuL21vZGVsLmpzXCIpO1xyXG52YXIgZGlzcGxheV8gPSAgcmVxdWlyZShcIi4vZGlzcGxheS5qc1wiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZy5qc1wiKTtcclxuXHJcbnZhciBkaXNwbGF5ID0gbmV3IGRpc3BsYXlfLkNhbnZhc0Rpc3BsYXkoKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiBuZXcgU3ByaXRlKHVybCwgcG9zLCBzaXplLCBzcGVlZCwgZnJhbWVzLCBkaXIsIG9uY2UpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWaWV3cG9ydCgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB3aWR0aDogY29uZmlnLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogY29uZmlnLmhlaWdodFxyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnJlbmRlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhckRpc3BsYXkoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuY2xlYXJEaXNwbGF5KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlckdhbWVPdmVyKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnJlbmRlckdhbWVPdmVyKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGVHYW1lT3ZlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5oaWRlR2FtZU92ZXIoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U2NvcmUoc2NvcmUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5zZXRTY29yZShzY29yZSlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBsb2FkUmVzb3VyY2VzOiByZXNvdXJjZXMubG9hZCxcclxuICAgIGdldFJlc291cmNlOiByZXNvdXJjZXMuZ2V0LFxyXG4gICAgb25SZXNvdXJjZXNSZWFkeTogcmVzb3VyY2VzLm9uUmVhZHksXHJcbiAgICBjcmVhdGVTcHJpdGU6IGNyZWF0ZVNwcml0ZSxcclxuICAgIGdldElucHV0OiBpbnB1dCxcclxuICAgIGNyZWF0ZVBsYXllcjogbW9kZWwuY3JlYXRlUGxheWVyLFxyXG4gICAgY3JlYXRlQmFja2dyb3VuZDogbW9kZWwuY3JlYXRlQmFja2dyb3VuZCxcclxuICAgIGNyZWF0ZUVuZW1pZTogbW9kZWwuY3JlYXRlRW5lbWllLFxyXG4gICAgY3JlYXRlQm9udXM6IG1vZGVsLmNyZWF0ZUJvbnVzLFxyXG4gICAgcGxheWVyOiBtb2RlbC5wbGF5ZXIsXHJcbiAgICBiYWNrZ3JvdW5kOiBtb2RlbC5iYWNrZ3JvdW5kLFxyXG4gICAgZW5lbWllczogbW9kZWwuZW5lbWllcyxcclxuICAgIGJvbnVzZXM6IG1vZGVsLmJvbnVzZXMsXHJcbiAgICByZW5kZXI6IHJlbmRlcixcclxuICAgIGNsZWFyUmVuZGVyOiBjbGVhckRpc3BsYXksXHJcbiAgICByZW5kZXJHYW1lT3ZlcjogcmVuZGVyR2FtZU92ZXIsXHJcbiAgICBoaWRlR2FtZU92ZXI6IGhpZGVHYW1lT3ZlcixcclxuICAgIHNldFNjb3JlOiBzZXRTY29yZSxcclxuICAgIGdldFZpZXdwb3J0OiBnZXRWaWV3cG9ydFxyXG59O1xyXG5cclxuIiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZy5qc1wiKTtcclxuLy92YXIgY29yZSA9IHJlcXVpcmUoXCIuL2NvcmUuanNcIik7XHJcbnZhciBtb2RlbCA9IHJlcXVpcmUoXCIuL21vZGVsLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gZmxpcEhvcml6b250YWxseShjb250ZXh0LCBhcm91bmQpIHtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKGFyb3VuZCwgMCk7XHJcbiAgICBjb250ZXh0LnNjYWxlKC0xLCAxKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC1hcm91bmQsIDApO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHNlZSBkaXNwbGF5XHJcbiAqL1xyXG5mdW5jdGlvbiBDYW52YXNEaXNwbGF5KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IGNvbmZpZy53aWR0aDtcclxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IGNvbmZpZy5oZWlnaHQ7XHJcbiAgICB0aGlzLnNjb3JlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlXCIpO1xyXG5cclxuICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dhbWVcIik7XHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG4gICAgdGhpcy5jeCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbn1cclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY2FudmFzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5jYW52YXMpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuY2xlYXJEaXNwbGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY3guZmlsbFN0eWxlID0gXCJyZ2IoNTIsIDE2NiwgMjUxKVwiO1xyXG4gICAgdGhpcy5jeC5maWxsUmVjdCgwLCAwLCBjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uKGVuZW15KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY3guc2F2ZSgpO1xyXG4gICAgdGhpcy5jeC50cmFuc2xhdGUoZW5lbXkucG9zWzBdLCBlbmVteS5wb3NbMV0pO1xyXG4gICAgZW5lbXkuc3ByaXRlLnJlbmRlcih0aGlzLmN4KTtcclxuICAgIHRoaXMuY3gucmVzdG9yZSgpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyQmFja2dyb3VuZCA9IGZ1bmN0aW9uKCkgeyAgLy9XVEY/IVxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmN4LnNhdmUoKTtcclxuICAgIHRoaXMuY3gudHJhbnNsYXRlKG1vZGVsLmJhY2tncm91bmQucG9zWzBdLCBtb2RlbC5iYWNrZ3JvdW5kLnBvc1sxXSk7XHJcbiAgICBtb2RlbC5iYWNrZ3JvdW5kLnNwcml0ZXNbbW9kZWwuYmFja2dyb3VuZC5jdXJyZW50U3ByaXRlXS5yZW5kZXIodGhpcy5jeCk7XHJcbiAgICB0aGlzLmN4LnJlc3RvcmUoKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlckVuZW1pZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb2RlbC5lbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyKG1vZGVsLmVuZW1pZXNbaV0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyUGxheWVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuX3JlbmRlcihtb2RlbC5wbGF5ZXIpO1xyXG59O1xyXG4vKipcclxuICogQ2xlYXIgcmVuZGVyLCByZW5kZXIgYmFja2dyb3VuZCwgcmVuZGVyIGVuZW1pZXMsIHJlbmRlciBwbGF5ZXJcclxuICovXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmNsZWFyRGlzcGxheSgpO1xyXG4gICAgdGhpcy5yZW5kZXJCYWNrZ3JvdW5kKCk7XHJcbiAgICB0aGlzLnJlbmRlckVuZW1pZXMoKTtcclxuICAgIHRoaXMucmVuZGVyUGxheWVyKCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJHYW1lT3ZlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLW92ZXJcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1vdmVyLW92ZXJsYXlcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmhpZGVHYW1lT3ZlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtb3ZlclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtb3Zlci1vdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vZGVcIjtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnNldFNjb3JlID0gZnVuY3Rpb24oc2NvcmUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5zY29yZUVsLmlubmVySFRNTCA9IHNjb3JlLnRvU3RyaW5nKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIENhbnZhc0Rpc3BsYXk6IENhbnZhc0Rpc3BsYXlcclxufTsiLCJ2YXIgd29ybGQgPSByZXF1aXJlKFwiLi93b3JsZC5qc1wiKTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB3b3JsZCh3aW5kb3cpO1xyXG59KTsiLCIvKipcclxuICogQHBhcmFtIHdpbmRvdyBHbG9iYWwgb2JqZWN0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIENhbiBiZTprZXlib2FyZCwgbWVkaWNpbmUsIHNtYXJ0cGhvbmVcclxuICogQHJldHVybnMgT2JqZWN0IHdoaWNoIGNvbnRlbnQgaW5mbyBhYm91dCBwcmVzc2VkIGJ1dHRvbnNcclxuICogQHNlZSBnZXRJbnB1dFxyXG4gKi9cclxuZnVuY3Rpb24gaW5wdXQod2luZG93XywgdHlwZSkgeyAgICAvL3R5cGUgLSBrZXlib2FyZCwgbWVkaWNpbmUsIHNtYXJ0cGhvbmVcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIHByZXNzZWQgPSBudWxsO1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xyXG4gICAgICAgIGlmIChjb2Rlcy5oYXNPd25Qcm9wZXJ0eShldmVudC5rZXlDb2RlKSkge1xyXG4gICAgICAgICAgICB2YXIgZG93biA9IGV2ZW50LnR5cGUgPT09IFwia2V5ZG93blwiO1xyXG4gICAgICAgICAgICBwcmVzc2VkW2NvZGVzW2V2ZW50LmtleUNvZGVdXSA9IGRvd247XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsZWFyQWxsKCkge1xyXG4gICAgICAgIGZvciAodmFyIGMgaW4gcHJlc3NlZCkge1xyXG4gICAgICAgICAgICBpZiAocHJlc3NlZC5oYXNPd25Qcm9wZXJ0eShjKSlcclxuICAgICAgICAgICAgICAgIHByZXNzZWRbY10gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFwcmVzc2VkKSB7XHJcbiAgICAgICAgcHJlc3NlZCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICAgICAgdmFyIGNvZGVzS2V5Ym9hcmQgPSB7Mzg6IFwidXBcIn07XHJcbiAgICAgICAgdmFyIGNvZGVzO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImtleWJvYXJkXCI6XHJcbiAgICAgICAgICAgICAgICBjb2RlcyA9IGNvZGVzS2V5Ym9hcmQ7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3dfLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Xy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3dfLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIGNsZWFyQWxsKCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV3JvbmcgdHlwZSBvZiBpbnB1dFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJlc3NlZDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dDsiLCJtb2R1bGUuZXhwb3J0cy5wbGF5ZXIgPSB7fTtcclxubW9kdWxlLmV4cG9ydHMuZW5lbWllcyA9IFtdO1xyXG5tb2R1bGUuZXhwb3J0cy5iYWNrZ3JvdW5kID0ge307XHJcbm1vZHVsZS5leHBvcnRzLmJvbnVzZXMgPSBbXTtcclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsIG9uY2VcclxuICogQHBhcmFtIHBvc1xyXG4gKiBAcGFyYW0gc3ByaXRlXHJcbiAqIEByZXR1cm5zIHBsYXllclxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlUGxheWVyID0gZnVuY3Rpb24gY3JlYXRlUGxheWVyKHBvcywgc3ByaXRlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIG1vZHVsZS5leHBvcnRzLnBsYXllci5wb3MgPSBwb3MgfHwgWzAsIDBdO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMucGxheWVyLnNwcml0ZSA9IHNwcml0ZTtcclxuICAgIHJldHVybiBtb2R1bGUuZXhwb3J0cy5wbGF5ZXI7XHJcbn07XHJcblxyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGwgb25jZVxyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVzXHJcbiAqIEByZXR1cm5zIGJhY2tncm91bmRcclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZUJhY2tncm91bmQgPSBmdW5jdGlvbiBjcmVhdGVCYWNrZ3JvdW5kKHBvcywgc3ByaXRlcykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy5iYWNrZ3JvdW5kLnBvcyA9IHBvcyB8fCBbMCwgMF07XHJcbiAgICBtb2R1bGUuZXhwb3J0cy5iYWNrZ3JvdW5kLnNwcml0ZXMgPSBzcHJpdGVzO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuYmFja2dyb3VuZC5jdXJyZW50U3ByaXRlID0gMDtcclxuICAgIG1vZHVsZS5leHBvcnRzLmJhY2tncm91bmQuc3ByaXRlc0xlbmd0aCA9IHNwcml0ZXMubGVuZ3RoIHx8IDE7XHJcbiAgICByZXR1cm4gbW9kdWxlLmV4cG9ydHMuYmFja2dyb3VuZDtcclxufTtcclxuLyoqXHJcbiAqIEFkZCBlbmVtaWUgdG8gZW5lbWllc1xyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVcclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZUVuZW1pZSA9IGZ1bmN0aW9uIGNyZWF0ZUVuZW1pZShwb3MsIHNwcml0ZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy5lbmVtaWVzLnB1c2goe1xyXG4gICAgICAgIHBvczogcG9zLFxyXG4gICAgICAgIHNwcml0ZTogc3ByaXRlXHJcbiAgICB9KTtcclxufTtcclxuLyoqXHJcbiAqIEFkZCBib251cyB0byBib251c2VzXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBDYW4gYmU6IHNwZWVkLCBzbG93LCBzbWFsbCwgYmlnXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVCb251cyA9IGZ1bmN0aW9uIGNyZWF0ZUJvbnVzKHBvcywgc3ByaXRlLCB0eXBlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIG1vZHVsZS5leHBvcnRzLmJvbnVzZXMucHVzaCh7XHJcbiAgICAgICAgcG9zOiBwb3MsXHJcbiAgICAgICAgc3ByaXRlOiBzcHJpdGUsXHJcbiAgICAgICAgdHlwZTogdHlwZVxyXG4gICAgfSk7XHJcbn07IiwidmFyIHJlc291cmNlQ2FjaGUgPSB7fTtcclxudmFyIHJlYWR5Q2FsbGJhY2tzID0gW107XHJcblxyXG5mdW5jdGlvbiBpc1JlYWR5KCkge1xyXG4gICAgdmFyIHJlYWR5ID0gdHJ1ZTtcclxuICAgIGZvciAodmFyIGsgaW4gcmVzb3VyY2VDYWNoZSkge1xyXG4gICAgICAgIGlmIChyZXNvdXJjZUNhY2hlLmhhc093blByb3BlcnR5KGspICYmICFyZXNvdXJjZUNhY2hlW2tdKSB7XHJcbiAgICAgICAgICAgIHJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlYWR5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBfbG9hZCh1cmwpIHtcclxuICAgIGlmIChyZXNvdXJjZUNhY2hlW3VybF0pIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VDYWNoZVt1cmxdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmVzb3VyY2VDYWNoZVt1cmxdID0gaW1nO1xyXG4gICAgICAgICAgICBpZiAoaXNSZWFkeSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZWFkeUNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGltZy5zcmMgPSB1cmw7XHJcbiAgICAgICAgcmVzb3VyY2VDYWNoZVt1cmxdID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIExvYWQgaW1hZ2UgYW5kIGFkZCB0aGVtIHRvIGNhY2hlXHJcbiAqQHBhcmFtIHsoc3RyaW5nfHN0cmluZ1tdKX0gdXJsT2ZBcnIgQXJyYXkgb2YgdXJsc1xyXG4gKiBAc2VlIGxvYWRSZXNvdXJjZXNcclxuICovXHJcbmZ1bmN0aW9uIGxvYWQodXJsT2ZBcnIpIHtcclxuICAgIGlmICh1cmxPZkFyciBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgdXJsT2ZBcnIuZm9yRWFjaChmdW5jdGlvbiAodXJsKSB7XHJcbiAgICAgICAgICAgIF9sb2FkKHVybCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIF9sb2FkKHVybE9mQXJyKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogR2V0IHJlc291cmNlIGZyb20gY2FjaGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxyXG4gKiBAcmV0dXJucyAgSW1hZ2VcclxuICogQHNlZSBnZXRSZXNvdXJjZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0KHVybCkge1xyXG4gICAgcmV0dXJuIHJlc291cmNlQ2FjaGVbdXJsXTtcclxufVxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uIHRvIGZ1bmN0aW9ucyB3aGljaCB3aWxsIGJlIGNhbGxlZCB0aGVuIGFsbCByZXNvdXJjZXMgbG9hZGVkXHJcbiAqIEBwYXJhbSBmdW5jXHJcbiAqIEBzZWUgb25SZXNvdXJjZXNSZWFkeVxyXG4gKi9cclxuZnVuY3Rpb24gb25SZWFkeShmdW5jKSB7XHJcbiAgICByZWFkeUNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGxvYWQ6IGxvYWQsXHJcbiAgICBnZXQ6IGdldCxcclxuICAgIG9uUmVhZHk6IG9uUmVhZHksXHJcbiAgICBpc1JlYWR5OiBpc1JlYWR5XHJcbn07XHJcbiIsInZhciByZXNvdXJjZXMgPSByZXF1aXJlKFwiLi9yZXNvdXJjZXMuanNcIik7XHJcblxyXG4vKipcclxuICogU3ByaXRlIG9mIHRleHR1cmVcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBwb3MgUG9zaXRpb24gaW4gc3ByaXRlIHNoZWV0XHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IHNpemUgU2l6ZSBpbiBzcHJpdGUgc2hlZXRcclxuICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIFNwZWVkIG9mIHBsYXlpbmcgYW5pbWF0aW9uXHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IGZyYW1lcyBGcmFtZXMgb2YgYW5pbWF0aW9uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXIgRGlyZWN0aW9uIG9uIHNwcml0ZSBzaGVldFxyXG4gKiBAcGFyYW0ge2Jvb2x9IG9uY2UgQ291bnQgb2YgcGxheWluZyBhbmltYXRpb25cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBzZWUgY3JlYXRlU3ByaXRlXHJcbiAqIEBzZWUgY3JlYXRlU3ByaXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBTcHJpdGUodXJsLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZSkge1xyXG4gICAgdGhpcy5wb3MgPSBwb3M7XHJcbiAgICB0aGlzLnVybCA9IHVybDtcclxuICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICB0aGlzLnNwZWVkID0gdHlwZW9mIHNwZWVkID09PSBcIm51bWJlclwiID8gc3BlZWQgOiAwO1xyXG4gICAgdGhpcy5mcmFtZXMgPSBmcmFtZXM7XHJcbiAgICB0aGlzLmRpciA9IGRpciB8fCBcImhvcml6b250YWxcIjtcclxuICAgIHRoaXMub25jZSA9IG9uY2U7XHJcbiAgICB0aGlzLl9pbmRleCA9IDA7XHJcbn1cclxuXHJcblNwcml0ZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICB0aGlzLl9pbmRleCArPSB0aGlzLnNwZWVkICogZHQ7XHJcbn07XHJcblNwcml0ZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGN0eCkge1xyXG4gICAgdmFyIGZyYW1lO1xyXG4gICAgaWYgKHRoaXMuc3BlZWQgPiAwKSB7XHJcbiAgICAgICAgdmFyIG1heCA9IHRoaXMuZnJhbWVzLmxlbmd0aDtcclxuICAgICAgICB2YXIgaWR4ID0gTWF0aC5mbG9vcih0aGlzLl9pbmRleCk7XHJcbiAgICAgICAgZnJhbWUgPSB0aGlzLmZyYW1lc1tpZHggJSBtYXhdO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vbmNlICYmIGlkeCA+PSBtYXgpIHtcclxuICAgICAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZnJhbWUgPSAwO1xyXG4gICAgfVxyXG4gICAgdmFyIHggPSB0aGlzLnBvc1swXTtcclxuICAgIHZhciB5ID0gdGhpcy5wb3NbMV07XHJcblxyXG4gICAgaWYgKHRoaXMuZGlyID09PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgICB5ICs9IGZyYW1lICogdGhpcy5zaXplWzFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB4ICs9IGZyYW1lICogdGhpcy5zaXplWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5kcmF3SW1hZ2UocmVzb3VyY2VzLmdldCh0aGlzLnVybCksIHgsIHksIHRoaXMuc2l6ZVswXSwgdGhpcy5zaXplWzFdLCAwLCAwLCB0aGlzLnNpemVbMF0sIHRoaXMuc2l6ZVsxXSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTsiLCJ2YXIgY29yZSA9IHJlcXVpcmUoXCIuL2NvcmUuanNcIik7XHJcblxyXG52YXIgbGFzdFRpbWUsXHJcbiAgICBpc0dhbWVPdmVyLFxyXG4gICAgc2NvcmUsXHJcbiAgICBpbnB1dDtcclxudmFyIHZpZXdwb3J0ID0gY29yZS5nZXRWaWV3cG9ydCgpO1xyXG5cclxuZnVuY3Rpb24gcmVzZXQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUdhbWVPdmVyKCk7XHJcbiAgICBpc0dhbWVPdmVyID0gZmFsc2U7XHJcbiAgICBzY29yZSA9IDA7XHJcbiAgICBjb3JlLmVuZW1pZXMgPSBbXTtcclxufVxyXG5cclxuY29yZS5jcmVhdGVQbGF5ZXIoXHJcbiAgICBbdmlld3BvcnQud2lkdGggLyAyLCB2aWV3cG9ydC5oZWlnaHQgLyAyXSxcclxuICAgIGNvcmUuY3JlYXRlU3ByaXRlKFwiaW1nL3JlY3QuanBnXCIsIFswLCAwXSwgWzEwMCwgMTAwXSwgMCwgWzBdKVxyXG4pO1xyXG5jb3JlLmNyZWF0ZUJhY2tncm91bmQoXHJcbiAgICBbMCwgMF0sXHJcbiAgICBbY29yZS5jcmVhdGVTcHJpdGUoXCJpbWcvYmxhY2suanBnXCIsIFswLCAwXSwgW3ZpZXdwb3J0LndpZHRoLCB2aWV3cG9ydC5oZWlnaHRdLCAwKV1cclxuKTtcclxuZnVuY3Rpb24gdXBkYXRlRW5pdGllcyhkdCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLnBsYXllci5zcHJpdGUudXBkYXRlKGR0KTtcclxuICAgIGNvcmUuYmFja2dyb3VuZC5wb3MgPSBbY29yZS5iYWNrZ3JvdW5kLnBvc1swXSAtIDEwLCBjb3JlLmJhY2tncm91bmQucG9zWzFdXTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHVwZGF0ZUVuaXRpZXMoZHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUucmVuZGVyKCk7XHJcbiAgICBjb3JlLnNldFNjb3JlKHNjb3JlKTtcclxuICAgIGlmIChpc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgY29yZS5yZW5kZXJHYW1lT3ZlcigpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgIHZhciBkdCA9IChub3cgLSBsYXN0VGltZSkgLyAxMDAwO1xyXG5cclxuICAgIHVwZGF0ZShkdCk7XHJcbiAgICByZW5kZXIoKTtcclxuXHJcbiAgICBsYXN0VGltZSA9IG5vdztcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgc2NvcmUgPSAwO1xyXG4gICAgaXNHYW1lT3ZlciA9IGZhbHNlO1xyXG5cclxuICAgIGlucHV0ID0gY29yZS5nZXRJbnB1dCh3aW5kb3csIFwia2V5Ym9hcmRcIik7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXktYWdhaW5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJlc2V0KCk7XHJcbiAgICB9KTtcclxuICAgIGxhc3RUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgIG1haW4oKTtcclxufVxyXG5cclxuY29yZS5sb2FkUmVzb3VyY2VzKFtcclxuICAgIFwiaW1nL2JsYWNrLmpwZ1wiLFxyXG4gICAgXCJpbWcvcmVjdC5qcGdcIlxyXG5dKTtcclxuXHJcbmNvcmUub25SZXNvdXJjZXNSZWFkeShpbml0KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbn07Il19
