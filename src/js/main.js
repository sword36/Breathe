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
    forestLine: 450,
    imageSmoothingEnabled: true
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
//var core = require("./core.js"); //circular link
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
    this.scoreEl = document.createElement("div");
    this.scoreEl.classList.add("score");

    var parent = document.querySelector("#game");
    parent.appendChild(this.canvas);
    parent.appendChild(this.scoreEl);
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
    document.getElementById("game-over-overlay").style.display = "none";
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
var config = require("./config");

var player = {},
    enemies = [],
    background = {},
    bonuses = [];
/**
 * Should be call once
 * @param pos
 * @param sprite
 * @returns player
 */
module.exports.createPlayer = function createPlayer(pos, sprite) {
    "use strict";
    player.pos = pos || [0, 0];
    if (player.sprite == null)
        player.sprite = sprite;
    player.speed = {x: 1, y: 0};
    return player;
};

/**
 * Should be call once
 * @param pos
 * @param sprites
 * @returns background
 */
module.exports.createBackground = function createBackground(pos, sprites) {
    "use strict";
    background.pos = pos || [0, 0];
    if (background.sprites == null)
        background.sprites = sprites;
    background.currentSprite = 0;
    background.spritesLength = sprites.length || 1;
    return background;
};
/**
 * Add enemie to enemies
 * @param pos
 * @param sprite
 */
module.exports.createEnemie = function createEnemie(pos, sprite) {
    "use strict";
    enemies.push({
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
    bonuses.push({
        pos: pos,
        sprite: sprite,
        type: type
    });
};
module.exports.player = player;
module.exports.background = background;
module.exports.enemies = enemies;
module.exports.bonuses = bonuses;
},{"./config":2}],8:[function(require,module,exports){
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
    core.createPlayer(
        [viewport.width / 2, 50],
        core.createSprite("img/rect.jpg", [0, 0], [100, 100], 0, [0])
    );
    core.createBackground(
        [0, 0],
        [core.createSprite("img/black.jpg", [0, 0], [viewport.width * 3, viewport.height], 0)]
    );
    core.enemies = [];
    core.bonuses = [];
}

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
    if (!isGameOver) {
        updateBackground(dt);
        updatePlayer(dt);
    }
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
    pressed = core.getInput(window, "keyboard");
    document.querySelector("#play-again").addEventListener("click", function() {
        reset();
    });
    reset();
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXVkaW8uanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2NvcmUuanMiLCJzcmMvanMvZGlzcGxheS5qcyIsInNyYy9qcy9nYW1lLmpzIiwic3JjL2pzL2lucHV0LmpzIiwic3JjL2pzL21vZGVsLmpzIiwic3JjL2pzL3Jlc291cmNlcy5qcyIsInNyYy9qcy9zcHJpdGUuanMiLCJzcmMvanMvd29ybGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBtb2R1bGVzIGFyZSBkZWZpbmVkIGFzIGFuIGFycmF5XHJcbi8vIFsgbW9kdWxlIGZ1bmN0aW9uLCBtYXAgb2YgcmVxdWlyZXVpcmVzIF1cclxuLy9cclxuLy8gbWFwIG9mIHJlcXVpcmV1aXJlcyBpcyBzaG9ydCByZXF1aXJlIG5hbWUgLT4gbnVtZXJpYyByZXF1aXJlXHJcbi8vXHJcbi8vIGFueXRoaW5nIGRlZmluZWQgaW4gYSBwcmV2aW91cyBidW5kbGUgaXMgYWNjZXNzZWQgdmlhIHRoZVxyXG4vLyBvcmlnIG1ldGhvZCB3aGljaCBpcyB0aGUgcmVxdWlyZXVpcmUgZm9yIHByZXZpb3VzIGJ1bmRsZXNcclxuXHJcbihmdW5jdGlvbiBvdXRlciAobW9kdWxlcywgY2FjaGUsIGVudHJ5KSB7XHJcbiAgICAvLyBTYXZlIHRoZSByZXF1aXJlIGZyb20gcHJldmlvdXMgYnVuZGxlIHRvIHRoaXMgY2xvc3VyZSBpZiBhbnlcclxuICAgIHZhciBwcmV2aW91c1JlcXVpcmUgPSB0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZTtcclxuXHJcbiAgICBmdW5jdGlvbiBuZXdSZXF1aXJlKG5hbWUsIGp1bXBlZCl7XHJcbiAgICAgICAgaWYoIWNhY2hlW25hbWVdKSB7XHJcbiAgICAgICAgICAgIGlmKCFtb2R1bGVzW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSBjYW5ub3QgZmluZCB0aGUgdGhlIG1vZHVsZSB3aXRoaW4gb3VyIGludGVybmFsIG1hcCBvclxyXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUganVtcCB0byB0aGUgY3VycmVudCBnbG9iYWwgcmVxdWlyZSBpZS4gdGhlIGxhc3QgYnVuZGxlXHJcbiAgICAgICAgICAgICAgICAvLyB0aGF0IHdhcyBhZGRlZCB0byB0aGUgcGFnZS5cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50UmVxdWlyZSA9IHR5cGVvZiByZXF1aXJlID09IFwiZnVuY3Rpb25cIiAmJiByZXF1aXJlO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFqdW1wZWQgJiYgY3VycmVudFJlcXVpcmUpIHJldHVybiBjdXJyZW50UmVxdWlyZShuYW1lLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgb3RoZXIgYnVuZGxlcyBvbiB0aGlzIHBhZ2UgdGhlIHJlcXVpcmUgZnJvbSB0aGVcclxuICAgICAgICAgICAgICAgIC8vIHByZXZpb3VzIG9uZSBpcyBzYXZlZCB0byAncHJldmlvdXNSZXF1aXJlJy4gUmVwZWF0IHRoaXMgYXNcclxuICAgICAgICAgICAgICAgIC8vIG1hbnkgdGltZXMgYXMgdGhlcmUgYXJlIGJ1bmRsZXMgdW50aWwgdGhlIG1vZHVsZSBpcyBmb3VuZCBvclxyXG4gICAgICAgICAgICAgICAgLy8gd2UgZXhoYXVzdCB0aGUgcmVxdWlyZSBjaGFpbi5cclxuICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c1JlcXVpcmUpIHJldHVybiBwcmV2aW91c1JlcXVpcmUobmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIG1vZHVsZSBcXCcnICsgbmFtZSArICdcXCcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbSA9IGNhY2hlW25hbWVdID0ge2V4cG9ydHM6e319O1xyXG4gICAgICAgICAgICBtb2R1bGVzW25hbWVdWzBdLmNhbGwobS5leHBvcnRzLCBmdW5jdGlvbih4KXtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IG1vZHVsZXNbbmFtZV1bMV1beF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3UmVxdWlyZShpZCA/IGlkIDogeCk7XHJcbiAgICAgICAgICAgIH0sbSxtLmV4cG9ydHMsb3V0ZXIsbW9kdWxlcyxjYWNoZSxlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYWNoZVtuYW1lXS5leHBvcnRzO1xyXG4gICAgfVxyXG4gICAgZm9yKHZhciBpPTA7aTxlbnRyeS5sZW5ndGg7aSsrKSBuZXdSZXF1aXJlKGVudHJ5W2ldKTtcclxuXHJcbiAgICAvLyBPdmVycmlkZSB0aGUgY3VycmVudCByZXF1aXJlIHdpdGggdGhpcyBuZXcgb25lXHJcbiAgICByZXR1cm4gbmV3UmVxdWlyZTtcclxufSkiLCIvKipcclxuICogQ3JlYXRlZCBieSBVU0VSIG9uIDEwLjA3LjIwMTUuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbn07IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgVVNFUiBvbiAxMC4wNy4yMDE1LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB3aWR0aDogMTAyNCxcclxuICAgIGhlaWdodDogNjAwLFxyXG4gICAgaW5wdXRUeXBlOiBcImtleWJvYXJkXCIsXHJcbiAgICBiYWNrZ3JvdW5kU3BlZWQ6IDE1MCxcclxuICAgIGdyYXZpdHk6IDE1MCxcclxuICAgIGJyZWF0aGVTcGVlZDogMzUwLFxyXG4gICAgZm9yZXN0TGluZTogNDUwLFxyXG4gICAgaW1hZ2VTbW9vdGhpbmdFbmFibGVkOiB0cnVlXHJcbn07IiwidmFyIHJlc291cmNlcyA9IHJlcXVpcmUoXCIuL3Jlc291cmNlcy5qc1wiKTtcclxudmFyIFNwcml0ZSA9IHJlcXVpcmUoXCIuL3Nwcml0ZS5qc1wiKTtcclxudmFyIGlucHV0ID0gcmVxdWlyZShcIi4vaW5wdXQuanNcIik7XHJcbnZhciBtb2RlbCA9IHJlcXVpcmUoXCIuL21vZGVsLmpzXCIpO1xyXG52YXIgZGlzcGxheV8gPSAgcmVxdWlyZShcIi4vZGlzcGxheS5qc1wiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZy5qc1wiKTtcclxuXHJcbnZhciBkaXNwbGF5ID0gbmV3IGRpc3BsYXlfLkNhbnZhc0Rpc3BsYXkoKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiBuZXcgU3ByaXRlKHVybCwgcG9zLCBzaXplLCBzcGVlZCwgZnJhbWVzLCBkaXIsIG9uY2UpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWaWV3cG9ydCgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB3aWR0aDogY29uZmlnLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogY29uZmlnLmhlaWdodFxyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnJlbmRlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhckRpc3BsYXkoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuY2xlYXJEaXNwbGF5KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlckdhbWVPdmVyKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnJlbmRlckdhbWVPdmVyKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGVHYW1lT3ZlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5oaWRlR2FtZU92ZXIoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U2NvcmUoc2NvcmUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5zZXRTY29yZShzY29yZSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgbG9hZFJlc291cmNlczogcmVzb3VyY2VzLmxvYWQsXHJcbiAgICBnZXRSZXNvdXJjZTogcmVzb3VyY2VzLmdldCxcclxuICAgIG9uUmVzb3VyY2VzUmVhZHk6IHJlc291cmNlcy5vblJlYWR5LFxyXG4gICAgY3JlYXRlU3ByaXRlOiBjcmVhdGVTcHJpdGUsXHJcbiAgICBnZXRJbnB1dDogaW5wdXQsXHJcbiAgICBjcmVhdGVQbGF5ZXI6IG1vZGVsLmNyZWF0ZVBsYXllcixcclxuICAgIGNyZWF0ZUJhY2tncm91bmQ6IG1vZGVsLmNyZWF0ZUJhY2tncm91bmQsXHJcbiAgICBjcmVhdGVFbmVtaWU6IG1vZGVsLmNyZWF0ZUVuZW1pZSxcclxuICAgIGNyZWF0ZUJvbnVzOiBtb2RlbC5jcmVhdGVCb251cyxcclxuICAgIHBsYXllcjogbW9kZWwucGxheWVyLFxyXG4gICAgYmFja2dyb3VuZDogbW9kZWwuYmFja2dyb3VuZCxcclxuICAgIGVuZW1pZXM6IG1vZGVsLmVuZW1pZXMsXHJcbiAgICBib251c2VzOiBtb2RlbC5ib251c2VzLFxyXG4gICAgcmVuZGVyOiByZW5kZXIsXHJcbiAgICBjbGVhclJlbmRlcjogY2xlYXJEaXNwbGF5LFxyXG4gICAgcmVuZGVyR2FtZU92ZXI6IHJlbmRlckdhbWVPdmVyLFxyXG4gICAgaGlkZUdhbWVPdmVyOiBoaWRlR2FtZU92ZXIsXHJcbiAgICBzZXRTY29yZTogc2V0U2NvcmUsXHJcbiAgICBnZXRWaWV3cG9ydDogZ2V0Vmlld3BvcnRcclxufTtcclxuXHJcbiIsInZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWcuanNcIik7XHJcbi8vdmFyIGNvcmUgPSByZXF1aXJlKFwiLi9jb3JlLmpzXCIpOyAvL2NpcmN1bGFyIGxpbmtcclxudmFyIG1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWwuanNcIik7XHJcblxyXG5mdW5jdGlvbiBmbGlwSG9yaXpvbnRhbGx5KGNvbnRleHQsIGFyb3VuZCkge1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoYXJvdW5kLCAwKTtcclxuICAgIGNvbnRleHQuc2NhbGUoLTEsIDEpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoLWFyb3VuZCwgMCk7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAc2VlIGRpc3BsYXlcclxuICovXHJcbmZ1bmN0aW9uIENhbnZhc0Rpc3BsYXkoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gY29uZmlnLndpZHRoO1xyXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gY29uZmlnLmhlaWdodDtcclxuICAgIHRoaXMuc2NvcmVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aGlzLnNjb3JlRWwuY2xhc3NMaXN0LmFkZChcInNjb3JlXCIpO1xyXG5cclxuICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dhbWVcIik7XHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuc2NvcmVFbCk7XHJcbiAgICB0aGlzLmN4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxufVxyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jYW52YXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5jbGVhckRpc3BsYXkgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jeC5maWxsU3R5bGUgPSBcInJnYig1MiwgMTY2LCAyNTEpXCI7XHJcbiAgICB0aGlzLmN4LmZpbGxSZWN0KDAsIDAsIGNvbmZpZy53aWR0aCwgY29uZmlnLmhlaWdodCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24oZW5lbXkpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jeC5zYXZlKCk7XHJcbiAgICB0aGlzLmN4LnRyYW5zbGF0ZShlbmVteS5wb3NbMF0sIGVuZW15LnBvc1sxXSk7XHJcbiAgICBlbmVteS5zcHJpdGUucmVuZGVyKHRoaXMuY3gpO1xyXG4gICAgdGhpcy5jeC5yZXN0b3JlKCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJCYWNrZ3JvdW5kID0gZnVuY3Rpb24oKSB7ICAvL1dURj8hXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY3guc2F2ZSgpO1xyXG4gICAgdGhpcy5jeC50cmFuc2xhdGUobW9kZWwuYmFja2dyb3VuZC5wb3NbMF0sIG1vZGVsLmJhY2tncm91bmQucG9zWzFdKTtcclxuICAgIG1vZGVsLmJhY2tncm91bmQuc3ByaXRlc1ttb2RlbC5iYWNrZ3JvdW5kLmN1cnJlbnRTcHJpdGVdLnJlbmRlcih0aGlzLmN4KTtcclxuICAgIHRoaXMuY3gucmVzdG9yZSgpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyRW5lbWllcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGVsLmVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLl9yZW5kZXIobW9kZWwuZW5lbWllc1tpXSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJQbGF5ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5fcmVuZGVyKG1vZGVsLnBsYXllcik7XHJcbn07XHJcbi8qKlxyXG4gKiBDbGVhciByZW5kZXIsIHJlbmRlciBiYWNrZ3JvdW5kLCByZW5kZXIgZW5lbWllcywgcmVuZGVyIHBsYXllclxyXG4gKi9cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY2xlYXJEaXNwbGF5KCk7XHJcbiAgICB0aGlzLnJlbmRlckJhY2tncm91bmQoKTtcclxuICAgIHRoaXMucmVuZGVyRW5lbWllcygpO1xyXG4gICAgdGhpcy5yZW5kZXJQbGF5ZXIoKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlckdhbWVPdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtb3ZlclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLW92ZXItb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuaGlkZUdhbWVPdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1vdmVyXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1vdmVyLW92ZXJsYXlcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuc2V0U2NvcmUgPSBmdW5jdGlvbihzY29yZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLnNjb3JlRWwuaW5uZXJIVE1MID0gc2NvcmUudG9TdHJpbmcoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgQ2FudmFzRGlzcGxheTogQ2FudmFzRGlzcGxheVxyXG59OyIsInZhciB3b3JsZCA9IHJlcXVpcmUoXCIuL3dvcmxkLmpzXCIpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHdvcmxkKHdpbmRvdyk7XHJcbn0pOyIsIi8qKlxyXG4gKiBAcGFyYW0gd2luZG93IEdsb2JhbCBvYmplY3RcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgQ2FuIGJlOmtleWJvYXJkLCBtZWRpY2luZSwgc21hcnRwaG9uZVxyXG4gKiBAcmV0dXJucyBPYmplY3Qgd2hpY2ggY29udGVudCBpbmZvIGFib3V0IHByZXNzZWQgYnV0dG9uc1xyXG4gKiBAc2VlIGdldElucHV0XHJcbiAqL1xyXG5mdW5jdGlvbiBpbnB1dCh3aW5kb3dfLCB0eXBlKSB7ICAgIC8vdHlwZSAtIGtleWJvYXJkLCBtZWRpY2luZSwgc21hcnRwaG9uZVxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgcHJlc3NlZCA9IG51bGw7XHJcbiAgICBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGNvZGVzLmhhc093blByb3BlcnR5KGV2ZW50LmtleUNvZGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBkb3duID0gZXZlbnQudHlwZSA9PT0gXCJrZXlkb3duXCI7XHJcbiAgICAgICAgICAgIHByZXNzZWRbY29kZXNbZXZlbnQua2V5Q29kZV1dID0gZG93bjtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xlYXJBbGwoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgYyBpbiBwcmVzc2VkKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVzc2VkLmhhc093blByb3BlcnR5KGMpKVxyXG4gICAgICAgICAgICAgICAgcHJlc3NlZFtjXSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXByZXNzZWQpIHtcclxuICAgICAgICBwcmVzc2VkID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgICAgICB2YXIgY29kZXNLZXlib2FyZCA9IHszODogXCJ1cFwifTtcclxuICAgICAgICB2YXIgY29kZXM7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwia2V5Ym9hcmRcIjpcclxuICAgICAgICAgICAgICAgIGNvZGVzID0gY29kZXNLZXlib2FyZDtcclxuICAgICAgICAgICAgICAgIHdpbmRvd18uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3dfLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvd18uYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgY2xlYXJBbGwoKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXcm9uZyB0eXBlIG9mIGlucHV0XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwcmVzc2VkO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHV0OyIsInZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWdcIik7XHJcblxyXG52YXIgcGxheWVyID0ge30sXHJcbiAgICBlbmVtaWVzID0gW10sXHJcbiAgICBiYWNrZ3JvdW5kID0ge30sXHJcbiAgICBib251c2VzID0gW107XHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbCBvbmNlXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKiBAcmV0dXJucyBwbGF5ZXJcclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVBsYXllciA9IGZ1bmN0aW9uIGNyZWF0ZVBsYXllcihwb3MsIHNwcml0ZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBwbGF5ZXIucG9zID0gcG9zIHx8IFswLCAwXTtcclxuICAgIGlmIChwbGF5ZXIuc3ByaXRlID09IG51bGwpXHJcbiAgICAgICAgcGxheWVyLnNwcml0ZSA9IHNwcml0ZTtcclxuICAgIHBsYXllci5zcGVlZCA9IHt4OiAxLCB5OiAwfTtcclxuICAgIHJldHVybiBwbGF5ZXI7XHJcbn07XHJcblxyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGwgb25jZVxyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVzXHJcbiAqIEByZXR1cm5zIGJhY2tncm91bmRcclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZUJhY2tncm91bmQgPSBmdW5jdGlvbiBjcmVhdGVCYWNrZ3JvdW5kKHBvcywgc3ByaXRlcykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBiYWNrZ3JvdW5kLnBvcyA9IHBvcyB8fCBbMCwgMF07XHJcbiAgICBpZiAoYmFja2dyb3VuZC5zcHJpdGVzID09IG51bGwpXHJcbiAgICAgICAgYmFja2dyb3VuZC5zcHJpdGVzID0gc3ByaXRlcztcclxuICAgIGJhY2tncm91bmQuY3VycmVudFNwcml0ZSA9IDA7XHJcbiAgICBiYWNrZ3JvdW5kLnNwcml0ZXNMZW5ndGggPSBzcHJpdGVzLmxlbmd0aCB8fCAxO1xyXG4gICAgcmV0dXJuIGJhY2tncm91bmQ7XHJcbn07XHJcbi8qKlxyXG4gKiBBZGQgZW5lbWllIHRvIGVuZW1pZXNcclxuICogQHBhcmFtIHBvc1xyXG4gKiBAcGFyYW0gc3ByaXRlXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVFbmVtaWUgPSBmdW5jdGlvbiBjcmVhdGVFbmVtaWUocG9zLCBzcHJpdGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZW5lbWllcy5wdXNoKHtcclxuICAgICAgICBwb3M6IHBvcyxcclxuICAgICAgICBzcHJpdGU6IHNwcml0ZVxyXG4gICAgfSk7XHJcbn07XHJcbi8qKlxyXG4gKiBBZGQgYm9udXMgdG8gYm9udXNlc1xyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgQ2FuIGJlOiBzcGVlZCwgc2xvdywgc21hbGwsIGJpZ1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlQm9udXMgPSBmdW5jdGlvbiBjcmVhdGVCb251cyhwb3MsIHNwcml0ZSwgdHlwZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBib251c2VzLnB1c2goe1xyXG4gICAgICAgIHBvczogcG9zLFxyXG4gICAgICAgIHNwcml0ZTogc3ByaXRlLFxyXG4gICAgICAgIHR5cGU6IHR5cGVcclxuICAgIH0pO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbm1vZHVsZS5leHBvcnRzLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kO1xyXG5tb2R1bGUuZXhwb3J0cy5lbmVtaWVzID0gZW5lbWllcztcclxubW9kdWxlLmV4cG9ydHMuYm9udXNlcyA9IGJvbnVzZXM7IiwidmFyIHJlc291cmNlQ2FjaGUgPSB7fTtcclxudmFyIHJlYWR5Q2FsbGJhY2tzID0gW107XHJcblxyXG5mdW5jdGlvbiBpc1JlYWR5KCkge1xyXG4gICAgdmFyIHJlYWR5ID0gdHJ1ZTtcclxuICAgIGZvciAodmFyIGsgaW4gcmVzb3VyY2VDYWNoZSkge1xyXG4gICAgICAgIGlmIChyZXNvdXJjZUNhY2hlLmhhc093blByb3BlcnR5KGspICYmICFyZXNvdXJjZUNhY2hlW2tdKSB7XHJcbiAgICAgICAgICAgIHJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlYWR5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBfbG9hZCh1cmwpIHtcclxuICAgIGlmIChyZXNvdXJjZUNhY2hlW3VybF0pIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VDYWNoZVt1cmxdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmVzb3VyY2VDYWNoZVt1cmxdID0gaW1nO1xyXG4gICAgICAgICAgICBpZiAoaXNSZWFkeSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZWFkeUNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGltZy5zcmMgPSB1cmw7XHJcbiAgICAgICAgcmVzb3VyY2VDYWNoZVt1cmxdID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIExvYWQgaW1hZ2UgYW5kIGFkZCB0aGVtIHRvIGNhY2hlXHJcbiAqQHBhcmFtIHsoc3RyaW5nfHN0cmluZ1tdKX0gdXJsT2ZBcnIgQXJyYXkgb2YgdXJsc1xyXG4gKiBAc2VlIGxvYWRSZXNvdXJjZXNcclxuICovXHJcbmZ1bmN0aW9uIGxvYWQodXJsT2ZBcnIpIHtcclxuICAgIGlmICh1cmxPZkFyciBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgdXJsT2ZBcnIuZm9yRWFjaChmdW5jdGlvbiAodXJsKSB7XHJcbiAgICAgICAgICAgIF9sb2FkKHVybCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIF9sb2FkKHVybE9mQXJyKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogR2V0IHJlc291cmNlIGZyb20gY2FjaGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxyXG4gKiBAcmV0dXJucyAgSW1hZ2VcclxuICogQHNlZSBnZXRSZXNvdXJjZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0KHVybCkge1xyXG4gICAgcmV0dXJuIHJlc291cmNlQ2FjaGVbdXJsXTtcclxufVxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uIHRvIGZ1bmN0aW9ucyB3aGljaCB3aWxsIGJlIGNhbGxlZCB0aGVuIGFsbCByZXNvdXJjZXMgbG9hZGVkXHJcbiAqIEBwYXJhbSBmdW5jXHJcbiAqIEBzZWUgb25SZXNvdXJjZXNSZWFkeVxyXG4gKi9cclxuZnVuY3Rpb24gb25SZWFkeShmdW5jKSB7XHJcbiAgICByZWFkeUNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGxvYWQ6IGxvYWQsXHJcbiAgICBnZXQ6IGdldCxcclxuICAgIG9uUmVhZHk6IG9uUmVhZHksXHJcbiAgICBpc1JlYWR5OiBpc1JlYWR5XHJcbn07XHJcbiIsInZhciByZXNvdXJjZXMgPSByZXF1aXJlKFwiLi9yZXNvdXJjZXMuanNcIik7XHJcblxyXG4vKipcclxuICogU3ByaXRlIG9mIHRleHR1cmVcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBwb3MgUG9zaXRpb24gaW4gc3ByaXRlIHNoZWV0XHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IHNpemUgU2l6ZSBpbiBzcHJpdGUgc2hlZXRcclxuICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIFNwZWVkIG9mIHBsYXlpbmcgYW5pbWF0aW9uXHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IGZyYW1lcyBGcmFtZXMgb2YgYW5pbWF0aW9uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXIgRGlyZWN0aW9uIG9uIHNwcml0ZSBzaGVldFxyXG4gKiBAcGFyYW0ge2Jvb2x9IG9uY2UgQ291bnQgb2YgcGxheWluZyBhbmltYXRpb25cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBzZWUgY3JlYXRlU3ByaXRlXHJcbiAqIEBzZWUgY3JlYXRlU3ByaXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBTcHJpdGUodXJsLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZSkge1xyXG4gICAgdGhpcy5wb3MgPSBwb3M7XHJcbiAgICB0aGlzLnVybCA9IHVybDtcclxuICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICB0aGlzLnNwZWVkID0gdHlwZW9mIHNwZWVkID09PSBcIm51bWJlclwiID8gc3BlZWQgOiAwO1xyXG4gICAgdGhpcy5mcmFtZXMgPSBmcmFtZXM7XHJcbiAgICB0aGlzLmRpciA9IGRpciB8fCBcImhvcml6b250YWxcIjtcclxuICAgIHRoaXMub25jZSA9IG9uY2U7XHJcbiAgICB0aGlzLl9pbmRleCA9IDA7XHJcbn1cclxuXHJcblNwcml0ZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICB0aGlzLl9pbmRleCArPSB0aGlzLnNwZWVkICogZHQ7XHJcbn07XHJcblNwcml0ZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGN0eCkge1xyXG4gICAgdmFyIGZyYW1lO1xyXG4gICAgaWYgKHRoaXMuc3BlZWQgPiAwKSB7XHJcbiAgICAgICAgdmFyIG1heCA9IHRoaXMuZnJhbWVzLmxlbmd0aDtcclxuICAgICAgICB2YXIgaWR4ID0gTWF0aC5mbG9vcih0aGlzLl9pbmRleCk7XHJcbiAgICAgICAgZnJhbWUgPSB0aGlzLmZyYW1lc1tpZHggJSBtYXhdO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vbmNlICYmIGlkeCA+PSBtYXgpIHtcclxuICAgICAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZnJhbWUgPSAwO1xyXG4gICAgfVxyXG4gICAgdmFyIHggPSB0aGlzLnBvc1swXTtcclxuICAgIHZhciB5ID0gdGhpcy5wb3NbMV07XHJcblxyXG4gICAgaWYgKHRoaXMuZGlyID09PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgICB5ICs9IGZyYW1lICogdGhpcy5zaXplWzFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB4ICs9IGZyYW1lICogdGhpcy5zaXplWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5kcmF3SW1hZ2UocmVzb3VyY2VzLmdldCh0aGlzLnVybCksIHgsIHksIHRoaXMuc2l6ZVswXSwgdGhpcy5zaXplWzFdLCAwLCAwLCB0aGlzLnNpemVbMF0sIHRoaXMuc2l6ZVsxXSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTsiLCJ2YXIgY29yZSA9IHJlcXVpcmUoXCIuL2NvcmUuanNcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWcuanNcIik7XHJcblxyXG52YXIgbGFzdFRpbWUsXHJcbiAgICBpc0dhbWVPdmVyLFxyXG4gICAgc2NvcmUsXHJcbiAgICBwcmVzc2VkO1xyXG52YXIgdmlld3BvcnQgPSBjb3JlLmdldFZpZXdwb3J0KCk7XHJcblxyXG5mdW5jdGlvbiBjb2xsaWRlcyh4LCB5LCByLCBiLCB4MiwgeTIsIHIyLCBiMikge1xyXG4gICAgcmV0dXJuIChyID49IHgyICYmIHggPCByMiAmJiB5IDwgYjIgJiYgYiA+PSB5Mik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJveENvbGxpZGVzKHBvcywgc2l6ZSwgcG9zMiwgc2l6ZTIpIHtcclxuICAgIHJldHVybiBjb2xsaWRlcyhwb3NbMF0sIHBvc1sxXSwgcG9zWzBdICsgc2l6ZVswXSwgcG9zWzFdICsgc2l6ZVsxXSxcclxuICAgICAgICBwb3MyWzBdLCBwb3MyWzFdLCBwb3MyWzBdICsgc2l6ZTJbMF0sIHBvczJbMV0gKyBzaXplMlsxXSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2V0KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVHYW1lT3ZlcigpO1xyXG4gICAgaXNHYW1lT3ZlciA9IGZhbHNlO1xyXG4gICAgc2NvcmUgPSAwO1xyXG4gICAgY29yZS5jcmVhdGVQbGF5ZXIoXHJcbiAgICAgICAgW3ZpZXdwb3J0LndpZHRoIC8gMiwgNTBdLFxyXG4gICAgICAgIGNvcmUuY3JlYXRlU3ByaXRlKFwiaW1nL3JlY3QuanBnXCIsIFswLCAwXSwgWzEwMCwgMTAwXSwgMCwgWzBdKVxyXG4gICAgKTtcclxuICAgIGNvcmUuY3JlYXRlQmFja2dyb3VuZChcclxuICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgW2NvcmUuY3JlYXRlU3ByaXRlKFwiaW1nL2JsYWNrLmpwZ1wiLCBbMCwgMF0sIFt2aWV3cG9ydC53aWR0aCAqIDMsIHZpZXdwb3J0LmhlaWdodF0sIDApXVxyXG4gICAgKTtcclxuICAgIGNvcmUuZW5lbWllcyA9IFtdO1xyXG4gICAgY29yZS5ib251c2VzID0gW107XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdhbWVPdmVyKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpc0dhbWVPdmVyID0gdHJ1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQmFja2dyb3VuZChkdCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmJhY2tncm91bmQucG9zID0gW2NvcmUuYmFja2dyb3VuZC5wb3NbMF0gLSBjb25maWcuYmFja2dyb3VuZFNwZWVkICogZHQsIGNvcmUuYmFja2dyb3VuZC5wb3NbMV1dO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja0NvbGlzaW9ucyhwb3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIGNvbGxpc2lvbiA9IFtdLFxyXG4gICAgICAgIHNpemUgPSBjb3JlLnBsYXllci5zcHJpdGUuc2l6ZSxcclxuICAgICAgICBpLFxyXG4gICAgICAgIGVuZW1pZXMgPSBjb3JlLmVuZW1pZXMsXHJcbiAgICAgICAgYm9udXNlcyA9IGNvcmUuYm9udXNlcztcclxuXHJcbiAgICBpZiAocG9zWzFdIDwgMCkge1xyXG4gICAgICAgIGNvbGxpc2lvbi5wdXNoKHt0eXBlOiBcInRvcFwifSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwb3NbMV0gKyBzaXplWzFdID4gY29uZmlnLmZvcmVzdExpbmUpIHtcclxuICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJmb3Jlc3RcIn0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGJveENvbGxpZGVzKHBvcywgc2l6ZSwgZW5lbWllc1tpXS5wb3MsIGVuZW1pZXNbaV0uc3ByaXRlLnNpemUpKSB7XHJcbiAgICAgICAgICAgIGNvbGxpc2lvbi5wdXNoKHt0eXBlOiBcImVuZW15XCIsIHRhcmdldDogZW5lbWllc1tpXX0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgYm9udXNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChib3hDb2xsaWRlcyhwb3MsIHNpemUsIGJvbnVzZXNbaV0ucG9zLCBib251c2VzW2ldLnNwcml0ZS5zaXplKSkge1xyXG4gICAgICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJib251c1wiLCB0YXJnZXQ6IGJvbnVzZXNbaV19KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29sbGlzaW9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb2xsaWRlUGxheWVyKHBvcykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgY29sbGlzaW9uID0gY2hlY2tDb2xpc2lvbnMocG9zKSxcclxuICAgICAgICBpID0gMDtcclxuICAgIGlmIChjb2xsaXNpb24ubGVuZ3RoID09IDApXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgY29sbGlzaW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3dpdGNoIChjb2xsaXNpb25baV0udHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwidG9wXCI6XHJcbiAgICAgICAgICAgICAgICBjb3JlLnBsYXllci5zcGVlZC55ID0gMDtcclxuICAgICAgICAgICAgICAgIGNvcmUucGxheWVyLnBvc1sxXSA9IDA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImZvcmVzdFwiOlxyXG4gICAgICAgICAgICAgICAgZ2FtZU92ZXIoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBjYXNlIFwiZW5lbXlcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYm9udXNcIjpcclxuICAgICAgICAgICAgICAgIGNvcmUucGxheWVyLnBvcyA9IHBvcztcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVBsYXllcihkdCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLnBsYXllci5zcGVlZC55ICs9IGNvbmZpZy5ncmF2aXR5ICogZHQ7XHJcbiAgICBpZiAocHJlc3NlZFsndXAnXSkge1xyXG4gICAgICAgIGNvcmUucGxheWVyLnNwZWVkLnkgLT0gY29uZmlnLmJyZWF0aGVTcGVlZCAqIGR0O1xyXG4gICAgfVxyXG4gICAgdmFyIG1vdGlvbiA9IGNvcmUucGxheWVyLnNwZWVkLnkgKiBkdDtcclxuICAgIHZhciBuZXdQb3MgPSBbY29yZS5wbGF5ZXIucG9zWzBdLCBjb3JlLnBsYXllci5wb3NbMV0gKyBtb3Rpb25dO1xyXG4gICAgaWYgKGNvbGxpZGVQbGF5ZXIobmV3UG9zKSkgeyAvL21vdmUgb3Igbm90IHRvIG1vdmVcclxuICAgICAgICBjb3JlLnBsYXllci5wb3MgPSBuZXdQb3M7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUVuaXRpZXMoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5wbGF5ZXIuc3ByaXRlLnVwZGF0ZShkdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZShkdCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB1cGRhdGVFbml0aWVzKGR0KTtcclxuICAgIGlmICghaXNHYW1lT3Zlcikge1xyXG4gICAgICAgIHVwZGF0ZUJhY2tncm91bmQoZHQpO1xyXG4gICAgICAgIHVwZGF0ZVBsYXllcihkdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5yZW5kZXIoKTtcclxuICAgIGNvcmUuc2V0U2NvcmUoc2NvcmUpO1xyXG4gICAgaWYgKGlzR2FtZU92ZXIpIHtcclxuICAgICAgICBjb3JlLnJlbmRlckdhbWVPdmVyKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgdmFyIGR0ID0gKG5vdyAtIGxhc3RUaW1lKSAvIDEwMDA7XHJcblxyXG4gICAgdXBkYXRlKGR0KTtcclxuICAgIHJlbmRlcigpO1xyXG5cclxuICAgIGxhc3RUaW1lID0gbm93O1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW4pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBwcmVzc2VkID0gY29yZS5nZXRJbnB1dCh3aW5kb3csIFwia2V5Ym9hcmRcIik7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXktYWdhaW5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJlc2V0KCk7XHJcbiAgICB9KTtcclxuICAgIHJlc2V0KCk7XHJcbiAgICBsYXN0VGltZSA9IERhdGUubm93KCk7XHJcbiAgICBtYWluKCk7XHJcbn1cclxuXHJcbmNvcmUubG9hZFJlc291cmNlcyhbXHJcbiAgICBcImltZy9ibGFjay5qcGdcIixcclxuICAgIFwiaW1nL3JlY3QuanBnXCJcclxuXSk7XHJcblxyXG5jb3JlLm9uUmVzb3VyY2VzUmVhZHkoaW5pdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG59OyJdfQ==
