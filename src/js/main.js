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
    gravity: 150,
    breatheSpeed: 350,
    forestLine: 450
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
    pressed;
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
    core.bonuses = [];
}

core.createPlayer(
    [viewport.width / 2, 50],
    core.createSprite("img/rect.jpg", [0, 0], [100, 100], 0, [0])
);
core.createBackground(
    [0, 0],
    [core.createSprite("img/black.jpg", [0, 0], [viewport.width * 3, viewport.height], 0)]
);

function gameOver() {
    "use strict";
    isGameOver = true;
}

function updateBackground(dt) {
    "use strict";
    core.background.pos = [core.background.pos[0] - config.backgroundSpeed * dt, core.background.pos[1]];
}

function checkColisions(pos) {
    "use strict";
    var collision = [],
        size = core.player.sprite.size,
        i,
        enemies = core.enemies,
        bonuses = core.bonuses;

    if (pos[1] < 0) {
        collision.push({type: "top"});
    }
    else if (pos[1] + size[1] > config.forestLine) {
        collision.push({type: "forest"});
    }

    for (i = 0; i < enemies.length; i++) {
        if (boxCollides(pos, size, enemies[i].pos, enemies[i].sprite.size)) {
            collision.push({type: "enemy", target: enemies[i]});
        }
    }

    for (i = 0; i < bonuses.length; i++) {
        if (boxCollides(pos, size, bonuses[i].pos, bonuses[i].sprite.size)) {
            collision.push({type: "bonus", target: bonuses[i]});
        }
    }
    return collision;
}

function collidePlayer(pos) {
    "use strict";
    var collision = checkColisions(pos),
        i = 0;
    if (collision.length == 0)
        return true;
    for (i = 0; i < collision.length; i++) {
        switch (collision[i].type) {
            case "top":
                core.player.speed.y = 0;
                core.player.pos[1] = 0;
                break;
            case "forest":
                gameOver();
                return true;
            case "enemy":
                break;
            case "bonus":
                core.player.pos = pos;
                return true;
            default: return true;
        }
    }
    return false;
}

function updatePlayer(dt) {
    "use strict";
    core.player.speed.y += config.gravity * dt;
    if (pressed['up']) {
        core.player.speed.y -= config.breatheSpeed * dt;
    }
    var motion = core.player.speed.y * dt;
    var newPos = [core.player.pos[0], core.player.pos[1] + motion];
    if (collidePlayer(newPos)) { //move or not to move
        core.player.pos = newPos;
    }
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

    pressed = core.getInput(window, "keyboard");
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXVkaW8uanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2NvcmUuanMiLCJzcmMvanMvZGlzcGxheS5qcyIsInNyYy9qcy9nYW1lLmpzIiwic3JjL2pzL2lucHV0LmpzIiwic3JjL2pzL21vZGVsLmpzIiwic3JjL2pzL3Jlc291cmNlcy5qcyIsInNyYy9qcy9zcHJpdGUuanMiLCJzcmMvanMvd29ybGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbW9kdWxlcyBhcmUgZGVmaW5lZCBhcyBhbiBhcnJheVxyXG4vLyBbIG1vZHVsZSBmdW5jdGlvbiwgbWFwIG9mIHJlcXVpcmV1aXJlcyBdXHJcbi8vXHJcbi8vIG1hcCBvZiByZXF1aXJldWlyZXMgaXMgc2hvcnQgcmVxdWlyZSBuYW1lIC0+IG51bWVyaWMgcmVxdWlyZVxyXG4vL1xyXG4vLyBhbnl0aGluZyBkZWZpbmVkIGluIGEgcHJldmlvdXMgYnVuZGxlIGlzIGFjY2Vzc2VkIHZpYSB0aGVcclxuLy8gb3JpZyBtZXRob2Qgd2hpY2ggaXMgdGhlIHJlcXVpcmV1aXJlIGZvciBwcmV2aW91cyBidW5kbGVzXHJcblxyXG4oZnVuY3Rpb24gb3V0ZXIgKG1vZHVsZXMsIGNhY2hlLCBlbnRyeSkge1xyXG4gICAgLy8gU2F2ZSB0aGUgcmVxdWlyZSBmcm9tIHByZXZpb3VzIGJ1bmRsZSB0byB0aGlzIGNsb3N1cmUgaWYgYW55XHJcbiAgICB2YXIgcHJldmlvdXNSZXF1aXJlID0gdHlwZW9mIHJlcXVpcmUgPT0gXCJmdW5jdGlvblwiICYmIHJlcXVpcmU7XHJcblxyXG4gICAgZnVuY3Rpb24gbmV3UmVxdWlyZShuYW1lLCBqdW1wZWQpe1xyXG4gICAgICAgIGlmKCFjYWNoZVtuYW1lXSkge1xyXG4gICAgICAgICAgICBpZighbW9kdWxlc1tuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgd2UgY2Fubm90IGZpbmQgdGhlIHRoZSBtb2R1bGUgd2l0aGluIG91ciBpbnRlcm5hbCBtYXAgb3JcclxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIGp1bXAgdG8gdGhlIGN1cnJlbnQgZ2xvYmFsIHJlcXVpcmUgaWUuIHRoZSBsYXN0IGJ1bmRsZVxyXG4gICAgICAgICAgICAgICAgLy8gdGhhdCB3YXMgYWRkZWQgdG8gdGhlIHBhZ2UuXHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFJlcXVpcmUgPSB0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZTtcclxuICAgICAgICAgICAgICAgIGlmICghanVtcGVkICYmIGN1cnJlbnRSZXF1aXJlKSByZXR1cm4gY3VycmVudFJlcXVpcmUobmFtZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG90aGVyIGJ1bmRsZXMgb24gdGhpcyBwYWdlIHRoZSByZXF1aXJlIGZyb20gdGhlXHJcbiAgICAgICAgICAgICAgICAvLyBwcmV2aW91cyBvbmUgaXMgc2F2ZWQgdG8gJ3ByZXZpb3VzUmVxdWlyZScuIFJlcGVhdCB0aGlzIGFzXHJcbiAgICAgICAgICAgICAgICAvLyBtYW55IHRpbWVzIGFzIHRoZXJlIGFyZSBidW5kbGVzIHVudGlsIHRoZSBtb2R1bGUgaXMgZm91bmQgb3JcclxuICAgICAgICAgICAgICAgIC8vIHdlIGV4aGF1c3QgdGhlIHJlcXVpcmUgY2hhaW4uXHJcbiAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNSZXF1aXJlKSByZXR1cm4gcHJldmlvdXNSZXF1aXJlKG5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZmluZCBtb2R1bGUgXFwnJyArIG5hbWUgKyAnXFwnJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG0gPSBjYWNoZVtuYW1lXSA9IHtleHBvcnRzOnt9fTtcclxuICAgICAgICAgICAgbW9kdWxlc1tuYW1lXVswXS5jYWxsKG0uZXhwb3J0cywgZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBtb2R1bGVzW25hbWVdWzFdW3hdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld1JlcXVpcmUoaWQgPyBpZCA6IHgpO1xyXG4gICAgICAgICAgICB9LG0sbS5leHBvcnRzLG91dGVyLG1vZHVsZXMsY2FjaGUsZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2FjaGVbbmFtZV0uZXhwb3J0cztcclxuICAgIH1cclxuICAgIGZvcih2YXIgaT0wO2k8ZW50cnkubGVuZ3RoO2krKykgbmV3UmVxdWlyZShlbnRyeVtpXSk7XHJcblxyXG4gICAgLy8gT3ZlcnJpZGUgdGhlIGN1cnJlbnQgcmVxdWlyZSB3aXRoIHRoaXMgbmV3IG9uZVxyXG4gICAgcmV0dXJuIG5ld1JlcXVpcmU7XHJcbn0pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgVVNFUiBvbiAxMC4wNy4yMDE1LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFVTRVIgb24gMTAuMDcuMjAxNS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgd2lkdGg6IDEwMjQsXHJcbiAgICBoZWlnaHQ6IDYwMCxcclxuICAgIGlucHV0VHlwZTogXCJrZXlib2FyZFwiLFxyXG4gICAgYmFja2dyb3VuZFNwZWVkOiAxNTAsXHJcbiAgICBncmF2aXR5OiAxNTAsXHJcbiAgICBicmVhdGhlU3BlZWQ6IDM1MCxcclxuICAgIGZvcmVzdExpbmU6IDQ1MFxyXG59OyIsInZhciByZXNvdXJjZXMgPSByZXF1aXJlKFwiLi9yZXNvdXJjZXMuanNcIik7XHJcbnZhciBTcHJpdGUgPSByZXF1aXJlKFwiLi9zcHJpdGUuanNcIik7XHJcbnZhciBpbnB1dCA9IHJlcXVpcmUoXCIuL2lucHV0LmpzXCIpO1xyXG52YXIgbW9kZWwgPSByZXF1aXJlKFwiLi9tb2RlbC5qc1wiKTtcclxudmFyIGRpc3BsYXlfID0gIHJlcXVpcmUoXCIuL2Rpc3BsYXkuanNcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWcuanNcIik7XHJcblxyXG52YXIgZGlzcGxheSA9IG5ldyBkaXNwbGF5Xy5DYW52YXNEaXNwbGF5KCk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTcHJpdGUodXJsLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICByZXR1cm4gbmV3IFNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Vmlld3BvcnQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgd2lkdGg6IGNvbmZpZy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IGNvbmZpZy5oZWlnaHRcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW5kZXIoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJEaXNwbGF5KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LmNsZWFyRGlzcGxheSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJHYW1lT3ZlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW5kZXJHYW1lT3ZlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlR2FtZU92ZXIoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuaGlkZUdhbWVPdmVyKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFNjb3JlKHNjb3JlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuc2V0U2NvcmUoc2NvcmUpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGxvYWRSZXNvdXJjZXM6IHJlc291cmNlcy5sb2FkLFxyXG4gICAgZ2V0UmVzb3VyY2U6IHJlc291cmNlcy5nZXQsXHJcbiAgICBvblJlc291cmNlc1JlYWR5OiByZXNvdXJjZXMub25SZWFkeSxcclxuICAgIGNyZWF0ZVNwcml0ZTogY3JlYXRlU3ByaXRlLFxyXG4gICAgZ2V0SW5wdXQ6IGlucHV0LFxyXG4gICAgY3JlYXRlUGxheWVyOiBtb2RlbC5jcmVhdGVQbGF5ZXIsXHJcbiAgICBjcmVhdGVCYWNrZ3JvdW5kOiBtb2RlbC5jcmVhdGVCYWNrZ3JvdW5kLFxyXG4gICAgY3JlYXRlRW5lbWllOiBtb2RlbC5jcmVhdGVFbmVtaWUsXHJcbiAgICBjcmVhdGVCb251czogbW9kZWwuY3JlYXRlQm9udXMsXHJcbiAgICBwbGF5ZXI6IG1vZGVsLnBsYXllcixcclxuICAgIGJhY2tncm91bmQ6IG1vZGVsLmJhY2tncm91bmQsXHJcbiAgICBlbmVtaWVzOiBtb2RlbC5lbmVtaWVzLFxyXG4gICAgYm9udXNlczogbW9kZWwuYm9udXNlcyxcclxuICAgIHJlbmRlcjogcmVuZGVyLFxyXG4gICAgY2xlYXJSZW5kZXI6IGNsZWFyRGlzcGxheSxcclxuICAgIHJlbmRlckdhbWVPdmVyOiByZW5kZXJHYW1lT3ZlcixcclxuICAgIGhpZGVHYW1lT3ZlcjogaGlkZUdhbWVPdmVyLFxyXG4gICAgc2V0U2NvcmU6IHNldFNjb3JlLFxyXG4gICAgZ2V0Vmlld3BvcnQ6IGdldFZpZXdwb3J0XHJcbn07XHJcblxyXG4iLCJ2YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnLmpzXCIpO1xyXG4vL3ZhciBjb3JlID0gcmVxdWlyZShcIi4vY29yZS5qc1wiKTtcclxudmFyIG1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWwuanNcIik7XHJcblxyXG5mdW5jdGlvbiBmbGlwSG9yaXpvbnRhbGx5KGNvbnRleHQsIGFyb3VuZCkge1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoYXJvdW5kLCAwKTtcclxuICAgIGNvbnRleHQuc2NhbGUoLTEsIDEpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoLWFyb3VuZCwgMCk7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAc2VlIGRpc3BsYXlcclxuICovXHJcbmZ1bmN0aW9uIENhbnZhc0Rpc3BsYXkoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gY29uZmlnLndpZHRoO1xyXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gY29uZmlnLmhlaWdodDtcclxuICAgIHRoaXMuc2NvcmVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2NvcmVcIik7XHJcblxyXG4gICAgdmFyIHBhcmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ2FtZVwiKTtcclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbiAgICB0aGlzLmN4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxufVxyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jYW52YXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5jbGVhckRpc3BsYXkgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jeC5maWxsU3R5bGUgPSBcInJnYig1MiwgMTY2LCAyNTEpXCI7XHJcbiAgICB0aGlzLmN4LmZpbGxSZWN0KDAsIDAsIGNvbmZpZy53aWR0aCwgY29uZmlnLmhlaWdodCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24oZW5lbXkpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jeC5zYXZlKCk7XHJcbiAgICB0aGlzLmN4LnRyYW5zbGF0ZShlbmVteS5wb3NbMF0sIGVuZW15LnBvc1sxXSk7XHJcbiAgICBlbmVteS5zcHJpdGUucmVuZGVyKHRoaXMuY3gpO1xyXG4gICAgdGhpcy5jeC5yZXN0b3JlKCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJCYWNrZ3JvdW5kID0gZnVuY3Rpb24oKSB7ICAvL1dURj8hXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY3guc2F2ZSgpO1xyXG4gICAgdGhpcy5jeC50cmFuc2xhdGUobW9kZWwuYmFja2dyb3VuZC5wb3NbMF0sIG1vZGVsLmJhY2tncm91bmQucG9zWzFdKTtcclxuICAgIG1vZGVsLmJhY2tncm91bmQuc3ByaXRlc1ttb2RlbC5iYWNrZ3JvdW5kLmN1cnJlbnRTcHJpdGVdLnJlbmRlcih0aGlzLmN4KTtcclxuICAgIHRoaXMuY3gucmVzdG9yZSgpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyRW5lbWllcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGVsLmVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLl9yZW5kZXIobW9kZWwuZW5lbWllc1tpXSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJQbGF5ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5fcmVuZGVyKG1vZGVsLnBsYXllcik7XHJcbn07XHJcbi8qKlxyXG4gKiBDbGVhciByZW5kZXIsIHJlbmRlciBiYWNrZ3JvdW5kLCByZW5kZXIgZW5lbWllcywgcmVuZGVyIHBsYXllclxyXG4gKi9cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY2xlYXJEaXNwbGF5KCk7XHJcbiAgICB0aGlzLnJlbmRlckJhY2tncm91bmQoKTtcclxuICAgIHRoaXMucmVuZGVyRW5lbWllcygpO1xyXG4gICAgdGhpcy5yZW5kZXJQbGF5ZXIoKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlckdhbWVPdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtb3ZlclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLW92ZXItb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuaGlkZUdhbWVPdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1vdmVyXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1vdmVyLW92ZXJsYXlcIikuc3R5bGUuZGlzcGxheSA9IFwibm9kZVwiO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuc2V0U2NvcmUgPSBmdW5jdGlvbihzY29yZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLnNjb3JlRWwuaW5uZXJIVE1MID0gc2NvcmUudG9TdHJpbmcoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgQ2FudmFzRGlzcGxheTogQ2FudmFzRGlzcGxheVxyXG59OyIsInZhciB3b3JsZCA9IHJlcXVpcmUoXCIuL3dvcmxkLmpzXCIpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHdvcmxkKHdpbmRvdyk7XHJcbn0pOyIsIi8qKlxyXG4gKiBAcGFyYW0gd2luZG93IEdsb2JhbCBvYmplY3RcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgQ2FuIGJlOmtleWJvYXJkLCBtZWRpY2luZSwgc21hcnRwaG9uZVxyXG4gKiBAcmV0dXJucyBPYmplY3Qgd2hpY2ggY29udGVudCBpbmZvIGFib3V0IHByZXNzZWQgYnV0dG9uc1xyXG4gKiBAc2VlIGdldElucHV0XHJcbiAqL1xyXG5mdW5jdGlvbiBpbnB1dCh3aW5kb3dfLCB0eXBlKSB7ICAgIC8vdHlwZSAtIGtleWJvYXJkLCBtZWRpY2luZSwgc21hcnRwaG9uZVxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgcHJlc3NlZCA9IG51bGw7XHJcbiAgICBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGNvZGVzLmhhc093blByb3BlcnR5KGV2ZW50LmtleUNvZGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBkb3duID0gZXZlbnQudHlwZSA9PT0gXCJrZXlkb3duXCI7XHJcbiAgICAgICAgICAgIHByZXNzZWRbY29kZXNbZXZlbnQua2V5Q29kZV1dID0gZG93bjtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xlYXJBbGwoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgYyBpbiBwcmVzc2VkKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVzc2VkLmhhc093blByb3BlcnR5KGMpKVxyXG4gICAgICAgICAgICAgICAgcHJlc3NlZFtjXSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXByZXNzZWQpIHtcclxuICAgICAgICBwcmVzc2VkID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgICAgICB2YXIgY29kZXNLZXlib2FyZCA9IHszODogXCJ1cFwifTtcclxuICAgICAgICB2YXIgY29kZXM7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwia2V5Ym9hcmRcIjpcclxuICAgICAgICAgICAgICAgIGNvZGVzID0gY29kZXNLZXlib2FyZDtcclxuICAgICAgICAgICAgICAgIHdpbmRvd18uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3dfLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvd18uYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgY2xlYXJBbGwoKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXcm9uZyB0eXBlIG9mIGlucHV0XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwcmVzc2VkO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHV0OyIsIm1vZHVsZS5leHBvcnRzLnBsYXllciA9IHt9O1xyXG5tb2R1bGUuZXhwb3J0cy5lbmVtaWVzID0gW107XHJcbm1vZHVsZS5leHBvcnRzLmJhY2tncm91bmQgPSB7fTtcclxubW9kdWxlLmV4cG9ydHMuYm9udXNlcyA9IFtdO1xyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGwgb25jZVxyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVcclxuICogQHJldHVybnMgcGxheWVyXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVQbGF5ZXIgPSBmdW5jdGlvbiBjcmVhdGVQbGF5ZXIocG9zLCBzcHJpdGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMucGxheWVyLnBvcyA9IHBvcyB8fCBbMCwgMF07XHJcbiAgICBtb2R1bGUuZXhwb3J0cy5wbGF5ZXIuc3ByaXRlID0gc3ByaXRlO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMucGxheWVyLnNwZWVkID0ge3g6IDEsIHk6IDB9O1xyXG4gICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzLnBsYXllcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbCBvbmNlXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZXNcclxuICogQHJldHVybnMgYmFja2dyb3VuZFxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlQmFja2dyb3VuZCA9IGZ1bmN0aW9uIGNyZWF0ZUJhY2tncm91bmQocG9zLCBzcHJpdGVzKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIG1vZHVsZS5leHBvcnRzLmJhY2tncm91bmQucG9zID0gcG9zIHx8IFswLCAwXTtcclxuICAgIG1vZHVsZS5leHBvcnRzLmJhY2tncm91bmQuc3ByaXRlcyA9IHNwcml0ZXM7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy5iYWNrZ3JvdW5kLmN1cnJlbnRTcHJpdGUgPSAwO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuYmFja2dyb3VuZC5zcHJpdGVzTGVuZ3RoID0gc3ByaXRlcy5sZW5ndGggfHwgMTtcclxuICAgIHJldHVybiBtb2R1bGUuZXhwb3J0cy5iYWNrZ3JvdW5kO1xyXG59O1xyXG4vKipcclxuICogQWRkIGVuZW1pZSB0byBlbmVtaWVzXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlRW5lbWllID0gZnVuY3Rpb24gY3JlYXRlRW5lbWllKHBvcywgc3ByaXRlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIG1vZHVsZS5leHBvcnRzLmVuZW1pZXMucHVzaCh7XHJcbiAgICAgICAgcG9zOiBwb3MsXHJcbiAgICAgICAgc3ByaXRlOiBzcHJpdGVcclxuICAgIH0pO1xyXG59O1xyXG4vKipcclxuICogQWRkIGJvbnVzIHRvIGJvbnVzZXNcclxuICogQHBhcmFtIHBvc1xyXG4gKiBAcGFyYW0gc3ByaXRlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIENhbiBiZTogc3BlZWQsIHNsb3csIHNtYWxsLCBiaWdcclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZUJvbnVzID0gZnVuY3Rpb24gY3JlYXRlQm9udXMocG9zLCBzcHJpdGUsIHR5cGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuYm9udXNlcy5wdXNoKHtcclxuICAgICAgICBwb3M6IHBvcyxcclxuICAgICAgICBzcHJpdGU6IHNwcml0ZSxcclxuICAgICAgICB0eXBlOiB0eXBlXHJcbiAgICB9KTtcclxufTsiLCJ2YXIgcmVzb3VyY2VDYWNoZSA9IHt9O1xyXG52YXIgcmVhZHlDYWxsYmFja3MgPSBbXTtcclxuXHJcbmZ1bmN0aW9uIGlzUmVhZHkoKSB7XHJcbiAgICB2YXIgcmVhZHkgPSB0cnVlO1xyXG4gICAgZm9yICh2YXIgayBpbiByZXNvdXJjZUNhY2hlKSB7XHJcbiAgICAgICAgaWYgKHJlc291cmNlQ2FjaGUuaGFzT3duUHJvcGVydHkoaykgJiYgIXJlc291cmNlQ2FjaGVba10pIHtcclxuICAgICAgICAgICAgcmVhZHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVhZHk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9sb2FkKHVybCkge1xyXG4gICAgaWYgKHJlc291cmNlQ2FjaGVbdXJsXSkge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUNhY2hlW3VybF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXNvdXJjZUNhY2hlW3VybF0gPSBpbWc7XHJcbiAgICAgICAgICAgIGlmIChpc1JlYWR5KCkpIHtcclxuICAgICAgICAgICAgICAgIHJlYWR5Q2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmdW5jKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW1nLnNyYyA9IHVybDtcclxuICAgICAgICByZXNvdXJjZUNhY2hlW3VybF0gPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogTG9hZCBpbWFnZSBhbmQgYWRkIHRoZW0gdG8gY2FjaGVcclxuICpAcGFyYW0geyhzdHJpbmd8c3RyaW5nW10pfSB1cmxPZkFyciBBcnJheSBvZiB1cmxzXHJcbiAqIEBzZWUgbG9hZFJlc291cmNlc1xyXG4gKi9cclxuZnVuY3Rpb24gbG9hZCh1cmxPZkFycikge1xyXG4gICAgaWYgKHVybE9mQXJyIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICB1cmxPZkFyci5mb3JFYWNoKGZ1bmN0aW9uICh1cmwpIHtcclxuICAgICAgICAgICAgX2xvYWQodXJsKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgX2xvYWQodXJsT2ZBcnIpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBHZXQgcmVzb3VyY2UgZnJvbSBjYWNoZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsXHJcbiAqIEByZXR1cm5zICBJbWFnZVxyXG4gKiBAc2VlIGdldFJlc291cmNlXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXQodXJsKSB7XHJcbiAgICByZXR1cm4gcmVzb3VyY2VDYWNoZVt1cmxdO1xyXG59XHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb24gdG8gZnVuY3Rpb25zIHdoaWNoIHdpbGwgYmUgY2FsbGVkIHRoZW4gYWxsIHJlc291cmNlcyBsb2FkZWRcclxuICogQHBhcmFtIGZ1bmNcclxuICogQHNlZSBvblJlc291cmNlc1JlYWR5XHJcbiAqL1xyXG5mdW5jdGlvbiBvblJlYWR5KGZ1bmMpIHtcclxuICAgIHJlYWR5Q2FsbGJhY2tzLnB1c2goZnVuYyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgbG9hZDogbG9hZCxcclxuICAgIGdldDogZ2V0LFxyXG4gICAgb25SZWFkeTogb25SZWFkeSxcclxuICAgIGlzUmVhZHk6IGlzUmVhZHlcclxufTtcclxuIiwidmFyIHJlc291cmNlcyA9IHJlcXVpcmUoXCIuL3Jlc291cmNlcy5qc1wiKTtcclxuXHJcbi8qKlxyXG4gKiBTcHJpdGUgb2YgdGV4dHVyZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsXHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IHBvcyBQb3NpdGlvbiBpbiBzcHJpdGUgc2hlZXRcclxuICogQHBhcmFtIHtudW1iZXJbXX0gc2l6ZSBTaXplIGluIHNwcml0ZSBzaGVldFxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgU3BlZWQgb2YgcGxheWluZyBhbmltYXRpb25cclxuICogQHBhcmFtIHtudW1iZXJbXX0gZnJhbWVzIEZyYW1lcyBvZiBhbmltYXRpb25cclxuICogQHBhcmFtIHtzdHJpbmd9IGRpciBEaXJlY3Rpb24gb24gc3ByaXRlIHNoZWV0XHJcbiAqIEBwYXJhbSB7Ym9vbH0gb25jZSBDb3VudCBvZiBwbGF5aW5nIGFuaW1hdGlvblxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHNlZSBjcmVhdGVTcHJpdGVcclxuICogQHNlZSBjcmVhdGVTcHJpdGVcclxuICovXHJcbmZ1bmN0aW9uIFNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKSB7XHJcbiAgICB0aGlzLnBvcyA9IHBvcztcclxuICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgIHRoaXMuc3BlZWQgPSB0eXBlb2Ygc3BlZWQgPT09IFwibnVtYmVyXCIgPyBzcGVlZCA6IDA7XHJcbiAgICB0aGlzLmZyYW1lcyA9IGZyYW1lcztcclxuICAgIHRoaXMuZGlyID0gZGlyIHx8IFwiaG9yaXpvbnRhbFwiO1xyXG4gICAgdGhpcy5vbmNlID0gb25jZTtcclxuICAgIHRoaXMuX2luZGV4ID0gMDtcclxufVxyXG5cclxuU3ByaXRlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgIHRoaXMuX2luZGV4ICs9IHRoaXMuc3BlZWQgKiBkdDtcclxufTtcclxuU3ByaXRlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoY3R4KSB7XHJcbiAgICB2YXIgZnJhbWU7XHJcbiAgICBpZiAodGhpcy5zcGVlZCA+IDApIHtcclxuICAgICAgICB2YXIgbWF4ID0gdGhpcy5mcmFtZXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBpZHggPSBNYXRoLmZsb29yKHRoaXMuX2luZGV4KTtcclxuICAgICAgICBmcmFtZSA9IHRoaXMuZnJhbWVzW2lkeCAlIG1heF07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uY2UgJiYgaWR4ID49IG1heCkge1xyXG4gICAgICAgICAgICB0aGlzLmRvbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmcmFtZSA9IDA7XHJcbiAgICB9XHJcbiAgICB2YXIgeCA9IHRoaXMucG9zWzBdO1xyXG4gICAgdmFyIHkgPSB0aGlzLnBvc1sxXTtcclxuXHJcbiAgICBpZiAodGhpcy5kaXIgPT09IFwidmVydGljYWxcIikge1xyXG4gICAgICAgIHkgKz0gZnJhbWUgKiB0aGlzLnNpemVbMV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHggKz0gZnJhbWUgKiB0aGlzLnNpemVbMF07XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LmRyYXdJbWFnZShyZXNvdXJjZXMuZ2V0KHRoaXMudXJsKSwgeCwgeSwgdGhpcy5zaXplWzBdLCB0aGlzLnNpemVbMV0sIDAsIDAsIHRoaXMuc2l6ZVswXSwgdGhpcy5zaXplWzFdKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlOyIsInZhciBjb3JlID0gcmVxdWlyZShcIi4vY29yZS5qc1wiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZy5qc1wiKTtcclxuXHJcbnZhciBsYXN0VGltZSxcclxuICAgIGlzR2FtZU92ZXIsXHJcbiAgICBzY29yZSxcclxuICAgIHByZXNzZWQ7XHJcbnZhciB2aWV3cG9ydCA9IGNvcmUuZ2V0Vmlld3BvcnQoKTtcclxuXHJcbmZ1bmN0aW9uIGNvbGxpZGVzKHgsIHksIHIsIGIsIHgyLCB5MiwgcjIsIGIyKSB7XHJcbiAgICByZXR1cm4gKHIgPj0geDIgJiYgeCA8IHIyICYmIHkgPCBiMiAmJiBiID49IHkyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYm94Q29sbGlkZXMocG9zLCBzaXplLCBwb3MyLCBzaXplMikge1xyXG4gICAgcmV0dXJuIGNvbGxpZGVzKHBvc1swXSwgcG9zWzFdLCBwb3NbMF0gKyBzaXplWzBdLCBwb3NbMV0gKyBzaXplWzFdLFxyXG4gICAgICAgIHBvczJbMF0sIHBvczJbMV0sIHBvczJbMF0gKyBzaXplMlswXSwgcG9zMlsxXSArIHNpemUyWzFdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUdhbWVPdmVyKCk7XHJcbiAgICBpc0dhbWVPdmVyID0gZmFsc2U7XHJcbiAgICBzY29yZSA9IDA7XHJcbiAgICBjb3JlLmVuZW1pZXMgPSBbXTtcclxuICAgIGNvcmUuYm9udXNlcyA9IFtdO1xyXG59XHJcblxyXG5jb3JlLmNyZWF0ZVBsYXllcihcclxuICAgIFt2aWV3cG9ydC53aWR0aCAvIDIsIDUwXSxcclxuICAgIGNvcmUuY3JlYXRlU3ByaXRlKFwiaW1nL3JlY3QuanBnXCIsIFswLCAwXSwgWzEwMCwgMTAwXSwgMCwgWzBdKVxyXG4pO1xyXG5jb3JlLmNyZWF0ZUJhY2tncm91bmQoXHJcbiAgICBbMCwgMF0sXHJcbiAgICBbY29yZS5jcmVhdGVTcHJpdGUoXCJpbWcvYmxhY2suanBnXCIsIFswLCAwXSwgW3ZpZXdwb3J0LndpZHRoICogMywgdmlld3BvcnQuaGVpZ2h0XSwgMCldXHJcbik7XHJcblxyXG5mdW5jdGlvbiBnYW1lT3ZlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaXNHYW1lT3ZlciA9IHRydWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUJhY2tncm91bmQoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5iYWNrZ3JvdW5kLnBvcyA9IFtjb3JlLmJhY2tncm91bmQucG9zWzBdIC0gY29uZmlnLmJhY2tncm91bmRTcGVlZCAqIGR0LCBjb3JlLmJhY2tncm91bmQucG9zWzFdXTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tDb2xpc2lvbnMocG9zKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBjb2xsaXNpb24gPSBbXSxcclxuICAgICAgICBzaXplID0gY29yZS5wbGF5ZXIuc3ByaXRlLnNpemUsXHJcbiAgICAgICAgaSxcclxuICAgICAgICBlbmVtaWVzID0gY29yZS5lbmVtaWVzLFxyXG4gICAgICAgIGJvbnVzZXMgPSBjb3JlLmJvbnVzZXM7XHJcblxyXG4gICAgaWYgKHBvc1sxXSA8IDApIHtcclxuICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJ0b3BcIn0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocG9zWzFdICsgc2l6ZVsxXSA+IGNvbmZpZy5mb3Jlc3RMaW5lKSB7XHJcbiAgICAgICAgY29sbGlzaW9uLnB1c2goe3R5cGU6IFwiZm9yZXN0XCJ9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChib3hDb2xsaWRlcyhwb3MsIHNpemUsIGVuZW1pZXNbaV0ucG9zLCBlbmVtaWVzW2ldLnNwcml0ZS5zaXplKSkge1xyXG4gICAgICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJlbmVteVwiLCB0YXJnZXQ6IGVuZW1pZXNbaV19KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGJvbnVzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoYm94Q29sbGlkZXMocG9zLCBzaXplLCBib251c2VzW2ldLnBvcywgYm9udXNlc1tpXS5zcHJpdGUuc2l6ZSkpIHtcclxuICAgICAgICAgICAgY29sbGlzaW9uLnB1c2goe3R5cGU6IFwiYm9udXNcIiwgdGFyZ2V0OiBib251c2VzW2ldfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbGxpc2lvbjtcclxufVxyXG5cclxuZnVuY3Rpb24gY29sbGlkZVBsYXllcihwb3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIGNvbGxpc2lvbiA9IGNoZWNrQ29saXNpb25zKHBvcyksXHJcbiAgICAgICAgaSA9IDA7XHJcbiAgICBpZiAoY29sbGlzaW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGNvbGxpc2lvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN3aXRjaCAoY29sbGlzaW9uW2ldLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInRvcFwiOlxyXG4gICAgICAgICAgICAgICAgY29yZS5wbGF5ZXIuc3BlZWQueSA9IDA7XHJcbiAgICAgICAgICAgICAgICBjb3JlLnBsYXllci5wb3NbMV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmb3Jlc3RcIjpcclxuICAgICAgICAgICAgICAgIGdhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgY2FzZSBcImVuZW15XCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImJvbnVzXCI6XHJcbiAgICAgICAgICAgICAgICBjb3JlLnBsYXllci5wb3MgPSBwb3M7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVQbGF5ZXIoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5wbGF5ZXIuc3BlZWQueSArPSBjb25maWcuZ3Jhdml0eSAqIGR0O1xyXG4gICAgaWYgKHByZXNzZWRbJ3VwJ10pIHtcclxuICAgICAgICBjb3JlLnBsYXllci5zcGVlZC55IC09IGNvbmZpZy5icmVhdGhlU3BlZWQgKiBkdDtcclxuICAgIH1cclxuICAgIHZhciBtb3Rpb24gPSBjb3JlLnBsYXllci5zcGVlZC55ICogZHQ7XHJcbiAgICB2YXIgbmV3UG9zID0gW2NvcmUucGxheWVyLnBvc1swXSwgY29yZS5wbGF5ZXIucG9zWzFdICsgbW90aW9uXTtcclxuICAgIGlmIChjb2xsaWRlUGxheWVyKG5ld1BvcykpIHsgLy9tb3ZlIG9yIG5vdCB0byBtb3ZlXHJcbiAgICAgICAgY29yZS5wbGF5ZXIucG9zID0gbmV3UG9zO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVFbml0aWVzKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUucGxheWVyLnNwcml0ZS51cGRhdGUoZHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGUoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdXBkYXRlRW5pdGllcyhkdCk7XHJcbiAgICB1cGRhdGVCYWNrZ3JvdW5kKGR0KTtcclxuICAgIHVwZGF0ZVBsYXllcihkdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5yZW5kZXIoKTtcclxuICAgIGNvcmUuc2V0U2NvcmUoc2NvcmUpO1xyXG4gICAgaWYgKGlzR2FtZU92ZXIpIHtcclxuICAgICAgICBjb3JlLnJlbmRlckdhbWVPdmVyKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgdmFyIGR0ID0gKG5vdyAtIGxhc3RUaW1lKSAvIDEwMDA7XHJcblxyXG4gICAgdXBkYXRlKGR0KTtcclxuICAgIHJlbmRlcigpO1xyXG5cclxuICAgIGxhc3RUaW1lID0gbm93O1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW4pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBzY29yZSA9IDA7XHJcbiAgICBpc0dhbWVPdmVyID0gZmFsc2U7XHJcblxyXG4gICAgcHJlc3NlZCA9IGNvcmUuZ2V0SW5wdXQod2luZG93LCBcImtleWJvYXJkXCIpO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGF5LWFnYWluXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXNldCgpO1xyXG4gICAgfSk7XHJcbiAgICBsYXN0VGltZSA9IERhdGUubm93KCk7XHJcbiAgICBtYWluKCk7XHJcbn1cclxuXHJcbmNvcmUubG9hZFJlc291cmNlcyhbXHJcbiAgICBcImltZy9ibGFjay5qcGdcIixcclxuICAgIFwiaW1nL3JlY3QuanBnXCJcclxuXSk7XHJcblxyXG5jb3JlLm9uUmVzb3VyY2VzUmVhZHkoaW5pdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG59OyJdfQ==
