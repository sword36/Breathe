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

function showElement(el) {
    "use strict";
    display.showElement(el);
}

function hideElement(el) {
    "use strict";
    display.hideElement(el);
}

module.exports = {
    loadImages: resources.loadImages,
    loadAudios: resources.loadAudios,
    getImg: resources.getImg,
    getAudio: resources.getAudio,
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
    showElement: showElement,
    hideElement: hideElement,
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
    this.canvas = document.querySelector("#canvas");
    this.canvas.width = config.width;
    this.canvas.height = config.height;
    this.scoreEl = document.querySelector("#score");
    this.cx = this.canvas.getContext('2d');
    this.menu = document.querySelector("#menu");
    this.main = document.querySelector("#main");
    this.play = document.querySelector(".play");
    this.credits = document.querySelector("#credits");
    this.records = document.querySelector("#records");
    this.game_over = document.querySelector("#game-over");
    this.game_over_overlay = document.querySelector("#game-over-overlay");
    this.backButtons = document.querySelectorAll(".back");
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

CanvasDisplay.prototype.showElement = function(el) {
    "use strict";
    if (el in this)
        this[el].style.display = 'block';
};


CanvasDisplay.prototype.hideElement = function(el) {
    "use strict";
    if (el in this)
        this[el].style.display = 'none';
};

CanvasDisplay.prototype.renderGameOver = function() {
    this.showElement("game_over");
    this.showElement("game_over_overlay");
};

CanvasDisplay.prototype.hideGameOver = function() {
    "use strict";
    this.hideElement("game_over");
    this.hideElement("game_over_overlay");
};

CanvasDisplay.prototype.setScore = function(score) {
    "use strict";
    this.scoreEl.innerHTML = score.toString();
};

module.exports = {
    CanvasDisplay: CanvasDisplay
};
},{"./config.js":2,"./model.js":7}],5:[function(require,module,exports){
var world = require("./world.js")();
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
},{}],8:[function(require,module,exports){
var imagesCache = {};
var audiosCache = {};
var readyCallbacks = [];
var resourcesLoaded = 0;

function isReady() {
    var ready = true;
    for (var k in imagesCache) {
        if (imagesCache.hasOwnProperty(k) && !imagesCache[k]) {
            ready = false;
        }
    }
    for (var k in audiosCache) {
        if (audiosCache.hasOwnProperty(k) && !audiosCache[k]) {
            ready = false;
        }
    }
    return ready;
}

function _loadImg(url) {
    if (imagesCache[url]) {
        return imagesCache[url];
    } else {
        var img = new Image();
        img.onload = function () {
            imagesCache[url] = img;
            if (isReady()) {
                readyCallbacks.forEach(function (func) {
                    func();
                });
            }
        };
        img.src = url;
        imagesCache[url] = false;
    }
}

function _loadAudio(url) {
    if (audiosCache[url]) {
        return audiosCache[url];
    } else {
        var audio = new Audio();
        audio.addEventListener("canplay", function () {
            if (!audiosCache[url]) {
                if (isReady()) {
                    audiosCache[url] = audio;
                    readyCallbacks.forEach(function (func) {
                        func();
                    });
                } else {
                    audiosCache[url] = audio;
                }
            }
        });
        audio.src = url;
        audio.preload = "auto";
        audio.load();
        audiosCache[url] = false;
    }
}
/**
 * Load image and add them to cache
 *@param {(string|string[])} urlOfArr Array of urls
 * @see loadResources
 */
function loadImages(urlOfArr) {
    if (urlOfArr instanceof Array) {
        resourcesLoaded += urlOfArr.length;
        urlOfArr.forEach(function (url) {
            _loadImg(url);
        });
    } else {
        resourcesLoaded += 1;
        _loadImg(urlOfArr);
    }
}

function loadAudios(urlOfArr) {
    if (urlOfArr instanceof Array) {
        resourcesLoaded += urlOfArr.length;
        urlOfArr.forEach(function (url) {
            _loadAudio(url);
        });
    } else {
        resourcesLoaded += 1;
        _loadAudio(urlOfArr);
    }
}
/**
 * Get resource from cache
 * @param {string} url
 * @returns  Image
 * @see getResource
 */
function getImg(url) {
    return imagesCache[url];
}

function getAudio(url) {
    return imagesCache[url];
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
    loadImages: loadImages,
    loadAudios: loadAudios,
    getImg: getImg,
    getAudio: getAudio,
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

    ctx.drawImage(resources.getImg(this.url), x, y, this.size[0], this.size[1], 0, 0, this.size[0], this.size[1]);
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

var scoreEl = document.querySelector("#score");

function gameOver() {
    "use strict";
    isGameOver = true;
    core.renderGameOver();
    scoreEl.innerHTML = score;
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
    if (collision.length === 0)
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
    /*document.querySelector("#play-again").addEventListener("click", function() {
        reset();
    });*/
    reset();
    lastTime = Date.now();
    main();
}

core.loadImages([
    "img/black.jpg",
    "img/rect.jpg"
]);

core.onResourcesReady(core.showElement("main"));

var playEl = document.querySelector(".play");
var restartEl = document.querySelector(".restart");

playEl.addEventListener("click", function() {
    "use strict";
    core.hideElement("menu");
    init();
});

restartEl.addEventListener("click", function() {
    "use strict";
    core.hideGameOver();
    reset();
});

module.exports = function() {
    "use strict";

};
},{"./config.js":2,"./core.js":3}]},{},[1,2,3,4,5,6,7,8,9,10])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXVkaW8uanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2NvcmUuanMiLCJzcmMvanMvZGlzcGxheS5qcyIsInNyYy9qcy9nYW1lLmpzIiwic3JjL2pzL2lucHV0LmpzIiwic3JjL2pzL21vZGVsLmpzIiwic3JjL2pzL3Jlc291cmNlcy5qcyIsInNyYy9qcy9zcHJpdGUuanMiLCJzcmMvanMvd29ybGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBtb2R1bGVzIGFyZSBkZWZpbmVkIGFzIGFuIGFycmF5XHJcbi8vIFsgbW9kdWxlIGZ1bmN0aW9uLCBtYXAgb2YgcmVxdWlyZXVpcmVzIF1cclxuLy9cclxuLy8gbWFwIG9mIHJlcXVpcmV1aXJlcyBpcyBzaG9ydCByZXF1aXJlIG5hbWUgLT4gbnVtZXJpYyByZXF1aXJlXHJcbi8vXHJcbi8vIGFueXRoaW5nIGRlZmluZWQgaW4gYSBwcmV2aW91cyBidW5kbGUgaXMgYWNjZXNzZWQgdmlhIHRoZVxyXG4vLyBvcmlnIG1ldGhvZCB3aGljaCBpcyB0aGUgcmVxdWlyZXVpcmUgZm9yIHByZXZpb3VzIGJ1bmRsZXNcclxuXHJcbihmdW5jdGlvbiBvdXRlciAobW9kdWxlcywgY2FjaGUsIGVudHJ5KSB7XHJcbiAgICAvLyBTYXZlIHRoZSByZXF1aXJlIGZyb20gcHJldmlvdXMgYnVuZGxlIHRvIHRoaXMgY2xvc3VyZSBpZiBhbnlcclxuICAgIHZhciBwcmV2aW91c1JlcXVpcmUgPSB0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZTtcclxuXHJcbiAgICBmdW5jdGlvbiBuZXdSZXF1aXJlKG5hbWUsIGp1bXBlZCl7XHJcbiAgICAgICAgaWYoIWNhY2hlW25hbWVdKSB7XHJcbiAgICAgICAgICAgIGlmKCFtb2R1bGVzW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSBjYW5ub3QgZmluZCB0aGUgdGhlIG1vZHVsZSB3aXRoaW4gb3VyIGludGVybmFsIG1hcCBvclxyXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUganVtcCB0byB0aGUgY3VycmVudCBnbG9iYWwgcmVxdWlyZSBpZS4gdGhlIGxhc3QgYnVuZGxlXHJcbiAgICAgICAgICAgICAgICAvLyB0aGF0IHdhcyBhZGRlZCB0byB0aGUgcGFnZS5cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50UmVxdWlyZSA9IHR5cGVvZiByZXF1aXJlID09IFwiZnVuY3Rpb25cIiAmJiByZXF1aXJlO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFqdW1wZWQgJiYgY3VycmVudFJlcXVpcmUpIHJldHVybiBjdXJyZW50UmVxdWlyZShuYW1lLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgb3RoZXIgYnVuZGxlcyBvbiB0aGlzIHBhZ2UgdGhlIHJlcXVpcmUgZnJvbSB0aGVcclxuICAgICAgICAgICAgICAgIC8vIHByZXZpb3VzIG9uZSBpcyBzYXZlZCB0byAncHJldmlvdXNSZXF1aXJlJy4gUmVwZWF0IHRoaXMgYXNcclxuICAgICAgICAgICAgICAgIC8vIG1hbnkgdGltZXMgYXMgdGhlcmUgYXJlIGJ1bmRsZXMgdW50aWwgdGhlIG1vZHVsZSBpcyBmb3VuZCBvclxyXG4gICAgICAgICAgICAgICAgLy8gd2UgZXhoYXVzdCB0aGUgcmVxdWlyZSBjaGFpbi5cclxuICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c1JlcXVpcmUpIHJldHVybiBwcmV2aW91c1JlcXVpcmUobmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIG1vZHVsZSBcXCcnICsgbmFtZSArICdcXCcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbSA9IGNhY2hlW25hbWVdID0ge2V4cG9ydHM6e319O1xyXG4gICAgICAgICAgICBtb2R1bGVzW25hbWVdWzBdLmNhbGwobS5leHBvcnRzLCBmdW5jdGlvbih4KXtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IG1vZHVsZXNbbmFtZV1bMV1beF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3UmVxdWlyZShpZCA/IGlkIDogeCk7XHJcbiAgICAgICAgICAgIH0sbSxtLmV4cG9ydHMsb3V0ZXIsbW9kdWxlcyxjYWNoZSxlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYWNoZVtuYW1lXS5leHBvcnRzO1xyXG4gICAgfVxyXG4gICAgZm9yKHZhciBpPTA7aTxlbnRyeS5sZW5ndGg7aSsrKSBuZXdSZXF1aXJlKGVudHJ5W2ldKTtcclxuXHJcbiAgICAvLyBPdmVycmlkZSB0aGUgY3VycmVudCByZXF1aXJlIHdpdGggdGhpcyBuZXcgb25lXHJcbiAgICByZXR1cm4gbmV3UmVxdWlyZTtcclxufSkiLCIvKipcclxuICogQ3JlYXRlZCBieSBVU0VSIG9uIDEwLjA3LjIwMTUuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbn07IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgVVNFUiBvbiAxMC4wNy4yMDE1LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB3aWR0aDogMTAyNCxcclxuICAgIGhlaWdodDogNjAwLFxyXG4gICAgaW5wdXRUeXBlOiBcImtleWJvYXJkXCIsXHJcbiAgICBiYWNrZ3JvdW5kU3BlZWQ6IDE1MCxcclxuICAgIGdyYXZpdHk6IDE1MCxcclxuICAgIGJyZWF0aGVTcGVlZDogMzUwLFxyXG4gICAgZm9yZXN0TGluZTogNDUwLFxyXG4gICAgaW1hZ2VTbW9vdGhpbmdFbmFibGVkOiB0cnVlXHJcbn07IiwidmFyIHJlc291cmNlcyA9IHJlcXVpcmUoXCIuL3Jlc291cmNlcy5qc1wiKTtcclxudmFyIFNwcml0ZSA9IHJlcXVpcmUoXCIuL3Nwcml0ZS5qc1wiKTtcclxudmFyIGlucHV0ID0gcmVxdWlyZShcIi4vaW5wdXQuanNcIik7XHJcbnZhciBtb2RlbCA9IHJlcXVpcmUoXCIuL21vZGVsLmpzXCIpO1xyXG52YXIgZGlzcGxheV8gPSAgcmVxdWlyZShcIi4vZGlzcGxheS5qc1wiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZy5qc1wiKTtcclxuXHJcbnZhciBkaXNwbGF5ID0gbmV3IGRpc3BsYXlfLkNhbnZhc0Rpc3BsYXkoKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiBuZXcgU3ByaXRlKHVybCwgcG9zLCBzaXplLCBzcGVlZCwgZnJhbWVzLCBkaXIsIG9uY2UpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWaWV3cG9ydCgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB3aWR0aDogY29uZmlnLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogY29uZmlnLmhlaWdodFxyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnJlbmRlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhckRpc3BsYXkoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuY2xlYXJEaXNwbGF5KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlckdhbWVPdmVyKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnJlbmRlckdhbWVPdmVyKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGVHYW1lT3ZlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5oaWRlR2FtZU92ZXIoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U2NvcmUoc2NvcmUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5zZXRTY29yZShzY29yZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dFbGVtZW50KGVsKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuc2hvd0VsZW1lbnQoZWwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlRWxlbWVudChlbCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LmhpZGVFbGVtZW50KGVsKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBsb2FkSW1hZ2VzOiByZXNvdXJjZXMubG9hZEltYWdlcyxcclxuICAgIGxvYWRBdWRpb3M6IHJlc291cmNlcy5sb2FkQXVkaW9zLFxyXG4gICAgZ2V0SW1nOiByZXNvdXJjZXMuZ2V0SW1nLFxyXG4gICAgZ2V0QXVkaW86IHJlc291cmNlcy5nZXRBdWRpbyxcclxuICAgIG9uUmVzb3VyY2VzUmVhZHk6IHJlc291cmNlcy5vblJlYWR5LFxyXG4gICAgY3JlYXRlU3ByaXRlOiBjcmVhdGVTcHJpdGUsXHJcbiAgICBnZXRJbnB1dDogaW5wdXQsXHJcbiAgICBjcmVhdGVQbGF5ZXI6IG1vZGVsLmNyZWF0ZVBsYXllcixcclxuICAgIGNyZWF0ZUJhY2tncm91bmQ6IG1vZGVsLmNyZWF0ZUJhY2tncm91bmQsXHJcbiAgICBjcmVhdGVFbmVtaWU6IG1vZGVsLmNyZWF0ZUVuZW1pZSxcclxuICAgIGNyZWF0ZUJvbnVzOiBtb2RlbC5jcmVhdGVCb251cyxcclxuICAgIHBsYXllcjogbW9kZWwucGxheWVyLFxyXG4gICAgYmFja2dyb3VuZDogbW9kZWwuYmFja2dyb3VuZCxcclxuICAgIGVuZW1pZXM6IG1vZGVsLmVuZW1pZXMsXHJcbiAgICBib251c2VzOiBtb2RlbC5ib251c2VzLFxyXG4gICAgcmVuZGVyOiByZW5kZXIsXHJcbiAgICBjbGVhclJlbmRlcjogY2xlYXJEaXNwbGF5LFxyXG4gICAgcmVuZGVyR2FtZU92ZXI6IHJlbmRlckdhbWVPdmVyLFxyXG4gICAgaGlkZUdhbWVPdmVyOiBoaWRlR2FtZU92ZXIsXHJcbiAgICBzZXRTY29yZTogc2V0U2NvcmUsXHJcbiAgICBzaG93RWxlbWVudDogc2hvd0VsZW1lbnQsXHJcbiAgICBoaWRlRWxlbWVudDogaGlkZUVsZW1lbnQsXHJcbiAgICBnZXRWaWV3cG9ydDogZ2V0Vmlld3BvcnRcclxufTtcclxuXHJcbiIsInZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWcuanNcIik7XHJcbi8vdmFyIGNvcmUgPSByZXF1aXJlKFwiLi9jb3JlLmpzXCIpOyAvL2NpcmN1bGFyIGxpbmtcclxudmFyIG1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWwuanNcIik7XHJcblxyXG5mdW5jdGlvbiBmbGlwSG9yaXpvbnRhbGx5KGNvbnRleHQsIGFyb3VuZCkge1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoYXJvdW5kLCAwKTtcclxuICAgIGNvbnRleHQuc2NhbGUoLTEsIDEpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoLWFyb3VuZCwgMCk7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAc2VlIGRpc3BsYXlcclxuICovXHJcbmZ1bmN0aW9uIENhbnZhc0Rpc3BsYXkoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjYW52YXNcIik7XHJcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IGNvbmZpZy53aWR0aDtcclxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IGNvbmZpZy5oZWlnaHQ7XHJcbiAgICB0aGlzLnNjb3JlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlXCIpO1xyXG4gICAgdGhpcy5jeCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLm1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbnVcIik7XHJcbiAgICB0aGlzLm1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5cIik7XHJcbiAgICB0aGlzLnBsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXlcIik7XHJcbiAgICB0aGlzLmNyZWRpdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NyZWRpdHNcIik7XHJcbiAgICB0aGlzLnJlY29yZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JlY29yZHNcIik7XHJcbiAgICB0aGlzLmdhbWVfb3ZlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ2FtZS1vdmVyXCIpO1xyXG4gICAgdGhpcy5nYW1lX292ZXJfb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ2FtZS1vdmVyLW92ZXJsYXlcIik7XHJcbiAgICB0aGlzLmJhY2tCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5iYWNrXCIpO1xyXG59XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmNhbnZhcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuY2FudmFzKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmNsZWFyRGlzcGxheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmN4LmZpbGxTdHlsZSA9IFwicmdiKDUyLCAxNjYsIDI1MSlcIjtcclxuICAgIHRoaXMuY3guZmlsbFJlY3QoMCwgMCwgY29uZmlnLndpZHRoLCBjb25maWcuaGVpZ2h0KTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLl9yZW5kZXIgPSBmdW5jdGlvbihlbmVteSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmN4LnNhdmUoKTtcclxuICAgIHRoaXMuY3gudHJhbnNsYXRlKGVuZW15LnBvc1swXSwgZW5lbXkucG9zWzFdKTtcclxuICAgIGVuZW15LnNwcml0ZS5yZW5kZXIodGhpcy5jeCk7XHJcbiAgICB0aGlzLmN4LnJlc3RvcmUoKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlckJhY2tncm91bmQgPSBmdW5jdGlvbigpIHsgIC8vV1RGPyFcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jeC5zYXZlKCk7XHJcbiAgICB0aGlzLmN4LnRyYW5zbGF0ZShtb2RlbC5iYWNrZ3JvdW5kLnBvc1swXSwgbW9kZWwuYmFja2dyb3VuZC5wb3NbMV0pO1xyXG4gICAgbW9kZWwuYmFja2dyb3VuZC5zcHJpdGVzW21vZGVsLmJhY2tncm91bmQuY3VycmVudFNwcml0ZV0ucmVuZGVyKHRoaXMuY3gpO1xyXG4gICAgdGhpcy5jeC5yZXN0b3JlKCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJFbmVtaWVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9kZWwuZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcihtb2RlbC5lbmVtaWVzW2ldKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlclBsYXllciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLl9yZW5kZXIobW9kZWwucGxheWVyKTtcclxufTtcclxuLyoqXHJcbiAqIENsZWFyIHJlbmRlciwgcmVuZGVyIGJhY2tncm91bmQsIHJlbmRlciBlbmVtaWVzLCByZW5kZXIgcGxheWVyXHJcbiAqL1xyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jbGVhckRpc3BsYXkoKTtcclxuICAgIHRoaXMucmVuZGVyQmFja2dyb3VuZCgpO1xyXG4gICAgdGhpcy5yZW5kZXJFbmVtaWVzKCk7XHJcbiAgICB0aGlzLnJlbmRlclBsYXllcigpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuc2hvd0VsZW1lbnQgPSBmdW5jdGlvbihlbCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpZiAoZWwgaW4gdGhpcylcclxuICAgICAgICB0aGlzW2VsXS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxufTtcclxuXHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5oaWRlRWxlbWVudCA9IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmIChlbCBpbiB0aGlzKVxyXG4gICAgICAgIHRoaXNbZWxdLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJHYW1lT3ZlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5zaG93RWxlbWVudChcImdhbWVfb3ZlclwiKTtcclxuICAgIHRoaXMuc2hvd0VsZW1lbnQoXCJnYW1lX292ZXJfb3ZlcmxheVwiKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmhpZGVHYW1lT3ZlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmhpZGVFbGVtZW50KFwiZ2FtZV9vdmVyXCIpO1xyXG4gICAgdGhpcy5oaWRlRWxlbWVudChcImdhbWVfb3Zlcl9vdmVybGF5XCIpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuc2V0U2NvcmUgPSBmdW5jdGlvbihzY29yZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLnNjb3JlRWwuaW5uZXJIVE1MID0gc2NvcmUudG9TdHJpbmcoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgQ2FudmFzRGlzcGxheTogQ2FudmFzRGlzcGxheVxyXG59OyIsInZhciB3b3JsZCA9IHJlcXVpcmUoXCIuL3dvcmxkLmpzXCIpKCk7IiwiLyoqXHJcbiAqIEBwYXJhbSB3aW5kb3cgR2xvYmFsIG9iamVjdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBDYW4gYmU6a2V5Ym9hcmQsIG1lZGljaW5lLCBzbWFydHBob25lXHJcbiAqIEByZXR1cm5zIE9iamVjdCB3aGljaCBjb250ZW50IGluZm8gYWJvdXQgcHJlc3NlZCBidXR0b25zXHJcbiAqIEBzZWUgZ2V0SW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIGlucHV0KHdpbmRvd18sIHR5cGUpIHsgICAgLy90eXBlIC0ga2V5Ym9hcmQsIG1lZGljaW5lLCBzbWFydHBob25lXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBwcmVzc2VkID0gbnVsbDtcclxuICAgIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuICAgICAgICBpZiAoY29kZXMuaGFzT3duUHJvcGVydHkoZXZlbnQua2V5Q29kZSkpIHtcclxuICAgICAgICAgICAgdmFyIGRvd24gPSBldmVudC50eXBlID09PSBcImtleWRvd25cIjtcclxuICAgICAgICAgICAgcHJlc3NlZFtjb2Rlc1tldmVudC5rZXlDb2RlXV0gPSBkb3duO1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhckFsbCgpIHtcclxuICAgICAgICBmb3IgKHZhciBjIGluIHByZXNzZWQpIHtcclxuICAgICAgICAgICAgaWYgKHByZXNzZWQuaGFzT3duUHJvcGVydHkoYykpXHJcbiAgICAgICAgICAgICAgICBwcmVzc2VkW2NdID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJlc3NlZCkge1xyXG4gICAgICAgIHByZXNzZWQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICAgIHZhciBjb2Rlc0tleWJvYXJkID0gezM4OiBcInVwXCJ9O1xyXG4gICAgICAgIHZhciBjb2RlcztcclxuXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJrZXlib2FyZFwiOlxyXG4gICAgICAgICAgICAgICAgY29kZXMgPSBjb2Rlc0tleWJvYXJkO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Xy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvd18uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Xy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBjbGVhckFsbCgpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIHR5cGUgb2YgaW5wdXRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByZXNzZWQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdXQ7IiwidmFyIHBsYXllciA9IHt9LFxyXG4gICAgZW5lbWllcyA9IFtdLFxyXG4gICAgYmFja2dyb3VuZCA9IHt9LFxyXG4gICAgYm9udXNlcyA9IFtdO1xyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGwgb25jZVxyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVcclxuICogQHJldHVybnMgcGxheWVyXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVQbGF5ZXIgPSBmdW5jdGlvbiBjcmVhdGVQbGF5ZXIocG9zLCBzcHJpdGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcGxheWVyLnBvcyA9IHBvcyB8fCBbMCwgMF07XHJcbiAgICBpZiAocGxheWVyLnNwcml0ZSA9PSBudWxsKVxyXG4gICAgICAgIHBsYXllci5zcHJpdGUgPSBzcHJpdGU7XHJcbiAgICBwbGF5ZXIuc3BlZWQgPSB7eDogMSwgeTogMH07XHJcbiAgICByZXR1cm4gcGxheWVyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsIG9uY2VcclxuICogQHBhcmFtIHBvc1xyXG4gKiBAcGFyYW0gc3ByaXRlc1xyXG4gKiBAcmV0dXJucyBiYWNrZ3JvdW5kXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVCYWNrZ3JvdW5kID0gZnVuY3Rpb24gY3JlYXRlQmFja2dyb3VuZChwb3MsIHNwcml0ZXMpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYmFja2dyb3VuZC5wb3MgPSBwb3MgfHwgWzAsIDBdO1xyXG4gICAgaWYgKGJhY2tncm91bmQuc3ByaXRlcyA9PSBudWxsKVxyXG4gICAgICAgIGJhY2tncm91bmQuc3ByaXRlcyA9IHNwcml0ZXM7XHJcbiAgICBiYWNrZ3JvdW5kLmN1cnJlbnRTcHJpdGUgPSAwO1xyXG4gICAgYmFja2dyb3VuZC5zcHJpdGVzTGVuZ3RoID0gc3ByaXRlcy5sZW5ndGggfHwgMTtcclxuICAgIHJldHVybiBiYWNrZ3JvdW5kO1xyXG59O1xyXG4vKipcclxuICogQWRkIGVuZW1pZSB0byBlbmVtaWVzXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlRW5lbWllID0gZnVuY3Rpb24gY3JlYXRlRW5lbWllKHBvcywgc3ByaXRlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGVuZW1pZXMucHVzaCh7XHJcbiAgICAgICAgcG9zOiBwb3MsXHJcbiAgICAgICAgc3ByaXRlOiBzcHJpdGVcclxuICAgIH0pO1xyXG59O1xyXG4vKipcclxuICogQWRkIGJvbnVzIHRvIGJvbnVzZXNcclxuICogQHBhcmFtIHBvc1xyXG4gKiBAcGFyYW0gc3ByaXRlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIENhbiBiZTogc3BlZWQsIHNsb3csIHNtYWxsLCBiaWdcclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZUJvbnVzID0gZnVuY3Rpb24gY3JlYXRlQm9udXMocG9zLCBzcHJpdGUsIHR5cGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYm9udXNlcy5wdXNoKHtcclxuICAgICAgICBwb3M6IHBvcyxcclxuICAgICAgICBzcHJpdGU6IHNwcml0ZSxcclxuICAgICAgICB0eXBlOiB0eXBlXHJcbiAgICB9KTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMucGxheWVyID0gcGxheWVyO1xyXG5tb2R1bGUuZXhwb3J0cy5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZDtcclxubW9kdWxlLmV4cG9ydHMuZW5lbWllcyA9IGVuZW1pZXM7XHJcbm1vZHVsZS5leHBvcnRzLmJvbnVzZXMgPSBib251c2VzOyIsInZhciBpbWFnZXNDYWNoZSA9IHt9O1xyXG52YXIgYXVkaW9zQ2FjaGUgPSB7fTtcclxudmFyIHJlYWR5Q2FsbGJhY2tzID0gW107XHJcbnZhciByZXNvdXJjZXNMb2FkZWQgPSAwO1xyXG5cclxuZnVuY3Rpb24gaXNSZWFkeSgpIHtcclxuICAgIHZhciByZWFkeSA9IHRydWU7XHJcbiAgICBmb3IgKHZhciBrIGluIGltYWdlc0NhY2hlKSB7XHJcbiAgICAgICAgaWYgKGltYWdlc0NhY2hlLmhhc093blByb3BlcnR5KGspICYmICFpbWFnZXNDYWNoZVtrXSkge1xyXG4gICAgICAgICAgICByZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAodmFyIGsgaW4gYXVkaW9zQ2FjaGUpIHtcclxuICAgICAgICBpZiAoYXVkaW9zQ2FjaGUuaGFzT3duUHJvcGVydHkoaykgJiYgIWF1ZGlvc0NhY2hlW2tdKSB7XHJcbiAgICAgICAgICAgIHJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlYWR5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBfbG9hZEltZyh1cmwpIHtcclxuICAgIGlmIChpbWFnZXNDYWNoZVt1cmxdKSB7XHJcbiAgICAgICAgcmV0dXJuIGltYWdlc0NhY2hlW3VybF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpbWFnZXNDYWNoZVt1cmxdID0gaW1nO1xyXG4gICAgICAgICAgICBpZiAoaXNSZWFkeSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZWFkeUNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGltZy5zcmMgPSB1cmw7XHJcbiAgICAgICAgaW1hZ2VzQ2FjaGVbdXJsXSA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBfbG9hZEF1ZGlvKHVybCkge1xyXG4gICAgaWYgKGF1ZGlvc0NhY2hlW3VybF0pIHtcclxuICAgICAgICByZXR1cm4gYXVkaW9zQ2FjaGVbdXJsXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGF1ZGlvID0gbmV3IEF1ZGlvKCk7XHJcbiAgICAgICAgYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcihcImNhbnBsYXlcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIWF1ZGlvc0NhY2hlW3VybF0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc1JlYWR5KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhdWRpb3NDYWNoZVt1cmxdID0gYXVkaW87XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhZHlDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoZnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvc0NhY2hlW3VybF0gPSBhdWRpbztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGF1ZGlvLnNyYyA9IHVybDtcclxuICAgICAgICBhdWRpby5wcmVsb2FkID0gXCJhdXRvXCI7XHJcbiAgICAgICAgYXVkaW8ubG9hZCgpO1xyXG4gICAgICAgIGF1ZGlvc0NhY2hlW3VybF0gPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogTG9hZCBpbWFnZSBhbmQgYWRkIHRoZW0gdG8gY2FjaGVcclxuICpAcGFyYW0geyhzdHJpbmd8c3RyaW5nW10pfSB1cmxPZkFyciBBcnJheSBvZiB1cmxzXHJcbiAqIEBzZWUgbG9hZFJlc291cmNlc1xyXG4gKi9cclxuZnVuY3Rpb24gbG9hZEltYWdlcyh1cmxPZkFycikge1xyXG4gICAgaWYgKHVybE9mQXJyIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICByZXNvdXJjZXNMb2FkZWQgKz0gdXJsT2ZBcnIubGVuZ3RoO1xyXG4gICAgICAgIHVybE9mQXJyLmZvckVhY2goZnVuY3Rpb24gKHVybCkge1xyXG4gICAgICAgICAgICBfbG9hZEltZyh1cmwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXNvdXJjZXNMb2FkZWQgKz0gMTtcclxuICAgICAgICBfbG9hZEltZyh1cmxPZkFycik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRBdWRpb3ModXJsT2ZBcnIpIHtcclxuICAgIGlmICh1cmxPZkFyciBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgcmVzb3VyY2VzTG9hZGVkICs9IHVybE9mQXJyLmxlbmd0aDtcclxuICAgICAgICB1cmxPZkFyci5mb3JFYWNoKGZ1bmN0aW9uICh1cmwpIHtcclxuICAgICAgICAgICAgX2xvYWRBdWRpbyh1cmwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXNvdXJjZXNMb2FkZWQgKz0gMTtcclxuICAgICAgICBfbG9hZEF1ZGlvKHVybE9mQXJyKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogR2V0IHJlc291cmNlIGZyb20gY2FjaGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxyXG4gKiBAcmV0dXJucyAgSW1hZ2VcclxuICogQHNlZSBnZXRSZXNvdXJjZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW1nKHVybCkge1xyXG4gICAgcmV0dXJuIGltYWdlc0NhY2hlW3VybF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEF1ZGlvKHVybCkge1xyXG4gICAgcmV0dXJuIGltYWdlc0NhY2hlW3VybF07XHJcbn1cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbiB0byBmdW5jdGlvbnMgd2hpY2ggd2lsbCBiZSBjYWxsZWQgdGhlbiBhbGwgcmVzb3VyY2VzIGxvYWRlZFxyXG4gKiBAcGFyYW0gZnVuY1xyXG4gKiBAc2VlIG9uUmVzb3VyY2VzUmVhZHlcclxuICovXHJcbmZ1bmN0aW9uIG9uUmVhZHkoZnVuYykge1xyXG4gICAgcmVhZHlDYWxsYmFja3MucHVzaChmdW5jKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBsb2FkSW1hZ2VzOiBsb2FkSW1hZ2VzLFxyXG4gICAgbG9hZEF1ZGlvczogbG9hZEF1ZGlvcyxcclxuICAgIGdldEltZzogZ2V0SW1nLFxyXG4gICAgZ2V0QXVkaW86IGdldEF1ZGlvLFxyXG4gICAgb25SZWFkeTogb25SZWFkeSxcclxuICAgIGlzUmVhZHk6IGlzUmVhZHlcclxufTtcclxuIiwidmFyIHJlc291cmNlcyA9IHJlcXVpcmUoXCIuL3Jlc291cmNlcy5qc1wiKTtcclxuXHJcbi8qKlxyXG4gKiBTcHJpdGUgb2YgdGV4dHVyZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsXHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IHBvcyBQb3NpdGlvbiBpbiBzcHJpdGUgc2hlZXRcclxuICogQHBhcmFtIHtudW1iZXJbXX0gc2l6ZSBTaXplIGluIHNwcml0ZSBzaGVldFxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgU3BlZWQgb2YgcGxheWluZyBhbmltYXRpb25cclxuICogQHBhcmFtIHtudW1iZXJbXX0gZnJhbWVzIEZyYW1lcyBvZiBhbmltYXRpb25cclxuICogQHBhcmFtIHtzdHJpbmd9IGRpciBEaXJlY3Rpb24gb24gc3ByaXRlIHNoZWV0XHJcbiAqIEBwYXJhbSB7Ym9vbH0gb25jZSBDb3VudCBvZiBwbGF5aW5nIGFuaW1hdGlvblxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHNlZSBjcmVhdGVTcHJpdGVcclxuICogQHNlZSBjcmVhdGVTcHJpdGVcclxuICovXHJcbmZ1bmN0aW9uIFNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKSB7XHJcbiAgICB0aGlzLnBvcyA9IHBvcztcclxuICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgIHRoaXMuc3BlZWQgPSB0eXBlb2Ygc3BlZWQgPT09IFwibnVtYmVyXCIgPyBzcGVlZCA6IDA7XHJcbiAgICB0aGlzLmZyYW1lcyA9IGZyYW1lcztcclxuICAgIHRoaXMuZGlyID0gZGlyIHx8IFwiaG9yaXpvbnRhbFwiO1xyXG4gICAgdGhpcy5vbmNlID0gb25jZTtcclxuICAgIHRoaXMuX2luZGV4ID0gMDtcclxufVxyXG5cclxuU3ByaXRlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgIHRoaXMuX2luZGV4ICs9IHRoaXMuc3BlZWQgKiBkdDtcclxufTtcclxuU3ByaXRlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoY3R4KSB7XHJcbiAgICB2YXIgZnJhbWU7XHJcbiAgICBpZiAodGhpcy5zcGVlZCA+IDApIHtcclxuICAgICAgICB2YXIgbWF4ID0gdGhpcy5mcmFtZXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciBpZHggPSBNYXRoLmZsb29yKHRoaXMuX2luZGV4KTtcclxuICAgICAgICBmcmFtZSA9IHRoaXMuZnJhbWVzW2lkeCAlIG1heF07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uY2UgJiYgaWR4ID49IG1heCkge1xyXG4gICAgICAgICAgICB0aGlzLmRvbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmcmFtZSA9IDA7XHJcbiAgICB9XHJcbiAgICB2YXIgeCA9IHRoaXMucG9zWzBdO1xyXG4gICAgdmFyIHkgPSB0aGlzLnBvc1sxXTtcclxuXHJcbiAgICBpZiAodGhpcy5kaXIgPT09IFwidmVydGljYWxcIikge1xyXG4gICAgICAgIHkgKz0gZnJhbWUgKiB0aGlzLnNpemVbMV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHggKz0gZnJhbWUgKiB0aGlzLnNpemVbMF07XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LmRyYXdJbWFnZShyZXNvdXJjZXMuZ2V0SW1nKHRoaXMudXJsKSwgeCwgeSwgdGhpcy5zaXplWzBdLCB0aGlzLnNpemVbMV0sIDAsIDAsIHRoaXMuc2l6ZVswXSwgdGhpcy5zaXplWzFdKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlOyIsInZhciBjb3JlID0gcmVxdWlyZShcIi4vY29yZS5qc1wiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZy5qc1wiKTtcclxuXHJcbnZhciBsYXN0VGltZSxcclxuICAgIGlzR2FtZU92ZXIsXHJcbiAgICBzY29yZSxcclxuICAgIHByZXNzZWQ7XHJcbnZhciB2aWV3cG9ydCA9IGNvcmUuZ2V0Vmlld3BvcnQoKTtcclxuXHJcbmZ1bmN0aW9uIGNvbGxpZGVzKHgsIHksIHIsIGIsIHgyLCB5MiwgcjIsIGIyKSB7XHJcbiAgICByZXR1cm4gKHIgPj0geDIgJiYgeCA8IHIyICYmIHkgPCBiMiAmJiBiID49IHkyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYm94Q29sbGlkZXMocG9zLCBzaXplLCBwb3MyLCBzaXplMikge1xyXG4gICAgcmV0dXJuIGNvbGxpZGVzKHBvc1swXSwgcG9zWzFdLCBwb3NbMF0gKyBzaXplWzBdLCBwb3NbMV0gKyBzaXplWzFdLFxyXG4gICAgICAgIHBvczJbMF0sIHBvczJbMV0sIHBvczJbMF0gKyBzaXplMlswXSwgcG9zMlsxXSArIHNpemUyWzFdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUdhbWVPdmVyKCk7XHJcbiAgICBpc0dhbWVPdmVyID0gZmFsc2U7XHJcbiAgICBzY29yZSA9IDA7XHJcbiAgICBjb3JlLmNyZWF0ZVBsYXllcihcclxuICAgICAgICBbdmlld3BvcnQud2lkdGggLyAyLCA1MF0sXHJcbiAgICAgICAgY29yZS5jcmVhdGVTcHJpdGUoXCJpbWcvcmVjdC5qcGdcIiwgWzAsIDBdLCBbMTAwLCAxMDBdLCAwLCBbMF0pXHJcbiAgICApO1xyXG4gICAgY29yZS5jcmVhdGVCYWNrZ3JvdW5kKFxyXG4gICAgICAgIFswLCAwXSxcclxuICAgICAgICBbY29yZS5jcmVhdGVTcHJpdGUoXCJpbWcvYmxhY2suanBnXCIsIFswLCAwXSwgW3ZpZXdwb3J0LndpZHRoICogMywgdmlld3BvcnQuaGVpZ2h0XSwgMCldXHJcbiAgICApO1xyXG4gICAgY29yZS5lbmVtaWVzID0gW107XHJcbiAgICBjb3JlLmJvbnVzZXMgPSBbXTtcclxufVxyXG5cclxudmFyIHNjb3JlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlXCIpO1xyXG5cclxuZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgY29yZS5yZW5kZXJHYW1lT3ZlcigpO1xyXG4gICAgc2NvcmVFbC5pbm5lckhUTUwgPSBzY29yZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQmFja2dyb3VuZChkdCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmJhY2tncm91bmQucG9zID0gW2NvcmUuYmFja2dyb3VuZC5wb3NbMF0gLSBjb25maWcuYmFja2dyb3VuZFNwZWVkICogZHQsIGNvcmUuYmFja2dyb3VuZC5wb3NbMV1dO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja0NvbGlzaW9ucyhwb3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIGNvbGxpc2lvbiA9IFtdLFxyXG4gICAgICAgIHNpemUgPSBjb3JlLnBsYXllci5zcHJpdGUuc2l6ZSxcclxuICAgICAgICBpLFxyXG4gICAgICAgIGVuZW1pZXMgPSBjb3JlLmVuZW1pZXMsXHJcbiAgICAgICAgYm9udXNlcyA9IGNvcmUuYm9udXNlcztcclxuXHJcbiAgICBpZiAocG9zWzFdIDwgMCkge1xyXG4gICAgICAgIGNvbGxpc2lvbi5wdXNoKHt0eXBlOiBcInRvcFwifSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwb3NbMV0gKyBzaXplWzFdID4gY29uZmlnLmZvcmVzdExpbmUpIHtcclxuICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJmb3Jlc3RcIn0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGJveENvbGxpZGVzKHBvcywgc2l6ZSwgZW5lbWllc1tpXS5wb3MsIGVuZW1pZXNbaV0uc3ByaXRlLnNpemUpKSB7XHJcbiAgICAgICAgICAgIGNvbGxpc2lvbi5wdXNoKHt0eXBlOiBcImVuZW15XCIsIHRhcmdldDogZW5lbWllc1tpXX0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgYm9udXNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChib3hDb2xsaWRlcyhwb3MsIHNpemUsIGJvbnVzZXNbaV0ucG9zLCBib251c2VzW2ldLnNwcml0ZS5zaXplKSkge1xyXG4gICAgICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJib251c1wiLCB0YXJnZXQ6IGJvbnVzZXNbaV19KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29sbGlzaW9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb2xsaWRlUGxheWVyKHBvcykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgY29sbGlzaW9uID0gY2hlY2tDb2xpc2lvbnMocG9zKSxcclxuICAgICAgICBpID0gMDtcclxuICAgIGlmIChjb2xsaXNpb24ubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGNvbGxpc2lvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN3aXRjaCAoY29sbGlzaW9uW2ldLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInRvcFwiOlxyXG4gICAgICAgICAgICAgICAgY29yZS5wbGF5ZXIuc3BlZWQueSA9IDA7XHJcbiAgICAgICAgICAgICAgICBjb3JlLnBsYXllci5wb3NbMV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmb3Jlc3RcIjpcclxuICAgICAgICAgICAgICAgIGdhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgY2FzZSBcImVuZW15XCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImJvbnVzXCI6XHJcbiAgICAgICAgICAgICAgICBjb3JlLnBsYXllci5wb3MgPSBwb3M7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVQbGF5ZXIoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5wbGF5ZXIuc3BlZWQueSArPSBjb25maWcuZ3Jhdml0eSAqIGR0O1xyXG4gICAgaWYgKHByZXNzZWRbJ3VwJ10pIHtcclxuICAgICAgICBjb3JlLnBsYXllci5zcGVlZC55IC09IGNvbmZpZy5icmVhdGhlU3BlZWQgKiBkdDtcclxuICAgIH1cclxuICAgIHZhciBtb3Rpb24gPSBjb3JlLnBsYXllci5zcGVlZC55ICogZHQ7XHJcbiAgICB2YXIgbmV3UG9zID0gW2NvcmUucGxheWVyLnBvc1swXSwgY29yZS5wbGF5ZXIucG9zWzFdICsgbW90aW9uXTtcclxuICAgIGlmIChjb2xsaWRlUGxheWVyKG5ld1BvcykpIHsgLy9tb3ZlIG9yIG5vdCB0byBtb3ZlXHJcbiAgICAgICAgY29yZS5wbGF5ZXIucG9zID0gbmV3UG9zO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVFbml0aWVzKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUucGxheWVyLnNwcml0ZS51cGRhdGUoZHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGUoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdXBkYXRlRW5pdGllcyhkdCk7XHJcbiAgICBpZiAoIWlzR2FtZU92ZXIpIHtcclxuICAgICAgICB1cGRhdGVCYWNrZ3JvdW5kKGR0KTtcclxuICAgICAgICB1cGRhdGVQbGF5ZXIoZHQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUucmVuZGVyKCk7XHJcbiAgICBjb3JlLnNldFNjb3JlKHNjb3JlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFpbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIG5vdyA9IERhdGUubm93KCk7XHJcbiAgICB2YXIgZHQgPSAobm93IC0gbGFzdFRpbWUpIC8gMTAwMDtcclxuXHJcbiAgICB1cGRhdGUoZHQpO1xyXG4gICAgcmVuZGVyKCk7XHJcblxyXG4gICAgbGFzdFRpbWUgPSBub3c7XHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHByZXNzZWQgPSBjb3JlLmdldElucHV0KHdpbmRvdywgXCJrZXlib2FyZFwiKTtcclxuICAgIC8qZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGF5LWFnYWluXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXNldCgpO1xyXG4gICAgfSk7Ki9cclxuICAgIHJlc2V0KCk7XHJcbiAgICBsYXN0VGltZSA9IERhdGUubm93KCk7XHJcbiAgICBtYWluKCk7XHJcbn1cclxuXHJcbmNvcmUubG9hZEltYWdlcyhbXHJcbiAgICBcImltZy9ibGFjay5qcGdcIixcclxuICAgIFwiaW1nL3JlY3QuanBnXCJcclxuXSk7XHJcblxyXG5jb3JlLm9uUmVzb3VyY2VzUmVhZHkoY29yZS5zaG93RWxlbWVudChcIm1haW5cIikpO1xyXG5cclxudmFyIHBsYXlFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheVwiKTtcclxudmFyIHJlc3RhcnRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzdGFydFwiKTtcclxuXHJcbnBsYXlFbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUVsZW1lbnQoXCJtZW51XCIpO1xyXG4gICAgaW5pdCgpO1xyXG59KTtcclxuXHJcbnJlc3RhcnRFbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUdhbWVPdmVyKCk7XHJcbiAgICByZXNldCgpO1xyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbn07Il19
