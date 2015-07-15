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

function setProgress(value) {
    "use strict";
    display.setProgress(value);
}

function chooseMenu(menuCase) {
    "use strict";
    display.chooseMenu(menuCase);
}

function unChooseMenu(menuCase) {
    "use strict";
    display.unChooseMenu(menuCase);
}

function onButtonClick(buttonName, handler) {
    "use strict";
    display.onButtonClick(buttonName, handler);
}

resources.on("loadingChange", setProgress);

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
    getViewport: getViewport,
    chooseMenu: chooseMenu,
    unChooseMenu: unChooseMenu,
    onButtonClick: onButtonClick
};


},{"./config.js":2,"./display.js":4,"./input.js":6,"./model.js":7,"./resources.js":9,"./sprite.js":10}],4:[function(require,module,exports){
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
    this.playButton = document.querySelector(".play");
    this.recordsButton = document.querySelector(".records");
    this.creditsButton = document.querySelector(".credits");
    this.quitButton = document.querySelector(".quit");
    this.restartButton = document.querySelector(".restart");
    this.backFromRecordsButton = document.querySelector("#records .back");
    this.backFromCreditsButton = document.querySelector("#credits .back");
    this.credits = document.querySelector("#credits");
    this.records = document.querySelector("#records");
    this.game_over = document.querySelector("#game-over");
    this.game_over_overlay = document.querySelector("#game-over-overlay");
    this.progress_bar = document.querySelector("#progress-bar");
    this.progress = document.querySelector("#progress");
    this.p = document.querySelector("#p");
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

CanvasDisplay.prototype.setProgress = function(value) {
    "use strict";
    this.progress_bar.value = value;
    this.p.innerHTML = value + "%";
};

CanvasDisplay.prototype.chooseMenu = function(menuCase) {
    this.menu.classList.add(menuCase);
};

CanvasDisplay.prototype.unChooseMenu = function(menuCase) {
    this.menu.classList.remove(menuCase);
};

CanvasDisplay.prototype.onButtonClick = function(buttonName, handler) {
    "use strict";
    buttonName += "Button";
    if (buttonName in this) {
        this[buttonName].addEventListener("click", handler);
    }
};

module.exports = {
    CanvasDisplay: CanvasDisplay
};
},{"./config.js":2,"./model.js":7}],5:[function(require,module,exports){
var world = require("./world.js")();
},{"./world.js":11}],6:[function(require,module,exports){
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
var publisher = {
    subscribers: {},
    on: function(type, fn) {
        "use strict";
        if (typeof this.subscribers[type] === "undefined") {
            this.subscribers[type] = [];
        }
        this.subscribers[type].push(fn);
    },
    remove: function(type, fn) {
        "use strict";
        this.visitSubscribers("unsubscribe", type, fn);
    },
    visitSubscribers: function(action, type, arg) {
        "use strict";
        var subscribers = this.subscribers[type],
            i,
            max = subscribers.length;
        for (i = 0; i < max; i += 1) {
            if (action === "publish") {
                subscribers[i](arg);
            } else {
                if (subscribers[i] === arg) {
                    subscribers.splice(i, 1);
                }
            }
        }
    },
    publish: function(type, publication) {
        "use strict";
        this.visitSubscribers("publish", type, publication);
    }
};

function makePublisher(o) {
    "use strict";
    var i;
    for (i in publisher) {
        if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
            o[i] = publisher[i];
        }
    }
    o.subscribers = {};
}

module.exports.makePublisher = makePublisher;
},{}],9:[function(require,module,exports){
var makePublisher = require("./publisher.js").makePublisher;

var imagesCache = {};
var audiosCache = {};
var readyCallbacks = [];
var resourcesCount = 0;
var resourcesLoaded = 1; // 1 for best view
readyCallbacks.done = false;

function changeLoading() {
    "use strict";
    module.exports.publish("loadingChange", progressInPercent());
}

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

function progressInPercent() {
    "use strict";
    return Math.round(resourcesLoaded / resourcesCount * 100);
}

function _loadImg(url) {
    if (imagesCache[url]) {
        return imagesCache[url];
    } else {
        var img = new Image();
        img.onload = function () {
            imagesCache[url] = img;
            resourcesLoaded += 1;
            changeLoading();
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
        audio.addEventListener("canplaythrough", function () {
            if (!audiosCache[url]) {
                resourcesLoaded += 1;
                changeLoading();
            }
            audiosCache[url] = audio;
            if (isReady()) {
                if (!readyCallbacks.done) {
                    readyCallbacks.done = true;
                    readyCallbacks.forEach(function (func) {
                        func();
                    });
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
        resourcesCount += urlOfArr.length;
        urlOfArr.forEach(function (url) {
            _loadImg(url);
        });
    } else {
        resourcesCount += 1;
        _loadImg(urlOfArr);
    }
}

function loadAudios(urlOfArr) {
    if (urlOfArr instanceof Array) {
        resourcesCount += urlOfArr.length;
        urlOfArr.forEach(function (url) {
            _loadAudio(url);
        });
    } else {
        resourcesCount += 1;
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
    isReady: isReady,
    progressInPercent: progressInPercent
};
makePublisher(module.exports);


},{"./publisher.js":8}],10:[function(require,module,exports){
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
},{"./resources.js":9}],11:[function(require,module,exports){
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
    var bgSound = core.getAudio("audio/Lordi.mp3");
    bgSound.currentTime = 0;
    bgSound.loop = true;
    bgSound.play();
}

core.loadImages([
    "img/black.jpg",
    "img/rect.jpg",
    "img/1.png"
]);

core.loadAudios([
    "audio/Lordi.mp3"
]);

function mainMenu() {
    "use strict";
    core.showElement("main");
    core.hideElement("progress");
    core.chooseMenu("main");

}

function recordsMenu() {
    "use strict";
    core.hideElement("main");
    core.showElement("records");
    core.chooseMenu("records");
}

function backFromRecords() {
    "use strict";
    core.hideElement("records");
    core.showElement("main");
    core.unChooseMenu("records");
}

function creditsMenu() {
    "use strict";
    core.hideElement("main");
    core.showElement("credits");
    core.chooseMenu("credits");
}

function backFromCredits() {
    "use strict";
    core.hideElement("credits");
    core.showElement("main");
    core.unChooseMenu("credits");
}

core.onResourcesReady(mainMenu);

core.onButtonClick("play", function() {
    "use strict";
    core.hideElement("menu");
    init();
});

core.onButtonClick("restart", function() {
    "use strict";
    core.hideGameOver();
    reset();
});

core.onButtonClick("credits", creditsMenu);
core.onButtonClick("backFromCredits", backFromCredits);
core.onButtonClick("records", recordsMenu);
core.onButtonClick("backFromRecords", backFromRecords);

module.exports = function() {
    "use strict";

};
},{"./config.js":2,"./core.js":3}]},{},[1,2,3,4,5,6,7,8,9,10,11])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXVkaW8uanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2NvcmUuanMiLCJzcmMvanMvZGlzcGxheS5qcyIsInNyYy9qcy9nYW1lLmpzIiwic3JjL2pzL2lucHV0LmpzIiwic3JjL2pzL21vZGVsLmpzIiwic3JjL2pzL3B1Ymxpc2hlci5qcyIsInNyYy9qcy9yZXNvdXJjZXMuanMiLCJzcmMvanMvc3ByaXRlLmpzIiwic3JjL2pzL3dvcmxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbW9kdWxlcyBhcmUgZGVmaW5lZCBhcyBhbiBhcnJheVxyXG4vLyBbIG1vZHVsZSBmdW5jdGlvbiwgbWFwIG9mIHJlcXVpcmV1aXJlcyBdXHJcbi8vXHJcbi8vIG1hcCBvZiByZXF1aXJldWlyZXMgaXMgc2hvcnQgcmVxdWlyZSBuYW1lIC0+IG51bWVyaWMgcmVxdWlyZVxyXG4vL1xyXG4vLyBhbnl0aGluZyBkZWZpbmVkIGluIGEgcHJldmlvdXMgYnVuZGxlIGlzIGFjY2Vzc2VkIHZpYSB0aGVcclxuLy8gb3JpZyBtZXRob2Qgd2hpY2ggaXMgdGhlIHJlcXVpcmV1aXJlIGZvciBwcmV2aW91cyBidW5kbGVzXHJcblxyXG4oZnVuY3Rpb24gb3V0ZXIgKG1vZHVsZXMsIGNhY2hlLCBlbnRyeSkge1xyXG4gICAgLy8gU2F2ZSB0aGUgcmVxdWlyZSBmcm9tIHByZXZpb3VzIGJ1bmRsZSB0byB0aGlzIGNsb3N1cmUgaWYgYW55XHJcbiAgICB2YXIgcHJldmlvdXNSZXF1aXJlID0gdHlwZW9mIHJlcXVpcmUgPT0gXCJmdW5jdGlvblwiICYmIHJlcXVpcmU7XHJcblxyXG4gICAgZnVuY3Rpb24gbmV3UmVxdWlyZShuYW1lLCBqdW1wZWQpe1xyXG4gICAgICAgIGlmKCFjYWNoZVtuYW1lXSkge1xyXG4gICAgICAgICAgICBpZighbW9kdWxlc1tuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgd2UgY2Fubm90IGZpbmQgdGhlIHRoZSBtb2R1bGUgd2l0aGluIG91ciBpbnRlcm5hbCBtYXAgb3JcclxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIGp1bXAgdG8gdGhlIGN1cnJlbnQgZ2xvYmFsIHJlcXVpcmUgaWUuIHRoZSBsYXN0IGJ1bmRsZVxyXG4gICAgICAgICAgICAgICAgLy8gdGhhdCB3YXMgYWRkZWQgdG8gdGhlIHBhZ2UuXHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFJlcXVpcmUgPSB0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZTtcclxuICAgICAgICAgICAgICAgIGlmICghanVtcGVkICYmIGN1cnJlbnRSZXF1aXJlKSByZXR1cm4gY3VycmVudFJlcXVpcmUobmFtZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG90aGVyIGJ1bmRsZXMgb24gdGhpcyBwYWdlIHRoZSByZXF1aXJlIGZyb20gdGhlXHJcbiAgICAgICAgICAgICAgICAvLyBwcmV2aW91cyBvbmUgaXMgc2F2ZWQgdG8gJ3ByZXZpb3VzUmVxdWlyZScuIFJlcGVhdCB0aGlzIGFzXHJcbiAgICAgICAgICAgICAgICAvLyBtYW55IHRpbWVzIGFzIHRoZXJlIGFyZSBidW5kbGVzIHVudGlsIHRoZSBtb2R1bGUgaXMgZm91bmQgb3JcclxuICAgICAgICAgICAgICAgIC8vIHdlIGV4aGF1c3QgdGhlIHJlcXVpcmUgY2hhaW4uXHJcbiAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNSZXF1aXJlKSByZXR1cm4gcHJldmlvdXNSZXF1aXJlKG5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZmluZCBtb2R1bGUgXFwnJyArIG5hbWUgKyAnXFwnJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG0gPSBjYWNoZVtuYW1lXSA9IHtleHBvcnRzOnt9fTtcclxuICAgICAgICAgICAgbW9kdWxlc1tuYW1lXVswXS5jYWxsKG0uZXhwb3J0cywgZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBtb2R1bGVzW25hbWVdWzFdW3hdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld1JlcXVpcmUoaWQgPyBpZCA6IHgpO1xyXG4gICAgICAgICAgICB9LG0sbS5leHBvcnRzLG91dGVyLG1vZHVsZXMsY2FjaGUsZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2FjaGVbbmFtZV0uZXhwb3J0cztcclxuICAgIH1cclxuICAgIGZvcih2YXIgaT0wO2k8ZW50cnkubGVuZ3RoO2krKykgbmV3UmVxdWlyZShlbnRyeVtpXSk7XHJcblxyXG4gICAgLy8gT3ZlcnJpZGUgdGhlIGN1cnJlbnQgcmVxdWlyZSB3aXRoIHRoaXMgbmV3IG9uZVxyXG4gICAgcmV0dXJuIG5ld1JlcXVpcmU7XHJcbn0pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgVVNFUiBvbiAxMC4wNy4yMDE1LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFVTRVIgb24gMTAuMDcuMjAxNS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgd2lkdGg6IDEwMjQsXHJcbiAgICBoZWlnaHQ6IDYwMCxcclxuICAgIGlucHV0VHlwZTogXCJrZXlib2FyZFwiLFxyXG4gICAgYmFja2dyb3VuZFNwZWVkOiAxNTAsXHJcbiAgICBncmF2aXR5OiAxNTAsXHJcbiAgICBicmVhdGhlU3BlZWQ6IDM1MCxcclxuICAgIGZvcmVzdExpbmU6IDQ1MCxcclxuICAgIGltYWdlU21vb3RoaW5nRW5hYmxlZDogdHJ1ZVxyXG59OyIsInZhciByZXNvdXJjZXMgPSByZXF1aXJlKFwiLi9yZXNvdXJjZXMuanNcIik7XHJcbnZhciBTcHJpdGUgPSByZXF1aXJlKFwiLi9zcHJpdGUuanNcIik7XHJcbnZhciBpbnB1dCA9IHJlcXVpcmUoXCIuL2lucHV0LmpzXCIpO1xyXG52YXIgbW9kZWwgPSByZXF1aXJlKFwiLi9tb2RlbC5qc1wiKTtcclxudmFyIGRpc3BsYXlfID0gIHJlcXVpcmUoXCIuL2Rpc3BsYXkuanNcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWcuanNcIik7XHJcblxyXG52YXIgZGlzcGxheSA9IG5ldyBkaXNwbGF5Xy5DYW52YXNEaXNwbGF5KCk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTcHJpdGUodXJsLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICByZXR1cm4gbmV3IFNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Vmlld3BvcnQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgd2lkdGg6IGNvbmZpZy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IGNvbmZpZy5oZWlnaHRcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW5kZXIoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJEaXNwbGF5KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LmNsZWFyRGlzcGxheSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJHYW1lT3ZlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW5kZXJHYW1lT3ZlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlR2FtZU92ZXIoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuaGlkZUdhbWVPdmVyKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFNjb3JlKHNjb3JlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuc2V0U2NvcmUoc2NvcmUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93RWxlbWVudChlbCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnNob3dFbGVtZW50KGVsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZUVsZW1lbnQoZWwpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5oaWRlRWxlbWVudChlbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFByb2dyZXNzKHZhbHVlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuc2V0UHJvZ3Jlc3ModmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaG9vc2VNZW51KG1lbnVDYXNlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuY2hvb3NlTWVudShtZW51Q2FzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuQ2hvb3NlTWVudShtZW51Q2FzZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnVuQ2hvb3NlTWVudShtZW51Q2FzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uQnV0dG9uQ2xpY2soYnV0dG9uTmFtZSwgaGFuZGxlcikge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5Lm9uQnV0dG9uQ2xpY2soYnV0dG9uTmFtZSwgaGFuZGxlcik7XHJcbn1cclxuXHJcbnJlc291cmNlcy5vbihcImxvYWRpbmdDaGFuZ2VcIiwgc2V0UHJvZ3Jlc3MpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBsb2FkSW1hZ2VzOiByZXNvdXJjZXMubG9hZEltYWdlcyxcclxuICAgIGxvYWRBdWRpb3M6IHJlc291cmNlcy5sb2FkQXVkaW9zLFxyXG4gICAgZ2V0SW1nOiByZXNvdXJjZXMuZ2V0SW1nLFxyXG4gICAgZ2V0QXVkaW86IHJlc291cmNlcy5nZXRBdWRpbyxcclxuICAgIG9uUmVzb3VyY2VzUmVhZHk6IHJlc291cmNlcy5vblJlYWR5LFxyXG4gICAgY3JlYXRlU3ByaXRlOiBjcmVhdGVTcHJpdGUsXHJcbiAgICBnZXRJbnB1dDogaW5wdXQsXHJcbiAgICBjcmVhdGVQbGF5ZXI6IG1vZGVsLmNyZWF0ZVBsYXllcixcclxuICAgIGNyZWF0ZUJhY2tncm91bmQ6IG1vZGVsLmNyZWF0ZUJhY2tncm91bmQsXHJcbiAgICBjcmVhdGVFbmVtaWU6IG1vZGVsLmNyZWF0ZUVuZW1pZSxcclxuICAgIGNyZWF0ZUJvbnVzOiBtb2RlbC5jcmVhdGVCb251cyxcclxuICAgIHBsYXllcjogbW9kZWwucGxheWVyLFxyXG4gICAgYmFja2dyb3VuZDogbW9kZWwuYmFja2dyb3VuZCxcclxuICAgIGVuZW1pZXM6IG1vZGVsLmVuZW1pZXMsXHJcbiAgICBib251c2VzOiBtb2RlbC5ib251c2VzLFxyXG4gICAgcmVuZGVyOiByZW5kZXIsXHJcbiAgICBjbGVhclJlbmRlcjogY2xlYXJEaXNwbGF5LFxyXG4gICAgcmVuZGVyR2FtZU92ZXI6IHJlbmRlckdhbWVPdmVyLFxyXG4gICAgaGlkZUdhbWVPdmVyOiBoaWRlR2FtZU92ZXIsXHJcbiAgICBzZXRTY29yZTogc2V0U2NvcmUsXHJcbiAgICBzaG93RWxlbWVudDogc2hvd0VsZW1lbnQsXHJcbiAgICBoaWRlRWxlbWVudDogaGlkZUVsZW1lbnQsXHJcbiAgICBnZXRWaWV3cG9ydDogZ2V0Vmlld3BvcnQsXHJcbiAgICBjaG9vc2VNZW51OiBjaG9vc2VNZW51LFxyXG4gICAgdW5DaG9vc2VNZW51OiB1bkNob29zZU1lbnUsXHJcbiAgICBvbkJ1dHRvbkNsaWNrOiBvbkJ1dHRvbkNsaWNrXHJcbn07XHJcblxyXG4iLCJ2YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnLmpzXCIpO1xyXG4vL3ZhciBjb3JlID0gcmVxdWlyZShcIi4vY29yZS5qc1wiKTsgLy9jaXJjdWxhciBsaW5rXHJcbnZhciBtb2RlbCA9IHJlcXVpcmUoXCIuL21vZGVsLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gZmxpcEhvcml6b250YWxseShjb250ZXh0LCBhcm91bmQpIHtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKGFyb3VuZCwgMCk7XHJcbiAgICBjb250ZXh0LnNjYWxlKC0xLCAxKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC1hcm91bmQsIDApO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHNlZSBkaXNwbGF5XHJcbiAqL1xyXG5mdW5jdGlvbiBDYW52YXNEaXNwbGF5KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2FudmFzXCIpO1xyXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSBjb25maWcud2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xyXG4gICAgdGhpcy5zY29yZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZVwiKTtcclxuICAgIHRoaXMuY3ggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgdGhpcy5tZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW51XCIpO1xyXG4gICAgdGhpcy5tYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluXCIpO1xyXG4gICAgdGhpcy5wbGF5QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5XCIpO1xyXG4gICAgdGhpcy5yZWNvcmRzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZWNvcmRzXCIpO1xyXG4gICAgdGhpcy5jcmVkaXRzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jcmVkaXRzXCIpO1xyXG4gICAgdGhpcy5xdWl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5xdWl0XCIpO1xyXG4gICAgdGhpcy5yZXN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXN0YXJ0XCIpO1xyXG4gICAgdGhpcy5iYWNrRnJvbVJlY29yZHNCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JlY29yZHMgLmJhY2tcIik7XHJcbiAgICB0aGlzLmJhY2tGcm9tQ3JlZGl0c0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY3JlZGl0cyAuYmFja1wiKTtcclxuICAgIHRoaXMuY3JlZGl0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY3JlZGl0c1wiKTtcclxuICAgIHRoaXMucmVjb3JkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVjb3Jkc1wiKTtcclxuICAgIHRoaXMuZ2FtZV9vdmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lLW92ZXJcIik7XHJcbiAgICB0aGlzLmdhbWVfb3Zlcl9vdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lLW92ZXItb3ZlcmxheVwiKTtcclxuICAgIHRoaXMucHJvZ3Jlc3NfYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9ncmVzcy1iYXJcIik7XHJcbiAgICB0aGlzLnByb2dyZXNzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9ncmVzc1wiKTtcclxuICAgIHRoaXMucCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcFwiKTtcclxufVxyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jYW52YXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5jbGVhckRpc3BsYXkgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jeC5maWxsU3R5bGUgPSBcInJnYig1MiwgMTY2LCAyNTEpXCI7XHJcbiAgICB0aGlzLmN4LmZpbGxSZWN0KDAsIDAsIGNvbmZpZy53aWR0aCwgY29uZmlnLmhlaWdodCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24oZW5lbXkpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jeC5zYXZlKCk7XHJcbiAgICB0aGlzLmN4LnRyYW5zbGF0ZShlbmVteS5wb3NbMF0sIGVuZW15LnBvc1sxXSk7XHJcbiAgICBlbmVteS5zcHJpdGUucmVuZGVyKHRoaXMuY3gpO1xyXG4gICAgdGhpcy5jeC5yZXN0b3JlKCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJCYWNrZ3JvdW5kID0gZnVuY3Rpb24oKSB7ICAvL1dURj8hXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY3guc2F2ZSgpO1xyXG4gICAgdGhpcy5jeC50cmFuc2xhdGUobW9kZWwuYmFja2dyb3VuZC5wb3NbMF0sIG1vZGVsLmJhY2tncm91bmQucG9zWzFdKTtcclxuICAgIG1vZGVsLmJhY2tncm91bmQuc3ByaXRlc1ttb2RlbC5iYWNrZ3JvdW5kLmN1cnJlbnRTcHJpdGVdLnJlbmRlcih0aGlzLmN4KTtcclxuICAgIHRoaXMuY3gucmVzdG9yZSgpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyRW5lbWllcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGVsLmVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLl9yZW5kZXIobW9kZWwuZW5lbWllc1tpXSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJQbGF5ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5fcmVuZGVyKG1vZGVsLnBsYXllcik7XHJcbn07XHJcbi8qKlxyXG4gKiBDbGVhciByZW5kZXIsIHJlbmRlciBiYWNrZ3JvdW5kLCByZW5kZXIgZW5lbWllcywgcmVuZGVyIHBsYXllclxyXG4gKi9cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY2xlYXJEaXNwbGF5KCk7XHJcbiAgICB0aGlzLnJlbmRlckJhY2tncm91bmQoKTtcclxuICAgIHRoaXMucmVuZGVyRW5lbWllcygpO1xyXG4gICAgdGhpcy5yZW5kZXJQbGF5ZXIoKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnNob3dFbGVtZW50ID0gZnVuY3Rpb24oZWwpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaWYgKGVsIGluIHRoaXMpXHJcbiAgICAgICAgdGhpc1tlbF0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbn07XHJcblxyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuaGlkZUVsZW1lbnQgPSBmdW5jdGlvbihlbCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpZiAoZWwgaW4gdGhpcylcclxuICAgICAgICB0aGlzW2VsXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyR2FtZU92ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuc2hvd0VsZW1lbnQoXCJnYW1lX292ZXJcIik7XHJcbiAgICB0aGlzLnNob3dFbGVtZW50KFwiZ2FtZV9vdmVyX292ZXJsYXlcIik7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5oaWRlR2FtZU92ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5oaWRlRWxlbWVudChcImdhbWVfb3ZlclwiKTtcclxuICAgIHRoaXMuaGlkZUVsZW1lbnQoXCJnYW1lX292ZXJfb3ZlcmxheVwiKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnNldFNjb3JlID0gZnVuY3Rpb24oc2NvcmUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5zY29yZUVsLmlubmVySFRNTCA9IHNjb3JlLnRvU3RyaW5nKCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5zZXRQcm9ncmVzcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMucHJvZ3Jlc3NfYmFyLnZhbHVlID0gdmFsdWU7XHJcbiAgICB0aGlzLnAuaW5uZXJIVE1MID0gdmFsdWUgKyBcIiVcIjtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmNob29zZU1lbnUgPSBmdW5jdGlvbihtZW51Q2FzZSkge1xyXG4gICAgdGhpcy5tZW51LmNsYXNzTGlzdC5hZGQobWVudUNhc2UpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUudW5DaG9vc2VNZW51ID0gZnVuY3Rpb24obWVudUNhc2UpIHtcclxuICAgIHRoaXMubWVudS5jbGFzc0xpc3QucmVtb3ZlKG1lbnVDYXNlKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLm9uQnV0dG9uQ2xpY2sgPSBmdW5jdGlvbihidXR0b25OYW1lLCBoYW5kbGVyKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGJ1dHRvbk5hbWUgKz0gXCJCdXR0b25cIjtcclxuICAgIGlmIChidXR0b25OYW1lIGluIHRoaXMpIHtcclxuICAgICAgICB0aGlzW2J1dHRvbk5hbWVdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgQ2FudmFzRGlzcGxheTogQ2FudmFzRGlzcGxheVxyXG59OyIsInZhciB3b3JsZCA9IHJlcXVpcmUoXCIuL3dvcmxkLmpzXCIpKCk7IiwiLyoqXHJcbiAqIEBwYXJhbSB3aW5kb3cgR2xvYmFsIG9iamVjdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBDYW4gYmU6a2V5Ym9hcmQsIG1lZGljaW5lLCBzbWFydHBob25lXHJcbiAqIEByZXR1cm5zIE9iamVjdCB3aGljaCBjb250ZW50IGluZm8gYWJvdXQgcHJlc3NlZCBidXR0b25zXHJcbiAqIEBzZWUgZ2V0SW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIGlucHV0KHdpbmRvd18sIHR5cGUpIHsgICAgLy90eXBlIC0ga2V5Ym9hcmQsIG1lZGljaW5lLCBzbWFydHBob25lXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBwcmVzc2VkID0gbnVsbDtcclxuICAgIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuICAgICAgICBpZiAoY29kZXMuaGFzT3duUHJvcGVydHkoZXZlbnQua2V5Q29kZSkpIHtcclxuICAgICAgICAgICAgdmFyIGRvd24gPSBldmVudC50eXBlID09PSBcImtleWRvd25cIjtcclxuICAgICAgICAgICAgcHJlc3NlZFtjb2Rlc1tldmVudC5rZXlDb2RlXV0gPSBkb3duO1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhckFsbCgpIHtcclxuICAgICAgICBmb3IgKHZhciBjIGluIHByZXNzZWQpIHtcclxuICAgICAgICAgICAgaWYgKHByZXNzZWQuaGFzT3duUHJvcGVydHkoYykpXHJcbiAgICAgICAgICAgICAgICBwcmVzc2VkW2NdID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJlc3NlZCkge1xyXG4gICAgICAgIHByZXNzZWQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICAgIHZhciBjb2Rlc0tleWJvYXJkID0gezM4OiBcInVwXCJ9O1xyXG4gICAgICAgIHZhciBjb2RlcztcclxuXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJrZXlib2FyZFwiOlxyXG4gICAgICAgICAgICAgICAgY29kZXMgPSBjb2Rlc0tleWJvYXJkO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Xy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvd18uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Xy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBjbGVhckFsbCgpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIHR5cGUgb2YgaW5wdXRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByZXNzZWQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdXQ7IiwidmFyIHBsYXllciA9IHt9LFxyXG4gICAgZW5lbWllcyA9IFtdLFxyXG4gICAgYmFja2dyb3VuZCA9IHt9LFxyXG4gICAgYm9udXNlcyA9IFtdO1xyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGwgb25jZVxyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVcclxuICogQHJldHVybnMgcGxheWVyXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVQbGF5ZXIgPSBmdW5jdGlvbiBjcmVhdGVQbGF5ZXIocG9zLCBzcHJpdGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcGxheWVyLnBvcyA9IHBvcyB8fCBbMCwgMF07XHJcbiAgICBpZiAocGxheWVyLnNwcml0ZSA9PSBudWxsKVxyXG4gICAgICAgIHBsYXllci5zcHJpdGUgPSBzcHJpdGU7XHJcbiAgICBwbGF5ZXIuc3BlZWQgPSB7eDogMSwgeTogMH07XHJcbiAgICByZXR1cm4gcGxheWVyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsIG9uY2VcclxuICogQHBhcmFtIHBvc1xyXG4gKiBAcGFyYW0gc3ByaXRlc1xyXG4gKiBAcmV0dXJucyBiYWNrZ3JvdW5kXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVCYWNrZ3JvdW5kID0gZnVuY3Rpb24gY3JlYXRlQmFja2dyb3VuZChwb3MsIHNwcml0ZXMpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYmFja2dyb3VuZC5wb3MgPSBwb3MgfHwgWzAsIDBdO1xyXG4gICAgaWYgKGJhY2tncm91bmQuc3ByaXRlcyA9PSBudWxsKVxyXG4gICAgICAgIGJhY2tncm91bmQuc3ByaXRlcyA9IHNwcml0ZXM7XHJcbiAgICBiYWNrZ3JvdW5kLmN1cnJlbnRTcHJpdGUgPSAwO1xyXG4gICAgYmFja2dyb3VuZC5zcHJpdGVzTGVuZ3RoID0gc3ByaXRlcy5sZW5ndGggfHwgMTtcclxuICAgIHJldHVybiBiYWNrZ3JvdW5kO1xyXG59O1xyXG4vKipcclxuICogQWRkIGVuZW1pZSB0byBlbmVtaWVzXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlRW5lbWllID0gZnVuY3Rpb24gY3JlYXRlRW5lbWllKHBvcywgc3ByaXRlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGVuZW1pZXMucHVzaCh7XHJcbiAgICAgICAgcG9zOiBwb3MsXHJcbiAgICAgICAgc3ByaXRlOiBzcHJpdGVcclxuICAgIH0pO1xyXG59O1xyXG4vKipcclxuICogQWRkIGJvbnVzIHRvIGJvbnVzZXNcclxuICogQHBhcmFtIHBvc1xyXG4gKiBAcGFyYW0gc3ByaXRlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIENhbiBiZTogc3BlZWQsIHNsb3csIHNtYWxsLCBiaWdcclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZUJvbnVzID0gZnVuY3Rpb24gY3JlYXRlQm9udXMocG9zLCBzcHJpdGUsIHR5cGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYm9udXNlcy5wdXNoKHtcclxuICAgICAgICBwb3M6IHBvcyxcclxuICAgICAgICBzcHJpdGU6IHNwcml0ZSxcclxuICAgICAgICB0eXBlOiB0eXBlXHJcbiAgICB9KTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMucGxheWVyID0gcGxheWVyO1xyXG5tb2R1bGUuZXhwb3J0cy5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZDtcclxubW9kdWxlLmV4cG9ydHMuZW5lbWllcyA9IGVuZW1pZXM7XHJcbm1vZHVsZS5leHBvcnRzLmJvbnVzZXMgPSBib251c2VzOyIsInZhciBwdWJsaXNoZXIgPSB7XHJcbiAgICBzdWJzY3JpYmVyczoge30sXHJcbiAgICBvbjogZnVuY3Rpb24odHlwZSwgZm4pIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLnB1c2goZm4pO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZTogZnVuY3Rpb24odHlwZSwgZm4pIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoXCJ1bnN1YnNjcmliZVwiLCB0eXBlLCBmbik7XHJcbiAgICB9LFxyXG4gICAgdmlzaXRTdWJzY3JpYmVyczogZnVuY3Rpb24oYWN0aW9uLCB0eXBlLCBhcmcpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB2YXIgc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLFxyXG4gICAgICAgICAgICBpLFxyXG4gICAgICAgICAgICBtYXggPSBzdWJzY3JpYmVycy5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG1heDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGlmIChhY3Rpb24gPT09IFwicHVibGlzaFwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1tpXShhcmcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzW2ldID09PSBhcmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGlzaDogZnVuY3Rpb24odHlwZSwgcHVibGljYXRpb24pIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoXCJwdWJsaXNoXCIsIHR5cGUsIHB1YmxpY2F0aW9uKTtcclxuICAgIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIG1ha2VQdWJsaXNoZXIobykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaSBpbiBwdWJsaXNoZXIpIHtcclxuICAgICAgICBpZiAocHVibGlzaGVyLmhhc093blByb3BlcnR5KGkpICYmIHR5cGVvZiBwdWJsaXNoZXJbaV0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICBvW2ldID0gcHVibGlzaGVyW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG8uc3Vic2NyaWJlcnMgPSB7fTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMubWFrZVB1Ymxpc2hlciA9IG1ha2VQdWJsaXNoZXI7IiwidmFyIG1ha2VQdWJsaXNoZXIgPSByZXF1aXJlKFwiLi9wdWJsaXNoZXIuanNcIikubWFrZVB1Ymxpc2hlcjtcclxuXHJcbnZhciBpbWFnZXNDYWNoZSA9IHt9O1xyXG52YXIgYXVkaW9zQ2FjaGUgPSB7fTtcclxudmFyIHJlYWR5Q2FsbGJhY2tzID0gW107XHJcbnZhciByZXNvdXJjZXNDb3VudCA9IDA7XHJcbnZhciByZXNvdXJjZXNMb2FkZWQgPSAxOyAvLyAxIGZvciBiZXN0IHZpZXdcclxucmVhZHlDYWxsYmFja3MuZG9uZSA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gY2hhbmdlTG9hZGluZygpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMucHVibGlzaChcImxvYWRpbmdDaGFuZ2VcIiwgcHJvZ3Jlc3NJblBlcmNlbnQoKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzUmVhZHkoKSB7XHJcbiAgICB2YXIgcmVhZHkgPSB0cnVlO1xyXG4gICAgZm9yICh2YXIgayBpbiBpbWFnZXNDYWNoZSkge1xyXG4gICAgICAgIGlmIChpbWFnZXNDYWNoZS5oYXNPd25Qcm9wZXJ0eShrKSAmJiAhaW1hZ2VzQ2FjaGVba10pIHtcclxuICAgICAgICAgICAgcmVhZHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBrIGluIGF1ZGlvc0NhY2hlKSB7XHJcbiAgICAgICAgaWYgKGF1ZGlvc0NhY2hlLmhhc093blByb3BlcnR5KGspICYmICFhdWRpb3NDYWNoZVtrXSkge1xyXG4gICAgICAgICAgICByZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZWFkeTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvZ3Jlc3NJblBlcmNlbnQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKHJlc291cmNlc0xvYWRlZCAvIHJlc291cmNlc0NvdW50ICogMTAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gX2xvYWRJbWcodXJsKSB7XHJcbiAgICBpZiAoaW1hZ2VzQ2FjaGVbdXJsXSkge1xyXG4gICAgICAgIHJldHVybiBpbWFnZXNDYWNoZVt1cmxdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW1hZ2VzQ2FjaGVbdXJsXSA9IGltZztcclxuICAgICAgICAgICAgcmVzb3VyY2VzTG9hZGVkICs9IDE7XHJcbiAgICAgICAgICAgIGNoYW5nZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGlzUmVhZHkoKSkge1xyXG4gICAgICAgICAgICAgICAgcmVhZHlDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoZnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbWcuc3JjID0gdXJsO1xyXG4gICAgICAgIGltYWdlc0NhY2hlW3VybF0gPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gX2xvYWRBdWRpbyh1cmwpIHtcclxuICAgIGlmIChhdWRpb3NDYWNoZVt1cmxdKSB7XHJcbiAgICAgICAgcmV0dXJuIGF1ZGlvc0NhY2hlW3VybF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBhdWRpbyA9IG5ldyBBdWRpbygpO1xyXG4gICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoXCJjYW5wbGF5dGhyb3VnaFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghYXVkaW9zQ2FjaGVbdXJsXSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzTG9hZGVkICs9IDE7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXVkaW9zQ2FjaGVbdXJsXSA9IGF1ZGlvO1xyXG4gICAgICAgICAgICBpZiAoaXNSZWFkeSgpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlYWR5Q2FsbGJhY2tzLmRvbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFkeUNhbGxiYWNrcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZWFkeUNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGF1ZGlvLnNyYyA9IHVybDtcclxuICAgICAgICBhdWRpby5wcmVsb2FkID0gXCJhdXRvXCI7XHJcbiAgICAgICAgYXVkaW8ubG9hZCgpO1xyXG4gICAgICAgIGF1ZGlvc0NhY2hlW3VybF0gPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogTG9hZCBpbWFnZSBhbmQgYWRkIHRoZW0gdG8gY2FjaGVcclxuICpAcGFyYW0geyhzdHJpbmd8c3RyaW5nW10pfSB1cmxPZkFyciBBcnJheSBvZiB1cmxzXHJcbiAqIEBzZWUgbG9hZFJlc291cmNlc1xyXG4gKi9cclxuZnVuY3Rpb24gbG9hZEltYWdlcyh1cmxPZkFycikge1xyXG4gICAgaWYgKHVybE9mQXJyIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICByZXNvdXJjZXNDb3VudCArPSB1cmxPZkFyci5sZW5ndGg7XHJcbiAgICAgICAgdXJsT2ZBcnIuZm9yRWFjaChmdW5jdGlvbiAodXJsKSB7XHJcbiAgICAgICAgICAgIF9sb2FkSW1nKHVybCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc291cmNlc0NvdW50ICs9IDE7XHJcbiAgICAgICAgX2xvYWRJbWcodXJsT2ZBcnIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkQXVkaW9zKHVybE9mQXJyKSB7XHJcbiAgICBpZiAodXJsT2ZBcnIgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgIHJlc291cmNlc0NvdW50ICs9IHVybE9mQXJyLmxlbmd0aDtcclxuICAgICAgICB1cmxPZkFyci5mb3JFYWNoKGZ1bmN0aW9uICh1cmwpIHtcclxuICAgICAgICAgICAgX2xvYWRBdWRpbyh1cmwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXNvdXJjZXNDb3VudCArPSAxO1xyXG4gICAgICAgIF9sb2FkQXVkaW8odXJsT2ZBcnIpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBHZXQgcmVzb3VyY2UgZnJvbSBjYWNoZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsXHJcbiAqIEByZXR1cm5zICBJbWFnZVxyXG4gKiBAc2VlIGdldFJlc291cmNlXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRJbWcodXJsKSB7XHJcbiAgICByZXR1cm4gaW1hZ2VzQ2FjaGVbdXJsXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXVkaW8odXJsKSB7XHJcbiAgICByZXR1cm4gaW1hZ2VzQ2FjaGVbdXJsXTtcclxufVxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uIHRvIGZ1bmN0aW9ucyB3aGljaCB3aWxsIGJlIGNhbGxlZCB0aGVuIGFsbCByZXNvdXJjZXMgbG9hZGVkXHJcbiAqIEBwYXJhbSBmdW5jXHJcbiAqIEBzZWUgb25SZXNvdXJjZXNSZWFkeVxyXG4gKi9cclxuZnVuY3Rpb24gb25SZWFkeShmdW5jKSB7XHJcbiAgICByZWFkeUNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGxvYWRJbWFnZXM6IGxvYWRJbWFnZXMsXHJcbiAgICBsb2FkQXVkaW9zOiBsb2FkQXVkaW9zLFxyXG4gICAgZ2V0SW1nOiBnZXRJbWcsXHJcbiAgICBnZXRBdWRpbzogZ2V0QXVkaW8sXHJcbiAgICBvblJlYWR5OiBvblJlYWR5LFxyXG4gICAgaXNSZWFkeTogaXNSZWFkeSxcclxuICAgIHByb2dyZXNzSW5QZXJjZW50OiBwcm9ncmVzc0luUGVyY2VudFxyXG59O1xyXG5tYWtlUHVibGlzaGVyKG1vZHVsZS5leHBvcnRzKTtcclxuXHJcbiIsInZhciByZXNvdXJjZXMgPSByZXF1aXJlKFwiLi9yZXNvdXJjZXMuanNcIik7XHJcblxyXG4vKipcclxuICogU3ByaXRlIG9mIHRleHR1cmVcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBwb3MgUG9zaXRpb24gaW4gc3ByaXRlIHNoZWV0XHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IHNpemUgU2l6ZSBpbiBzcHJpdGUgc2hlZXRcclxuICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIFNwZWVkIG9mIHBsYXlpbmcgYW5pbWF0aW9uXHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IGZyYW1lcyBGcmFtZXMgb2YgYW5pbWF0aW9uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXIgRGlyZWN0aW9uIG9uIHNwcml0ZSBzaGVldFxyXG4gKiBAcGFyYW0ge2Jvb2x9IG9uY2UgQ291bnQgb2YgcGxheWluZyBhbmltYXRpb25cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBzZWUgY3JlYXRlU3ByaXRlXHJcbiAqIEBzZWUgY3JlYXRlU3ByaXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBTcHJpdGUodXJsLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZSkge1xyXG4gICAgdGhpcy5wb3MgPSBwb3M7XHJcbiAgICB0aGlzLnVybCA9IHVybDtcclxuICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICB0aGlzLnNwZWVkID0gdHlwZW9mIHNwZWVkID09PSBcIm51bWJlclwiID8gc3BlZWQgOiAwO1xyXG4gICAgdGhpcy5mcmFtZXMgPSBmcmFtZXM7XHJcbiAgICB0aGlzLmRpciA9IGRpciB8fCBcImhvcml6b250YWxcIjtcclxuICAgIHRoaXMub25jZSA9IG9uY2U7XHJcbiAgICB0aGlzLl9pbmRleCA9IDA7XHJcbn1cclxuXHJcblNwcml0ZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICB0aGlzLl9pbmRleCArPSB0aGlzLnNwZWVkICogZHQ7XHJcbn07XHJcblNwcml0ZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGN0eCkge1xyXG4gICAgdmFyIGZyYW1lO1xyXG4gICAgaWYgKHRoaXMuc3BlZWQgPiAwKSB7XHJcbiAgICAgICAgdmFyIG1heCA9IHRoaXMuZnJhbWVzLmxlbmd0aDtcclxuICAgICAgICB2YXIgaWR4ID0gTWF0aC5mbG9vcih0aGlzLl9pbmRleCk7XHJcbiAgICAgICAgZnJhbWUgPSB0aGlzLmZyYW1lc1tpZHggJSBtYXhdO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vbmNlICYmIGlkeCA+PSBtYXgpIHtcclxuICAgICAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZnJhbWUgPSAwO1xyXG4gICAgfVxyXG4gICAgdmFyIHggPSB0aGlzLnBvc1swXTtcclxuICAgIHZhciB5ID0gdGhpcy5wb3NbMV07XHJcblxyXG4gICAgaWYgKHRoaXMuZGlyID09PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgICB5ICs9IGZyYW1lICogdGhpcy5zaXplWzFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB4ICs9IGZyYW1lICogdGhpcy5zaXplWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5kcmF3SW1hZ2UocmVzb3VyY2VzLmdldEltZyh0aGlzLnVybCksIHgsIHksIHRoaXMuc2l6ZVswXSwgdGhpcy5zaXplWzFdLCAwLCAwLCB0aGlzLnNpemVbMF0sIHRoaXMuc2l6ZVsxXSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTsiLCJ2YXIgY29yZSA9IHJlcXVpcmUoXCIuL2NvcmUuanNcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWcuanNcIik7XHJcblxyXG52YXIgbGFzdFRpbWUsXHJcbiAgICBpc0dhbWVPdmVyLFxyXG4gICAgc2NvcmUsXHJcbiAgICBwcmVzc2VkO1xyXG52YXIgdmlld3BvcnQgPSBjb3JlLmdldFZpZXdwb3J0KCk7XHJcblxyXG5mdW5jdGlvbiBjb2xsaWRlcyh4LCB5LCByLCBiLCB4MiwgeTIsIHIyLCBiMikge1xyXG4gICAgcmV0dXJuIChyID49IHgyICYmIHggPCByMiAmJiB5IDwgYjIgJiYgYiA+PSB5Mik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJveENvbGxpZGVzKHBvcywgc2l6ZSwgcG9zMiwgc2l6ZTIpIHtcclxuICAgIHJldHVybiBjb2xsaWRlcyhwb3NbMF0sIHBvc1sxXSwgcG9zWzBdICsgc2l6ZVswXSwgcG9zWzFdICsgc2l6ZVsxXSxcclxuICAgICAgICBwb3MyWzBdLCBwb3MyWzFdLCBwb3MyWzBdICsgc2l6ZTJbMF0sIHBvczJbMV0gKyBzaXplMlsxXSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2V0KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVHYW1lT3ZlcigpO1xyXG4gICAgaXNHYW1lT3ZlciA9IGZhbHNlO1xyXG4gICAgc2NvcmUgPSAwO1xyXG4gICAgY29yZS5jcmVhdGVQbGF5ZXIoXHJcbiAgICAgICAgW3ZpZXdwb3J0LndpZHRoIC8gMiwgNTBdLFxyXG4gICAgICAgIGNvcmUuY3JlYXRlU3ByaXRlKFwiaW1nL3JlY3QuanBnXCIsIFswLCAwXSwgWzEwMCwgMTAwXSwgMCwgWzBdKVxyXG4gICAgKTtcclxuICAgIGNvcmUuY3JlYXRlQmFja2dyb3VuZChcclxuICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgW2NvcmUuY3JlYXRlU3ByaXRlKFwiaW1nL2JsYWNrLmpwZ1wiLCBbMCwgMF0sIFt2aWV3cG9ydC53aWR0aCAqIDMsIHZpZXdwb3J0LmhlaWdodF0sIDApXVxyXG4gICAgKTtcclxuICAgIGNvcmUuZW5lbWllcyA9IFtdO1xyXG4gICAgY29yZS5ib251c2VzID0gW107XHJcbn1cclxuXHJcbnZhciBzY29yZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZVwiKTtcclxuXHJcbmZ1bmN0aW9uIGdhbWVPdmVyKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpc0dhbWVPdmVyID0gdHJ1ZTtcclxuICAgIGNvcmUucmVuZGVyR2FtZU92ZXIoKTtcclxuICAgIHNjb3JlRWwuaW5uZXJIVE1MID0gc2NvcmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUJhY2tncm91bmQoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5iYWNrZ3JvdW5kLnBvcyA9IFtjb3JlLmJhY2tncm91bmQucG9zWzBdIC0gY29uZmlnLmJhY2tncm91bmRTcGVlZCAqIGR0LCBjb3JlLmJhY2tncm91bmQucG9zWzFdXTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tDb2xpc2lvbnMocG9zKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBjb2xsaXNpb24gPSBbXSxcclxuICAgICAgICBzaXplID0gY29yZS5wbGF5ZXIuc3ByaXRlLnNpemUsXHJcbiAgICAgICAgaSxcclxuICAgICAgICBlbmVtaWVzID0gY29yZS5lbmVtaWVzLFxyXG4gICAgICAgIGJvbnVzZXMgPSBjb3JlLmJvbnVzZXM7XHJcblxyXG4gICAgaWYgKHBvc1sxXSA8IDApIHtcclxuICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJ0b3BcIn0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocG9zWzFdICsgc2l6ZVsxXSA+IGNvbmZpZy5mb3Jlc3RMaW5lKSB7XHJcbiAgICAgICAgY29sbGlzaW9uLnB1c2goe3R5cGU6IFwiZm9yZXN0XCJ9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChib3hDb2xsaWRlcyhwb3MsIHNpemUsIGVuZW1pZXNbaV0ucG9zLCBlbmVtaWVzW2ldLnNwcml0ZS5zaXplKSkge1xyXG4gICAgICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJlbmVteVwiLCB0YXJnZXQ6IGVuZW1pZXNbaV19KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGJvbnVzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoYm94Q29sbGlkZXMocG9zLCBzaXplLCBib251c2VzW2ldLnBvcywgYm9udXNlc1tpXS5zcHJpdGUuc2l6ZSkpIHtcclxuICAgICAgICAgICAgY29sbGlzaW9uLnB1c2goe3R5cGU6IFwiYm9udXNcIiwgdGFyZ2V0OiBib251c2VzW2ldfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbGxpc2lvbjtcclxufVxyXG5cclxuZnVuY3Rpb24gY29sbGlkZVBsYXllcihwb3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIGNvbGxpc2lvbiA9IGNoZWNrQ29saXNpb25zKHBvcyksXHJcbiAgICAgICAgaSA9IDA7XHJcbiAgICBpZiAoY29sbGlzaW9uLmxlbmd0aCA9PT0gMClcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBjb2xsaXNpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzd2l0Y2ggKGNvbGxpc2lvbltpXS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcclxuICAgICAgICAgICAgICAgIGNvcmUucGxheWVyLnNwZWVkLnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgY29yZS5wbGF5ZXIucG9zWzFdID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiZm9yZXN0XCI6XHJcbiAgICAgICAgICAgICAgICBnYW1lT3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlbmVteVwiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJib251c1wiOlxyXG4gICAgICAgICAgICAgICAgY29yZS5wbGF5ZXIucG9zID0gcG9zO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUGxheWVyKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUucGxheWVyLnNwZWVkLnkgKz0gY29uZmlnLmdyYXZpdHkgKiBkdDtcclxuICAgIGlmIChwcmVzc2VkWyd1cCddKSB7XHJcbiAgICAgICAgY29yZS5wbGF5ZXIuc3BlZWQueSAtPSBjb25maWcuYnJlYXRoZVNwZWVkICogZHQ7XHJcbiAgICB9XHJcbiAgICB2YXIgbW90aW9uID0gY29yZS5wbGF5ZXIuc3BlZWQueSAqIGR0O1xyXG4gICAgdmFyIG5ld1BvcyA9IFtjb3JlLnBsYXllci5wb3NbMF0sIGNvcmUucGxheWVyLnBvc1sxXSArIG1vdGlvbl07XHJcbiAgICBpZiAoY29sbGlkZVBsYXllcihuZXdQb3MpKSB7IC8vbW92ZSBvciBub3QgdG8gbW92ZVxyXG4gICAgICAgIGNvcmUucGxheWVyLnBvcyA9IG5ld1BvcztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlRW5pdGllcyhkdCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLnBsYXllci5zcHJpdGUudXBkYXRlKGR0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHVwZGF0ZUVuaXRpZXMoZHQpO1xyXG4gICAgaWYgKCFpc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgdXBkYXRlQmFja2dyb3VuZChkdCk7XHJcbiAgICAgICAgdXBkYXRlUGxheWVyKGR0KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLnJlbmRlcigpO1xyXG4gICAgY29yZS5zZXRTY29yZShzY29yZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgdmFyIGR0ID0gKG5vdyAtIGxhc3RUaW1lKSAvIDEwMDA7XHJcblxyXG4gICAgdXBkYXRlKGR0KTtcclxuICAgIHJlbmRlcigpO1xyXG5cclxuICAgIGxhc3RUaW1lID0gbm93O1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW4pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBwcmVzc2VkID0gY29yZS5nZXRJbnB1dCh3aW5kb3csIFwia2V5Ym9hcmRcIik7XHJcbiAgICAvKmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheS1hZ2FpblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVzZXQoKTtcclxuICAgIH0pOyovXHJcbiAgICByZXNldCgpO1xyXG4gICAgbGFzdFRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgbWFpbigpO1xyXG4gICAgdmFyIGJnU291bmQgPSBjb3JlLmdldEF1ZGlvKFwiYXVkaW8vTG9yZGkubXAzXCIpO1xyXG4gICAgYmdTb3VuZC5jdXJyZW50VGltZSA9IDA7XHJcbiAgICBiZ1NvdW5kLmxvb3AgPSB0cnVlO1xyXG4gICAgYmdTb3VuZC5wbGF5KCk7XHJcbn1cclxuXHJcbmNvcmUubG9hZEltYWdlcyhbXHJcbiAgICBcImltZy9ibGFjay5qcGdcIixcclxuICAgIFwiaW1nL3JlY3QuanBnXCIsXHJcbiAgICBcImltZy8xLnBuZ1wiXHJcbl0pO1xyXG5cclxuY29yZS5sb2FkQXVkaW9zKFtcclxuICAgIFwiYXVkaW8vTG9yZGkubXAzXCJcclxuXSk7XHJcblxyXG5mdW5jdGlvbiBtYWluTWVudSgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5zaG93RWxlbWVudChcIm1haW5cIik7XHJcbiAgICBjb3JlLmhpZGVFbGVtZW50KFwicHJvZ3Jlc3NcIik7XHJcbiAgICBjb3JlLmNob29zZU1lbnUoXCJtYWluXCIpO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gcmVjb3Jkc01lbnUoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUVsZW1lbnQoXCJtYWluXCIpO1xyXG4gICAgY29yZS5zaG93RWxlbWVudChcInJlY29yZHNcIik7XHJcbiAgICBjb3JlLmNob29zZU1lbnUoXCJyZWNvcmRzXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBiYWNrRnJvbVJlY29yZHMoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUVsZW1lbnQoXCJyZWNvcmRzXCIpO1xyXG4gICAgY29yZS5zaG93RWxlbWVudChcIm1haW5cIik7XHJcbiAgICBjb3JlLnVuQ2hvb3NlTWVudShcInJlY29yZHNcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWRpdHNNZW51KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVFbGVtZW50KFwibWFpblwiKTtcclxuICAgIGNvcmUuc2hvd0VsZW1lbnQoXCJjcmVkaXRzXCIpO1xyXG4gICAgY29yZS5jaG9vc2VNZW51KFwiY3JlZGl0c1wiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYmFja0Zyb21DcmVkaXRzKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVFbGVtZW50KFwiY3JlZGl0c1wiKTtcclxuICAgIGNvcmUuc2hvd0VsZW1lbnQoXCJtYWluXCIpO1xyXG4gICAgY29yZS51bkNob29zZU1lbnUoXCJjcmVkaXRzXCIpO1xyXG59XHJcblxyXG5jb3JlLm9uUmVzb3VyY2VzUmVhZHkobWFpbk1lbnUpO1xyXG5cclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwicGxheVwiLCBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5oaWRlRWxlbWVudChcIm1lbnVcIik7XHJcbiAgICBpbml0KCk7XHJcbn0pO1xyXG5cclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwicmVzdGFydFwiLCBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5oaWRlR2FtZU92ZXIoKTtcclxuICAgIHJlc2V0KCk7XHJcbn0pO1xyXG5cclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwiY3JlZGl0c1wiLCBjcmVkaXRzTWVudSk7XHJcbmNvcmUub25CdXR0b25DbGljayhcImJhY2tGcm9tQ3JlZGl0c1wiLCBiYWNrRnJvbUNyZWRpdHMpO1xyXG5jb3JlLm9uQnV0dG9uQ2xpY2soXCJyZWNvcmRzXCIsIHJlY29yZHNNZW51KTtcclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwiYmFja0Zyb21SZWNvcmRzXCIsIGJhY2tGcm9tUmVjb3Jkcyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG59OyJdfQ==
