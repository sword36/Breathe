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
    bottomEnemiesSpeed: 220,
    topEnemiesSpeed: 270,
    gravity: 150,
    breatheSpeed: 350,
    forestLine: 450,
    imageSmoothingEnabled: true,
    fastBonusSpeed: 2,
    playerSpeedX: 1,
    fastBonusTime: 5
};
},{}],3:[function(require,module,exports){
var resources = require("./resources.js");
var Sprite = require("./sprite.js");
var input = require("./input.js");
var model_ = require("./model.js");
var display_ =  require("./display.js");
var config = require("./config.js");

var display = new display_.CanvasDisplay();
var model = new model_();

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

function createPlayer(pos, sprite) {
    "use strict";
    model.createPlayer(pos, sprite);
}

function createBackground(sprites) {
    "use strict";
    model.createBackground(sprites);
}

function createEnemy(pos, sprite, type) {
    "use strict";
    model.createEnemy(pos, sprite, type);
}

function createBonus(pos, sprite, type) {
    "use strict";
    model.createBonus(pos, sprite, type);
}

function getEnemies() {
    "use strict";
    return model.enemies;
}

function getBonuses() {
    "use strict";
    return model.bonuses;
}

function clearEnemies() {
    "use strict";
    model.enemies = [];
}

function clearBonuses() {
    "use strict";
    model.bonuses = [];
}

function getPlayer() {
    "use strict";
    return model.player;
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
    createPlayer: createPlayer,
    createBackground: createBackground,
    createEnemy: createEnemy,
    getEnemies: getEnemies,
    clearEnemies: clearEnemies,
    createBonus: createBonus,
    getBonuses: getBonuses,
    clearBonuses: clearBonuses,
    getPlayer: getPlayer,
    background: model.background,
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
var model_ = require("./model.js");
var model = new model_();

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
    this.pause = document.querySelector(".pause");
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

var bg = model.background;
function moveBgSprite(index) {
    "use strict";
    this.cx.save();
    this.cx.translate(bg.positions[index], 0);
    bg.sprites[index].render(this.cx);
    this.cx.restore();
}
CanvasDisplay.prototype.renderBackground = function() {  //WTF?!
    "use strict";
    var move = moveBgSprite.bind(this);
    move(bg.currentSprite);
    if (!bg.isOneTexture) {
        move(bg.nextSprite);
    }
};

CanvasDisplay.prototype.renderEnemies = function() {
    "use strict";
    for (var i = 0; i < model.enemies.length; i++) {
        if (model.enemies[i].pos[0] <= config.width) {
            this._render(model.enemies[i]);
        }
    }
};

CanvasDisplay.prototype.renderBonuses = function() {
    "use strict";
    for (var i = 0; i < model.bonuses.length; i++) {
        if (model.bonuses[i].pos[0] <= config.width) {
            this._render(model.bonuses[i]);
        }
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
    this.renderBonuses();
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
var config = require("./config.js");

function Player() {
    "use strict";
    this.pos = [0, 0];
    this.sprite = null;
    this.speed = {x: 1, y: 0};
    this.activeBonusesTime = {
        fast: 0
    };
    this.activeBonuses = {
        fast: null
    };
}

function Enemy(pos, sprite, speed) {
    "use strict";
    if (pos === undefined)
        this.pos = 0;
    else
        this.pos = pos;
    if (sprite === undefined)
        this.sprite = null;
    else
        this.sprite = sprite;
    if (speed === undefined)
        this.speed = 0;
    else
        this.speed = speed;
}

function Active(enable, disable) {
    "use strict";
    this.enable = enable;
    this.disable = disable;
}

function Bonus(pos, sprite, type) {
    "use strict";
    this.speed = config.backgroundSpeed;

    if (pos === undefined)
        this.pos = 0;
    else
        this.pos = pos;
    if (sprite === undefined)
        this.sprite = null;
    else
        this.sprite = sprite;
    if (type === undefined)
        this.type = null;
    else
        this.type = type;

    this.oldValue = null;
    this.time = 0;

    function fastBonusEnable(player) {
        player.activeBonusesTime.fast += this.time;
    }
    function fastBonusDisable(player) {
        player.activeBonusesTime.fast = 0;
    }

    switch (this.type) {
        case "fast":
            this.time = config.fastBonusTime;
            this.active = new Active(
                fastBonusEnable.bind(this),
                fastBonusDisable.bind(this)
            );
    }
}

function Background() {
    "use strict";
    this.positions = [];
    this.sprites = [];
    this.currentSprite = 0;
    this.nextSprite = 1;
    this.speed = config.backgroundSpeed;
    this.isOneTextur = true;
}

function Model() { //pattern singleton
    "use strict";
    if (Model.cache)
        return Model.cache;
    else {
        this.player = new Player();
        this.background = new Background();
        this.bonuses = [];
        this.enemies = [];
        Model.cache = this;
    }
}


/**
 * Should be call once
 * @param pos
 * @param sprite
 * @returns player
 */
Model.prototype.createPlayer = function createPlayer(pos, sprite) {
    "use strict";
    this.player.pos = pos || [0, 0];
    if (this.player.sprite == null)
        this.player.sprite = sprite;
    this.player.speed = {x: 1, y: 0};
    this.activeBonusesTime = {
        fast: 0
    };
    this.activeBonuses = {
        fast: null
    };
};

/**
 * Should be call once
 * @param sprites
 * @returns background
 */
Model.prototype.createBackground = function createBackground(sprites) { //2 min
    "use strict";
    this.background.positions = [];
    this.background.sprites = sprites;
    this.background.currentSprite = 0;
    this.background.nextSprite = 1;
    this.background.spritesLength = sprites.length;
    this.background.isOneTexture = true;
    for (var i = 0; i < sprites.length; i++) {
        if (i === 0) {
            this.background.positions[0] = 0;
        } else {
            this.background.positions[i] = config.width;
        }
    }
};
/**
 * Add enemy to enemies
 * @param pos
 * @param sprite
 */
Model.prototype.createEnemy = function createEnemy(pos, sprite, type) {
    "use strict";
    var s;
    switch (type) {
        case "bottom":
            s = config.bottomEnemiesSpeed;
            break;
        case "top":
            s = config.topEnemiesSpeed;
            break;
        default:
            throw new Error("Wrong type of enemie");
    }

    this.enemies.push(new Enemy(pos, sprite, s));
};
/**
 * Add bonus to bonuses
 * @param pos
 * @param sprite
 * @param {string} type Can be: speed, slow, small, big
 */
Model.prototype.createBonus = function createBonus(pos, sprite, type) {
    "use strict";
    this.bonuses.push(new Bonus(pos, sprite, type));
};

Model.cache = null;

module.exports = Model;
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
        audio.preload = "auto";function fastBonusEnable(player) {

        }
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
    isPaused,
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

    var playerSprite = core.createSprite("img/rect.jpg", [0, 0], [100, 100], 0, [0]);
    core.createPlayer(
        [viewport.width / 2, 50],
        playerSprite
    );

    var bgSprite1 = core.createSprite("img/black.jpg", [0, 0], [viewport.width * 3, viewport.height], 0);
    core.createBackground(
        [bgSprite1, bgSprite1]
    );

    core.clearEnemies();
    core.clearBonuses();
    core.createEnemy(
        [1000, 450],
        playerSprite,
        "bottom"
    );
    core.createEnemy(
        [2000, 100],
        playerSprite,
        "top"
    );

    core.createBonus(
        [1500, 300],
        playerSprite,
        "fast"
    )
}

var scoreEl = document.querySelector("#score");

function gameOver() {
    "use strict";
    isGameOver = true;
    core.renderGameOver();
    scoreEl.innerHTML = score;
}


var bg = core.background;

function updateBackground(dt) {
    "use strict";

    var cur = bg.currentSprite,
            next = bg.nextSprite;
    var newBgPos = bg.positions[cur] - bg.speed * dt,
        newRightCorner = newBgPos + bg.sprites[cur].size[0];

    if (newRightCorner < config.width) {
        if (bg.isOneTexture) {
            bg.isOneTexture = false;
        }
        if (newRightCorner > 0) {
            bg.positions[cur] = newBgPos;
            bg.positions[next] = bg.positions[next] - bg.speed * dt;
        } else {
            bg.positions[cur] = config.width;
            cur = bg.currentSprite = next;
            next = bg.nextSprite = (cur + 1) % bg.spritesLength;
            bg.positions[cur] = bg.positions[cur] - bg.speed * dt;
            if (bg.sprites[cur].size[0] <= config.width) {   //if texture's size equal window width
                bg.positions[next] = bg.positions[next] - bg.speed * dt;
            } else {
                bg.isOneTexture = true;
            }
        }
    } else {
        bg.positions[cur] = newBgPos;
    }
}

function checkColisions(pos) {
    "use strict";
    var collision = [],
        size = core.getPlayer().sprite.size,
        i,
        enemies = core.getEnemies(),
        bonuses = core.getBonuses();

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

function fastAll() {
    "use strict";
    var xSpeed = config.fastBonusSpeed;
    var i;
    var enemies = core.getEnemies();
    var bonuses = core.getBonuses();
    core.background.speed *= xSpeed;
    for (i = 0; i < enemies.length; i++) {
        enemies[i].speed *= xSpeed;
    }
    for (i = 0; i < bonuses.length; i++) {
        bonuses[i].speed *= xSpeed;
    }
}

function slowAll() {
    "use strict";
    var xSpeed = config.fastBonusSpeed;
    var i;
    var enemies = core.getEnemies();
    var bonuses = core.getBonuses();
    core.background.speed /= xSpeed;
    for (i = 0; i < enemies.length; i++) {
        enemies[i].speed /= xSpeed;
    }
    for (i = 0; i < bonuses.length; i++) {
        bonuses[i].speed /= xSpeed;
    }
}

function initBonus(bonus) {
    "use strict";
    switch (bonus.type) {
        case "fast":
            fastAll();
    }
}

function undoBonus(bonus) {
    "use strict";
    switch (bonus.type) {
        case "fast":
            slowAll();
    }
}

function deleteBonus(bonus) {
    "use strict";
    var bonuses = core.getBonuses();
    var i = 0;
    for (i = 0; i < bonuses.length; i++) {
        if (bonuses[i] == bonus) {
            bonuses.splice(i, 1);
            return;
        }
    }
}
function collidePlayer(pos) {
    "use strict";
    var player = core.getPlayer();
    var collision = checkColisions(pos),
        i = 0;
    if (collision.length === 0)
        return true;
    for (i = 0; i < collision.length; i++) {
        switch (collision[i].type) {
            case "top":
                player.speed.y = 0;
                player.pos[1] = 0;
                break;
            case "forest":
                gameOver();
                return true;
            case "enemy":
                gameOver();
                break;
            case "bonus":
                collision[i].target.active.enable(player);
                if (collision[i].target.type in player.activeBonuses) {
                    player.activeBonuses[collision[i].target.type] = collision[i].target;
                }
                initBonus(collision[i].target);
                deleteBonus(collision[i].target);
                return true;
            default: return true;
        }
    }
    return false;
}

function updatePlayer(dt) {
    "use strict";
    var i,
        player = core.getPlayer(),
        activeBonusesTime = player.activeBonusesTime,
        activeBonuses = player.activeBonuses;
    player.sprite.update(dt);
    player.speed.y += config.gravity * dt;
    if (pressed['up']) {
        player.speed.y -= config.breatheSpeed * dt;
    }
    var motion = player.speed.y * dt;
    var newPos = [player.pos[0], player.pos[1] + motion];
    if (collidePlayer(newPos)) { //move or not to move
        player.pos = newPos;
    }
    for (i in activeBonuses) {
        if (activeBonuses.hasOwnProperty(i) && activeBonuses[i] !== null) {
            activeBonusesTime[i] -= dt;
            if (activeBonusesTime[i] < 0) {
                player.activeBonuses[i].active.disable(player);
                undoBonus(player.activeBonuses[i]);
                player.activeBonuses[i] = null;
            }
        }
    }
}

function updateEnemies(dt) {
    "use strict";
    var enemies = core.getEnemies(),
        i,
        motion;
    for (i = 0; i < enemies.length; i++) {
        enemies[i].sprite.update(dt);
        motion = enemies[i].speed * dt;
        enemies[i].pos = [enemies[i].pos[0] - motion, enemies[i].pos[1]];
    }
}

function updateBonuses(dt) {
    "use strict";
    var bonuses = core.getBonuses(),
        i,
        motion;
    for (i = 0; i < bonuses.length; i++) {
        bonuses[i].sprite.update(dt);
        motion = bonuses[i].speed * dt;
        bonuses[i].pos = [bonuses[i].pos[0] - motion, bonuses[i].pos[1]];
    }
}

function update(dt) {
    "use strict";
    if (!isGameOver) {
        updateEnemies(dt);
        updateBackground(dt);
        updatePlayer(dt);
        updateBonuses(dt);
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
    if (!isPaused) {
        requestAnimationFrame(main);
    }
}

function init() {
    "use strict";
    pressed = core.getInput(window, "keyboard");
    reset();
    lastTime = Date.now();
    core.showElement("pause");
    main();

    /*function hadnler() {
        "use strict";
        console.log((new Date).getSeconds());
        console.log("cur: " + bg.currentSprite + " - pos: " + bg.positions[bg.currentSprite]);
        console.log("next: " + bg.nextSprite + " - pos: " + bg.positions[bg.nextSprite]);
    }
    window.setInterval(hadnler, 1000);*/
}

core.loadImages([
    "img/black.jpg",
    "img/rect.jpg"
]);

core.loadAudios([
    "audio/Lordi.mp3"
]);

function pauseGame() {
    "use strict";
    isPaused = true;
}

function unPauseGame() {
    "use strict";
    isPaused = false;
    lastTime = Date.now();
    main();
}

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
    core.hideElement("pause");
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

core.onButtonClick("pause", function() {
    "use strict";
    if (core.hasClass("pause", "pause-on")) {
        core.removeClass("pause", "pause-on");
        core.addClass("pause", "pause-off");
        unPauseGame();
    } else {
        core.removeClass("pause", "pause-off");
        core.addClass("pause", "pause-on");
        pauseGame();
    }
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXVkaW8uanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2NvcmUuanMiLCJzcmMvanMvZGlzcGxheS5qcyIsInNyYy9qcy9nYW1lLmpzIiwic3JjL2pzL2lucHV0LmpzIiwic3JjL2pzL21vZGVsLmpzIiwic3JjL2pzL3B1Ymxpc2hlci5qcyIsInNyYy9qcy9yZXNvdXJjZXMuanMiLCJzcmMvanMvc3ByaXRlLmpzIiwic3JjL2pzL3dvcmxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBtb2R1bGVzIGFyZSBkZWZpbmVkIGFzIGFuIGFycmF5XHJcbi8vIFsgbW9kdWxlIGZ1bmN0aW9uLCBtYXAgb2YgcmVxdWlyZXVpcmVzIF1cclxuLy9cclxuLy8gbWFwIG9mIHJlcXVpcmV1aXJlcyBpcyBzaG9ydCByZXF1aXJlIG5hbWUgLT4gbnVtZXJpYyByZXF1aXJlXHJcbi8vXHJcbi8vIGFueXRoaW5nIGRlZmluZWQgaW4gYSBwcmV2aW91cyBidW5kbGUgaXMgYWNjZXNzZWQgdmlhIHRoZVxyXG4vLyBvcmlnIG1ldGhvZCB3aGljaCBpcyB0aGUgcmVxdWlyZXVpcmUgZm9yIHByZXZpb3VzIGJ1bmRsZXNcclxuXHJcbihmdW5jdGlvbiBvdXRlciAobW9kdWxlcywgY2FjaGUsIGVudHJ5KSB7XHJcbiAgICAvLyBTYXZlIHRoZSByZXF1aXJlIGZyb20gcHJldmlvdXMgYnVuZGxlIHRvIHRoaXMgY2xvc3VyZSBpZiBhbnlcclxuICAgIHZhciBwcmV2aW91c1JlcXVpcmUgPSB0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZTtcclxuXHJcbiAgICBmdW5jdGlvbiBuZXdSZXF1aXJlKG5hbWUsIGp1bXBlZCl7XHJcbiAgICAgICAgaWYoIWNhY2hlW25hbWVdKSB7XHJcbiAgICAgICAgICAgIGlmKCFtb2R1bGVzW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSBjYW5ub3QgZmluZCB0aGUgdGhlIG1vZHVsZSB3aXRoaW4gb3VyIGludGVybmFsIG1hcCBvclxyXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUganVtcCB0byB0aGUgY3VycmVudCBnbG9iYWwgcmVxdWlyZSBpZS4gdGhlIGxhc3QgYnVuZGxlXHJcbiAgICAgICAgICAgICAgICAvLyB0aGF0IHdhcyBhZGRlZCB0byB0aGUgcGFnZS5cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50UmVxdWlyZSA9IHR5cGVvZiByZXF1aXJlID09IFwiZnVuY3Rpb25cIiAmJiByZXF1aXJlO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFqdW1wZWQgJiYgY3VycmVudFJlcXVpcmUpIHJldHVybiBjdXJyZW50UmVxdWlyZShuYW1lLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgb3RoZXIgYnVuZGxlcyBvbiB0aGlzIHBhZ2UgdGhlIHJlcXVpcmUgZnJvbSB0aGVcclxuICAgICAgICAgICAgICAgIC8vIHByZXZpb3VzIG9uZSBpcyBzYXZlZCB0byAncHJldmlvdXNSZXF1aXJlJy4gUmVwZWF0IHRoaXMgYXNcclxuICAgICAgICAgICAgICAgIC8vIG1hbnkgdGltZXMgYXMgdGhlcmUgYXJlIGJ1bmRsZXMgdW50aWwgdGhlIG1vZHVsZSBpcyBmb3VuZCBvclxyXG4gICAgICAgICAgICAgICAgLy8gd2UgZXhoYXVzdCB0aGUgcmVxdWlyZSBjaGFpbi5cclxuICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c1JlcXVpcmUpIHJldHVybiBwcmV2aW91c1JlcXVpcmUobmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIG1vZHVsZSBcXCcnICsgbmFtZSArICdcXCcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbSA9IGNhY2hlW25hbWVdID0ge2V4cG9ydHM6e319O1xyXG4gICAgICAgICAgICBtb2R1bGVzW25hbWVdWzBdLmNhbGwobS5leHBvcnRzLCBmdW5jdGlvbih4KXtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IG1vZHVsZXNbbmFtZV1bMV1beF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3UmVxdWlyZShpZCA/IGlkIDogeCk7XHJcbiAgICAgICAgICAgIH0sbSxtLmV4cG9ydHMsb3V0ZXIsbW9kdWxlcyxjYWNoZSxlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYWNoZVtuYW1lXS5leHBvcnRzO1xyXG4gICAgfVxyXG4gICAgZm9yKHZhciBpPTA7aTxlbnRyeS5sZW5ndGg7aSsrKSBuZXdSZXF1aXJlKGVudHJ5W2ldKTtcclxuXHJcbiAgICAvLyBPdmVycmlkZSB0aGUgY3VycmVudCByZXF1aXJlIHdpdGggdGhpcyBuZXcgb25lXHJcbiAgICByZXR1cm4gbmV3UmVxdWlyZTtcclxufSkiLCIvKipcclxuICogQ3JlYXRlZCBieSBVU0VSIG9uIDEwLjA3LjIwMTUuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbn07IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgVVNFUiBvbiAxMC4wNy4yMDE1LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB3aWR0aDogMTAyNCxcclxuICAgIGhlaWdodDogNjAwLFxyXG4gICAgaW5wdXRUeXBlOiBcImtleWJvYXJkXCIsXHJcbiAgICBiYWNrZ3JvdW5kU3BlZWQ6IDE1MCxcclxuICAgIGJvdHRvbUVuZW1pZXNTcGVlZDogMjIwLFxyXG4gICAgdG9wRW5lbWllc1NwZWVkOiAyNzAsXHJcbiAgICBncmF2aXR5OiAxNTAsXHJcbiAgICBicmVhdGhlU3BlZWQ6IDM1MCxcclxuICAgIGZvcmVzdExpbmU6IDQ1MCxcclxuICAgIGltYWdlU21vb3RoaW5nRW5hYmxlZDogdHJ1ZSxcclxuICAgIGZhc3RCb251c1NwZWVkOiAyLFxyXG4gICAgcGxheWVyU3BlZWRYOiAxLFxyXG4gICAgZmFzdEJvbnVzVGltZTogNVxyXG59OyIsInZhciByZXNvdXJjZXMgPSByZXF1aXJlKFwiLi9yZXNvdXJjZXMuanNcIik7XHJcbnZhciBTcHJpdGUgPSByZXF1aXJlKFwiLi9zcHJpdGUuanNcIik7XHJcbnZhciBpbnB1dCA9IHJlcXVpcmUoXCIuL2lucHV0LmpzXCIpO1xyXG52YXIgbW9kZWxfID0gcmVxdWlyZShcIi4vbW9kZWwuanNcIik7XHJcbnZhciBkaXNwbGF5XyA9ICByZXF1aXJlKFwiLi9kaXNwbGF5LmpzXCIpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnLmpzXCIpO1xyXG5cclxudmFyIGRpc3BsYXkgPSBuZXcgZGlzcGxheV8uQ2FudmFzRGlzcGxheSgpO1xyXG52YXIgbW9kZWwgPSBuZXcgbW9kZWxfKCk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTcHJpdGUodXJsLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICByZXR1cm4gbmV3IFNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Vmlld3BvcnQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgd2lkdGg6IGNvbmZpZy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IGNvbmZpZy5oZWlnaHRcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW5kZXIoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJEaXNwbGF5KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LmNsZWFyRGlzcGxheSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJHYW1lT3ZlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW5kZXJHYW1lT3ZlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlR2FtZU92ZXIoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuaGlkZUdhbWVPdmVyKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFNjb3JlKHNjb3JlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuc2V0U2NvcmUoc2NvcmUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93RWxlbWVudChlbCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnNob3dFbGVtZW50KGVsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZUVsZW1lbnQoZWwpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5oaWRlRWxlbWVudChlbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFByb2dyZXNzKHZhbHVlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuc2V0UHJvZ3Jlc3ModmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaG9vc2VNZW51KG1lbnVDYXNlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuY2hvb3NlTWVudShtZW51Q2FzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuQ2hvb3NlTWVudShtZW51Q2FzZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnVuQ2hvb3NlTWVudShtZW51Q2FzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uQnV0dG9uQ2xpY2soYnV0dG9uTmFtZSwgaGFuZGxlciwgbm90QnV0dG9uKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkub25CdXR0b25DbGljayhidXR0b25OYW1lLCBoYW5kbGVyLCBub3RCdXR0b24pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRDbGFzcyhlbCwgdmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5hZGRDbGFzcyhlbCwgdmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbCwgdmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW1vdmVDbGFzcyhlbCwgdmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYXNDbGFzcyhlbCwgdmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIGRpc3BsYXkuaGFzQ2xhc3MoZWwsIHZhbHVlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U291bmRNdXRlZCh2YWx1ZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaSBpbiByZXNvdXJjZXMuYXVkaW9zKSB7XHJcbiAgICAgICAgaWYgKHJlc291cmNlcy5hdWRpb3MuaGFzT3duUHJvcGVydHkoaSkpIHtcclxuICAgICAgICAgICAgcmVzb3VyY2VzLmF1ZGlvc1tpXS5tdXRlZCA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUGxheWVyKHBvcywgc3ByaXRlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIG1vZGVsLmNyZWF0ZVBsYXllcihwb3MsIHNwcml0ZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUJhY2tncm91bmQoc3ByaXRlcykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBtb2RlbC5jcmVhdGVCYWNrZ3JvdW5kKHNwcml0ZXMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFbmVteShwb3MsIHNwcml0ZSwgdHlwZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBtb2RlbC5jcmVhdGVFbmVteShwb3MsIHNwcml0ZSwgdHlwZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUJvbnVzKHBvcywgc3ByaXRlLCB0eXBlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIG1vZGVsLmNyZWF0ZUJvbnVzKHBvcywgc3ByaXRlLCB0eXBlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RW5lbWllcygpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIG1vZGVsLmVuZW1pZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEJvbnVzZXMoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiBtb2RlbC5ib251c2VzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhckVuZW1pZXMoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIG1vZGVsLmVuZW1pZXMgPSBbXTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJCb251c2VzKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBtb2RlbC5ib251c2VzID0gW107XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBsYXllcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIG1vZGVsLnBsYXllcjtcclxufVxyXG5cclxucmVzb3VyY2VzLm9uKFwibG9hZGluZ0NoYW5nZVwiLCBzZXRQcm9ncmVzcyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGxvYWRJbWFnZXM6IHJlc291cmNlcy5sb2FkSW1hZ2VzLFxyXG4gICAgbG9hZEF1ZGlvczogcmVzb3VyY2VzLmxvYWRBdWRpb3MsXHJcbiAgICBnZXRJbWc6IHJlc291cmNlcy5nZXRJbWcsXHJcbiAgICBnZXRBdWRpbzogcmVzb3VyY2VzLmdldEF1ZGlvLFxyXG4gICAgb25SZXNvdXJjZXNSZWFkeTogcmVzb3VyY2VzLm9uUmVhZHksXHJcbiAgICBjcmVhdGVTcHJpdGU6IGNyZWF0ZVNwcml0ZSxcclxuICAgIGdldElucHV0OiBpbnB1dCxcclxuICAgIGNyZWF0ZVBsYXllcjogY3JlYXRlUGxheWVyLFxyXG4gICAgY3JlYXRlQmFja2dyb3VuZDogY3JlYXRlQmFja2dyb3VuZCxcclxuICAgIGNyZWF0ZUVuZW15OiBjcmVhdGVFbmVteSxcclxuICAgIGdldEVuZW1pZXM6IGdldEVuZW1pZXMsXHJcbiAgICBjbGVhckVuZW1pZXM6IGNsZWFyRW5lbWllcyxcclxuICAgIGNyZWF0ZUJvbnVzOiBjcmVhdGVCb251cyxcclxuICAgIGdldEJvbnVzZXM6IGdldEJvbnVzZXMsXHJcbiAgICBjbGVhckJvbnVzZXM6IGNsZWFyQm9udXNlcyxcclxuICAgIGdldFBsYXllcjogZ2V0UGxheWVyLFxyXG4gICAgYmFja2dyb3VuZDogbW9kZWwuYmFja2dyb3VuZCxcclxuICAgIGJvbnVzZXM6IG1vZGVsLmJvbnVzZXMsXHJcbiAgICByZW5kZXI6IHJlbmRlcixcclxuICAgIGNsZWFyUmVuZGVyOiBjbGVhckRpc3BsYXksXHJcbiAgICByZW5kZXJHYW1lT3ZlcjogcmVuZGVyR2FtZU92ZXIsXHJcbiAgICBoaWRlR2FtZU92ZXI6IGhpZGVHYW1lT3ZlcixcclxuICAgIHNldFNjb3JlOiBzZXRTY29yZSxcclxuICAgIHNob3dFbGVtZW50OiBzaG93RWxlbWVudCxcclxuICAgIGhpZGVFbGVtZW50OiBoaWRlRWxlbWVudCxcclxuICAgIGdldFZpZXdwb3J0OiBnZXRWaWV3cG9ydCxcclxuICAgIGNob29zZU1lbnU6IGNob29zZU1lbnUsXHJcbiAgICB1bkNob29zZU1lbnU6IHVuQ2hvb3NlTWVudSxcclxuICAgIG9uQnV0dG9uQ2xpY2s6IG9uQnV0dG9uQ2xpY2ssXHJcbiAgICBhZGRDbGFzczogYWRkQ2xhc3MsXHJcbiAgICByZW1vdmVDbGFzczogcmVtb3ZlQ2xhc3MsXHJcbiAgICBoYXNDbGFzczogaGFzQ2xhc3MsXHJcbiAgICBzZXRTb3VuZE11dGVkOiBzZXRTb3VuZE11dGVkXHJcbn07XHJcblxyXG4iLCJ2YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnLmpzXCIpO1xyXG4vL3ZhciBjb3JlID0gcmVxdWlyZShcIi4vY29yZS5qc1wiKTsgLy9jaXJjdWxhciBsaW5rXHJcbnZhciBtb2RlbF8gPSByZXF1aXJlKFwiLi9tb2RlbC5qc1wiKTtcclxudmFyIG1vZGVsID0gbmV3IG1vZGVsXygpO1xyXG5cclxuZnVuY3Rpb24gZmxpcEhvcml6b250YWxseShjb250ZXh0LCBhcm91bmQpIHtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKGFyb3VuZCwgMCk7XHJcbiAgICBjb250ZXh0LnNjYWxlKC0xLCAxKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC1hcm91bmQsIDApO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHNlZSBkaXNwbGF5XHJcbiAqL1xyXG5mdW5jdGlvbiBDYW52YXNEaXNwbGF5KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2FudmFzXCIpO1xyXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSBjb25maWcud2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xyXG4gICAgdGhpcy5zY29yZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZVwiKTtcclxuICAgIHRoaXMuY3ggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgdGhpcy5tZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW51XCIpO1xyXG4gICAgdGhpcy5tYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluXCIpO1xyXG4gICAgdGhpcy5wbGF5QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5XCIpO1xyXG4gICAgdGhpcy5yZWNvcmRzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZWNvcmRzXCIpO1xyXG4gICAgdGhpcy5jcmVkaXRzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jcmVkaXRzXCIpO1xyXG4gICAgdGhpcy5xdWl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5xdWl0XCIpO1xyXG4gICAgdGhpcy5tZW51QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51XCIpO1xyXG4gICAgdGhpcy5yZXN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXN0YXJ0XCIpO1xyXG4gICAgdGhpcy5iYWNrRnJvbVJlY29yZHNCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JlY29yZHMgLmJhY2tcIik7XHJcbiAgICB0aGlzLmJhY2tGcm9tQ3JlZGl0c0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY3JlZGl0cyAuYmFja1wiKTtcclxuICAgIHRoaXMuY3JlZGl0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY3JlZGl0c1wiKTtcclxuICAgIHRoaXMucmVjb3JkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVjb3Jkc1wiKTtcclxuICAgIHRoaXMuZ2FtZV9vdmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lLW92ZXJcIik7XHJcbiAgICB0aGlzLmdhbWVfb3Zlcl9vdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lLW92ZXItb3ZlcmxheVwiKTtcclxuICAgIHRoaXMucHJvZ3Jlc3NfYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9ncmVzcy1iYXJcIik7XHJcbiAgICB0aGlzLnByb2dyZXNzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9ncmVzc1wiKTtcclxuICAgIHRoaXMucCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcFwiKTtcclxuICAgIHRoaXMuc291bmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNvdW5kXCIpO1xyXG4gICAgdGhpcy5wYXVzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGF1c2VcIik7XHJcbn1cclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY2FudmFzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5jYW52YXMpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuY2xlYXJEaXNwbGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY3guZmlsbFN0eWxlID0gXCJyZ2IoNTIsIDE2NiwgMjUxKVwiO1xyXG4gICAgdGhpcy5jeC5maWxsUmVjdCgwLCAwLCBjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uKGVuZW15KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY3guc2F2ZSgpO1xyXG4gICAgdGhpcy5jeC50cmFuc2xhdGUoZW5lbXkucG9zWzBdLCBlbmVteS5wb3NbMV0pO1xyXG4gICAgZW5lbXkuc3ByaXRlLnJlbmRlcih0aGlzLmN4KTtcclxuICAgIHRoaXMuY3gucmVzdG9yZSgpO1xyXG59O1xyXG5cclxudmFyIGJnID0gbW9kZWwuYmFja2dyb3VuZDtcclxuZnVuY3Rpb24gbW92ZUJnU3ByaXRlKGluZGV4KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY3guc2F2ZSgpO1xyXG4gICAgdGhpcy5jeC50cmFuc2xhdGUoYmcucG9zaXRpb25zW2luZGV4XSwgMCk7XHJcbiAgICBiZy5zcHJpdGVzW2luZGV4XS5yZW5kZXIodGhpcy5jeCk7XHJcbiAgICB0aGlzLmN4LnJlc3RvcmUoKTtcclxufVxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJCYWNrZ3JvdW5kID0gZnVuY3Rpb24oKSB7ICAvL1dURj8hXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBtb3ZlID0gbW92ZUJnU3ByaXRlLmJpbmQodGhpcyk7XHJcbiAgICBtb3ZlKGJnLmN1cnJlbnRTcHJpdGUpO1xyXG4gICAgaWYgKCFiZy5pc09uZVRleHR1cmUpIHtcclxuICAgICAgICBtb3ZlKGJnLm5leHRTcHJpdGUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyRW5lbWllcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGVsLmVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobW9kZWwuZW5lbWllc1tpXS5wb3NbMF0gPD0gY29uZmlnLndpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlcihtb2RlbC5lbmVtaWVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJCb251c2VzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9kZWwuYm9udXNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChtb2RlbC5ib251c2VzW2ldLnBvc1swXSA8PSBjb25maWcud2lkdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKG1vZGVsLmJvbnVzZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlclBsYXllciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLl9yZW5kZXIobW9kZWwucGxheWVyKTtcclxufTtcclxuLyoqXHJcbiAqIENsZWFyIHJlbmRlciwgcmVuZGVyIGJhY2tncm91bmQsIHJlbmRlciBlbmVtaWVzLCByZW5kZXIgcGxheWVyXHJcbiAqL1xyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jbGVhckRpc3BsYXkoKTtcclxuICAgIHRoaXMucmVuZGVyQmFja2dyb3VuZCgpO1xyXG4gICAgdGhpcy5yZW5kZXJFbmVtaWVzKCk7XHJcbiAgICB0aGlzLnJlbmRlckJvbnVzZXMoKTtcclxuICAgIHRoaXMucmVuZGVyUGxheWVyKCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5zaG93RWxlbWVudCA9IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmIChlbCBpbiB0aGlzKVxyXG4gICAgICAgIHRoaXNbZWxdLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG59O1xyXG5cclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmhpZGVFbGVtZW50ID0gZnVuY3Rpb24oZWwpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaWYgKGVsIGluIHRoaXMpXHJcbiAgICAgICAgdGhpc1tlbF0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlckdhbWVPdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNob3dFbGVtZW50KFwiZ2FtZV9vdmVyXCIpO1xyXG4gICAgdGhpcy5zaG93RWxlbWVudChcImdhbWVfb3Zlcl9vdmVybGF5XCIpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuaGlkZUdhbWVPdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuaGlkZUVsZW1lbnQoXCJnYW1lX292ZXJcIik7XHJcbiAgICB0aGlzLmhpZGVFbGVtZW50KFwiZ2FtZV9vdmVyX292ZXJsYXlcIik7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5zZXRTY29yZSA9IGZ1bmN0aW9uKHNjb3JlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuc2NvcmVFbC5pbm5lckhUTUwgPSBzY29yZS50b1N0cmluZygpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuc2V0UHJvZ3Jlc3MgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLnByb2dyZXNzX2Jhci52YWx1ZSA9IHZhbHVlO1xyXG4gICAgdGhpcy5wLmlubmVySFRNTCA9IHZhbHVlICsgXCIlXCI7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5jaG9vc2VNZW51ID0gZnVuY3Rpb24obWVudUNhc2UpIHtcclxuICAgIHRoaXMubWVudS5jbGFzc0xpc3QuYWRkKG1lbnVDYXNlKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnVuQ2hvb3NlTWVudSA9IGZ1bmN0aW9uKG1lbnVDYXNlKSB7XHJcbiAgICB0aGlzLm1lbnUuY2xhc3NMaXN0LnJlbW92ZShtZW51Q2FzZSk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5vbkJ1dHRvbkNsaWNrID0gZnVuY3Rpb24oYnV0dG9uTmFtZSwgaGFuZGxlciwgbm90QnV0dG9uKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmICghbm90QnV0dG9uKVxyXG4gICAgICAgIGJ1dHRvbk5hbWUgKz0gXCJCdXR0b25cIjtcclxuICAgIGlmIChidXR0b25OYW1lIGluIHRoaXMpIHtcclxuICAgICAgICB0aGlzW2J1dHRvbk5hbWVdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmIChlbCBpbiB0aGlzKSB7XHJcbiAgICAgICAgdGhpc1tlbF0uY2xhc3NMaXN0LmFkZCh2YWx1ZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpZiAoZWwgaW4gdGhpcykge1xyXG4gICAgICAgIHRoaXNbZWxdLmNsYXNzTGlzdC5yZW1vdmUodmFsdWUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaWYgKGVsIGluIHRoaXMpIHtcclxuICAgICAgICByZXR1cm4gdGhpc1tlbF0uY2xhc3NMaXN0LmNvbnRhaW5zKHZhbHVlKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgQ2FudmFzRGlzcGxheTogQ2FudmFzRGlzcGxheVxyXG59OyIsInZhciB3b3JsZCA9IHJlcXVpcmUoXCIuL3dvcmxkLmpzXCIpKCk7IiwiLyoqXHJcbiAqIEBwYXJhbSB3aW5kb3cgR2xvYmFsIG9iamVjdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBDYW4gYmU6a2V5Ym9hcmQsIG1lZGljaW5lLCBzbWFydHBob25lXHJcbiAqIEByZXR1cm5zIE9iamVjdCB3aGljaCBjb250ZW50IGluZm8gYWJvdXQgcHJlc3NlZCBidXR0b25zXHJcbiAqIEBzZWUgZ2V0SW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIGlucHV0KHdpbmRvd18sIHR5cGUpIHsgICAgLy90eXBlIC0ga2V5Ym9hcmQsIG1lZGljaW5lLCBzbWFydHBob25lXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBwcmVzc2VkID0gbnVsbDtcclxuICAgIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuICAgICAgICBpZiAoY29kZXMuaGFzT3duUHJvcGVydHkoZXZlbnQua2V5Q29kZSkpIHtcclxuICAgICAgICAgICAgdmFyIGRvd24gPSBldmVudC50eXBlID09PSBcImtleWRvd25cIjtcclxuICAgICAgICAgICAgcHJlc3NlZFtjb2Rlc1tldmVudC5rZXlDb2RlXV0gPSBkb3duO1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhckFsbCgpIHtcclxuICAgICAgICBmb3IgKHZhciBjIGluIHByZXNzZWQpIHtcclxuICAgICAgICAgICAgaWYgKHByZXNzZWQuaGFzT3duUHJvcGVydHkoYykpXHJcbiAgICAgICAgICAgICAgICBwcmVzc2VkW2NdID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJlc3NlZCkge1xyXG4gICAgICAgIHByZXNzZWQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICAgIHZhciBjb2Rlc0tleWJvYXJkID0gezM4OiBcInVwXCJ9O1xyXG4gICAgICAgIHZhciBjb2RlcztcclxuXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJrZXlib2FyZFwiOlxyXG4gICAgICAgICAgICAgICAgY29kZXMgPSBjb2Rlc0tleWJvYXJkO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Xy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvd18uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Xy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBjbGVhckFsbCgpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIHR5cGUgb2YgaW5wdXRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByZXNzZWQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdXQ7IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZy5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIFBsYXllcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5wb3MgPSBbMCwgMF07XHJcbiAgICB0aGlzLnNwcml0ZSA9IG51bGw7XHJcbiAgICB0aGlzLnNwZWVkID0ge3g6IDEsIHk6IDB9O1xyXG4gICAgdGhpcy5hY3RpdmVCb251c2VzVGltZSA9IHtcclxuICAgICAgICBmYXN0OiAwXHJcbiAgICB9O1xyXG4gICAgdGhpcy5hY3RpdmVCb251c2VzID0ge1xyXG4gICAgICAgIGZhc3Q6IG51bGxcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEVuZW15KHBvcywgc3ByaXRlLCBzcGVlZCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpZiAocG9zID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgdGhpcy5wb3MgPSAwO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMucG9zID0gcG9zO1xyXG4gICAgaWYgKHNwcml0ZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNwcml0ZSA9IHNwcml0ZTtcclxuICAgIGlmIChzcGVlZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHRoaXMuc3BlZWQgPSAwO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcclxufVxyXG5cclxuZnVuY3Rpb24gQWN0aXZlKGVuYWJsZSwgZGlzYWJsZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmVuYWJsZSA9IGVuYWJsZTtcclxuICAgIHRoaXMuZGlzYWJsZSA9IGRpc2FibGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEJvbnVzKHBvcywgc3ByaXRlLCB0eXBlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuc3BlZWQgPSBjb25maWcuYmFja2dyb3VuZFNwZWVkO1xyXG5cclxuICAgIGlmIChwb3MgPT09IHVuZGVmaW5lZClcclxuICAgICAgICB0aGlzLnBvcyA9IDA7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5wb3MgPSBwb3M7XHJcbiAgICBpZiAoc3ByaXRlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBudWxsO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICB0aGlzLnR5cGUgPSBudWxsO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcblxyXG4gICAgdGhpcy5vbGRWYWx1ZSA9IG51bGw7XHJcbiAgICB0aGlzLnRpbWUgPSAwO1xyXG5cclxuICAgIGZ1bmN0aW9uIGZhc3RCb251c0VuYWJsZShwbGF5ZXIpIHtcclxuICAgICAgICBwbGF5ZXIuYWN0aXZlQm9udXNlc1RpbWUuZmFzdCArPSB0aGlzLnRpbWU7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBmYXN0Qm9udXNEaXNhYmxlKHBsYXllcikge1xyXG4gICAgICAgIHBsYXllci5hY3RpdmVCb251c2VzVGltZS5mYXN0ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJmYXN0XCI6XHJcbiAgICAgICAgICAgIHRoaXMudGltZSA9IGNvbmZpZy5mYXN0Qm9udXNUaW1lO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IG5ldyBBY3RpdmUoXHJcbiAgICAgICAgICAgICAgICBmYXN0Qm9udXNFbmFibGUuYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIGZhc3RCb251c0Rpc2FibGUuYmluZCh0aGlzKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBCYWNrZ3JvdW5kKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xyXG4gICAgdGhpcy5zcHJpdGVzID0gW107XHJcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSAwO1xyXG4gICAgdGhpcy5uZXh0U3ByaXRlID0gMTtcclxuICAgIHRoaXMuc3BlZWQgPSBjb25maWcuYmFja2dyb3VuZFNwZWVkO1xyXG4gICAgdGhpcy5pc09uZVRleHR1ciA9IHRydWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIE1vZGVsKCkgeyAvL3BhdHRlcm4gc2luZ2xldG9uXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmIChNb2RlbC5jYWNoZSlcclxuICAgICAgICByZXR1cm4gTW9kZWwuY2FjaGU7XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoKTtcclxuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZCgpO1xyXG4gICAgICAgIHRoaXMuYm9udXNlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZW5lbWllcyA9IFtdO1xyXG4gICAgICAgIE1vZGVsLmNhY2hlID0gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbCBvbmNlXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKiBAcmV0dXJucyBwbGF5ZXJcclxuICovXHJcbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIgPSBmdW5jdGlvbiBjcmVhdGVQbGF5ZXIocG9zLCBzcHJpdGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5wbGF5ZXIucG9zID0gcG9zIHx8IFswLCAwXTtcclxuICAgIGlmICh0aGlzLnBsYXllci5zcHJpdGUgPT0gbnVsbClcclxuICAgICAgICB0aGlzLnBsYXllci5zcHJpdGUgPSBzcHJpdGU7XHJcbiAgICB0aGlzLnBsYXllci5zcGVlZCA9IHt4OiAxLCB5OiAwfTtcclxuICAgIHRoaXMuYWN0aXZlQm9udXNlc1RpbWUgPSB7XHJcbiAgICAgICAgZmFzdDogMFxyXG4gICAgfTtcclxuICAgIHRoaXMuYWN0aXZlQm9udXNlcyA9IHtcclxuICAgICAgICBmYXN0OiBudWxsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsIG9uY2VcclxuICogQHBhcmFtIHNwcml0ZXNcclxuICogQHJldHVybnMgYmFja2dyb3VuZFxyXG4gKi9cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZUJhY2tncm91bmQgPSBmdW5jdGlvbiBjcmVhdGVCYWNrZ3JvdW5kKHNwcml0ZXMpIHsgLy8yIG1pblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmJhY2tncm91bmQucG9zaXRpb25zID0gW107XHJcbiAgICB0aGlzLmJhY2tncm91bmQuc3ByaXRlcyA9IHNwcml0ZXM7XHJcbiAgICB0aGlzLmJhY2tncm91bmQuY3VycmVudFNwcml0ZSA9IDA7XHJcbiAgICB0aGlzLmJhY2tncm91bmQubmV4dFNwcml0ZSA9IDE7XHJcbiAgICB0aGlzLmJhY2tncm91bmQuc3ByaXRlc0xlbmd0aCA9IHNwcml0ZXMubGVuZ3RoO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kLmlzT25lVGV4dHVyZSA9IHRydWU7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwcml0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoaSA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmQucG9zaXRpb25zWzBdID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmQucG9zaXRpb25zW2ldID0gY29uZmlnLndpZHRoO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuLyoqXHJcbiAqIEFkZCBlbmVteSB0byBlbmVtaWVzXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKi9cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZUVuZW15ID0gZnVuY3Rpb24gY3JlYXRlRW5lbXkocG9zLCBzcHJpdGUsIHR5cGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIHM7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICBjYXNlIFwiYm90dG9tXCI6XHJcbiAgICAgICAgICAgIHMgPSBjb25maWcuYm90dG9tRW5lbWllc1NwZWVkO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwidG9wXCI6XHJcbiAgICAgICAgICAgIHMgPSBjb25maWcudG9wRW5lbWllc1NwZWVkO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXcm9uZyB0eXBlIG9mIGVuZW1pZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVuZW1pZXMucHVzaChuZXcgRW5lbXkocG9zLCBzcHJpdGUsIHMpKTtcclxufTtcclxuLyoqXHJcbiAqIEFkZCBib251cyB0byBib251c2VzXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBDYW4gYmU6IHNwZWVkLCBzbG93LCBzbWFsbCwgYmlnXHJcbiAqL1xyXG5Nb2RlbC5wcm90b3R5cGUuY3JlYXRlQm9udXMgPSBmdW5jdGlvbiBjcmVhdGVCb251cyhwb3MsIHNwcml0ZSwgdHlwZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmJvbnVzZXMucHVzaChuZXcgQm9udXMocG9zLCBzcHJpdGUsIHR5cGUpKTtcclxufTtcclxuXHJcbk1vZGVsLmNhY2hlID0gbnVsbDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7IiwidmFyIHB1Ymxpc2hlciA9IHtcclxuICAgIHN1YnNjcmliZXJzOiB7fSxcclxuICAgIG9uOiBmdW5jdGlvbih0eXBlLCBmbikge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0ucHVzaChmbik7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlOiBmdW5jdGlvbih0eXBlLCBmbikge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycyhcInVuc3Vic2NyaWJlXCIsIHR5cGUsIGZuKTtcclxuICAgIH0sXHJcbiAgICB2aXNpdFN1YnNjcmliZXJzOiBmdW5jdGlvbihhY3Rpb24sIHR5cGUsIGFyZykge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHZhciBzdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0sXHJcbiAgICAgICAgICAgIGksXHJcbiAgICAgICAgICAgIG1heCA9IHN1YnNjcmliZXJzLmxlbmd0aDtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWF4OyBpICs9IDEpIHtcclxuICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gXCJwdWJsaXNoXCIpIHtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzW2ldKGFyZyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnNbaV0gPT09IGFyZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwdWJsaXNoOiBmdW5jdGlvbih0eXBlLCBwdWJsaWNhdGlvbikge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycyhcInB1Ymxpc2hcIiwgdHlwZSwgcHVibGljYXRpb24pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gbWFrZVB1Ymxpc2hlcihvKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBpO1xyXG4gICAgZm9yIChpIGluIHB1Ymxpc2hlcikge1xyXG4gICAgICAgIGlmIChwdWJsaXNoZXIuaGFzT3duUHJvcGVydHkoaSkgJiYgdHlwZW9mIHB1Ymxpc2hlcltpXSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIG9baV0gPSBwdWJsaXNoZXJbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgby5zdWJzY3JpYmVycyA9IHt9O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5tYWtlUHVibGlzaGVyID0gbWFrZVB1Ymxpc2hlcjsiLCJ2YXIgbWFrZVB1Ymxpc2hlciA9IHJlcXVpcmUoXCIuL3B1Ymxpc2hlci5qc1wiKS5tYWtlUHVibGlzaGVyO1xyXG5cclxudmFyIGltYWdlc0NhY2hlID0ge307XHJcbnZhciBhdWRpb3NDYWNoZSA9IHt9O1xyXG52YXIgcmVhZHlDYWxsYmFja3MgPSBbXTtcclxudmFyIHJlc291cmNlc0NvdW50ID0gMDtcclxudmFyIHJlc291cmNlc0xvYWRlZCA9IDE7IC8vIDEgZm9yIGJlc3Qgdmlld1xyXG5yZWFkeUNhbGxiYWNrcy5kb25lID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiBwcm9ncmVzc0luUGVyY2VudCgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQocmVzb3VyY2VzTG9hZGVkIC8gcmVzb3VyY2VzQ291bnQgKiAxMDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGFuZ2VMb2FkaW5nKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBtb2R1bGUuZXhwb3J0cy5wdWJsaXNoKFwibG9hZGluZ0NoYW5nZVwiLCBwcm9ncmVzc0luUGVyY2VudCgpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNSZWFkeSgpIHtcclxuICAgIHZhciByZWFkeSA9IHRydWU7XHJcbiAgICBmb3IgKHZhciBrIGluIGltYWdlc0NhY2hlKSB7XHJcbiAgICAgICAgaWYgKGltYWdlc0NhY2hlLmhhc093blByb3BlcnR5KGspICYmICFpbWFnZXNDYWNoZVtrXSkge1xyXG4gICAgICAgICAgICByZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAodmFyIGsgaW4gYXVkaW9zQ2FjaGUpIHtcclxuICAgICAgICBpZiAoYXVkaW9zQ2FjaGUuaGFzT3duUHJvcGVydHkoaykgJiYgIWF1ZGlvc0NhY2hlW2tdKSB7XHJcbiAgICAgICAgICAgIHJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlYWR5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBfbG9hZEltZyh1cmwpIHtcclxuICAgIGlmIChpbWFnZXNDYWNoZVt1cmxdKSB7XHJcbiAgICAgICAgcmV0dXJuIGltYWdlc0NhY2hlW3VybF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpbWFnZXNDYWNoZVt1cmxdID0gaW1nO1xyXG4gICAgICAgICAgICByZXNvdXJjZXNMb2FkZWQgKz0gMTtcclxuICAgICAgICAgICAgY2hhbmdlTG9hZGluZygpO1xyXG4gICAgICAgICAgICBpZiAoaXNSZWFkeSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZWFkeUNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGltZy5zcmMgPSB1cmw7XHJcbiAgICAgICAgaW1hZ2VzQ2FjaGVbdXJsXSA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBfbG9hZEF1ZGlvKHVybCkge1xyXG4gICAgaWYgKGF1ZGlvc0NhY2hlW3VybF0pIHtcclxuICAgICAgICByZXR1cm4gYXVkaW9zQ2FjaGVbdXJsXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGF1ZGlvID0gbmV3IEF1ZGlvKCk7XHJcbiAgICAgICAgYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcihcImNhbnBsYXl0aHJvdWdoXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCFhdWRpb3NDYWNoZVt1cmxdKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZXNMb2FkZWQgKz0gMTtcclxuICAgICAgICAgICAgICAgIGNoYW5nZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhdWRpb3NDYWNoZVt1cmxdID0gYXVkaW87XHJcbiAgICAgICAgICAgIGlmIChpc1JlYWR5KCkpIHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVhZHlDYWxsYmFja3MuZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWR5Q2FsbGJhY2tzLmRvbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWR5Q2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXVkaW8uc3JjID0gdXJsO1xyXG4gICAgICAgIGF1ZGlvLnByZWxvYWQgPSBcImF1dG9cIjtmdW5jdGlvbiBmYXN0Qm9udXNFbmFibGUocGxheWVyKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2F1ZGlvLmxvYWQoKTtcclxuICAgICAgICBhdWRpb3NDYWNoZVt1cmxdID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIExvYWQgaW1hZ2UgYW5kIGFkZCB0aGVtIHRvIGNhY2hlXHJcbiAqQHBhcmFtIHsoc3RyaW5nfHN0cmluZ1tdKX0gdXJsT2ZBcnIgQXJyYXkgb2YgdXJsc1xyXG4gKiBAc2VlIGxvYWRSZXNvdXJjZXNcclxuICovXHJcbmZ1bmN0aW9uIGxvYWRJbWFnZXModXJsT2ZBcnIpIHtcclxuICAgIGlmICh1cmxPZkFyciBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgcmVzb3VyY2VzQ291bnQgKz0gdXJsT2ZBcnIubGVuZ3RoO1xyXG4gICAgICAgIHVybE9mQXJyLmZvckVhY2goZnVuY3Rpb24gKHVybCkge1xyXG4gICAgICAgICAgICBfbG9hZEltZyh1cmwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXNvdXJjZXNDb3VudCArPSAxO1xyXG4gICAgICAgIF9sb2FkSW1nKHVybE9mQXJyKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZEF1ZGlvcyh1cmxPZkFycikge1xyXG4gICAgaWYgKHVybE9mQXJyIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICByZXNvdXJjZXNDb3VudCArPSB1cmxPZkFyci5sZW5ndGg7XHJcbiAgICAgICAgdXJsT2ZBcnIuZm9yRWFjaChmdW5jdGlvbiAodXJsKSB7XHJcbiAgICAgICAgICAgIF9sb2FkQXVkaW8odXJsKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzb3VyY2VzQ291bnQgKz0gMTtcclxuICAgICAgICBfbG9hZEF1ZGlvKHVybE9mQXJyKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogR2V0IHJlc291cmNlIGZyb20gY2FjaGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxyXG4gKiBAcmV0dXJucyAgSW1hZ2VcclxuICogQHNlZSBnZXRSZXNvdXJjZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW1nKHVybCkge1xyXG4gICAgcmV0dXJuIGltYWdlc0NhY2hlW3VybF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEF1ZGlvKHVybCkge1xyXG4gICAgcmV0dXJuIGF1ZGlvc0NhY2hlW3VybF07XHJcbn1cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbiB0byBmdW5jdGlvbnMgd2hpY2ggd2lsbCBiZSBjYWxsZWQgdGhlbiBhbGwgcmVzb3VyY2VzIGxvYWRlZFxyXG4gKiBAcGFyYW0gZnVuY1xyXG4gKiBAc2VlIG9uUmVzb3VyY2VzUmVhZHlcclxuICovXHJcbmZ1bmN0aW9uIG9uUmVhZHkoZnVuYykge1xyXG4gICAgcmVhZHlDYWxsYmFja3MucHVzaChmdW5jKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBsb2FkSW1hZ2VzOiBsb2FkSW1hZ2VzLFxyXG4gICAgbG9hZEF1ZGlvczogbG9hZEF1ZGlvcyxcclxuICAgIGdldEltZzogZ2V0SW1nLFxyXG4gICAgZ2V0QXVkaW86IGdldEF1ZGlvLFxyXG4gICAgb25SZWFkeTogb25SZWFkeSxcclxuICAgIGlzUmVhZHk6IGlzUmVhZHksXHJcbiAgICBwcm9ncmVzc0luUGVyY2VudDogcHJvZ3Jlc3NJblBlcmNlbnQsXHJcbiAgICBhdWRpb3M6IGF1ZGlvc0NhY2hlLFxyXG4gICAgaW1hZ2VzOiBpbWFnZXNDYWNoZVxyXG59O1xyXG5tYWtlUHVibGlzaGVyKG1vZHVsZS5leHBvcnRzKTtcclxuXHJcbiIsInZhciByZXNvdXJjZXMgPSByZXF1aXJlKFwiLi9yZXNvdXJjZXMuanNcIik7XHJcblxyXG4vKipcclxuICogU3ByaXRlIG9mIHRleHR1cmVcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBwb3MgUG9zaXRpb24gaW4gc3ByaXRlIHNoZWV0XHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IHNpemUgU2l6ZSBpbiBzcHJpdGUgc2hlZXRcclxuICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIFNwZWVkIG9mIHBsYXlpbmcgYW5pbWF0aW9uXHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IGZyYW1lcyBGcmFtZXMgb2YgYW5pbWF0aW9uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXIgRGlyZWN0aW9uIG9uIHNwcml0ZSBzaGVldFxyXG4gKiBAcGFyYW0ge2Jvb2x9IG9uY2UgQ291bnQgb2YgcGxheWluZyBhbmltYXRpb25cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBzZWUgY3JlYXRlU3ByaXRlXHJcbiAqIEBzZWUgY3JlYXRlU3ByaXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBTcHJpdGUodXJsLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZSkge1xyXG4gICAgdGhpcy5wb3MgPSBwb3M7XHJcbiAgICB0aGlzLnVybCA9IHVybDtcclxuICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICB0aGlzLnNwZWVkID0gdHlwZW9mIHNwZWVkID09PSBcIm51bWJlclwiID8gc3BlZWQgOiAwO1xyXG4gICAgdGhpcy5mcmFtZXMgPSBmcmFtZXM7XHJcbiAgICB0aGlzLmRpciA9IGRpciB8fCBcImhvcml6b250YWxcIjtcclxuICAgIHRoaXMub25jZSA9IG9uY2U7XHJcbiAgICB0aGlzLl9pbmRleCA9IDA7XHJcbn1cclxuXHJcblNwcml0ZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICB0aGlzLl9pbmRleCArPSB0aGlzLnNwZWVkICogZHQ7XHJcbn07XHJcblNwcml0ZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGN0eCkge1xyXG4gICAgdmFyIGZyYW1lO1xyXG4gICAgaWYgKHRoaXMuc3BlZWQgPiAwKSB7XHJcbiAgICAgICAgdmFyIG1heCA9IHRoaXMuZnJhbWVzLmxlbmd0aDtcclxuICAgICAgICB2YXIgaWR4ID0gTWF0aC5mbG9vcih0aGlzLl9pbmRleCk7XHJcbiAgICAgICAgZnJhbWUgPSB0aGlzLmZyYW1lc1tpZHggJSBtYXhdO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vbmNlICYmIGlkeCA+PSBtYXgpIHtcclxuICAgICAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZnJhbWUgPSAwO1xyXG4gICAgfVxyXG4gICAgdmFyIHggPSB0aGlzLnBvc1swXTtcclxuICAgIHZhciB5ID0gdGhpcy5wb3NbMV07XHJcblxyXG4gICAgaWYgKHRoaXMuZGlyID09PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgICB5ICs9IGZyYW1lICogdGhpcy5zaXplWzFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB4ICs9IGZyYW1lICogdGhpcy5zaXplWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5kcmF3SW1hZ2UocmVzb3VyY2VzLmdldEltZyh0aGlzLnVybCksIHgsIHksIHRoaXMuc2l6ZVswXSwgdGhpcy5zaXplWzFdLCAwLCAwLCB0aGlzLnNpemVbMF0sIHRoaXMuc2l6ZVsxXSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTsiLCJ2YXIgY29yZSA9IHJlcXVpcmUoXCIuL2NvcmUuanNcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWcuanNcIik7XHJcblxyXG52YXIgbGFzdFRpbWUsXHJcbiAgICBpc0dhbWVPdmVyLFxyXG4gICAgc2NvcmUsXHJcbiAgICBwcmVzc2VkLFxyXG4gICAgcGxheVNvdW5kLFxyXG4gICAgaXNQYXVzZWQsXHJcbiAgICBiZ1NvdW5kO1xyXG52YXIgdmlld3BvcnQgPSBjb3JlLmdldFZpZXdwb3J0KCk7XHJcblxyXG5mdW5jdGlvbiBjb2xsaWRlcyh4LCB5LCByLCBiLCB4MiwgeTIsIHIyLCBiMikge1xyXG4gICAgcmV0dXJuIChyID49IHgyICYmIHggPCByMiAmJiB5IDwgYjIgJiYgYiA+PSB5Mik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJveENvbGxpZGVzKHBvcywgc2l6ZSwgcG9zMiwgc2l6ZTIpIHtcclxuICAgIHJldHVybiBjb2xsaWRlcyhwb3NbMF0sIHBvc1sxXSwgcG9zWzBdICsgc2l6ZVswXSwgcG9zWzFdICsgc2l6ZVsxXSxcclxuICAgICAgICBwb3MyWzBdLCBwb3MyWzFdLCBwb3MyWzBdICsgc2l6ZTJbMF0sIHBvczJbMV0gKyBzaXplMlsxXSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2V0KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVHYW1lT3ZlcigpO1xyXG4gICAgaXNHYW1lT3ZlciA9IGZhbHNlO1xyXG4gICAgc2NvcmUgPSAwO1xyXG5cclxuICAgIHZhciBwbGF5ZXJTcHJpdGUgPSBjb3JlLmNyZWF0ZVNwcml0ZShcImltZy9yZWN0LmpwZ1wiLCBbMCwgMF0sIFsxMDAsIDEwMF0sIDAsIFswXSk7XHJcbiAgICBjb3JlLmNyZWF0ZVBsYXllcihcclxuICAgICAgICBbdmlld3BvcnQud2lkdGggLyAyLCA1MF0sXHJcbiAgICAgICAgcGxheWVyU3ByaXRlXHJcbiAgICApO1xyXG5cclxuICAgIHZhciBiZ1Nwcml0ZTEgPSBjb3JlLmNyZWF0ZVNwcml0ZShcImltZy9ibGFjay5qcGdcIiwgWzAsIDBdLCBbdmlld3BvcnQud2lkdGggKiAzLCB2aWV3cG9ydC5oZWlnaHRdLCAwKTtcclxuICAgIGNvcmUuY3JlYXRlQmFja2dyb3VuZChcclxuICAgICAgICBbYmdTcHJpdGUxLCBiZ1Nwcml0ZTFdXHJcbiAgICApO1xyXG5cclxuICAgIGNvcmUuY2xlYXJFbmVtaWVzKCk7XHJcbiAgICBjb3JlLmNsZWFyQm9udXNlcygpO1xyXG4gICAgY29yZS5jcmVhdGVFbmVteShcclxuICAgICAgICBbMTAwMCwgNDUwXSxcclxuICAgICAgICBwbGF5ZXJTcHJpdGUsXHJcbiAgICAgICAgXCJib3R0b21cIlxyXG4gICAgKTtcclxuICAgIGNvcmUuY3JlYXRlRW5lbXkoXHJcbiAgICAgICAgWzIwMDAsIDEwMF0sXHJcbiAgICAgICAgcGxheWVyU3ByaXRlLFxyXG4gICAgICAgIFwidG9wXCJcclxuICAgICk7XHJcblxyXG4gICAgY29yZS5jcmVhdGVCb251cyhcclxuICAgICAgICBbMTUwMCwgMzAwXSxcclxuICAgICAgICBwbGF5ZXJTcHJpdGUsXHJcbiAgICAgICAgXCJmYXN0XCJcclxuICAgIClcclxufVxyXG5cclxudmFyIHNjb3JlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlXCIpO1xyXG5cclxuZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgY29yZS5yZW5kZXJHYW1lT3ZlcigpO1xyXG4gICAgc2NvcmVFbC5pbm5lckhUTUwgPSBzY29yZTtcclxufVxyXG5cclxuXHJcbnZhciBiZyA9IGNvcmUuYmFja2dyb3VuZDtcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUJhY2tncm91bmQoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBjdXIgPSBiZy5jdXJyZW50U3ByaXRlLFxyXG4gICAgICAgICAgICBuZXh0ID0gYmcubmV4dFNwcml0ZTtcclxuICAgIHZhciBuZXdCZ1BvcyA9IGJnLnBvc2l0aW9uc1tjdXJdIC0gYmcuc3BlZWQgKiBkdCxcclxuICAgICAgICBuZXdSaWdodENvcm5lciA9IG5ld0JnUG9zICsgYmcuc3ByaXRlc1tjdXJdLnNpemVbMF07XHJcblxyXG4gICAgaWYgKG5ld1JpZ2h0Q29ybmVyIDwgY29uZmlnLndpZHRoKSB7XHJcbiAgICAgICAgaWYgKGJnLmlzT25lVGV4dHVyZSkge1xyXG4gICAgICAgICAgICBiZy5pc09uZVRleHR1cmUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1JpZ2h0Q29ybmVyID4gMCkge1xyXG4gICAgICAgICAgICBiZy5wb3NpdGlvbnNbY3VyXSA9IG5ld0JnUG9zO1xyXG4gICAgICAgICAgICBiZy5wb3NpdGlvbnNbbmV4dF0gPSBiZy5wb3NpdGlvbnNbbmV4dF0gLSBiZy5zcGVlZCAqIGR0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJnLnBvc2l0aW9uc1tjdXJdID0gY29uZmlnLndpZHRoO1xyXG4gICAgICAgICAgICBjdXIgPSBiZy5jdXJyZW50U3ByaXRlID0gbmV4dDtcclxuICAgICAgICAgICAgbmV4dCA9IGJnLm5leHRTcHJpdGUgPSAoY3VyICsgMSkgJSBiZy5zcHJpdGVzTGVuZ3RoO1xyXG4gICAgICAgICAgICBiZy5wb3NpdGlvbnNbY3VyXSA9IGJnLnBvc2l0aW9uc1tjdXJdIC0gYmcuc3BlZWQgKiBkdDtcclxuICAgICAgICAgICAgaWYgKGJnLnNwcml0ZXNbY3VyXS5zaXplWzBdIDw9IGNvbmZpZy53aWR0aCkgeyAgIC8vaWYgdGV4dHVyZSdzIHNpemUgZXF1YWwgd2luZG93IHdpZHRoXHJcbiAgICAgICAgICAgICAgICBiZy5wb3NpdGlvbnNbbmV4dF0gPSBiZy5wb3NpdGlvbnNbbmV4dF0gLSBiZy5zcGVlZCAqIGR0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYmcuaXNPbmVUZXh0dXJlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYmcucG9zaXRpb25zW2N1cl0gPSBuZXdCZ1BvcztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tDb2xpc2lvbnMocG9zKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBjb2xsaXNpb24gPSBbXSxcclxuICAgICAgICBzaXplID0gY29yZS5nZXRQbGF5ZXIoKS5zcHJpdGUuc2l6ZSxcclxuICAgICAgICBpLFxyXG4gICAgICAgIGVuZW1pZXMgPSBjb3JlLmdldEVuZW1pZXMoKSxcclxuICAgICAgICBib251c2VzID0gY29yZS5nZXRCb251c2VzKCk7XHJcblxyXG4gICAgaWYgKHBvc1sxXSA8IDApIHtcclxuICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJ0b3BcIn0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocG9zWzFdICsgc2l6ZVsxXSA+IGNvbmZpZy5mb3Jlc3RMaW5lKSB7XHJcbiAgICAgICAgY29sbGlzaW9uLnB1c2goe3R5cGU6IFwiZm9yZXN0XCJ9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChib3hDb2xsaWRlcyhwb3MsIHNpemUsIGVuZW1pZXNbaV0ucG9zLCBlbmVtaWVzW2ldLnNwcml0ZS5zaXplKSkge1xyXG4gICAgICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJlbmVteVwiLCB0YXJnZXQ6IGVuZW1pZXNbaV19KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGJvbnVzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoYm94Q29sbGlkZXMocG9zLCBzaXplLCBib251c2VzW2ldLnBvcywgYm9udXNlc1tpXS5zcHJpdGUuc2l6ZSkpIHtcclxuICAgICAgICAgICAgY29sbGlzaW9uLnB1c2goe3R5cGU6IFwiYm9udXNcIiwgdGFyZ2V0OiBib251c2VzW2ldfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbGxpc2lvbjtcclxufVxyXG5cclxuZnVuY3Rpb24gZmFzdEFsbCgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIHhTcGVlZCA9IGNvbmZpZy5mYXN0Qm9udXNTcGVlZDtcclxuICAgIHZhciBpO1xyXG4gICAgdmFyIGVuZW1pZXMgPSBjb3JlLmdldEVuZW1pZXMoKTtcclxuICAgIHZhciBib251c2VzID0gY29yZS5nZXRCb251c2VzKCk7XHJcbiAgICBjb3JlLmJhY2tncm91bmQuc3BlZWQgKj0geFNwZWVkO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBlbmVtaWVzW2ldLnNwZWVkICo9IHhTcGVlZDtcclxuICAgIH1cclxuICAgIGZvciAoaSA9IDA7IGkgPCBib251c2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYm9udXNlc1tpXS5zcGVlZCAqPSB4U3BlZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNsb3dBbGwoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciB4U3BlZWQgPSBjb25maWcuZmFzdEJvbnVzU3BlZWQ7XHJcbiAgICB2YXIgaTtcclxuICAgIHZhciBlbmVtaWVzID0gY29yZS5nZXRFbmVtaWVzKCk7XHJcbiAgICB2YXIgYm9udXNlcyA9IGNvcmUuZ2V0Qm9udXNlcygpO1xyXG4gICAgY29yZS5iYWNrZ3JvdW5kLnNwZWVkIC89IHhTcGVlZDtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZW5lbWllc1tpXS5zcGVlZCAvPSB4U3BlZWQ7XHJcbiAgICB9XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgYm9udXNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGJvbnVzZXNbaV0uc3BlZWQgLz0geFNwZWVkO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0Qm9udXMoYm9udXMpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgc3dpdGNoIChib251cy50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcImZhc3RcIjpcclxuICAgICAgICAgICAgZmFzdEFsbCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1bmRvQm9udXMoYm9udXMpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgc3dpdGNoIChib251cy50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcImZhc3RcIjpcclxuICAgICAgICAgICAgc2xvd0FsbCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWxldGVCb251cyhib251cykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgYm9udXNlcyA9IGNvcmUuZ2V0Qm9udXNlcygpO1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGJvbnVzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoYm9udXNlc1tpXSA9PSBib251cykge1xyXG4gICAgICAgICAgICBib251c2VzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjb2xsaWRlUGxheWVyKHBvcykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgcGxheWVyID0gY29yZS5nZXRQbGF5ZXIoKTtcclxuICAgIHZhciBjb2xsaXNpb24gPSBjaGVja0NvbGlzaW9ucyhwb3MpLFxyXG4gICAgICAgIGkgPSAwO1xyXG4gICAgaWYgKGNvbGxpc2lvbi5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgY29sbGlzaW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3dpdGNoIChjb2xsaXNpb25baV0udHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwidG9wXCI6XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc3BlZWQueSA9IDA7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIucG9zWzFdID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiZm9yZXN0XCI6XHJcbiAgICAgICAgICAgICAgICBnYW1lT3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlbmVteVwiOlxyXG4gICAgICAgICAgICAgICAgZ2FtZU92ZXIoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYm9udXNcIjpcclxuICAgICAgICAgICAgICAgIGNvbGxpc2lvbltpXS50YXJnZXQuYWN0aXZlLmVuYWJsZShwbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbGxpc2lvbltpXS50YXJnZXQudHlwZSBpbiBwbGF5ZXIuYWN0aXZlQm9udXNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5hY3RpdmVCb251c2VzW2NvbGxpc2lvbltpXS50YXJnZXQudHlwZV0gPSBjb2xsaXNpb25baV0udGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW5pdEJvbnVzKGNvbGxpc2lvbltpXS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlQm9udXMoY29sbGlzaW9uW2ldLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVQbGF5ZXIoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIGksXHJcbiAgICAgICAgcGxheWVyID0gY29yZS5nZXRQbGF5ZXIoKSxcclxuICAgICAgICBhY3RpdmVCb251c2VzVGltZSA9IHBsYXllci5hY3RpdmVCb251c2VzVGltZSxcclxuICAgICAgICBhY3RpdmVCb251c2VzID0gcGxheWVyLmFjdGl2ZUJvbnVzZXM7XHJcbiAgICBwbGF5ZXIuc3ByaXRlLnVwZGF0ZShkdCk7XHJcbiAgICBwbGF5ZXIuc3BlZWQueSArPSBjb25maWcuZ3Jhdml0eSAqIGR0O1xyXG4gICAgaWYgKHByZXNzZWRbJ3VwJ10pIHtcclxuICAgICAgICBwbGF5ZXIuc3BlZWQueSAtPSBjb25maWcuYnJlYXRoZVNwZWVkICogZHQ7XHJcbiAgICB9XHJcbiAgICB2YXIgbW90aW9uID0gcGxheWVyLnNwZWVkLnkgKiBkdDtcclxuICAgIHZhciBuZXdQb3MgPSBbcGxheWVyLnBvc1swXSwgcGxheWVyLnBvc1sxXSArIG1vdGlvbl07XHJcbiAgICBpZiAoY29sbGlkZVBsYXllcihuZXdQb3MpKSB7IC8vbW92ZSBvciBub3QgdG8gbW92ZVxyXG4gICAgICAgIHBsYXllci5wb3MgPSBuZXdQb3M7XHJcbiAgICB9XHJcbiAgICBmb3IgKGkgaW4gYWN0aXZlQm9udXNlcykge1xyXG4gICAgICAgIGlmIChhY3RpdmVCb251c2VzLmhhc093blByb3BlcnR5KGkpICYmIGFjdGl2ZUJvbnVzZXNbaV0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgYWN0aXZlQm9udXNlc1RpbWVbaV0gLT0gZHQ7XHJcbiAgICAgICAgICAgIGlmIChhY3RpdmVCb251c2VzVGltZVtpXSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHBsYXllci5hY3RpdmVCb251c2VzW2ldLmFjdGl2ZS5kaXNhYmxlKHBsYXllcik7XHJcbiAgICAgICAgICAgICAgICB1bmRvQm9udXMocGxheWVyLmFjdGl2ZUJvbnVzZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLmFjdGl2ZUJvbnVzZXNbaV0gPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVFbmVtaWVzKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBlbmVtaWVzID0gY29yZS5nZXRFbmVtaWVzKCksXHJcbiAgICAgICAgaSxcclxuICAgICAgICBtb3Rpb247XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGVuZW1pZXNbaV0uc3ByaXRlLnVwZGF0ZShkdCk7XHJcbiAgICAgICAgbW90aW9uID0gZW5lbWllc1tpXS5zcGVlZCAqIGR0O1xyXG4gICAgICAgIGVuZW1pZXNbaV0ucG9zID0gW2VuZW1pZXNbaV0ucG9zWzBdIC0gbW90aW9uLCBlbmVtaWVzW2ldLnBvc1sxXV07XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUJvbnVzZXMoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIGJvbnVzZXMgPSBjb3JlLmdldEJvbnVzZXMoKSxcclxuICAgICAgICBpLFxyXG4gICAgICAgIG1vdGlvbjtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBib251c2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYm9udXNlc1tpXS5zcHJpdGUudXBkYXRlKGR0KTtcclxuICAgICAgICBtb3Rpb24gPSBib251c2VzW2ldLnNwZWVkICogZHQ7XHJcbiAgICAgICAgYm9udXNlc1tpXS5wb3MgPSBbYm9udXNlc1tpXS5wb3NbMF0gLSBtb3Rpb24sIGJvbnVzZXNbaV0ucG9zWzFdXTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmICghaXNHYW1lT3Zlcikge1xyXG4gICAgICAgIHVwZGF0ZUVuZW1pZXMoZHQpO1xyXG4gICAgICAgIHVwZGF0ZUJhY2tncm91bmQoZHQpO1xyXG4gICAgICAgIHVwZGF0ZVBsYXllcihkdCk7XHJcbiAgICAgICAgdXBkYXRlQm9udXNlcyhkdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5yZW5kZXIoKTtcclxuICAgIGNvcmUuc2V0U2NvcmUoc2NvcmUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgIHZhciBkdCA9IChub3cgLSBsYXN0VGltZSkgLyAxMDAwO1xyXG5cclxuICAgIHVwZGF0ZShkdCk7XHJcbiAgICByZW5kZXIoKTtcclxuXHJcbiAgICBsYXN0VGltZSA9IG5vdztcclxuICAgIGlmICghaXNQYXVzZWQpIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHByZXNzZWQgPSBjb3JlLmdldElucHV0KHdpbmRvdywgXCJrZXlib2FyZFwiKTtcclxuICAgIHJlc2V0KCk7XHJcbiAgICBsYXN0VGltZSA9IERhdGUubm93KCk7XHJcbiAgICBjb3JlLnNob3dFbGVtZW50KFwicGF1c2VcIik7XHJcbiAgICBtYWluKCk7XHJcblxyXG4gICAgLypmdW5jdGlvbiBoYWRubGVyKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKChuZXcgRGF0ZSkuZ2V0U2Vjb25kcygpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImN1cjogXCIgKyBiZy5jdXJyZW50U3ByaXRlICsgXCIgLSBwb3M6IFwiICsgYmcucG9zaXRpb25zW2JnLmN1cnJlbnRTcHJpdGVdKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm5leHQ6IFwiICsgYmcubmV4dFNwcml0ZSArIFwiIC0gcG9zOiBcIiArIGJnLnBvc2l0aW9uc1tiZy5uZXh0U3ByaXRlXSk7XHJcbiAgICB9XHJcbiAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoaGFkbmxlciwgMTAwMCk7Ki9cclxufVxyXG5cclxuY29yZS5sb2FkSW1hZ2VzKFtcclxuICAgIFwiaW1nL2JsYWNrLmpwZ1wiLFxyXG4gICAgXCJpbWcvcmVjdC5qcGdcIlxyXG5dKTtcclxuXHJcbmNvcmUubG9hZEF1ZGlvcyhbXHJcbiAgICBcImF1ZGlvL0xvcmRpLm1wM1wiXHJcbl0pO1xyXG5cclxuZnVuY3Rpb24gcGF1c2VHYW1lKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpc1BhdXNlZCA9IHRydWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuUGF1c2VHYW1lKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpc1BhdXNlZCA9IGZhbHNlO1xyXG4gICAgbGFzdFRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgbWFpbigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBiZ1NvdW5kU3RhcnQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGJnU291bmQuY3VycmVudFRpbWUgPSAwO1xyXG4gICAgYmdTb3VuZC5wbGF5KCk7XHJcbiAgICBpZiAoXCJsb29wXCIgaW4gYmdTb3VuZCkge1xyXG4gICAgICAgIGJnU291bmQubG9vcCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJnU291bmQuYWRkRXZlbnRMaXN0ZW5lcihcImVuZGVkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYmdTb3VuZC5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgIGJnU291bmQucGxheSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG1haW5NZW51KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLnNob3dFbGVtZW50KFwibWFpblwiKTtcclxuICAgIGNvcmUuaGlkZUVsZW1lbnQoXCJwcm9ncmVzc1wiKTtcclxuICAgIGNvcmUuY2hvb3NlTWVudShcIm1haW5cIik7XHJcbiAgICBjb3JlLnNob3dFbGVtZW50KFwic291bmRcIik7XHJcbiAgICBiZ1NvdW5kU3RhcnQoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVjb3Jkc01lbnUoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUVsZW1lbnQoXCJtYWluXCIpO1xyXG4gICAgY29yZS5zaG93RWxlbWVudChcInJlY29yZHNcIik7XHJcbiAgICBjb3JlLmNob29zZU1lbnUoXCJyZWNvcmRzXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBiYWNrRnJvbVJlY29yZHMoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGNvcmUuaGlkZUVsZW1lbnQoXCJyZWNvcmRzXCIpO1xyXG4gICAgY29yZS5zaG93RWxlbWVudChcIm1haW5cIik7XHJcbiAgICBjb3JlLnVuQ2hvb3NlTWVudShcInJlY29yZHNcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWRpdHNNZW51KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVFbGVtZW50KFwibWFpblwiKTtcclxuICAgIGNvcmUuc2hvd0VsZW1lbnQoXCJjcmVkaXRzXCIpO1xyXG4gICAgY29yZS5jaG9vc2VNZW51KFwiY3JlZGl0c1wiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYmFja0Zyb21DcmVkaXRzKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVFbGVtZW50KFwiY3JlZGl0c1wiKTtcclxuICAgIGNvcmUuc2hvd0VsZW1lbnQoXCJtYWluXCIpO1xyXG4gICAgY29yZS51bkNob29zZU1lbnUoXCJjcmVkaXRzXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBiYWNrVG9NZW51KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVHYW1lT3ZlcigpO1xyXG4gICAgY29yZS5oaWRlRWxlbWVudChcInBhdXNlXCIpO1xyXG4gICAgY29yZS5zaG93RWxlbWVudChcIm1lbnVcIik7XHJcbn1cclxuZnVuY3Rpb24gaW5pdFNvdW5kcygpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYmdTb3VuZCA9IGNvcmUuZ2V0QXVkaW8oXCJhdWRpby9Mb3JkaS5tcDNcIik7XHJcbiAgICBwbGF5U291bmQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBsYXlTb3VuZFwiKSA9PT0gXCJ0cnVlXCI7XHJcbiAgICBpZiAocGxheVNvdW5kKSB7XHJcbiAgICAgICAgY29yZS5hZGRDbGFzcyhcInNvdW5kXCIsIFwic291bmQtb25cIik7XHJcbiAgICAgICAgY29yZS5yZW1vdmVDbGFzcyhcInNvdW5kXCIsIFwic291bmQtb2ZmXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb3JlLmFkZENsYXNzKFwic291bmRcIiwgXCJzb3VuZC1vZmZcIik7XHJcbiAgICAgICAgY29yZS5yZW1vdmVDbGFzcyhcInNvdW5kXCIsIFwic291bmQtb25cIik7XHJcbiAgICB9XHJcbiAgICBjb3JlLnNldFNvdW5kTXV0ZWQoIXBsYXlTb3VuZCk7XHJcbn1cclxuY29yZS5vblJlc291cmNlc1JlYWR5KGluaXRTb3VuZHMpO1xyXG5jb3JlLm9uUmVzb3VyY2VzUmVhZHkobWFpbk1lbnUpOyAvL29yZGVyIGlzIGltcG9ydGFudFxyXG5cclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwicGxheVwiLCBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5oaWRlRWxlbWVudChcIm1lbnVcIik7XHJcbiAgICBpbml0KCk7XHJcbn0pO1xyXG5cclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwicmVzdGFydFwiLCBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5oaWRlR2FtZU92ZXIoKTtcclxuICAgIHJlc2V0KCk7XHJcbn0pO1xyXG5cclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwic291bmRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmIChjb3JlLmhhc0NsYXNzKFwic291bmRcIiwgXCJzb3VuZC1vblwiKSkge1xyXG4gICAgICAgIGNvcmUucmVtb3ZlQ2xhc3MoXCJzb3VuZFwiLCBcInNvdW5kLW9uXCIpO1xyXG4gICAgICAgIGNvcmUuYWRkQ2xhc3MoXCJzb3VuZFwiLCBcInNvdW5kLW9mZlwiKTtcclxuICAgICAgICBwbGF5U291bmQgPSBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29yZS5yZW1vdmVDbGFzcyhcInNvdW5kXCIsIFwic291bmQtb2ZmXCIpO1xyXG4gICAgICAgIGNvcmUuYWRkQ2xhc3MoXCJzb3VuZFwiLCBcInNvdW5kLW9uXCIpO1xyXG4gICAgICAgIHBsYXlTb3VuZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInBsYXlTb3VuZFwiLCBwbGF5U291bmQpO1xyXG4gICAgY29yZS5zZXRTb3VuZE11dGVkKCFwbGF5U291bmQpO1xyXG59LCB0cnVlKTtcclxuXHJcbmNvcmUub25CdXR0b25DbGljayhcInBhdXNlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpZiAoY29yZS5oYXNDbGFzcyhcInBhdXNlXCIsIFwicGF1c2Utb25cIikpIHtcclxuICAgICAgICBjb3JlLnJlbW92ZUNsYXNzKFwicGF1c2VcIiwgXCJwYXVzZS1vblwiKTtcclxuICAgICAgICBjb3JlLmFkZENsYXNzKFwicGF1c2VcIiwgXCJwYXVzZS1vZmZcIik7XHJcbiAgICAgICAgdW5QYXVzZUdhbWUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29yZS5yZW1vdmVDbGFzcyhcInBhdXNlXCIsIFwicGF1c2Utb2ZmXCIpO1xyXG4gICAgICAgIGNvcmUuYWRkQ2xhc3MoXCJwYXVzZVwiLCBcInBhdXNlLW9uXCIpO1xyXG4gICAgICAgIHBhdXNlR2FtZSgpO1xyXG4gICAgfVxyXG59LCB0cnVlKTtcclxuXHJcbmNvcmUub25CdXR0b25DbGljayhcImNyZWRpdHNcIiwgY3JlZGl0c01lbnUpO1xyXG5jb3JlLm9uQnV0dG9uQ2xpY2soXCJiYWNrRnJvbUNyZWRpdHNcIiwgYmFja0Zyb21DcmVkaXRzKTtcclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwicmVjb3Jkc1wiLCByZWNvcmRzTWVudSk7XHJcbmNvcmUub25CdXR0b25DbGljayhcImJhY2tGcm9tUmVjb3Jkc1wiLCBiYWNrRnJvbVJlY29yZHMpO1xyXG5jb3JlLm9uQnV0dG9uQ2xpY2soXCJtZW51XCIsIGJhY2tUb01lbnUpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxufTsiXX0=
