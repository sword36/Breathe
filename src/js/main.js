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

function onButtonClick(buttonName, handler, notButton) {
    "use strict";
    display.onButtonClick(buttonName, handler, notButton);
}

function addClass(el, value) {
    "use strict";
    display.addClass(el, value);
}

function removeClass(el, value) {
    "use strict";
    display.removeClass(el, value);
}

function hasClass(el, value) {
    "use strict";
    return display.hasClass(el, value);
}

function setSoundMuted(value) {
    "use strict";
    var i;
    for (i in resources.audios) {
        if (resources.audios.hasOwnProperty(i)) {
            resources.audios[i].muted = value;
        }
    }
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
    onButtonClick: onButtonClick,
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    setSoundMuted: setSoundMuted
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
    this.menuButton = document.querySelector(".menu");
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
    this.sound = document.querySelector(".sound");
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

CanvasDisplay.prototype.onButtonClick = function(buttonName, handler, notButton) {
    "use strict";
    if (!notButton)
        buttonName += "Button";
    if (buttonName in this) {
        this[buttonName].addEventListener("click", handler);
    }
};

CanvasDisplay.prototype.addClass = function(el, value) {
    "use strict";
    if (el in this) {
        this[el].classList.add(value);
    }
};

CanvasDisplay.prototype.removeClass = function(el, value) {
    "use strict";
    if (el in this) {
        this[el].classList.remove(value);
    }
};

CanvasDisplay.prototype.hasClass = function(el, value) {
    "use strict";
    if (el in this) {
        return this[el].classList.contains(value);
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
var confing = require("./config.js");

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
module.exports.createBackground = function createBackground(sprites) { //2 min
    "use strict";
    background.positions = [];
    if (background.sprites == null) {
        background.sprites = sprites;
    }
    background.currentSprite = 0;
    background.spritesLength = sprites.length;
    for (var i = 0; i < sprites.length; i++) {
        if (i === 0) {
            background.positions[0] = 0;
        } else {
            background.positions[i] = confing.width;
        }
    }
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
},{"./config.js":2}],8:[function(require,module,exports){
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

function progressInPercent() {
    "use strict";
    return Math.round(resourcesLoaded / resourcesCount * 100);
}

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
        //audio.load();
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
    return audiosCache[url];
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
    progressInPercent: progressInPercent,
    audios: audiosCache,
    images: imagesCache
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
    pressed,
    playSound,
    bgSound;
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

    var bgSprite1 = core.createSprite("img/black.jpg", [0, 0], [viewport.width * 3, viewport.height], 0);
    //var bgSprite2 = core.createSprite("img/black.jpg", [0, 0], [viewport.width * 3, viewport.height], 0);

    core.createBackground(
        [bgSprite1, bgSprite1]
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

var bg = core.background;
var firstCycleBg = true;
function updateBackground(dt) {
    "use strict";
    var cur = bg.currentSprite,
            next = (cur + 1) % bg.spritesLength;
    var newBgPos = bg.positions[cur] - config.backgroundSpeed * dt,
        newRightCorner = newBgPos + bg.sprites[cur].size[0];

    if (!firstCycleBg && (newRightCorner < config.width)) {
        firstCycleBg = false;
        if (newRightCorner > 0) {
            bg.positions[cur] = newBgPos;
            bg.positions[next] = bg.positions[next] - config.backgroundSpeed * dt;
        } else {
            bg.positions[cur] = config.width;
            cur = next;
            bg.positions[cur] = bg.positions[cur] - config.backgroundSpeed * dt;
            next = (cur + 1) % bg.spritesLength;
            bg.positions[next] = bg.positions[next] - config.backgroundSpeed * dt;
        }
    } else {
        bg.positions[cur] = newBgPos;
    }
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

core.loadAudios([
    "audio/Lordi.mp3"
]);

function bgSoundStart() {
    "use strict";
    bgSound.currentTime = 0;
    bgSound.play();
    if ("loop" in bgSound) {
        bgSound.loop = true;
    } else {
        bgSound.addEventListener("ended", function () {
            bgSound.currentTime = 0;
            bgSound.play();
        });
    }
}
function mainMenu() {
    "use strict";
    core.showElement("main");
    core.hideElement("progress");
    core.chooseMenu("main");
    core.showElement("sound");
    bgSoundStart();
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

function backToMenu() {
    "use strict";
    core.hideGameOver();
    core.showElement("menu");
}
function initSounds() {
    "use strict";
    bgSound = core.getAudio("audio/Lordi.mp3");
    playSound = localStorage.getItem("playSound") === "true";
    if (playSound) {
        core.addClass("sound", "sound-on");
        core.removeClass("sound", "sound-off");
    } else {
        core.addClass("sound", "sound-off");
        core.removeClass("sound", "sound-on");
    }
    core.setSoundMuted(!playSound);
}
core.onResourcesReady(initSounds);
core.onResourcesReady(mainMenu); //order is important

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

core.onButtonClick("sound", function() {
    "use strict";
    if (core.hasClass("sound", "sound-on")) {
        core.removeClass("sound", "sound-on");
        core.addClass("sound", "sound-off");
        playSound = false;
    } else {
        core.removeClass("sound", "sound-off");
        core.addClass("sound", "sound-on");
        playSound = true;
    }
    localStorage.setItem("playSound", playSound);
    core.setSoundMuted(!playSound);
}, true);

core.onButtonClick("credits", creditsMenu);
core.onButtonClick("backFromCredits", backFromCredits);
core.onButtonClick("records", recordsMenu);
core.onButtonClick("backFromRecords", backFromRecords);
core.onButtonClick("menu", backToMenu);

module.exports = function() {
    "use strict";

};
},{"./config.js":2,"./core.js":3}]},{},[1,2,3,4,5,6,7,8,9,10,11])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXVkaW8uanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2NvcmUuanMiLCJzcmMvanMvZGlzcGxheS5qcyIsInNyYy9qcy9nYW1lLmpzIiwic3JjL2pzL2lucHV0LmpzIiwic3JjL2pzL21vZGVsLmpzIiwic3JjL2pzL3B1Ymxpc2hlci5qcyIsInNyYy9qcy9yZXNvdXJjZXMuanMiLCJzcmMvanMvc3ByaXRlLmpzIiwic3JjL2pzL3dvcmxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbW9kdWxlcyBhcmUgZGVmaW5lZCBhcyBhbiBhcnJheVxyXG4vLyBbIG1vZHVsZSBmdW5jdGlvbiwgbWFwIG9mIHJlcXVpcmV1aXJlcyBdXHJcbi8vXHJcbi8vIG1hcCBvZiByZXF1aXJldWlyZXMgaXMgc2hvcnQgcmVxdWlyZSBuYW1lIC0+IG51bWVyaWMgcmVxdWlyZVxyXG4vL1xyXG4vLyBhbnl0aGluZyBkZWZpbmVkIGluIGEgcHJldmlvdXMgYnVuZGxlIGlzIGFjY2Vzc2VkIHZpYSB0aGVcclxuLy8gb3JpZyBtZXRob2Qgd2hpY2ggaXMgdGhlIHJlcXVpcmV1aXJlIGZvciBwcmV2aW91cyBidW5kbGVzXHJcblxyXG4oZnVuY3Rpb24gb3V0ZXIgKG1vZHVsZXMsIGNhY2hlLCBlbnRyeSkge1xyXG4gICAgLy8gU2F2ZSB0aGUgcmVxdWlyZSBmcm9tIHByZXZpb3VzIGJ1bmRsZSB0byB0aGlzIGNsb3N1cmUgaWYgYW55XHJcbiAgICB2YXIgcHJldmlvdXNSZXF1aXJlID0gdHlwZW9mIHJlcXVpcmUgPT0gXCJmdW5jdGlvblwiICYmIHJlcXVpcmU7XHJcblxyXG4gICAgZnVuY3Rpb24gbmV3UmVxdWlyZShuYW1lLCBqdW1wZWQpe1xyXG4gICAgICAgIGlmKCFjYWNoZVtuYW1lXSkge1xyXG4gICAgICAgICAgICBpZighbW9kdWxlc1tuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgd2UgY2Fubm90IGZpbmQgdGhlIHRoZSBtb2R1bGUgd2l0aGluIG91ciBpbnRlcm5hbCBtYXAgb3JcclxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIGp1bXAgdG8gdGhlIGN1cnJlbnQgZ2xvYmFsIHJlcXVpcmUgaWUuIHRoZSBsYXN0IGJ1bmRsZVxyXG4gICAgICAgICAgICAgICAgLy8gdGhhdCB3YXMgYWRkZWQgdG8gdGhlIHBhZ2UuXHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFJlcXVpcmUgPSB0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZTtcclxuICAgICAgICAgICAgICAgIGlmICghanVtcGVkICYmIGN1cnJlbnRSZXF1aXJlKSByZXR1cm4gY3VycmVudFJlcXVpcmUobmFtZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG90aGVyIGJ1bmRsZXMgb24gdGhpcyBwYWdlIHRoZSByZXF1aXJlIGZyb20gdGhlXHJcbiAgICAgICAgICAgICAgICAvLyBwcmV2aW91cyBvbmUgaXMgc2F2ZWQgdG8gJ3ByZXZpb3VzUmVxdWlyZScuIFJlcGVhdCB0aGlzIGFzXHJcbiAgICAgICAgICAgICAgICAvLyBtYW55IHRpbWVzIGFzIHRoZXJlIGFyZSBidW5kbGVzIHVudGlsIHRoZSBtb2R1bGUgaXMgZm91bmQgb3JcclxuICAgICAgICAgICAgICAgIC8vIHdlIGV4aGF1c3QgdGhlIHJlcXVpcmUgY2hhaW4uXHJcbiAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNSZXF1aXJlKSByZXR1cm4gcHJldmlvdXNSZXF1aXJlKG5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZmluZCBtb2R1bGUgXFwnJyArIG5hbWUgKyAnXFwnJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG0gPSBjYWNoZVtuYW1lXSA9IHtleHBvcnRzOnt9fTtcclxuICAgICAgICAgICAgbW9kdWxlc1tuYW1lXVswXS5jYWxsKG0uZXhwb3J0cywgZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBtb2R1bGVzW25hbWVdWzFdW3hdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld1JlcXVpcmUoaWQgPyBpZCA6IHgpO1xyXG4gICAgICAgICAgICB9LG0sbS5leHBvcnRzLG91dGVyLG1vZHVsZXMsY2FjaGUsZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2FjaGVbbmFtZV0uZXhwb3J0cztcclxuICAgIH1cclxuICAgIGZvcih2YXIgaT0wO2k8ZW50cnkubGVuZ3RoO2krKykgbmV3UmVxdWlyZShlbnRyeVtpXSk7XHJcblxyXG4gICAgLy8gT3ZlcnJpZGUgdGhlIGN1cnJlbnQgcmVxdWlyZSB3aXRoIHRoaXMgbmV3IG9uZVxyXG4gICAgcmV0dXJuIG5ld1JlcXVpcmU7XHJcbn0pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgVVNFUiBvbiAxMC4wNy4yMDE1LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFVTRVIgb24gMTAuMDcuMjAxNS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgd2lkdGg6IDEwMjQsXHJcbiAgICBoZWlnaHQ6IDYwMCxcclxuICAgIGlucHV0VHlwZTogXCJrZXlib2FyZFwiLFxyXG4gICAgYmFja2dyb3VuZFNwZWVkOiAxNTAsXHJcbiAgICBncmF2aXR5OiAxNTAsXHJcbiAgICBicmVhdGhlU3BlZWQ6IDM1MCxcclxuICAgIGZvcmVzdExpbmU6IDQ1MCxcclxuICAgIGltYWdlU21vb3RoaW5nRW5hYmxlZDogdHJ1ZVxyXG59OyIsInZhciByZXNvdXJjZXMgPSByZXF1aXJlKFwiLi9yZXNvdXJjZXMuanNcIik7XHJcbnZhciBTcHJpdGUgPSByZXF1aXJlKFwiLi9zcHJpdGUuanNcIik7XHJcbnZhciBpbnB1dCA9IHJlcXVpcmUoXCIuL2lucHV0LmpzXCIpO1xyXG52YXIgbW9kZWwgPSByZXF1aXJlKFwiLi9tb2RlbC5qc1wiKTtcclxudmFyIGRpc3BsYXlfID0gIHJlcXVpcmUoXCIuL2Rpc3BsYXkuanNcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWcuanNcIik7XHJcblxyXG52YXIgZGlzcGxheSA9IG5ldyBkaXNwbGF5Xy5DYW52YXNEaXNwbGF5KCk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTcHJpdGUodXJsLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICByZXR1cm4gbmV3IFNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Vmlld3BvcnQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgd2lkdGg6IGNvbmZpZy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IGNvbmZpZy5oZWlnaHRcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW5kZXIoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJEaXNwbGF5KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LmNsZWFyRGlzcGxheSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJHYW1lT3ZlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW5kZXJHYW1lT3ZlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlR2FtZU92ZXIoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuaGlkZUdhbWVPdmVyKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFNjb3JlKHNjb3JlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuc2V0U2NvcmUoc2NvcmUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93RWxlbWVudChlbCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnNob3dFbGVtZW50KGVsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZUVsZW1lbnQoZWwpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5oaWRlRWxlbWVudChlbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFByb2dyZXNzKHZhbHVlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuc2V0UHJvZ3Jlc3ModmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaG9vc2VNZW51KG1lbnVDYXNlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuY2hvb3NlTWVudShtZW51Q2FzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuQ2hvb3NlTWVudShtZW51Q2FzZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnVuQ2hvb3NlTWVudShtZW51Q2FzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uQnV0dG9uQ2xpY2soYnV0dG9uTmFtZSwgaGFuZGxlciwgbm90QnV0dG9uKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkub25CdXR0b25DbGljayhidXR0b25OYW1lLCBoYW5kbGVyLCBub3RCdXR0b24pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRDbGFzcyhlbCwgdmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5hZGRDbGFzcyhlbCwgdmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbCwgdmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW1vdmVDbGFzcyhlbCwgdmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYXNDbGFzcyhlbCwgdmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIGRpc3BsYXkuaGFzQ2xhc3MoZWwsIHZhbHVlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U291bmRNdXRlZCh2YWx1ZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaSBpbiByZXNvdXJjZXMuYXVkaW9zKSB7XHJcbiAgICAgICAgaWYgKHJlc291cmNlcy5hdWRpb3MuaGFzT3duUHJvcGVydHkoaSkpIHtcclxuICAgICAgICAgICAgcmVzb3VyY2VzLmF1ZGlvc1tpXS5tdXRlZCA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxucmVzb3VyY2VzLm9uKFwibG9hZGluZ0NoYW5nZVwiLCBzZXRQcm9ncmVzcyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGxvYWRJbWFnZXM6IHJlc291cmNlcy5sb2FkSW1hZ2VzLFxyXG4gICAgbG9hZEF1ZGlvczogcmVzb3VyY2VzLmxvYWRBdWRpb3MsXHJcbiAgICBnZXRJbWc6IHJlc291cmNlcy5nZXRJbWcsXHJcbiAgICBnZXRBdWRpbzogcmVzb3VyY2VzLmdldEF1ZGlvLFxyXG4gICAgb25SZXNvdXJjZXNSZWFkeTogcmVzb3VyY2VzLm9uUmVhZHksXHJcbiAgICBjcmVhdGVTcHJpdGU6IGNyZWF0ZVNwcml0ZSxcclxuICAgIGdldElucHV0OiBpbnB1dCxcclxuICAgIGNyZWF0ZVBsYXllcjogbW9kZWwuY3JlYXRlUGxheWVyLFxyXG4gICAgY3JlYXRlQmFja2dyb3VuZDogbW9kZWwuY3JlYXRlQmFja2dyb3VuZCxcclxuICAgIGNyZWF0ZUVuZW1pZTogbW9kZWwuY3JlYXRlRW5lbWllLFxyXG4gICAgY3JlYXRlQm9udXM6IG1vZGVsLmNyZWF0ZUJvbnVzLFxyXG4gICAgcGxheWVyOiBtb2RlbC5wbGF5ZXIsXHJcbiAgICBiYWNrZ3JvdW5kOiBtb2RlbC5iYWNrZ3JvdW5kLFxyXG4gICAgZW5lbWllczogbW9kZWwuZW5lbWllcyxcclxuICAgIGJvbnVzZXM6IG1vZGVsLmJvbnVzZXMsXHJcbiAgICByZW5kZXI6IHJlbmRlcixcclxuICAgIGNsZWFyUmVuZGVyOiBjbGVhckRpc3BsYXksXHJcbiAgICByZW5kZXJHYW1lT3ZlcjogcmVuZGVyR2FtZU92ZXIsXHJcbiAgICBoaWRlR2FtZU92ZXI6IGhpZGVHYW1lT3ZlcixcclxuICAgIHNldFNjb3JlOiBzZXRTY29yZSxcclxuICAgIHNob3dFbGVtZW50OiBzaG93RWxlbWVudCxcclxuICAgIGhpZGVFbGVtZW50OiBoaWRlRWxlbWVudCxcclxuICAgIGdldFZpZXdwb3J0OiBnZXRWaWV3cG9ydCxcclxuICAgIGNob29zZU1lbnU6IGNob29zZU1lbnUsXHJcbiAgICB1bkNob29zZU1lbnU6IHVuQ2hvb3NlTWVudSxcclxuICAgIG9uQnV0dG9uQ2xpY2s6IG9uQnV0dG9uQ2xpY2ssXHJcbiAgICBhZGRDbGFzczogYWRkQ2xhc3MsXHJcbiAgICByZW1vdmVDbGFzczogcmVtb3ZlQ2xhc3MsXHJcbiAgICBoYXNDbGFzczogaGFzQ2xhc3MsXHJcbiAgICBzZXRTb3VuZE11dGVkOiBzZXRTb3VuZE11dGVkXHJcbn07XHJcblxyXG4iLCJ2YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnLmpzXCIpO1xyXG4vL3ZhciBjb3JlID0gcmVxdWlyZShcIi4vY29yZS5qc1wiKTsgLy9jaXJjdWxhciBsaW5rXHJcbnZhciBtb2RlbCA9IHJlcXVpcmUoXCIuL21vZGVsLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gZmxpcEhvcml6b250YWxseShjb250ZXh0LCBhcm91bmQpIHtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKGFyb3VuZCwgMCk7XHJcbiAgICBjb250ZXh0LnNjYWxlKC0xLCAxKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC1hcm91bmQsIDApO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHNlZSBkaXNwbGF5XHJcbiAqL1xyXG5mdW5jdGlvbiBDYW52YXNEaXNwbGF5KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2FudmFzXCIpO1xyXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSBjb25maWcud2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xyXG4gICAgdGhpcy5zY29yZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZVwiKTtcclxuICAgIHRoaXMuY3ggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgdGhpcy5tZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW51XCIpO1xyXG4gICAgdGhpcy5tYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluXCIpO1xyXG4gICAgdGhpcy5wbGF5QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5XCIpO1xyXG4gICAgdGhpcy5yZWNvcmRzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZWNvcmRzXCIpO1xyXG4gICAgdGhpcy5jcmVkaXRzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jcmVkaXRzXCIpO1xyXG4gICAgdGhpcy5xdWl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5xdWl0XCIpO1xyXG4gICAgdGhpcy5tZW51QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51XCIpO1xyXG4gICAgdGhpcy5yZXN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXN0YXJ0XCIpO1xyXG4gICAgdGhpcy5iYWNrRnJvbVJlY29yZHNCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JlY29yZHMgLmJhY2tcIik7XHJcbiAgICB0aGlzLmJhY2tGcm9tQ3JlZGl0c0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY3JlZGl0cyAuYmFja1wiKTtcclxuICAgIHRoaXMuY3JlZGl0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY3JlZGl0c1wiKTtcclxuICAgIHRoaXMucmVjb3JkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVjb3Jkc1wiKTtcclxuICAgIHRoaXMuZ2FtZV9vdmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lLW92ZXJcIik7XHJcbiAgICB0aGlzLmdhbWVfb3Zlcl9vdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lLW92ZXItb3ZlcmxheVwiKTtcclxuICAgIHRoaXMucHJvZ3Jlc3NfYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9ncmVzcy1iYXJcIik7XHJcbiAgICB0aGlzLnByb2dyZXNzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9ncmVzc1wiKTtcclxuICAgIHRoaXMucCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcFwiKTtcclxuICAgIHRoaXMuc291bmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNvdW5kXCIpO1xyXG59XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmNhbnZhcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuY2FudmFzKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmNsZWFyRGlzcGxheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmN4LmZpbGxTdHlsZSA9IFwicmdiKDUyLCAxNjYsIDI1MSlcIjtcclxuICAgIHRoaXMuY3guZmlsbFJlY3QoMCwgMCwgY29uZmlnLndpZHRoLCBjb25maWcuaGVpZ2h0KTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLl9yZW5kZXIgPSBmdW5jdGlvbihlbmVteSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmN4LnNhdmUoKTtcclxuICAgIHRoaXMuY3gudHJhbnNsYXRlKGVuZW15LnBvc1swXSwgZW5lbXkucG9zWzFdKTtcclxuICAgIGVuZW15LnNwcml0ZS5yZW5kZXIodGhpcy5jeCk7XHJcbiAgICB0aGlzLmN4LnJlc3RvcmUoKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlckJhY2tncm91bmQgPSBmdW5jdGlvbigpIHsgIC8vV1RGPyFcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jeC5zYXZlKCk7XHJcbiAgICB0aGlzLmN4LnRyYW5zbGF0ZShtb2RlbC5iYWNrZ3JvdW5kLnBvc1swXSwgbW9kZWwuYmFja2dyb3VuZC5wb3NbMV0pO1xyXG4gICAgbW9kZWwuYmFja2dyb3VuZC5zcHJpdGVzW21vZGVsLmJhY2tncm91bmQuY3VycmVudFNwcml0ZV0ucmVuZGVyKHRoaXMuY3gpO1xyXG4gICAgdGhpcy5jeC5yZXN0b3JlKCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJFbmVtaWVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9kZWwuZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcihtb2RlbC5lbmVtaWVzW2ldKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlclBsYXllciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLl9yZW5kZXIobW9kZWwucGxheWVyKTtcclxufTtcclxuLyoqXHJcbiAqIENsZWFyIHJlbmRlciwgcmVuZGVyIGJhY2tncm91bmQsIHJlbmRlciBlbmVtaWVzLCByZW5kZXIgcGxheWVyXHJcbiAqL1xyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jbGVhckRpc3BsYXkoKTtcclxuICAgIHRoaXMucmVuZGVyQmFja2dyb3VuZCgpO1xyXG4gICAgdGhpcy5yZW5kZXJFbmVtaWVzKCk7XHJcbiAgICB0aGlzLnJlbmRlclBsYXllcigpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuc2hvd0VsZW1lbnQgPSBmdW5jdGlvbihlbCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpZiAoZWwgaW4gdGhpcylcclxuICAgICAgICB0aGlzW2VsXS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxufTtcclxuXHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5oaWRlRWxlbWVudCA9IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmIChlbCBpbiB0aGlzKVxyXG4gICAgICAgIHRoaXNbZWxdLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJHYW1lT3ZlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5zaG93RWxlbWVudChcImdhbWVfb3ZlclwiKTtcclxuICAgIHRoaXMuc2hvd0VsZW1lbnQoXCJnYW1lX292ZXJfb3ZlcmxheVwiKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmhpZGVHYW1lT3ZlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmhpZGVFbGVtZW50KFwiZ2FtZV9vdmVyXCIpO1xyXG4gICAgdGhpcy5oaWRlRWxlbWVudChcImdhbWVfb3Zlcl9vdmVybGF5XCIpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuc2V0U2NvcmUgPSBmdW5jdGlvbihzY29yZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLnNjb3JlRWwuaW5uZXJIVE1MID0gc2NvcmUudG9TdHJpbmcoKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnNldFByb2dyZXNzID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5wcm9ncmVzc19iYXIudmFsdWUgPSB2YWx1ZTtcclxuICAgIHRoaXMucC5pbm5lckhUTUwgPSB2YWx1ZSArIFwiJVwiO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuY2hvb3NlTWVudSA9IGZ1bmN0aW9uKG1lbnVDYXNlKSB7XHJcbiAgICB0aGlzLm1lbnUuY2xhc3NMaXN0LmFkZChtZW51Q2FzZSk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS51bkNob29zZU1lbnUgPSBmdW5jdGlvbihtZW51Q2FzZSkge1xyXG4gICAgdGhpcy5tZW51LmNsYXNzTGlzdC5yZW1vdmUobWVudUNhc2UpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUub25CdXR0b25DbGljayA9IGZ1bmN0aW9uKGJ1dHRvbk5hbWUsIGhhbmRsZXIsIG5vdEJ1dHRvbikge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpZiAoIW5vdEJ1dHRvbilcclxuICAgICAgICBidXR0b25OYW1lICs9IFwiQnV0dG9uXCI7XHJcbiAgICBpZiAoYnV0dG9uTmFtZSBpbiB0aGlzKSB7XHJcbiAgICAgICAgdGhpc1tidXR0b25OYW1lXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlcik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpZiAoZWwgaW4gdGhpcykge1xyXG4gICAgICAgIHRoaXNbZWxdLmNsYXNzTGlzdC5hZGQodmFsdWUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaWYgKGVsIGluIHRoaXMpIHtcclxuICAgICAgICB0aGlzW2VsXS5jbGFzc0xpc3QucmVtb3ZlKHZhbHVlKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmhhc0NsYXNzID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmIChlbCBpbiB0aGlzKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbZWxdLmNsYXNzTGlzdC5jb250YWlucyh2YWx1ZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIENhbnZhc0Rpc3BsYXk6IENhbnZhc0Rpc3BsYXlcclxufTsiLCJ2YXIgd29ybGQgPSByZXF1aXJlKFwiLi93b3JsZC5qc1wiKSgpOyIsIi8qKlxyXG4gKiBAcGFyYW0gd2luZG93IEdsb2JhbCBvYmplY3RcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgQ2FuIGJlOmtleWJvYXJkLCBtZWRpY2luZSwgc21hcnRwaG9uZVxyXG4gKiBAcmV0dXJucyBPYmplY3Qgd2hpY2ggY29udGVudCBpbmZvIGFib3V0IHByZXNzZWQgYnV0dG9uc1xyXG4gKiBAc2VlIGdldElucHV0XHJcbiAqL1xyXG5mdW5jdGlvbiBpbnB1dCh3aW5kb3dfLCB0eXBlKSB7ICAgIC8vdHlwZSAtIGtleWJvYXJkLCBtZWRpY2luZSwgc21hcnRwaG9uZVxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgcHJlc3NlZCA9IG51bGw7XHJcbiAgICBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGNvZGVzLmhhc093blByb3BlcnR5KGV2ZW50LmtleUNvZGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBkb3duID0gZXZlbnQudHlwZSA9PT0gXCJrZXlkb3duXCI7XHJcbiAgICAgICAgICAgIHByZXNzZWRbY29kZXNbZXZlbnQua2V5Q29kZV1dID0gZG93bjtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xlYXJBbGwoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgYyBpbiBwcmVzc2VkKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVzc2VkLmhhc093blByb3BlcnR5KGMpKVxyXG4gICAgICAgICAgICAgICAgcHJlc3NlZFtjXSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXByZXNzZWQpIHtcclxuICAgICAgICBwcmVzc2VkID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgICAgICB2YXIgY29kZXNLZXlib2FyZCA9IHszODogXCJ1cFwifTtcclxuICAgICAgICB2YXIgY29kZXM7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwia2V5Ym9hcmRcIjpcclxuICAgICAgICAgICAgICAgIGNvZGVzID0gY29kZXNLZXlib2FyZDtcclxuICAgICAgICAgICAgICAgIHdpbmRvd18uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3dfLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvd18uYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgY2xlYXJBbGwoKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXcm9uZyB0eXBlIG9mIGlucHV0XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwcmVzc2VkO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHV0OyIsInZhciBjb25maW5nID0gcmVxdWlyZShcIi4vY29uZmlnLmpzXCIpO1xyXG5cclxudmFyIHBsYXllciA9IHt9LFxyXG4gICAgZW5lbWllcyA9IFtdLFxyXG4gICAgYmFja2dyb3VuZCA9IHt9LFxyXG4gICAgYm9udXNlcyA9IFtdO1xyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGwgb25jZVxyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVcclxuICogQHJldHVybnMgcGxheWVyXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVQbGF5ZXIgPSBmdW5jdGlvbiBjcmVhdGVQbGF5ZXIocG9zLCBzcHJpdGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcGxheWVyLnBvcyA9IHBvcyB8fCBbMCwgMF07XHJcbiAgICBpZiAocGxheWVyLnNwcml0ZSA9PSBudWxsKVxyXG4gICAgICAgIHBsYXllci5zcHJpdGUgPSBzcHJpdGU7XHJcbiAgICBwbGF5ZXIuc3BlZWQgPSB7eDogMSwgeTogMH07XHJcbiAgICByZXR1cm4gcGxheWVyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsIG9uY2VcclxuICogQHBhcmFtIHBvc1xyXG4gKiBAcGFyYW0gc3ByaXRlc1xyXG4gKiBAcmV0dXJucyBiYWNrZ3JvdW5kXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVCYWNrZ3JvdW5kID0gZnVuY3Rpb24gY3JlYXRlQmFja2dyb3VuZChzcHJpdGVzKSB7IC8vMiBtaW5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYmFja2dyb3VuZC5wb3NpdGlvbnMgPSBbXTtcclxuICAgIGlmIChiYWNrZ3JvdW5kLnNwcml0ZXMgPT0gbnVsbCkge1xyXG4gICAgICAgIGJhY2tncm91bmQuc3ByaXRlcyA9IHNwcml0ZXM7XHJcbiAgICB9XHJcbiAgICBiYWNrZ3JvdW5kLmN1cnJlbnRTcHJpdGUgPSAwO1xyXG4gICAgYmFja2dyb3VuZC5zcHJpdGVzTGVuZ3RoID0gc3ByaXRlcy5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwcml0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoaSA9PT0gMCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLnBvc2l0aW9uc1swXSA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC5wb3NpdGlvbnNbaV0gPSBjb25maW5nLndpZHRoO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBiYWNrZ3JvdW5kO1xyXG59O1xyXG4vKipcclxuICogQWRkIGVuZW1pZSB0byBlbmVtaWVzXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlRW5lbWllID0gZnVuY3Rpb24gY3JlYXRlRW5lbWllKHBvcywgc3ByaXRlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGVuZW1pZXMucHVzaCh7XHJcbiAgICAgICAgcG9zOiBwb3MsXHJcbiAgICAgICAgc3ByaXRlOiBzcHJpdGVcclxuICAgIH0pO1xyXG59O1xyXG4vKipcclxuICogQWRkIGJvbnVzIHRvIGJvbnVzZXNcclxuICogQHBhcmFtIHBvc1xyXG4gKiBAcGFyYW0gc3ByaXRlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIENhbiBiZTogc3BlZWQsIHNsb3csIHNtYWxsLCBiaWdcclxuICovXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZUJvbnVzID0gZnVuY3Rpb24gY3JlYXRlQm9udXMocG9zLCBzcHJpdGUsIHR5cGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYm9udXNlcy5wdXNoKHtcclxuICAgICAgICBwb3M6IHBvcyxcclxuICAgICAgICBzcHJpdGU6IHNwcml0ZSxcclxuICAgICAgICB0eXBlOiB0eXBlXHJcbiAgICB9KTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMucGxheWVyID0gcGxheWVyO1xyXG5tb2R1bGUuZXhwb3J0cy5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZDtcclxubW9kdWxlLmV4cG9ydHMuZW5lbWllcyA9IGVuZW1pZXM7XHJcbm1vZHVsZS5leHBvcnRzLmJvbnVzZXMgPSBib251c2VzOyIsInZhciBwdWJsaXNoZXIgPSB7XHJcbiAgICBzdWJzY3JpYmVyczoge30sXHJcbiAgICBvbjogZnVuY3Rpb24odHlwZSwgZm4pIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLnB1c2goZm4pO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZTogZnVuY3Rpb24odHlwZSwgZm4pIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoXCJ1bnN1YnNjcmliZVwiLCB0eXBlLCBmbik7XHJcbiAgICB9LFxyXG4gICAgdmlzaXRTdWJzY3JpYmVyczogZnVuY3Rpb24oYWN0aW9uLCB0eXBlLCBhcmcpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB2YXIgc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLFxyXG4gICAgICAgICAgICBpLFxyXG4gICAgICAgICAgICBtYXggPSBzdWJzY3JpYmVycy5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG1heDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGlmIChhY3Rpb24gPT09IFwicHVibGlzaFwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1tpXShhcmcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzW2ldID09PSBhcmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGlzaDogZnVuY3Rpb24odHlwZSwgcHVibGljYXRpb24pIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoXCJwdWJsaXNoXCIsIHR5cGUsIHB1YmxpY2F0aW9uKTtcclxuICAgIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIG1ha2VQdWJsaXNoZXIobykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaSBpbiBwdWJsaXNoZXIpIHtcclxuICAgICAgICBpZiAocHVibGlzaGVyLmhhc093blByb3BlcnR5KGkpICYmIHR5cGVvZiBwdWJsaXNoZXJbaV0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICBvW2ldID0gcHVibGlzaGVyW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG8uc3Vic2NyaWJlcnMgPSB7fTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMubWFrZVB1Ymxpc2hlciA9IG1ha2VQdWJsaXNoZXI7IiwidmFyIG1ha2VQdWJsaXNoZXIgPSByZXF1aXJlKFwiLi9wdWJsaXNoZXIuanNcIikubWFrZVB1Ymxpc2hlcjtcclxuXHJcbnZhciBpbWFnZXNDYWNoZSA9IHt9O1xyXG52YXIgYXVkaW9zQ2FjaGUgPSB7fTtcclxudmFyIHJlYWR5Q2FsbGJhY2tzID0gW107XHJcbnZhciByZXNvdXJjZXNDb3VudCA9IDA7XHJcbnZhciByZXNvdXJjZXNMb2FkZWQgPSAxOyAvLyAxIGZvciBiZXN0IHZpZXdcclxucmVhZHlDYWxsYmFja3MuZG9uZSA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gcHJvZ3Jlc3NJblBlcmNlbnQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKHJlc291cmNlc0xvYWRlZCAvIHJlc291cmNlc0NvdW50ICogMTAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hhbmdlTG9hZGluZygpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMucHVibGlzaChcImxvYWRpbmdDaGFuZ2VcIiwgcHJvZ3Jlc3NJblBlcmNlbnQoKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzUmVhZHkoKSB7XHJcbiAgICB2YXIgcmVhZHkgPSB0cnVlO1xyXG4gICAgZm9yICh2YXIgayBpbiBpbWFnZXNDYWNoZSkge1xyXG4gICAgICAgIGlmIChpbWFnZXNDYWNoZS5oYXNPd25Qcm9wZXJ0eShrKSAmJiAhaW1hZ2VzQ2FjaGVba10pIHtcclxuICAgICAgICAgICAgcmVhZHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBrIGluIGF1ZGlvc0NhY2hlKSB7XHJcbiAgICAgICAgaWYgKGF1ZGlvc0NhY2hlLmhhc093blByb3BlcnR5KGspICYmICFhdWRpb3NDYWNoZVtrXSkge1xyXG4gICAgICAgICAgICByZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZWFkeTtcclxufVxyXG5cclxuZnVuY3Rpb24gX2xvYWRJbWcodXJsKSB7XHJcbiAgICBpZiAoaW1hZ2VzQ2FjaGVbdXJsXSkge1xyXG4gICAgICAgIHJldHVybiBpbWFnZXNDYWNoZVt1cmxdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW1hZ2VzQ2FjaGVbdXJsXSA9IGltZztcclxuICAgICAgICAgICAgcmVzb3VyY2VzTG9hZGVkICs9IDE7XHJcbiAgICAgICAgICAgIGNoYW5nZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGlzUmVhZHkoKSkge1xyXG4gICAgICAgICAgICAgICAgcmVhZHlDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoZnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbWcuc3JjID0gdXJsO1xyXG4gICAgICAgIGltYWdlc0NhY2hlW3VybF0gPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gX2xvYWRBdWRpbyh1cmwpIHtcclxuICAgIGlmIChhdWRpb3NDYWNoZVt1cmxdKSB7XHJcbiAgICAgICAgcmV0dXJuIGF1ZGlvc0NhY2hlW3VybF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBhdWRpbyA9IG5ldyBBdWRpbygpO1xyXG4gICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoXCJjYW5wbGF5dGhyb3VnaFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghYXVkaW9zQ2FjaGVbdXJsXSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzTG9hZGVkICs9IDE7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXVkaW9zQ2FjaGVbdXJsXSA9IGF1ZGlvO1xyXG4gICAgICAgICAgICBpZiAoaXNSZWFkeSgpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlYWR5Q2FsbGJhY2tzLmRvbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFkeUNhbGxiYWNrcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZWFkeUNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGF1ZGlvLnNyYyA9IHVybDtcclxuICAgICAgICBhdWRpby5wcmVsb2FkID0gXCJhdXRvXCI7XHJcbiAgICAgICAgLy9hdWRpby5sb2FkKCk7XHJcbiAgICAgICAgYXVkaW9zQ2FjaGVbdXJsXSA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBMb2FkIGltYWdlIGFuZCBhZGQgdGhlbSB0byBjYWNoZVxyXG4gKkBwYXJhbSB7KHN0cmluZ3xzdHJpbmdbXSl9IHVybE9mQXJyIEFycmF5IG9mIHVybHNcclxuICogQHNlZSBsb2FkUmVzb3VyY2VzXHJcbiAqL1xyXG5mdW5jdGlvbiBsb2FkSW1hZ2VzKHVybE9mQXJyKSB7XHJcbiAgICBpZiAodXJsT2ZBcnIgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgIHJlc291cmNlc0NvdW50ICs9IHVybE9mQXJyLmxlbmd0aDtcclxuICAgICAgICB1cmxPZkFyci5mb3JFYWNoKGZ1bmN0aW9uICh1cmwpIHtcclxuICAgICAgICAgICAgX2xvYWRJbWcodXJsKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzb3VyY2VzQ291bnQgKz0gMTtcclxuICAgICAgICBfbG9hZEltZyh1cmxPZkFycik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRBdWRpb3ModXJsT2ZBcnIpIHtcclxuICAgIGlmICh1cmxPZkFyciBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgcmVzb3VyY2VzQ291bnQgKz0gdXJsT2ZBcnIubGVuZ3RoO1xyXG4gICAgICAgIHVybE9mQXJyLmZvckVhY2goZnVuY3Rpb24gKHVybCkge1xyXG4gICAgICAgICAgICBfbG9hZEF1ZGlvKHVybCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc291cmNlc0NvdW50ICs9IDE7XHJcbiAgICAgICAgX2xvYWRBdWRpbyh1cmxPZkFycik7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEdldCByZXNvdXJjZSBmcm9tIGNhY2hlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcclxuICogQHJldHVybnMgIEltYWdlXHJcbiAqIEBzZWUgZ2V0UmVzb3VyY2VcclxuICovXHJcbmZ1bmN0aW9uIGdldEltZyh1cmwpIHtcclxuICAgIHJldHVybiBpbWFnZXNDYWNoZVt1cmxdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBdWRpbyh1cmwpIHtcclxuICAgIHJldHVybiBhdWRpb3NDYWNoZVt1cmxdO1xyXG59XHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb24gdG8gZnVuY3Rpb25zIHdoaWNoIHdpbGwgYmUgY2FsbGVkIHRoZW4gYWxsIHJlc291cmNlcyBsb2FkZWRcclxuICogQHBhcmFtIGZ1bmNcclxuICogQHNlZSBvblJlc291cmNlc1JlYWR5XHJcbiAqL1xyXG5mdW5jdGlvbiBvblJlYWR5KGZ1bmMpIHtcclxuICAgIHJlYWR5Q2FsbGJhY2tzLnB1c2goZnVuYyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgbG9hZEltYWdlczogbG9hZEltYWdlcyxcclxuICAgIGxvYWRBdWRpb3M6IGxvYWRBdWRpb3MsXHJcbiAgICBnZXRJbWc6IGdldEltZyxcclxuICAgIGdldEF1ZGlvOiBnZXRBdWRpbyxcclxuICAgIG9uUmVhZHk6IG9uUmVhZHksXHJcbiAgICBpc1JlYWR5OiBpc1JlYWR5LFxyXG4gICAgcHJvZ3Jlc3NJblBlcmNlbnQ6IHByb2dyZXNzSW5QZXJjZW50LFxyXG4gICAgYXVkaW9zOiBhdWRpb3NDYWNoZSxcclxuICAgIGltYWdlczogaW1hZ2VzQ2FjaGVcclxufTtcclxubWFrZVB1Ymxpc2hlcihtb2R1bGUuZXhwb3J0cyk7XHJcblxyXG4iLCJ2YXIgcmVzb3VyY2VzID0gcmVxdWlyZShcIi4vcmVzb3VyY2VzLmpzXCIpO1xyXG5cclxuLyoqXHJcbiAqIFNwcml0ZSBvZiB0ZXh0dXJlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcclxuICogQHBhcmFtIHtudW1iZXJbXX0gcG9zIFBvc2l0aW9uIGluIHNwcml0ZSBzaGVldFxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBzaXplIFNpemUgaW4gc3ByaXRlIHNoZWV0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBTcGVlZCBvZiBwbGF5aW5nIGFuaW1hdGlvblxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBmcmFtZXMgRnJhbWVzIG9mIGFuaW1hdGlvblxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGlyIERpcmVjdGlvbiBvbiBzcHJpdGUgc2hlZXRcclxuICogQHBhcmFtIHtib29sfSBvbmNlIENvdW50IG9mIHBsYXlpbmcgYW5pbWF0aW9uXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAc2VlIGNyZWF0ZVNwcml0ZVxyXG4gKiBAc2VlIGNyZWF0ZVNwcml0ZVxyXG4gKi9cclxuZnVuY3Rpb24gU3ByaXRlKHVybCwgcG9zLCBzaXplLCBzcGVlZCwgZnJhbWVzLCBkaXIsIG9uY2UpIHtcclxuICAgIHRoaXMucG9zID0gcG9zO1xyXG4gICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgdGhpcy5zcGVlZCA9IHR5cGVvZiBzcGVlZCA9PT0gXCJudW1iZXJcIiA/IHNwZWVkIDogMDtcclxuICAgIHRoaXMuZnJhbWVzID0gZnJhbWVzO1xyXG4gICAgdGhpcy5kaXIgPSBkaXIgfHwgXCJob3Jpem9udGFsXCI7XHJcbiAgICB0aGlzLm9uY2UgPSBvbmNlO1xyXG4gICAgdGhpcy5faW5kZXggPSAwO1xyXG59XHJcblxyXG5TcHJpdGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgdGhpcy5faW5kZXggKz0gdGhpcy5zcGVlZCAqIGR0O1xyXG59O1xyXG5TcHJpdGUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChjdHgpIHtcclxuICAgIHZhciBmcmFtZTtcclxuICAgIGlmICh0aGlzLnNwZWVkID4gMCkge1xyXG4gICAgICAgIHZhciBtYXggPSB0aGlzLmZyYW1lcy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIGlkeCA9IE1hdGguZmxvb3IodGhpcy5faW5kZXgpO1xyXG4gICAgICAgIGZyYW1lID0gdGhpcy5mcmFtZXNbaWR4ICUgbWF4XTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub25jZSAmJiBpZHggPj0gbWF4KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZyYW1lID0gMDtcclxuICAgIH1cclxuICAgIHZhciB4ID0gdGhpcy5wb3NbMF07XHJcbiAgICB2YXIgeSA9IHRoaXMucG9zWzFdO1xyXG5cclxuICAgIGlmICh0aGlzLmRpciA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XHJcbiAgICAgICAgeSArPSBmcmFtZSAqIHRoaXMuc2l6ZVsxXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeCArPSBmcmFtZSAqIHRoaXMuc2l6ZVswXTtcclxuICAgIH1cclxuXHJcbiAgICBjdHguZHJhd0ltYWdlKHJlc291cmNlcy5nZXRJbWcodGhpcy51cmwpLCB4LCB5LCB0aGlzLnNpemVbMF0sIHRoaXMuc2l6ZVsxXSwgMCwgMCwgdGhpcy5zaXplWzBdLCB0aGlzLnNpemVbMV0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7IiwidmFyIGNvcmUgPSByZXF1aXJlKFwiLi9jb3JlLmpzXCIpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnLmpzXCIpO1xyXG5cclxudmFyIGxhc3RUaW1lLFxyXG4gICAgaXNHYW1lT3ZlcixcclxuICAgIHNjb3JlLFxyXG4gICAgcHJlc3NlZCxcclxuICAgIHBsYXlTb3VuZCxcclxuICAgIGJnU291bmQ7XHJcbnZhciB2aWV3cG9ydCA9IGNvcmUuZ2V0Vmlld3BvcnQoKTtcclxuXHJcbmZ1bmN0aW9uIGNvbGxpZGVzKHgsIHksIHIsIGIsIHgyLCB5MiwgcjIsIGIyKSB7XHJcbiAgICByZXR1cm4gKHIgPj0geDIgJiYgeCA8IHIyICYmIHkgPCBiMiAmJiBiID49IHkyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYm94Q29sbGlkZXMocG9zLCBzaXplLCBwb3MyLCBzaXplMikge1xyXG4gICAgcmV0dXJuIGNvbGxpZGVzKHBvc1swXSwgcG9zWzFdLCBwb3NbMF0gKyBzaXplWzBdLCBwb3NbMV0gKyBzaXplWzFdLFxyXG4gICAgICAgIHBvczJbMF0sIHBvczJbMV0sIHBvczJbMF0gKyBzaXplMlswXSwgcG9zMlsxXSArIHNpemUyWzFdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUdhbWVPdmVyKCk7XHJcbiAgICBpc0dhbWVPdmVyID0gZmFsc2U7XHJcbiAgICBzY29yZSA9IDA7XHJcbiAgICBjb3JlLmNyZWF0ZVBsYXllcihcclxuICAgICAgICBbdmlld3BvcnQud2lkdGggLyAyLCA1MF0sXHJcbiAgICAgICAgY29yZS5jcmVhdGVTcHJpdGUoXCJpbWcvcmVjdC5qcGdcIiwgWzAsIDBdLCBbMTAwLCAxMDBdLCAwLCBbMF0pXHJcbiAgICApO1xyXG5cclxuICAgIHZhciBiZ1Nwcml0ZTEgPSBjb3JlLmNyZWF0ZVNwcml0ZShcImltZy9ibGFjay5qcGdcIiwgWzAsIDBdLCBbdmlld3BvcnQud2lkdGggKiAzLCB2aWV3cG9ydC5oZWlnaHRdLCAwKTtcclxuICAgIC8vdmFyIGJnU3ByaXRlMiA9IGNvcmUuY3JlYXRlU3ByaXRlKFwiaW1nL2JsYWNrLmpwZ1wiLCBbMCwgMF0sIFt2aWV3cG9ydC53aWR0aCAqIDMsIHZpZXdwb3J0LmhlaWdodF0sIDApO1xyXG5cclxuICAgIGNvcmUuY3JlYXRlQmFja2dyb3VuZChcclxuICAgICAgICBbYmdTcHJpdGUxLCBiZ1Nwcml0ZTFdXHJcbiAgICApO1xyXG4gICAgY29yZS5lbmVtaWVzID0gW107XHJcbiAgICBjb3JlLmJvbnVzZXMgPSBbXTtcclxufVxyXG5cclxudmFyIHNjb3JlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlXCIpO1xyXG5cclxuZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgY29yZS5yZW5kZXJHYW1lT3ZlcigpO1xyXG4gICAgc2NvcmVFbC5pbm5lckhUTUwgPSBzY29yZTtcclxufVxyXG5cclxudmFyIGJnID0gY29yZS5iYWNrZ3JvdW5kO1xyXG52YXIgZmlyc3RDeWNsZUJnID0gdHJ1ZTtcclxuZnVuY3Rpb24gdXBkYXRlQmFja2dyb3VuZChkdCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgY3VyID0gYmcuY3VycmVudFNwcml0ZSxcclxuICAgICAgICAgICAgbmV4dCA9IChjdXIgKyAxKSAlIGJnLnNwcml0ZXNMZW5ndGg7XHJcbiAgICB2YXIgbmV3QmdQb3MgPSBiZy5wb3NpdGlvbnNbY3VyXSAtIGNvbmZpZy5iYWNrZ3JvdW5kU3BlZWQgKiBkdCxcclxuICAgICAgICBuZXdSaWdodENvcm5lciA9IG5ld0JnUG9zICsgYmcuc3ByaXRlc1tjdXJdLnNpemVbMF07XHJcblxyXG4gICAgaWYgKCFmaXJzdEN5Y2xlQmcgJiYgKG5ld1JpZ2h0Q29ybmVyIDwgY29uZmlnLndpZHRoKSkge1xyXG4gICAgICAgIGZpcnN0Q3ljbGVCZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChuZXdSaWdodENvcm5lciA+IDApIHtcclxuICAgICAgICAgICAgYmcucG9zaXRpb25zW2N1cl0gPSBuZXdCZ1BvcztcclxuICAgICAgICAgICAgYmcucG9zaXRpb25zW25leHRdID0gYmcucG9zaXRpb25zW25leHRdIC0gY29uZmlnLmJhY2tncm91bmRTcGVlZCAqIGR0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJnLnBvc2l0aW9uc1tjdXJdID0gY29uZmlnLndpZHRoO1xyXG4gICAgICAgICAgICBjdXIgPSBuZXh0O1xyXG4gICAgICAgICAgICBiZy5wb3NpdGlvbnNbY3VyXSA9IGJnLnBvc2l0aW9uc1tjdXJdIC0gY29uZmlnLmJhY2tncm91bmRTcGVlZCAqIGR0O1xyXG4gICAgICAgICAgICBuZXh0ID0gKGN1ciArIDEpICUgYmcuc3ByaXRlc0xlbmd0aDtcclxuICAgICAgICAgICAgYmcucG9zaXRpb25zW25leHRdID0gYmcucG9zaXRpb25zW25leHRdIC0gY29uZmlnLmJhY2tncm91bmRTcGVlZCAqIGR0O1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYmcucG9zaXRpb25zW2N1cl0gPSBuZXdCZ1BvcztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tDb2xpc2lvbnMocG9zKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBjb2xsaXNpb24gPSBbXSxcclxuICAgICAgICBzaXplID0gY29yZS5wbGF5ZXIuc3ByaXRlLnNpemUsXHJcbiAgICAgICAgaSxcclxuICAgICAgICBlbmVtaWVzID0gY29yZS5lbmVtaWVzLFxyXG4gICAgICAgIGJvbnVzZXMgPSBjb3JlLmJvbnVzZXM7XHJcblxyXG4gICAgaWYgKHBvc1sxXSA8IDApIHtcclxuICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJ0b3BcIn0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocG9zWzFdICsgc2l6ZVsxXSA+IGNvbmZpZy5mb3Jlc3RMaW5lKSB7XHJcbiAgICAgICAgY29sbGlzaW9uLnB1c2goe3R5cGU6IFwiZm9yZXN0XCJ9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChib3hDb2xsaWRlcyhwb3MsIHNpemUsIGVuZW1pZXNbaV0ucG9zLCBlbmVtaWVzW2ldLnNwcml0ZS5zaXplKSkge1xyXG4gICAgICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJlbmVteVwiLCB0YXJnZXQ6IGVuZW1pZXNbaV19KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGJvbnVzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoYm94Q29sbGlkZXMocG9zLCBzaXplLCBib251c2VzW2ldLnBvcywgYm9udXNlc1tpXS5zcHJpdGUuc2l6ZSkpIHtcclxuICAgICAgICAgICAgY29sbGlzaW9uLnB1c2goe3R5cGU6IFwiYm9udXNcIiwgdGFyZ2V0OiBib251c2VzW2ldfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbGxpc2lvbjtcclxufVxyXG5cclxuZnVuY3Rpb24gY29sbGlkZVBsYXllcihwb3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIGNvbGxpc2lvbiA9IGNoZWNrQ29saXNpb25zKHBvcyksXHJcbiAgICAgICAgaSA9IDA7XHJcbiAgICBpZiAoY29sbGlzaW9uLmxlbmd0aCA9PT0gMClcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBjb2xsaXNpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzd2l0Y2ggKGNvbGxpc2lvbltpXS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcclxuICAgICAgICAgICAgICAgIGNvcmUucGxheWVyLnNwZWVkLnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgY29yZS5wbGF5ZXIucG9zWzFdID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiZm9yZXN0XCI6XHJcbiAgICAgICAgICAgICAgICBnYW1lT3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlbmVteVwiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJib251c1wiOlxyXG4gICAgICAgICAgICAgICAgY29yZS5wbGF5ZXIucG9zID0gcG9zO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUGxheWVyKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUucGxheWVyLnNwZWVkLnkgKz0gY29uZmlnLmdyYXZpdHkgKiBkdDtcclxuICAgIGlmIChwcmVzc2VkWyd1cCddKSB7XHJcbiAgICAgICAgY29yZS5wbGF5ZXIuc3BlZWQueSAtPSBjb25maWcuYnJlYXRoZVNwZWVkICogZHQ7XHJcbiAgICB9XHJcbiAgICB2YXIgbW90aW9uID0gY29yZS5wbGF5ZXIuc3BlZWQueSAqIGR0O1xyXG4gICAgdmFyIG5ld1BvcyA9IFtjb3JlLnBsYXllci5wb3NbMF0sIGNvcmUucGxheWVyLnBvc1sxXSArIG1vdGlvbl07XHJcbiAgICBpZiAoY29sbGlkZVBsYXllcihuZXdQb3MpKSB7IC8vbW92ZSBvciBub3QgdG8gbW92ZVxyXG4gICAgICAgIGNvcmUucGxheWVyLnBvcyA9IG5ld1BvcztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlRW5pdGllcyhkdCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLnBsYXllci5zcHJpdGUudXBkYXRlKGR0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHVwZGF0ZUVuaXRpZXMoZHQpO1xyXG4gICAgaWYgKCFpc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgdXBkYXRlQmFja2dyb3VuZChkdCk7XHJcbiAgICAgICAgdXBkYXRlUGxheWVyKGR0KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLnJlbmRlcigpO1xyXG4gICAgY29yZS5zZXRTY29yZShzY29yZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgdmFyIGR0ID0gKG5vdyAtIGxhc3RUaW1lKSAvIDEwMDA7XHJcblxyXG4gICAgdXBkYXRlKGR0KTtcclxuICAgIHJlbmRlcigpO1xyXG5cclxuICAgIGxhc3RUaW1lID0gbm93O1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW4pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBwcmVzc2VkID0gY29yZS5nZXRJbnB1dCh3aW5kb3csIFwia2V5Ym9hcmRcIik7XHJcbiAgICAvKmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheS1hZ2FpblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVzZXQoKTtcclxuICAgIH0pOyovXHJcbiAgICByZXNldCgpO1xyXG4gICAgbGFzdFRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgbWFpbigpO1xyXG59XHJcblxyXG5jb3JlLmxvYWRJbWFnZXMoW1xyXG4gICAgXCJpbWcvYmxhY2suanBnXCIsXHJcbiAgICBcImltZy9yZWN0LmpwZ1wiXHJcbl0pO1xyXG5cclxuY29yZS5sb2FkQXVkaW9zKFtcclxuICAgIFwiYXVkaW8vTG9yZGkubXAzXCJcclxuXSk7XHJcblxyXG5mdW5jdGlvbiBiZ1NvdW5kU3RhcnQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGJnU291bmQuY3VycmVudFRpbWUgPSAwO1xyXG4gICAgYmdTb3VuZC5wbGF5KCk7XHJcbiAgICBpZiAoXCJsb29wXCIgaW4gYmdTb3VuZCkge1xyXG4gICAgICAgIGJnU291bmQubG9vcCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJnU291bmQuYWRkRXZlbnRMaXN0ZW5lcihcImVuZGVkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYmdTb3VuZC5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgIGJnU291bmQucGxheSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG1haW5NZW51KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLnNob3dFbGVtZW50KFwibWFpblwiKTtcclxuICAgIGNvcmUuaGlkZUVsZW1lbnQoXCJwcm9ncmVzc1wiKTtcclxuICAgIGNvcmUuY2hvb3NlTWVudShcIm1haW5cIik7XHJcbiAgICBjb3JlLnNob3dFbGVtZW50KFwic291bmRcIik7XHJcbiAgICBiZ1NvdW5kU3RhcnQoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVjb3Jkc01lbnUoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUVsZW1lbnQoXCJtYWluXCIpO1xyXG4gICAgY29yZS5zaG93RWxlbWVudChcInJlY29yZHNcIik7XHJcbiAgICBjb3JlLmNob29zZU1lbnUoXCJyZWNvcmRzXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBiYWNrRnJvbVJlY29yZHMoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUVsZW1lbnQoXCJyZWNvcmRzXCIpO1xyXG4gICAgY29yZS5zaG93RWxlbWVudChcIm1haW5cIik7XHJcbiAgICBjb3JlLnVuQ2hvb3NlTWVudShcInJlY29yZHNcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWRpdHNNZW51KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVFbGVtZW50KFwibWFpblwiKTtcclxuICAgIGNvcmUuc2hvd0VsZW1lbnQoXCJjcmVkaXRzXCIpO1xyXG4gICAgY29yZS5jaG9vc2VNZW51KFwiY3JlZGl0c1wiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYmFja0Zyb21DcmVkaXRzKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVFbGVtZW50KFwiY3JlZGl0c1wiKTtcclxuICAgIGNvcmUuc2hvd0VsZW1lbnQoXCJtYWluXCIpO1xyXG4gICAgY29yZS51bkNob29zZU1lbnUoXCJjcmVkaXRzXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBiYWNrVG9NZW51KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVHYW1lT3ZlcigpO1xyXG4gICAgY29yZS5zaG93RWxlbWVudChcIm1lbnVcIik7XHJcbn1cclxuZnVuY3Rpb24gaW5pdFNvdW5kcygpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYmdTb3VuZCA9IGNvcmUuZ2V0QXVkaW8oXCJhdWRpby9Mb3JkaS5tcDNcIik7XHJcbiAgICBwbGF5U291bmQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBsYXlTb3VuZFwiKSA9PT0gXCJ0cnVlXCI7XHJcbiAgICBpZiAocGxheVNvdW5kKSB7XHJcbiAgICAgICAgY29yZS5hZGRDbGFzcyhcInNvdW5kXCIsIFwic291bmQtb25cIik7XHJcbiAgICAgICAgY29yZS5yZW1vdmVDbGFzcyhcInNvdW5kXCIsIFwic291bmQtb2ZmXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb3JlLmFkZENsYXNzKFwic291bmRcIiwgXCJzb3VuZC1vZmZcIik7XHJcbiAgICAgICAgY29yZS5yZW1vdmVDbGFzcyhcInNvdW5kXCIsIFwic291bmQtb25cIik7XHJcbiAgICB9XHJcbiAgICBjb3JlLnNldFNvdW5kTXV0ZWQoIXBsYXlTb3VuZCk7XHJcbn1cclxuY29yZS5vblJlc291cmNlc1JlYWR5KGluaXRTb3VuZHMpO1xyXG5jb3JlLm9uUmVzb3VyY2VzUmVhZHkobWFpbk1lbnUpOyAvL29yZGVyIGlzIGltcG9ydGFudFxyXG5cclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwicGxheVwiLCBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5oaWRlRWxlbWVudChcIm1lbnVcIik7XHJcbiAgICBpbml0KCk7XHJcbn0pO1xyXG5cclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwicmVzdGFydFwiLCBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5oaWRlR2FtZU92ZXIoKTtcclxuICAgIHJlc2V0KCk7XHJcbn0pO1xyXG5cclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwic291bmRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmIChjb3JlLmhhc0NsYXNzKFwic291bmRcIiwgXCJzb3VuZC1vblwiKSkge1xyXG4gICAgICAgIGNvcmUucmVtb3ZlQ2xhc3MoXCJzb3VuZFwiLCBcInNvdW5kLW9uXCIpO1xyXG4gICAgICAgIGNvcmUuYWRkQ2xhc3MoXCJzb3VuZFwiLCBcInNvdW5kLW9mZlwiKTtcclxuICAgICAgICBwbGF5U291bmQgPSBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29yZS5yZW1vdmVDbGFzcyhcInNvdW5kXCIsIFwic291bmQtb2ZmXCIpO1xyXG4gICAgICAgIGNvcmUuYWRkQ2xhc3MoXCJzb3VuZFwiLCBcInNvdW5kLW9uXCIpO1xyXG4gICAgICAgIHBsYXlTb3VuZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInBsYXlTb3VuZFwiLCBwbGF5U291bmQpO1xyXG4gICAgY29yZS5zZXRTb3VuZE11dGVkKCFwbGF5U291bmQpO1xyXG59LCB0cnVlKTtcclxuXHJcbmNvcmUub25CdXR0b25DbGljayhcImNyZWRpdHNcIiwgY3JlZGl0c01lbnUpO1xyXG5jb3JlLm9uQnV0dG9uQ2xpY2soXCJiYWNrRnJvbUNyZWRpdHNcIiwgYmFja0Zyb21DcmVkaXRzKTtcclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwicmVjb3Jkc1wiLCByZWNvcmRzTWVudSk7XHJcbmNvcmUub25CdXR0b25DbGljayhcImJhY2tGcm9tUmVjb3Jkc1wiLCBiYWNrRnJvbVJlY29yZHMpO1xyXG5jb3JlLm9uQnV0dG9uQ2xpY2soXCJtZW51XCIsIGJhY2tUb01lbnUpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxufTsiXX0=
