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
    backgroundSpeed: 150,
    gravity: 30,
    breatheSpeed: 10
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
    display.setScore(score);
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
    module.exports.player.speed = {x: 1, y: 0};
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
},{"./config.js":2,"./core.js":3}]},{},[1,2,3,4,5,6,7,8,9,10])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXVkaW8uanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2NvcmUuanMiLCJzcmMvanMvZGlzcGxheS5qcyIsInNyYy9qcy9nYW1lLmpzIiwic3JjL2pzL2lucHV0LmpzIiwic3JjL2pzL21vZGVsLmpzIiwic3JjL2pzL3Jlc291cmNlcy5qcyIsInNyYy9qcy9zcHJpdGUuanMiLCJzcmMvanMvd29ybGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8vIG1vZHVsZXMgYXJlIGRlZmluZWQgYXMgYW4gYXJyYXlcclxuLy8gWyBtb2R1bGUgZnVuY3Rpb24sIG1hcCBvZiByZXF1aXJldWlyZXMgXVxyXG4vL1xyXG4vLyBtYXAgb2YgcmVxdWlyZXVpcmVzIGlzIHNob3J0IHJlcXVpcmUgbmFtZSAtPiBudW1lcmljIHJlcXVpcmVcclxuLy9cclxuLy8gYW55dGhpbmcgZGVmaW5lZCBpbiBhIHByZXZpb3VzIGJ1bmRsZSBpcyBhY2Nlc3NlZCB2aWEgdGhlXHJcbi8vIG9yaWcgbWV0aG9kIHdoaWNoIGlzIHRoZSByZXF1aXJldWlyZSBmb3IgcHJldmlvdXMgYnVuZGxlc1xyXG5cclxuKGZ1bmN0aW9uIG91dGVyIChtb2R1bGVzLCBjYWNoZSwgZW50cnkpIHtcclxuICAgIC8vIFNhdmUgdGhlIHJlcXVpcmUgZnJvbSBwcmV2aW91cyBidW5kbGUgdG8gdGhpcyBjbG9zdXJlIGlmIGFueVxyXG4gICAgdmFyIHByZXZpb3VzUmVxdWlyZSA9IHR5cGVvZiByZXF1aXJlID09IFwiZnVuY3Rpb25cIiAmJiByZXF1aXJlO1xyXG5cclxuICAgIGZ1bmN0aW9uIG5ld1JlcXVpcmUobmFtZSwganVtcGVkKXtcclxuICAgICAgICBpZighY2FjaGVbbmFtZV0pIHtcclxuICAgICAgICAgICAgaWYoIW1vZHVsZXNbbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHdlIGNhbm5vdCBmaW5kIHRoZSB0aGUgbW9kdWxlIHdpdGhpbiBvdXIgaW50ZXJuYWwgbWFwIG9yXHJcbiAgICAgICAgICAgICAgICAvLyBjYWNoZSBqdW1wIHRvIHRoZSBjdXJyZW50IGdsb2JhbCByZXF1aXJlIGllLiB0aGUgbGFzdCBidW5kbGVcclxuICAgICAgICAgICAgICAgIC8vIHRoYXQgd2FzIGFkZGVkIHRvIHRoZSBwYWdlLlxyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRSZXF1aXJlID0gdHlwZW9mIHJlcXVpcmUgPT0gXCJmdW5jdGlvblwiICYmIHJlcXVpcmU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWp1bXBlZCAmJiBjdXJyZW50UmVxdWlyZSkgcmV0dXJuIGN1cnJlbnRSZXF1aXJlKG5hbWUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBvdGhlciBidW5kbGVzIG9uIHRoaXMgcGFnZSB0aGUgcmVxdWlyZSBmcm9tIHRoZVxyXG4gICAgICAgICAgICAgICAgLy8gcHJldmlvdXMgb25lIGlzIHNhdmVkIHRvICdwcmV2aW91c1JlcXVpcmUnLiBSZXBlYXQgdGhpcyBhc1xyXG4gICAgICAgICAgICAgICAgLy8gbWFueSB0aW1lcyBhcyB0aGVyZSBhcmUgYnVuZGxlcyB1bnRpbCB0aGUgbW9kdWxlIGlzIGZvdW5kIG9yXHJcbiAgICAgICAgICAgICAgICAvLyB3ZSBleGhhdXN0IHRoZSByZXF1aXJlIGNoYWluLlxyXG4gICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzUmVxdWlyZSkgcmV0dXJuIHByZXZpb3VzUmVxdWlyZShuYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgbW9kdWxlIFxcJycgKyBuYW1lICsgJ1xcJycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBtID0gY2FjaGVbbmFtZV0gPSB7ZXhwb3J0czp7fX07XHJcbiAgICAgICAgICAgIG1vZHVsZXNbbmFtZV1bMF0uY2FsbChtLmV4cG9ydHMsIGZ1bmN0aW9uKHgpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gbW9kdWxlc1tuYW1lXVsxXVt4XTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXdSZXF1aXJlKGlkID8gaWQgOiB4KTtcclxuICAgICAgICAgICAgfSxtLG0uZXhwb3J0cyxvdXRlcixtb2R1bGVzLGNhY2hlLGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNhY2hlW25hbWVdLmV4cG9ydHM7XHJcbiAgICB9XHJcbiAgICBmb3IodmFyIGk9MDtpPGVudHJ5Lmxlbmd0aDtpKyspIG5ld1JlcXVpcmUoZW50cnlbaV0pO1xyXG5cclxuICAgIC8vIE92ZXJyaWRlIHRoZSBjdXJyZW50IHJlcXVpcmUgd2l0aCB0aGlzIG5ldyBvbmVcclxuICAgIHJldHVybiBuZXdSZXF1aXJlO1xyXG59KSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFVTRVIgb24gMTAuMDcuMjAxNS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxufTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBVU0VSIG9uIDEwLjA3LjIwMTUuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHdpZHRoOiAxMDI0LFxyXG4gICAgaGVpZ2h0OiA2MDAsXHJcbiAgICBpbnB1dFR5cGU6IFwia2V5Ym9hcmRcIixcclxuICAgIGJhY2tncm91bmRTcGVlZDogMTUwLFxyXG4gICAgZ3Jhdml0eTogMzAsXHJcbiAgICBicmVhdGhlU3BlZWQ6IDEwXHJcbn07IiwidmFyIHJlc291cmNlcyA9IHJlcXVpcmUoXCIuL3Jlc291cmNlcy5qc1wiKTtcclxudmFyIFNwcml0ZSA9IHJlcXVpcmUoXCIuL3Nwcml0ZS5qc1wiKTtcclxudmFyIGlucHV0ID0gcmVxdWlyZShcIi4vaW5wdXQuanNcIik7XHJcbnZhciBtb2RlbCA9IHJlcXVpcmUoXCIuL21vZGVsLmpzXCIpO1xyXG52YXIgZGlzcGxheV8gPSAgcmVxdWlyZShcIi4vZGlzcGxheS5qc1wiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZy5qc1wiKTtcclxuXHJcbnZhciBkaXNwbGF5ID0gbmV3IGRpc3BsYXlfLkNhbnZhc0Rpc3BsYXkoKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiBuZXcgU3ByaXRlKHVybCwgcG9zLCBzaXplLCBzcGVlZCwgZnJhbWVzLCBkaXIsIG9uY2UpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWaWV3cG9ydCgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB3aWR0aDogY29uZmlnLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogY29uZmlnLmhlaWdodFxyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnJlbmRlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhckRpc3BsYXkoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuY2xlYXJEaXNwbGF5KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlckdhbWVPdmVyKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnJlbmRlckdhbWVPdmVyKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGVHYW1lT3ZlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5oaWRlR2FtZU92ZXIoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U2NvcmUoc2NvcmUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5zZXRTY29yZShzY29yZSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgbG9hZFJlc291cmNlczogcmVzb3VyY2VzLmxvYWQsXHJcbiAgICBnZXRSZXNvdXJjZTogcmVzb3VyY2VzLmdldCxcclxuICAgIG9uUmVzb3VyY2VzUmVhZHk6IHJlc291cmNlcy5vblJlYWR5LFxyXG4gICAgY3JlYXRlU3ByaXRlOiBjcmVhdGVTcHJpdGUsXHJcbiAgICBnZXRJbnB1dDogaW5wdXQsXHJcbiAgICBjcmVhdGVQbGF5ZXI6IG1vZGVsLmNyZWF0ZVBsYXllcixcclxuICAgIGNyZWF0ZUJhY2tncm91bmQ6IG1vZGVsLmNyZWF0ZUJhY2tncm91bmQsXHJcbiAgICBjcmVhdGVFbmVtaWU6IG1vZGVsLmNyZWF0ZUVuZW1pZSxcclxuICAgIGNyZWF0ZUJvbnVzOiBtb2RlbC5jcmVhdGVCb251cyxcclxuICAgIHBsYXllcjogbW9kZWwucGxheWVyLFxyXG4gICAgYmFja2dyb3VuZDogbW9kZWwuYmFja2dyb3VuZCxcclxuICAgIGVuZW1pZXM6IG1vZGVsLmVuZW1pZXMsXHJcbiAgICBib251c2VzOiBtb2RlbC5ib251c2VzLFxyXG4gICAgcmVuZGVyOiByZW5kZXIsXHJcbiAgICBjbGVhclJlbmRlcjogY2xlYXJEaXNwbGF5LFxyXG4gICAgcmVuZGVyR2FtZU92ZXI6IHJlbmRlckdhbWVPdmVyLFxyXG4gICAgaGlkZUdhbWVPdmVyOiBoaWRlR2FtZU92ZXIsXHJcbiAgICBzZXRTY29yZTogc2V0U2NvcmUsXHJcbiAgICBnZXRWaWV3cG9ydDogZ2V0Vmlld3BvcnRcclxufTtcclxuXHJcbiIsInZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWcuanNcIik7XHJcbi8vdmFyIGNvcmUgPSByZXF1aXJlKFwiLi9jb3JlLmpzXCIpO1xyXG52YXIgbW9kZWwgPSByZXF1aXJlKFwiLi9tb2RlbC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIGZsaXBIb3Jpem9udGFsbHkoY29udGV4dCwgYXJvdW5kKSB7XHJcbiAgICBjb250ZXh0LnRyYW5zbGF0ZShhcm91bmQsIDApO1xyXG4gICAgY29udGV4dC5zY2FsZSgtMSwgMSk7XHJcbiAgICBjb250ZXh0LnRyYW5zbGF0ZSgtYXJvdW5kLCAwKTtcclxufVxyXG4vKipcclxuICpcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBzZWUgZGlzcGxheVxyXG4gKi9cclxuZnVuY3Rpb24gQ2FudmFzRGlzcGxheSgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSBjb25maWcud2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xyXG4gICAgdGhpcy5zY29yZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZVwiKTtcclxuXHJcbiAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lXCIpO1xyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcclxuICAgIHRoaXMuY3ggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG59XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmNhbnZhcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuY2FudmFzKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmNsZWFyRGlzcGxheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmN4LmZpbGxTdHlsZSA9IFwicmdiKDUyLCAxNjYsIDI1MSlcIjtcclxuICAgIHRoaXMuY3guZmlsbFJlY3QoMCwgMCwgY29uZmlnLndpZHRoLCBjb25maWcuaGVpZ2h0KTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLl9yZW5kZXIgPSBmdW5jdGlvbihlbmVteSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmN4LnNhdmUoKTtcclxuICAgIHRoaXMuY3gudHJhbnNsYXRlKGVuZW15LnBvc1swXSwgZW5lbXkucG9zWzFdKTtcclxuICAgIGVuZW15LnNwcml0ZS5yZW5kZXIodGhpcy5jeCk7XHJcbiAgICB0aGlzLmN4LnJlc3RvcmUoKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlckJhY2tncm91bmQgPSBmdW5jdGlvbigpIHsgIC8vV1RGPyFcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jeC5zYXZlKCk7XHJcbiAgICB0aGlzLmN4LnRyYW5zbGF0ZShtb2RlbC5iYWNrZ3JvdW5kLnBvc1swXSwgbW9kZWwuYmFja2dyb3VuZC5wb3NbMV0pO1xyXG4gICAgbW9kZWwuYmFja2dyb3VuZC5zcHJpdGVzW21vZGVsLmJhY2tncm91bmQuY3VycmVudFNwcml0ZV0ucmVuZGVyKHRoaXMuY3gpO1xyXG4gICAgdGhpcy5jeC5yZXN0b3JlKCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJFbmVtaWVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9kZWwuZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcihtb2RlbC5lbmVtaWVzW2ldKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlclBsYXllciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLl9yZW5kZXIobW9kZWwucGxheWVyKTtcclxufTtcclxuLyoqXHJcbiAqIENsZWFyIHJlbmRlciwgcmVuZGVyIGJhY2tncm91bmQsIHJlbmRlciBlbmVtaWVzLCByZW5kZXIgcGxheWVyXHJcbiAqL1xyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jbGVhckRpc3BsYXkoKTtcclxuICAgIHRoaXMucmVuZGVyQmFja2dyb3VuZCgpO1xyXG4gICAgdGhpcy5yZW5kZXJFbmVtaWVzKCk7XHJcbiAgICB0aGlzLnJlbmRlclBsYXllcigpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyR2FtZU92ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1vdmVyXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtb3Zlci1vdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5oaWRlR2FtZU92ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLW92ZXJcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLW92ZXItb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub2RlXCI7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5zZXRTY29yZSA9IGZ1bmN0aW9uKHNjb3JlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuc2NvcmVFbC5pbm5lckhUTUwgPSBzY29yZS50b1N0cmluZygpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBDYW52YXNEaXNwbGF5OiBDYW52YXNEaXNwbGF5XHJcbn07IiwidmFyIHdvcmxkID0gcmVxdWlyZShcIi4vd29ybGQuanNcIik7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgd29ybGQod2luZG93KTtcclxufSk7IiwiLyoqXHJcbiAqIEBwYXJhbSB3aW5kb3cgR2xvYmFsIG9iamVjdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBDYW4gYmU6a2V5Ym9hcmQsIG1lZGljaW5lLCBzbWFydHBob25lXHJcbiAqIEByZXR1cm5zIE9iamVjdCB3aGljaCBjb250ZW50IGluZm8gYWJvdXQgcHJlc3NlZCBidXR0b25zXHJcbiAqIEBzZWUgZ2V0SW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIGlucHV0KHdpbmRvd18sIHR5cGUpIHsgICAgLy90eXBlIC0ga2V5Ym9hcmQsIG1lZGljaW5lLCBzbWFydHBob25lXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBwcmVzc2VkID0gbnVsbDtcclxuICAgIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuICAgICAgICBpZiAoY29kZXMuaGFzT3duUHJvcGVydHkoZXZlbnQua2V5Q29kZSkpIHtcclxuICAgICAgICAgICAgdmFyIGRvd24gPSBldmVudC50eXBlID09PSBcImtleWRvd25cIjtcclxuICAgICAgICAgICAgcHJlc3NlZFtjb2Rlc1tldmVudC5rZXlDb2RlXV0gPSBkb3duO1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhckFsbCgpIHtcclxuICAgICAgICBmb3IgKHZhciBjIGluIHByZXNzZWQpIHtcclxuICAgICAgICAgICAgaWYgKHByZXNzZWQuaGFzT3duUHJvcGVydHkoYykpXHJcbiAgICAgICAgICAgICAgICBwcmVzc2VkW2NdID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJlc3NlZCkge1xyXG4gICAgICAgIHByZXNzZWQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICAgIHZhciBjb2Rlc0tleWJvYXJkID0gezM4OiBcInVwXCJ9O1xyXG4gICAgICAgIHZhciBjb2RlcztcclxuXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJrZXlib2FyZFwiOlxyXG4gICAgICAgICAgICAgICAgY29kZXMgPSBjb2Rlc0tleWJvYXJkO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Xy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvd18uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Xy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBjbGVhckFsbCgpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIHR5cGUgb2YgaW5wdXRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByZXNzZWQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdXQ7IiwibW9kdWxlLmV4cG9ydHMucGxheWVyID0ge307XHJcbm1vZHVsZS5leHBvcnRzLmVuZW1pZXMgPSBbXTtcclxubW9kdWxlLmV4cG9ydHMuYmFja2dyb3VuZCA9IHt9O1xyXG5tb2R1bGUuZXhwb3J0cy5ib251c2VzID0gW107XHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbCBvbmNlXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKiBAcmV0dXJucyBwbGF5ZXJcclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVBsYXllciA9IGZ1bmN0aW9uIGNyZWF0ZVBsYXllcihwb3MsIHNwcml0ZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy5wbGF5ZXIucG9zID0gcG9zIHx8IFswLCAwXTtcclxuICAgIG1vZHVsZS5leHBvcnRzLnBsYXllci5zcHJpdGUgPSBzcHJpdGU7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy5wbGF5ZXIuc3BlZWQgPSB7eDogMSwgeTogMH07XHJcbiAgICByZXR1cm4gbW9kdWxlLmV4cG9ydHMucGxheWVyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsIG9uY2VcclxuICogQHBhcmFtIHBvc1xyXG4gKiBAcGFyYW0gc3ByaXRlc1xyXG4gKiBAcmV0dXJucyBiYWNrZ3JvdW5kXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVCYWNrZ3JvdW5kID0gZnVuY3Rpb24gY3JlYXRlQmFja2dyb3VuZChwb3MsIHNwcml0ZXMpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuYmFja2dyb3VuZC5wb3MgPSBwb3MgfHwgWzAsIDBdO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuYmFja2dyb3VuZC5zcHJpdGVzID0gc3ByaXRlcztcclxuICAgIG1vZHVsZS5leHBvcnRzLmJhY2tncm91bmQuY3VycmVudFNwcml0ZSA9IDA7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy5iYWNrZ3JvdW5kLnNwcml0ZXNMZW5ndGggPSBzcHJpdGVzLmxlbmd0aCB8fCAxO1xyXG4gICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzLmJhY2tncm91bmQ7XHJcbn07XHJcbi8qKlxyXG4gKiBBZGQgZW5lbWllIHRvIGVuZW1pZXNcclxuICogQHBhcmFtIHBvc1xyXG4gKiBAcGFyYW0gc3ByaXRlXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVFbmVtaWUgPSBmdW5jdGlvbiBjcmVhdGVFbmVtaWUocG9zLCBzcHJpdGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuZW5lbWllcy5wdXNoKHtcclxuICAgICAgICBwb3M6IHBvcyxcclxuICAgICAgICBzcHJpdGU6IHNwcml0ZVxyXG4gICAgfSk7XHJcbn07XHJcbi8qKlxyXG4gKiBBZGQgYm9udXMgdG8gYm9udXNlc1xyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgQ2FuIGJlOiBzcGVlZCwgc2xvdywgc21hbGwsIGJpZ1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlQm9udXMgPSBmdW5jdGlvbiBjcmVhdGVCb251cyhwb3MsIHNwcml0ZSwgdHlwZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy5ib251c2VzLnB1c2goe1xyXG4gICAgICAgIHBvczogcG9zLFxyXG4gICAgICAgIHNwcml0ZTogc3ByaXRlLFxyXG4gICAgICAgIHR5cGU6IHR5cGVcclxuICAgIH0pO1xyXG59OyIsInZhciByZXNvdXJjZUNhY2hlID0ge307XHJcbnZhciByZWFkeUNhbGxiYWNrcyA9IFtdO1xyXG5cclxuZnVuY3Rpb24gaXNSZWFkeSgpIHtcclxuICAgIHZhciByZWFkeSA9IHRydWU7XHJcbiAgICBmb3IgKHZhciBrIGluIHJlc291cmNlQ2FjaGUpIHtcclxuICAgICAgICBpZiAocmVzb3VyY2VDYWNoZS5oYXNPd25Qcm9wZXJ0eShrKSAmJiAhcmVzb3VyY2VDYWNoZVtrXSkge1xyXG4gICAgICAgICAgICByZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZWFkeTtcclxufVxyXG5cclxuZnVuY3Rpb24gX2xvYWQodXJsKSB7XHJcbiAgICBpZiAocmVzb3VyY2VDYWNoZVt1cmxdKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQ2FjaGVbdXJsXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJlc291cmNlQ2FjaGVbdXJsXSA9IGltZztcclxuICAgICAgICAgICAgaWYgKGlzUmVhZHkoKSkge1xyXG4gICAgICAgICAgICAgICAgcmVhZHlDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoZnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbWcuc3JjID0gdXJsO1xyXG4gICAgICAgIHJlc291cmNlQ2FjaGVbdXJsXSA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBMb2FkIGltYWdlIGFuZCBhZGQgdGhlbSB0byBjYWNoZVxyXG4gKkBwYXJhbSB7KHN0cmluZ3xzdHJpbmdbXSl9IHVybE9mQXJyIEFycmF5IG9mIHVybHNcclxuICogQHNlZSBsb2FkUmVzb3VyY2VzXHJcbiAqL1xyXG5mdW5jdGlvbiBsb2FkKHVybE9mQXJyKSB7XHJcbiAgICBpZiAodXJsT2ZBcnIgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgIHVybE9mQXJyLmZvckVhY2goZnVuY3Rpb24gKHVybCkge1xyXG4gICAgICAgICAgICBfbG9hZCh1cmwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBfbG9hZCh1cmxPZkFycik7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEdldCByZXNvdXJjZSBmcm9tIGNhY2hlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcclxuICogQHJldHVybnMgIEltYWdlXHJcbiAqIEBzZWUgZ2V0UmVzb3VyY2VcclxuICovXHJcbmZ1bmN0aW9uIGdldCh1cmwpIHtcclxuICAgIHJldHVybiByZXNvdXJjZUNhY2hlW3VybF07XHJcbn1cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbiB0byBmdW5jdGlvbnMgd2hpY2ggd2lsbCBiZSBjYWxsZWQgdGhlbiBhbGwgcmVzb3VyY2VzIGxvYWRlZFxyXG4gKiBAcGFyYW0gZnVuY1xyXG4gKiBAc2VlIG9uUmVzb3VyY2VzUmVhZHlcclxuICovXHJcbmZ1bmN0aW9uIG9uUmVhZHkoZnVuYykge1xyXG4gICAgcmVhZHlDYWxsYmFja3MucHVzaChmdW5jKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBsb2FkOiBsb2FkLFxyXG4gICAgZ2V0OiBnZXQsXHJcbiAgICBvblJlYWR5OiBvblJlYWR5LFxyXG4gICAgaXNSZWFkeTogaXNSZWFkeVxyXG59O1xyXG4iLCJ2YXIgcmVzb3VyY2VzID0gcmVxdWlyZShcIi4vcmVzb3VyY2VzLmpzXCIpO1xyXG5cclxuLyoqXHJcbiAqIFNwcml0ZSBvZiB0ZXh0dXJlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcclxuICogQHBhcmFtIHtudW1iZXJbXX0gcG9zIFBvc2l0aW9uIGluIHNwcml0ZSBzaGVldFxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBzaXplIFNpemUgaW4gc3ByaXRlIHNoZWV0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBTcGVlZCBvZiBwbGF5aW5nIGFuaW1hdGlvblxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBmcmFtZXMgRnJhbWVzIG9mIGFuaW1hdGlvblxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGlyIERpcmVjdGlvbiBvbiBzcHJpdGUgc2hlZXRcclxuICogQHBhcmFtIHtib29sfSBvbmNlIENvdW50IG9mIHBsYXlpbmcgYW5pbWF0aW9uXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAc2VlIGNyZWF0ZVNwcml0ZVxyXG4gKiBAc2VlIGNyZWF0ZVNwcml0ZVxyXG4gKi9cclxuZnVuY3Rpb24gU3ByaXRlKHVybCwgcG9zLCBzaXplLCBzcGVlZCwgZnJhbWVzLCBkaXIsIG9uY2UpIHtcclxuICAgIHRoaXMucG9zID0gcG9zO1xyXG4gICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgdGhpcy5zcGVlZCA9IHR5cGVvZiBzcGVlZCA9PT0gXCJudW1iZXJcIiA/IHNwZWVkIDogMDtcclxuICAgIHRoaXMuZnJhbWVzID0gZnJhbWVzO1xyXG4gICAgdGhpcy5kaXIgPSBkaXIgfHwgXCJob3Jpem9udGFsXCI7XHJcbiAgICB0aGlzLm9uY2UgPSBvbmNlO1xyXG4gICAgdGhpcy5faW5kZXggPSAwO1xyXG59XHJcblxyXG5TcHJpdGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgdGhpcy5faW5kZXggKz0gdGhpcy5zcGVlZCAqIGR0O1xyXG59O1xyXG5TcHJpdGUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChjdHgpIHtcclxuICAgIHZhciBmcmFtZTtcclxuICAgIGlmICh0aGlzLnNwZWVkID4gMCkge1xyXG4gICAgICAgIHZhciBtYXggPSB0aGlzLmZyYW1lcy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIGlkeCA9IE1hdGguZmxvb3IodGhpcy5faW5kZXgpO1xyXG4gICAgICAgIGZyYW1lID0gdGhpcy5mcmFtZXNbaWR4ICUgbWF4XTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub25jZSAmJiBpZHggPj0gbWF4KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZyYW1lID0gMDtcclxuICAgIH1cclxuICAgIHZhciB4ID0gdGhpcy5wb3NbMF07XHJcbiAgICB2YXIgeSA9IHRoaXMucG9zWzFdO1xyXG5cclxuICAgIGlmICh0aGlzLmRpciA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XHJcbiAgICAgICAgeSArPSBmcmFtZSAqIHRoaXMuc2l6ZVsxXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeCArPSBmcmFtZSAqIHRoaXMuc2l6ZVswXTtcclxuICAgIH1cclxuXHJcbiAgICBjdHguZHJhd0ltYWdlKHJlc291cmNlcy5nZXQodGhpcy51cmwpLCB4LCB5LCB0aGlzLnNpemVbMF0sIHRoaXMuc2l6ZVsxXSwgMCwgMCwgdGhpcy5zaXplWzBdLCB0aGlzLnNpemVbMV0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7IiwidmFyIGNvcmUgPSByZXF1aXJlKFwiLi9jb3JlLmpzXCIpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnLmpzXCIpO1xyXG5cclxudmFyIGxhc3RUaW1lLFxyXG4gICAgaXNHYW1lT3ZlcixcclxuICAgIHNjb3JlLFxyXG4gICAgaW5wdXQ7XHJcbnZhciB2aWV3cG9ydCA9IGNvcmUuZ2V0Vmlld3BvcnQoKTtcclxuXHJcbmZ1bmN0aW9uIGNvbGxpZGVzKHgsIHksIHIsIGIsIHgyLCB5MiwgcjIsIGIyKSB7XHJcbiAgICByZXR1cm4gKHIgPj0geDIgJiYgeCA8IHIyICYmIHkgPCBiMiAmJiBiID49IHkyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYm94Q29sbGlkZXMocG9zLCBzaXplLCBwb3MyLCBzaXplMikge1xyXG4gICAgcmV0dXJuIGNvbGxpZGVzKHBvc1swXSwgcG9zWzFdLCBwb3NbMF0gKyBzaXplWzBdLCBwb3NbMV0gKyBzaXplWzFdLFxyXG4gICAgICAgIHBvczJbMF0sIHBvczJbMV0sIHBvczJbMF0gKyBzaXplMlswXSwgcG9zMlsxXSArIHNpemUyWzFdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUdhbWVPdmVyKCk7XHJcbiAgICBpc0dhbWVPdmVyID0gZmFsc2U7XHJcbiAgICBzY29yZSA9IDA7XHJcbiAgICBjb3JlLmVuZW1pZXMgPSBbXTtcclxufVxyXG5cclxuY29yZS5jcmVhdGVQbGF5ZXIoXHJcbiAgICBbMTAwLCAxMDBdLFxyXG4gICAgY29yZS5jcmVhdGVTcHJpdGUoXCJpbWcvcmVjdC5qcGdcIiwgWzAsIDBdLCBbMTAwLCAxMDBdLCAwLCBbMF0pXHJcbik7XHJcbmNvcmUuY3JlYXRlQmFja2dyb3VuZChcclxuICAgIFswLCAwXSxcclxuICAgIFtjb3JlLmNyZWF0ZVNwcml0ZShcImltZy9ibGFjay5qcGdcIiwgWzAsIDBdLCBbdmlld3BvcnQud2lkdGggKiAzLCB2aWV3cG9ydC5oZWlnaHRdLCAwKV1cclxuKTtcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUJhY2tncm91bmQoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5iYWNrZ3JvdW5kLnBvcyA9IFtjb3JlLmJhY2tncm91bmQucG9zWzBdIC0gY29uZmlnLmJhY2tncm91bmRTcGVlZCAqIGR0LCBjb3JlLmJhY2tncm91bmQucG9zWzFdXTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUGxheWVyKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUucGxheWVyLnNwZWVkLnkgKz0gY29uZmlnLmdyYXZpdHkgKiBkdDtcclxuICAgIHZhciBtb3Rpb24gPSBjb3JlLnBsYXllci5zcGVlZC55ICogZHQ7XHJcbiAgICBjb3JlLnBsYXllci5wb3MgPSBbY29yZS5wbGF5ZXIucG9zWzBdLCBjb3JlLnBsYXllci5wb3NbMV0gKyBtb3Rpb25dO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVFbml0aWVzKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBjb3JlLnBsYXllci5zcHJpdGUudXBkYXRlKGR0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHVwZGF0ZUVuaXRpZXMoZHQpO1xyXG4gICAgdXBkYXRlQmFja2dyb3VuZChkdCk7XHJcbiAgICB1cGRhdGVQbGF5ZXIoZHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUucmVuZGVyKCk7XHJcbiAgICBjb3JlLnNldFNjb3JlKHNjb3JlKTtcclxuICAgIGlmIChpc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgY29yZS5yZW5kZXJHYW1lT3ZlcigpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgIHZhciBkdCA9IChub3cgLSBsYXN0VGltZSkgLyAxMDAwO1xyXG5cclxuICAgIHVwZGF0ZShkdCk7XHJcbiAgICByZW5kZXIoKTtcclxuXHJcbiAgICBsYXN0VGltZSA9IG5vdztcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgc2NvcmUgPSAwO1xyXG4gICAgaXNHYW1lT3ZlciA9IGZhbHNlO1xyXG5cclxuICAgIGlucHV0ID0gY29yZS5nZXRJbnB1dCh3aW5kb3csIFwia2V5Ym9hcmRcIik7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXktYWdhaW5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJlc2V0KCk7XHJcbiAgICB9KTtcclxuICAgIGxhc3RUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgIG1haW4oKTtcclxufVxyXG5cclxuY29yZS5sb2FkUmVzb3VyY2VzKFtcclxuICAgIFwiaW1nL2JsYWNrLmpwZ1wiLFxyXG4gICAgXCJpbWcvcmVjdC5qcGdcIlxyXG5dKTtcclxuXHJcbmNvcmUub25SZXNvdXJjZXNSZWFkeShpbml0KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbn07Il19
