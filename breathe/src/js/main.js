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
    slowBonusSpeed: 0.6,
    playerSpeedX: 1,
    bonusTime: 5
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
        fast: 0,
        slow: 0
    };
    this.activeBonuses = {
        fast: null,
        slow: null
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

function bonusEnable(type, player) {
    "use strict";
    if (type in player.activeBonusesTime) {
        player.activeBonusesTime[type] += config.bonusTime;
    }
}

function bonusDisable(type, player) {
    "use strict";
    if (type in player.activeBonusesTime) {
        player.activeBonusesTime[type] = 0;
    }
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


    this.active = new Active(
        bonusEnable.bind(null, this.type),
        bonusDisable.bind(null, this.type)
    );
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
    this.player.activeBonusesTime = {
        fast: 0,
        slow: 0
    };
    this.player.activeBonuses = {
        fast: null,
        slow: null
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
    this.background.speed = config.backgroundSpeed;
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
    );
    core.createBonus(
        [1800, 300],
        playerSprite,
        "slow"
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
    var player = core.getPlayer();
    if (player.activeBonusesTime.fast <= 0) {
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
}

function unFastAll() {
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


function slowAll() {
    "use strict";
    var player = core.getPlayer();
    if (player.activeBonusesTime.slow <= 0) {
        var xSpeed = config.slowBonusSpeed;
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
}

function unSlowAll() {
    "use strict";
    var xSpeed = config.slowBonusSpeed;
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

function initBonus(type) {
    "use strict";
    switch (type) {
        case "fast":
            fastAll();
            break;
        case "slow":
            slowAll();
            break;
    }
}

function undoBonus(type) {
    "use strict";
    switch (type) {
        case "fast":
            unFastAll();
            break;
        case "slow":
            unSlowAll();
            break;
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
                initBonus(collision[i].target.type);  //order is important
                collision[i].target.active.enable(player);
                if (collision[i].target.type in player.activeBonuses) {
                    player.activeBonuses[collision[i].target.type] = collision[i].target;
                }
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
                undoBonus(player.activeBonuses[i].type);
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

/*core.loadAudios([
    "audio/50.wav"
]);*/

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
    bgSound = core.getAudio("audio/50.wav");
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
//core.onResourcesReady(initSounds);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXVkaW8uanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2NvcmUuanMiLCJzcmMvanMvZGlzcGxheS5qcyIsInNyYy9qcy9nYW1lLmpzIiwic3JjL2pzL2lucHV0LmpzIiwic3JjL2pzL21vZGVsLmpzIiwic3JjL2pzL3B1Ymxpc2hlci5qcyIsInNyYy9qcy9yZXNvdXJjZXMuanMiLCJzcmMvanMvc3ByaXRlLmpzIiwic3JjL2pzL3dvcmxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVMQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBtb2R1bGVzIGFyZSBkZWZpbmVkIGFzIGFuIGFycmF5XHJcbi8vIFsgbW9kdWxlIGZ1bmN0aW9uLCBtYXAgb2YgcmVxdWlyZXVpcmVzIF1cclxuLy9cclxuLy8gbWFwIG9mIHJlcXVpcmV1aXJlcyBpcyBzaG9ydCByZXF1aXJlIG5hbWUgLT4gbnVtZXJpYyByZXF1aXJlXHJcbi8vXHJcbi8vIGFueXRoaW5nIGRlZmluZWQgaW4gYSBwcmV2aW91cyBidW5kbGUgaXMgYWNjZXNzZWQgdmlhIHRoZVxyXG4vLyBvcmlnIG1ldGhvZCB3aGljaCBpcyB0aGUgcmVxdWlyZXVpcmUgZm9yIHByZXZpb3VzIGJ1bmRsZXNcclxuXHJcbihmdW5jdGlvbiBvdXRlciAobW9kdWxlcywgY2FjaGUsIGVudHJ5KSB7XHJcbiAgICAvLyBTYXZlIHRoZSByZXF1aXJlIGZyb20gcHJldmlvdXMgYnVuZGxlIHRvIHRoaXMgY2xvc3VyZSBpZiBhbnlcclxuICAgIHZhciBwcmV2aW91c1JlcXVpcmUgPSB0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZTtcclxuXHJcbiAgICBmdW5jdGlvbiBuZXdSZXF1aXJlKG5hbWUsIGp1bXBlZCl7XHJcbiAgICAgICAgaWYoIWNhY2hlW25hbWVdKSB7XHJcbiAgICAgICAgICAgIGlmKCFtb2R1bGVzW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSBjYW5ub3QgZmluZCB0aGUgdGhlIG1vZHVsZSB3aXRoaW4gb3VyIGludGVybmFsIG1hcCBvclxyXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUganVtcCB0byB0aGUgY3VycmVudCBnbG9iYWwgcmVxdWlyZSBpZS4gdGhlIGxhc3QgYnVuZGxlXHJcbiAgICAgICAgICAgICAgICAvLyB0aGF0IHdhcyBhZGRlZCB0byB0aGUgcGFnZS5cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50UmVxdWlyZSA9IHR5cGVvZiByZXF1aXJlID09IFwiZnVuY3Rpb25cIiAmJiByZXF1aXJlO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFqdW1wZWQgJiYgY3VycmVudFJlcXVpcmUpIHJldHVybiBjdXJyZW50UmVxdWlyZShuYW1lLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgb3RoZXIgYnVuZGxlcyBvbiB0aGlzIHBhZ2UgdGhlIHJlcXVpcmUgZnJvbSB0aGVcclxuICAgICAgICAgICAgICAgIC8vIHByZXZpb3VzIG9uZSBpcyBzYXZlZCB0byAncHJldmlvdXNSZXF1aXJlJy4gUmVwZWF0IHRoaXMgYXNcclxuICAgICAgICAgICAgICAgIC8vIG1hbnkgdGltZXMgYXMgdGhlcmUgYXJlIGJ1bmRsZXMgdW50aWwgdGhlIG1vZHVsZSBpcyBmb3VuZCBvclxyXG4gICAgICAgICAgICAgICAgLy8gd2UgZXhoYXVzdCB0aGUgcmVxdWlyZSBjaGFpbi5cclxuICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c1JlcXVpcmUpIHJldHVybiBwcmV2aW91c1JlcXVpcmUobmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIG1vZHVsZSBcXCcnICsgbmFtZSArICdcXCcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbSA9IGNhY2hlW25hbWVdID0ge2V4cG9ydHM6e319O1xyXG4gICAgICAgICAgICBtb2R1bGVzW25hbWVdWzBdLmNhbGwobS5leHBvcnRzLCBmdW5jdGlvbih4KXtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IG1vZHVsZXNbbmFtZV1bMV1beF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3UmVxdWlyZShpZCA/IGlkIDogeCk7XHJcbiAgICAgICAgICAgIH0sbSxtLmV4cG9ydHMsb3V0ZXIsbW9kdWxlcyxjYWNoZSxlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYWNoZVtuYW1lXS5leHBvcnRzO1xyXG4gICAgfVxyXG4gICAgZm9yKHZhciBpPTA7aTxlbnRyeS5sZW5ndGg7aSsrKSBuZXdSZXF1aXJlKGVudHJ5W2ldKTtcclxuXHJcbiAgICAvLyBPdmVycmlkZSB0aGUgY3VycmVudCByZXF1aXJlIHdpdGggdGhpcyBuZXcgb25lXHJcbiAgICByZXR1cm4gbmV3UmVxdWlyZTtcclxufSkiLCIvKipcclxuICogQ3JlYXRlZCBieSBVU0VSIG9uIDEwLjA3LjIwMTUuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbn07IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgVVNFUiBvbiAxMC4wNy4yMDE1LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB3aWR0aDogMTAyNCxcclxuICAgIGhlaWdodDogNjAwLFxyXG4gICAgaW5wdXRUeXBlOiBcImtleWJvYXJkXCIsXHJcbiAgICBiYWNrZ3JvdW5kU3BlZWQ6IDE1MCxcclxuICAgIGJvdHRvbUVuZW1pZXNTcGVlZDogMjIwLFxyXG4gICAgdG9wRW5lbWllc1NwZWVkOiAyNzAsXHJcbiAgICBncmF2aXR5OiAxNTAsXHJcbiAgICBicmVhdGhlU3BlZWQ6IDM1MCxcclxuICAgIGZvcmVzdExpbmU6IDQ1MCxcclxuICAgIGltYWdlU21vb3RoaW5nRW5hYmxlZDogdHJ1ZSxcclxuICAgIGZhc3RCb251c1NwZWVkOiAyLFxyXG4gICAgc2xvd0JvbnVzU3BlZWQ6IDAuNixcclxuICAgIHBsYXllclNwZWVkWDogMSxcclxuICAgIGJvbnVzVGltZTogNVxyXG59OyIsInZhciByZXNvdXJjZXMgPSByZXF1aXJlKFwiLi9yZXNvdXJjZXMuanNcIik7XHJcbnZhciBTcHJpdGUgPSByZXF1aXJlKFwiLi9zcHJpdGUuanNcIik7XHJcbnZhciBpbnB1dCA9IHJlcXVpcmUoXCIuL2lucHV0LmpzXCIpO1xyXG52YXIgbW9kZWxfID0gcmVxdWlyZShcIi4vbW9kZWwuanNcIik7XHJcbnZhciBkaXNwbGF5XyA9ICByZXF1aXJlKFwiLi9kaXNwbGF5LmpzXCIpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnLmpzXCIpO1xyXG5cclxudmFyIGRpc3BsYXkgPSBuZXcgZGlzcGxheV8uQ2FudmFzRGlzcGxheSgpO1xyXG52YXIgbW9kZWwgPSBuZXcgbW9kZWxfKCk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTcHJpdGUodXJsLCBwb3MsIHNpemUsIHNwZWVkLCBmcmFtZXMsIGRpciwgb25jZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICByZXR1cm4gbmV3IFNwcml0ZSh1cmwsIHBvcywgc2l6ZSwgc3BlZWQsIGZyYW1lcywgZGlyLCBvbmNlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Vmlld3BvcnQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgd2lkdGg6IGNvbmZpZy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IGNvbmZpZy5oZWlnaHRcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW5kZXIoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJEaXNwbGF5KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LmNsZWFyRGlzcGxheSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJHYW1lT3ZlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW5kZXJHYW1lT3ZlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlR2FtZU92ZXIoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuaGlkZUdhbWVPdmVyKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFNjb3JlKHNjb3JlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuc2V0U2NvcmUoc2NvcmUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93RWxlbWVudChlbCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnNob3dFbGVtZW50KGVsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZUVsZW1lbnQoZWwpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5oaWRlRWxlbWVudChlbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFByb2dyZXNzKHZhbHVlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuc2V0UHJvZ3Jlc3ModmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaG9vc2VNZW51KG1lbnVDYXNlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkuY2hvb3NlTWVudShtZW51Q2FzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuQ2hvb3NlTWVudShtZW51Q2FzZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBkaXNwbGF5LnVuQ2hvb3NlTWVudShtZW51Q2FzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uQnV0dG9uQ2xpY2soYnV0dG9uTmFtZSwgaGFuZGxlciwgbm90QnV0dG9uKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGRpc3BsYXkub25CdXR0b25DbGljayhidXR0b25OYW1lLCBoYW5kbGVyLCBub3RCdXR0b24pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRDbGFzcyhlbCwgdmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5hZGRDbGFzcyhlbCwgdmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbCwgdmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZGlzcGxheS5yZW1vdmVDbGFzcyhlbCwgdmFsdWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYXNDbGFzcyhlbCwgdmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIGRpc3BsYXkuaGFzQ2xhc3MoZWwsIHZhbHVlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U291bmRNdXRlZCh2YWx1ZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaSBpbiByZXNvdXJjZXMuYXVkaW9zKSB7XHJcbiAgICAgICAgaWYgKHJlc291cmNlcy5hdWRpb3MuaGFzT3duUHJvcGVydHkoaSkpIHtcclxuICAgICAgICAgICAgcmVzb3VyY2VzLmF1ZGlvc1tpXS5tdXRlZCA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUGxheWVyKHBvcywgc3ByaXRlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIG1vZGVsLmNyZWF0ZVBsYXllcihwb3MsIHNwcml0ZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUJhY2tncm91bmQoc3ByaXRlcykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBtb2RlbC5jcmVhdGVCYWNrZ3JvdW5kKHNwcml0ZXMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFbmVteShwb3MsIHNwcml0ZSwgdHlwZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBtb2RlbC5jcmVhdGVFbmVteShwb3MsIHNwcml0ZSwgdHlwZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUJvbnVzKHBvcywgc3ByaXRlLCB0eXBlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIG1vZGVsLmNyZWF0ZUJvbnVzKHBvcywgc3ByaXRlLCB0eXBlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RW5lbWllcygpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIG1vZGVsLmVuZW1pZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEJvbnVzZXMoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiBtb2RlbC5ib251c2VzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhckVuZW1pZXMoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIG1vZGVsLmVuZW1pZXMgPSBbXTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJCb251c2VzKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBtb2RlbC5ib251c2VzID0gW107XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBsYXllcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIG1vZGVsLnBsYXllcjtcclxufVxyXG5cclxucmVzb3VyY2VzLm9uKFwibG9hZGluZ0NoYW5nZVwiLCBzZXRQcm9ncmVzcyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGxvYWRJbWFnZXM6IHJlc291cmNlcy5sb2FkSW1hZ2VzLFxyXG4gICAgbG9hZEF1ZGlvczogcmVzb3VyY2VzLmxvYWRBdWRpb3MsXHJcbiAgICBnZXRJbWc6IHJlc291cmNlcy5nZXRJbWcsXHJcbiAgICBnZXRBdWRpbzogcmVzb3VyY2VzLmdldEF1ZGlvLFxyXG4gICAgb25SZXNvdXJjZXNSZWFkeTogcmVzb3VyY2VzLm9uUmVhZHksXHJcbiAgICBjcmVhdGVTcHJpdGU6IGNyZWF0ZVNwcml0ZSxcclxuICAgIGdldElucHV0OiBpbnB1dCxcclxuICAgIGNyZWF0ZVBsYXllcjogY3JlYXRlUGxheWVyLFxyXG4gICAgY3JlYXRlQmFja2dyb3VuZDogY3JlYXRlQmFja2dyb3VuZCxcclxuICAgIGNyZWF0ZUVuZW15OiBjcmVhdGVFbmVteSxcclxuICAgIGdldEVuZW1pZXM6IGdldEVuZW1pZXMsXHJcbiAgICBjbGVhckVuZW1pZXM6IGNsZWFyRW5lbWllcyxcclxuICAgIGNyZWF0ZUJvbnVzOiBjcmVhdGVCb251cyxcclxuICAgIGdldEJvbnVzZXM6IGdldEJvbnVzZXMsXHJcbiAgICBjbGVhckJvbnVzZXM6IGNsZWFyQm9udXNlcyxcclxuICAgIGdldFBsYXllcjogZ2V0UGxheWVyLFxyXG4gICAgYmFja2dyb3VuZDogbW9kZWwuYmFja2dyb3VuZCxcclxuICAgIGJvbnVzZXM6IG1vZGVsLmJvbnVzZXMsXHJcbiAgICByZW5kZXI6IHJlbmRlcixcclxuICAgIGNsZWFyUmVuZGVyOiBjbGVhckRpc3BsYXksXHJcbiAgICByZW5kZXJHYW1lT3ZlcjogcmVuZGVyR2FtZU92ZXIsXHJcbiAgICBoaWRlR2FtZU92ZXI6IGhpZGVHYW1lT3ZlcixcclxuICAgIHNldFNjb3JlOiBzZXRTY29yZSxcclxuICAgIHNob3dFbGVtZW50OiBzaG93RWxlbWVudCxcclxuICAgIGhpZGVFbGVtZW50OiBoaWRlRWxlbWVudCxcclxuICAgIGdldFZpZXdwb3J0OiBnZXRWaWV3cG9ydCxcclxuICAgIGNob29zZU1lbnU6IGNob29zZU1lbnUsXHJcbiAgICB1bkNob29zZU1lbnU6IHVuQ2hvb3NlTWVudSxcclxuICAgIG9uQnV0dG9uQ2xpY2s6IG9uQnV0dG9uQ2xpY2ssXHJcbiAgICBhZGRDbGFzczogYWRkQ2xhc3MsXHJcbiAgICByZW1vdmVDbGFzczogcmVtb3ZlQ2xhc3MsXHJcbiAgICBoYXNDbGFzczogaGFzQ2xhc3MsXHJcbiAgICBzZXRTb3VuZE11dGVkOiBzZXRTb3VuZE11dGVkXHJcbn07XHJcblxyXG4iLCJ2YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnLmpzXCIpO1xyXG4vL3ZhciBjb3JlID0gcmVxdWlyZShcIi4vY29yZS5qc1wiKTsgLy9jaXJjdWxhciBsaW5rXHJcbnZhciBtb2RlbF8gPSByZXF1aXJlKFwiLi9tb2RlbC5qc1wiKTtcclxudmFyIG1vZGVsID0gbmV3IG1vZGVsXygpO1xyXG5cclxuZnVuY3Rpb24gZmxpcEhvcml6b250YWxseShjb250ZXh0LCBhcm91bmQpIHtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKGFyb3VuZCwgMCk7XHJcbiAgICBjb250ZXh0LnNjYWxlKC0xLCAxKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKC1hcm91bmQsIDApO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHNlZSBkaXNwbGF5XHJcbiAqL1xyXG5mdW5jdGlvbiBDYW52YXNEaXNwbGF5KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2FudmFzXCIpO1xyXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSBjb25maWcud2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBjb25maWcuaGVpZ2h0O1xyXG4gICAgdGhpcy5zY29yZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZVwiKTtcclxuICAgIHRoaXMuY3ggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgdGhpcy5tZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW51XCIpO1xyXG4gICAgdGhpcy5tYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluXCIpO1xyXG4gICAgdGhpcy5wbGF5QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5XCIpO1xyXG4gICAgdGhpcy5yZWNvcmRzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZWNvcmRzXCIpO1xyXG4gICAgdGhpcy5jcmVkaXRzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jcmVkaXRzXCIpO1xyXG4gICAgdGhpcy5xdWl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5xdWl0XCIpO1xyXG4gICAgdGhpcy5tZW51QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51XCIpO1xyXG4gICAgdGhpcy5yZXN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXN0YXJ0XCIpO1xyXG4gICAgdGhpcy5iYWNrRnJvbVJlY29yZHNCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JlY29yZHMgLmJhY2tcIik7XHJcbiAgICB0aGlzLmJhY2tGcm9tQ3JlZGl0c0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY3JlZGl0cyAuYmFja1wiKTtcclxuICAgIHRoaXMuY3JlZGl0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY3JlZGl0c1wiKTtcclxuICAgIHRoaXMucmVjb3JkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVjb3Jkc1wiKTtcclxuICAgIHRoaXMuZ2FtZV9vdmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lLW92ZXJcIik7XHJcbiAgICB0aGlzLmdhbWVfb3Zlcl9vdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lLW92ZXItb3ZlcmxheVwiKTtcclxuICAgIHRoaXMucHJvZ3Jlc3NfYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9ncmVzcy1iYXJcIik7XHJcbiAgICB0aGlzLnByb2dyZXNzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9ncmVzc1wiKTtcclxuICAgIHRoaXMucCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcFwiKTtcclxuICAgIHRoaXMuc291bmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNvdW5kXCIpO1xyXG4gICAgdGhpcy5wYXVzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGF1c2VcIik7XHJcbn1cclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY2FudmFzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5jYW52YXMpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuY2xlYXJEaXNwbGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY3guZmlsbFN0eWxlID0gXCJyZ2IoNTIsIDE2NiwgMjUxKVwiO1xyXG4gICAgdGhpcy5jeC5maWxsUmVjdCgwLCAwLCBjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uKGVuZW15KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY3guc2F2ZSgpO1xyXG4gICAgdGhpcy5jeC50cmFuc2xhdGUoZW5lbXkucG9zWzBdLCBlbmVteS5wb3NbMV0pO1xyXG4gICAgZW5lbXkuc3ByaXRlLnJlbmRlcih0aGlzLmN4KTtcclxuICAgIHRoaXMuY3gucmVzdG9yZSgpO1xyXG59O1xyXG5cclxudmFyIGJnID0gbW9kZWwuYmFja2dyb3VuZDtcclxuZnVuY3Rpb24gbW92ZUJnU3ByaXRlKGluZGV4KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY3guc2F2ZSgpO1xyXG4gICAgdGhpcy5jeC50cmFuc2xhdGUoYmcucG9zaXRpb25zW2luZGV4XSwgMCk7XHJcbiAgICBiZy5zcHJpdGVzW2luZGV4XS5yZW5kZXIodGhpcy5jeCk7XHJcbiAgICB0aGlzLmN4LnJlc3RvcmUoKTtcclxufVxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJCYWNrZ3JvdW5kID0gZnVuY3Rpb24oKSB7ICAvL1dURj8hXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBtb3ZlID0gbW92ZUJnU3ByaXRlLmJpbmQodGhpcyk7XHJcbiAgICBtb3ZlKGJnLmN1cnJlbnRTcHJpdGUpO1xyXG4gICAgaWYgKCFiZy5pc09uZVRleHR1cmUpIHtcclxuICAgICAgICBtb3ZlKGJnLm5leHRTcHJpdGUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUucmVuZGVyRW5lbWllcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGVsLmVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobW9kZWwuZW5lbWllc1tpXS5wb3NbMF0gPD0gY29uZmlnLndpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlcihtb2RlbC5lbmVtaWVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXJCb251c2VzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9kZWwuYm9udXNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChtb2RlbC5ib251c2VzW2ldLnBvc1swXSA8PSBjb25maWcud2lkdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKG1vZGVsLmJvbnVzZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlclBsYXllciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLl9yZW5kZXIobW9kZWwucGxheWVyKTtcclxufTtcclxuLyoqXHJcbiAqIENsZWFyIHJlbmRlciwgcmVuZGVyIGJhY2tncm91bmQsIHJlbmRlciBlbmVtaWVzLCByZW5kZXIgcGxheWVyXHJcbiAqL1xyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jbGVhckRpc3BsYXkoKTtcclxuICAgIHRoaXMucmVuZGVyQmFja2dyb3VuZCgpO1xyXG4gICAgdGhpcy5yZW5kZXJFbmVtaWVzKCk7XHJcbiAgICB0aGlzLnJlbmRlckJvbnVzZXMoKTtcclxuICAgIHRoaXMucmVuZGVyUGxheWVyKCk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5zaG93RWxlbWVudCA9IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmIChlbCBpbiB0aGlzKVxyXG4gICAgICAgIHRoaXNbZWxdLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG59O1xyXG5cclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmhpZGVFbGVtZW50ID0gZnVuY3Rpb24oZWwpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaWYgKGVsIGluIHRoaXMpXHJcbiAgICAgICAgdGhpc1tlbF0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnJlbmRlckdhbWVPdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNob3dFbGVtZW50KFwiZ2FtZV9vdmVyXCIpO1xyXG4gICAgdGhpcy5zaG93RWxlbWVudChcImdhbWVfb3Zlcl9vdmVybGF5XCIpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuaGlkZUdhbWVPdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuaGlkZUVsZW1lbnQoXCJnYW1lX292ZXJcIik7XHJcbiAgICB0aGlzLmhpZGVFbGVtZW50KFwiZ2FtZV9vdmVyX292ZXJsYXlcIik7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5zZXRTY29yZSA9IGZ1bmN0aW9uKHNjb3JlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuc2NvcmVFbC5pbm5lckhUTUwgPSBzY29yZS50b1N0cmluZygpO1xyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuc2V0UHJvZ3Jlc3MgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLnByb2dyZXNzX2Jhci52YWx1ZSA9IHZhbHVlO1xyXG4gICAgdGhpcy5wLmlubmVySFRNTCA9IHZhbHVlICsgXCIlXCI7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5jaG9vc2VNZW51ID0gZnVuY3Rpb24obWVudUNhc2UpIHtcclxuICAgIHRoaXMubWVudS5jbGFzc0xpc3QuYWRkKG1lbnVDYXNlKTtcclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLnVuQ2hvb3NlTWVudSA9IGZ1bmN0aW9uKG1lbnVDYXNlKSB7XHJcbiAgICB0aGlzLm1lbnUuY2xhc3NMaXN0LnJlbW92ZShtZW51Q2FzZSk7XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5vbkJ1dHRvbkNsaWNrID0gZnVuY3Rpb24oYnV0dG9uTmFtZSwgaGFuZGxlciwgbm90QnV0dG9uKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmICghbm90QnV0dG9uKVxyXG4gICAgICAgIGJ1dHRvbk5hbWUgKz0gXCJCdXR0b25cIjtcclxuICAgIGlmIChidXR0b25OYW1lIGluIHRoaXMpIHtcclxuICAgICAgICB0aGlzW2J1dHRvbk5hbWVdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNhbnZhc0Rpc3BsYXkucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmIChlbCBpbiB0aGlzKSB7XHJcbiAgICAgICAgdGhpc1tlbF0uY2xhc3NMaXN0LmFkZCh2YWx1ZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5DYW52YXNEaXNwbGF5LnByb3RvdHlwZS5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpZiAoZWwgaW4gdGhpcykge1xyXG4gICAgICAgIHRoaXNbZWxdLmNsYXNzTGlzdC5yZW1vdmUodmFsdWUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ2FudmFzRGlzcGxheS5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaWYgKGVsIGluIHRoaXMpIHtcclxuICAgICAgICByZXR1cm4gdGhpc1tlbF0uY2xhc3NMaXN0LmNvbnRhaW5zKHZhbHVlKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgQ2FudmFzRGlzcGxheTogQ2FudmFzRGlzcGxheVxyXG59OyIsInZhciB3b3JsZCA9IHJlcXVpcmUoXCIuL3dvcmxkLmpzXCIpKCk7IiwiLyoqXHJcbiAqIEBwYXJhbSB3aW5kb3cgR2xvYmFsIG9iamVjdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBDYW4gYmU6a2V5Ym9hcmQsIG1lZGljaW5lLCBzbWFydHBob25lXHJcbiAqIEByZXR1cm5zIE9iamVjdCB3aGljaCBjb250ZW50IGluZm8gYWJvdXQgcHJlc3NlZCBidXR0b25zXHJcbiAqIEBzZWUgZ2V0SW5wdXRcclxuICovXHJcbmZ1bmN0aW9uIGlucHV0KHdpbmRvd18sIHR5cGUpIHsgICAgLy90eXBlIC0ga2V5Ym9hcmQsIG1lZGljaW5lLCBzbWFydHBob25lXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBwcmVzc2VkID0gbnVsbDtcclxuICAgIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuICAgICAgICBpZiAoY29kZXMuaGFzT3duUHJvcGVydHkoZXZlbnQua2V5Q29kZSkpIHtcclxuICAgICAgICAgICAgdmFyIGRvd24gPSBldmVudC50eXBlID09PSBcImtleWRvd25cIjtcclxuICAgICAgICAgICAgcHJlc3NlZFtjb2Rlc1tldmVudC5rZXlDb2RlXV0gPSBkb3duO1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhckFsbCgpIHtcclxuICAgICAgICBmb3IgKHZhciBjIGluIHByZXNzZWQpIHtcclxuICAgICAgICAgICAgaWYgKHByZXNzZWQuaGFzT3duUHJvcGVydHkoYykpXHJcbiAgICAgICAgICAgICAgICBwcmVzc2VkW2NdID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJlc3NlZCkge1xyXG4gICAgICAgIHByZXNzZWQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICAgIHZhciBjb2Rlc0tleWJvYXJkID0gezM4OiBcInVwXCJ9O1xyXG4gICAgICAgIHZhciBjb2RlcztcclxuXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJrZXlib2FyZFwiOlxyXG4gICAgICAgICAgICAgICAgY29kZXMgPSBjb2Rlc0tleWJvYXJkO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Xy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvd18uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Xy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBjbGVhckFsbCgpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIHR5cGUgb2YgaW5wdXRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByZXNzZWQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdXQ7IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZy5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIFBsYXllcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5wb3MgPSBbMCwgMF07XHJcbiAgICB0aGlzLnNwcml0ZSA9IG51bGw7XHJcbiAgICB0aGlzLnNwZWVkID0ge3g6IDEsIHk6IDB9O1xyXG4gICAgdGhpcy5hY3RpdmVCb251c2VzVGltZSA9IHtcclxuICAgICAgICBmYXN0OiAwLFxyXG4gICAgICAgIHNsb3c6IDBcclxuICAgIH07XHJcbiAgICB0aGlzLmFjdGl2ZUJvbnVzZXMgPSB7XHJcbiAgICAgICAgZmFzdDogbnVsbCxcclxuICAgICAgICBzbG93OiBudWxsXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBFbmVteShwb3MsIHNwcml0ZSwgc3BlZWQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaWYgKHBvcyA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHRoaXMucG9zID0gMDtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnBvcyA9IHBvcztcclxuICAgIGlmIChzcHJpdGUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICB0aGlzLnNwcml0ZSA9IG51bGw7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBzcHJpdGU7XHJcbiAgICBpZiAoc3BlZWQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICB0aGlzLnNwZWVkID0gMDtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEFjdGl2ZShlbmFibGUsIGRpc2FibGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5lbmFibGUgPSBlbmFibGU7XHJcbiAgICB0aGlzLmRpc2FibGUgPSBkaXNhYmxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBib251c0VuYWJsZSh0eXBlLCBwbGF5ZXIpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaWYgKHR5cGUgaW4gcGxheWVyLmFjdGl2ZUJvbnVzZXNUaW1lKSB7XHJcbiAgICAgICAgcGxheWVyLmFjdGl2ZUJvbnVzZXNUaW1lW3R5cGVdICs9IGNvbmZpZy5ib251c1RpbWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJvbnVzRGlzYWJsZSh0eXBlLCBwbGF5ZXIpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaWYgKHR5cGUgaW4gcGxheWVyLmFjdGl2ZUJvbnVzZXNUaW1lKSB7XHJcbiAgICAgICAgcGxheWVyLmFjdGl2ZUJvbnVzZXNUaW1lW3R5cGVdID0gMDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gQm9udXMocG9zLCBzcHJpdGUsIHR5cGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5zcGVlZCA9IGNvbmZpZy5iYWNrZ3JvdW5kU3BlZWQ7XHJcblxyXG4gICAgaWYgKHBvcyA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHRoaXMucG9zID0gMDtcclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLnBvcyA9IHBvcztcclxuICAgIGlmIChzcHJpdGUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICB0aGlzLnNwcml0ZSA9IG51bGw7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBzcHJpdGU7XHJcbiAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHRoaXMudHlwZSA9IG51bGw7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuXHJcblxyXG4gICAgdGhpcy5hY3RpdmUgPSBuZXcgQWN0aXZlKFxyXG4gICAgICAgIGJvbnVzRW5hYmxlLmJpbmQobnVsbCwgdGhpcy50eXBlKSxcclxuICAgICAgICBib251c0Rpc2FibGUuYmluZChudWxsLCB0aGlzLnR5cGUpXHJcbiAgICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBCYWNrZ3JvdW5kKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xyXG4gICAgdGhpcy5zcHJpdGVzID0gW107XHJcbiAgICB0aGlzLmN1cnJlbnRTcHJpdGUgPSAwO1xyXG4gICAgdGhpcy5uZXh0U3ByaXRlID0gMTtcclxuICAgIHRoaXMuc3BlZWQgPSBjb25maWcuYmFja2dyb3VuZFNwZWVkO1xyXG4gICAgdGhpcy5pc09uZVRleHR1ciA9IHRydWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIE1vZGVsKCkgeyAvL3BhdHRlcm4gc2luZ2xldG9uXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmIChNb2RlbC5jYWNoZSlcclxuICAgICAgICByZXR1cm4gTW9kZWwuY2FjaGU7XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoKTtcclxuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZCgpO1xyXG4gICAgICAgIHRoaXMuYm9udXNlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZW5lbWllcyA9IFtdO1xyXG4gICAgICAgIE1vZGVsLmNhY2hlID0gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbCBvbmNlXHJcbiAqIEBwYXJhbSBwb3NcclxuICogQHBhcmFtIHNwcml0ZVxyXG4gKiBAcmV0dXJucyBwbGF5ZXJcclxuICovXHJcbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIgPSBmdW5jdGlvbiBjcmVhdGVQbGF5ZXIocG9zLCBzcHJpdGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5wbGF5ZXIucG9zID0gcG9zIHx8IFswLCAwXTtcclxuICAgIGlmICh0aGlzLnBsYXllci5zcHJpdGUgPT0gbnVsbClcclxuICAgICAgICB0aGlzLnBsYXllci5zcHJpdGUgPSBzcHJpdGU7XHJcbiAgICB0aGlzLnBsYXllci5zcGVlZCA9IHt4OiAxLCB5OiAwfTtcclxuICAgIHRoaXMucGxheWVyLmFjdGl2ZUJvbnVzZXNUaW1lID0ge1xyXG4gICAgICAgIGZhc3Q6IDAsXHJcbiAgICAgICAgc2xvdzogMFxyXG4gICAgfTtcclxuICAgIHRoaXMucGxheWVyLmFjdGl2ZUJvbnVzZXMgPSB7XHJcbiAgICAgICAgZmFzdDogbnVsbCxcclxuICAgICAgICBzbG93OiBudWxsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsIG9uY2VcclxuICogQHBhcmFtIHNwcml0ZXNcclxuICogQHJldHVybnMgYmFja2dyb3VuZFxyXG4gKi9cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZUJhY2tncm91bmQgPSBmdW5jdGlvbiBjcmVhdGVCYWNrZ3JvdW5kKHNwcml0ZXMpIHsgLy8yIG1pblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB0aGlzLmJhY2tncm91bmQucG9zaXRpb25zID0gW107XHJcbiAgICB0aGlzLmJhY2tncm91bmQuc3ByaXRlcyA9IHNwcml0ZXM7XHJcbiAgICB0aGlzLmJhY2tncm91bmQuc3BlZWQgPSBjb25maWcuYmFja2dyb3VuZFNwZWVkO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kLmN1cnJlbnRTcHJpdGUgPSAwO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kLm5leHRTcHJpdGUgPSAxO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kLnNwcml0ZXNMZW5ndGggPSBzcHJpdGVzLmxlbmd0aDtcclxuICAgIHRoaXMuYmFja2dyb3VuZC5pc09uZVRleHR1cmUgPSB0cnVlO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcHJpdGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGkgPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLnBvc2l0aW9uc1swXSA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLnBvc2l0aW9uc1tpXSA9IGNvbmZpZy53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBBZGQgZW5lbXkgdG8gZW5lbWllc1xyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVcclxuICovXHJcbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVFbmVteSA9IGZ1bmN0aW9uIGNyZWF0ZUVuZW15KHBvcywgc3ByaXRlLCB0eXBlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBzO1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxyXG4gICAgICAgICAgICBzID0gY29uZmlnLmJvdHRvbUVuZW1pZXNTcGVlZDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInRvcFwiOlxyXG4gICAgICAgICAgICBzID0gY29uZmlnLnRvcEVuZW1pZXNTcGVlZDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV3JvbmcgdHlwZSBvZiBlbmVtaWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbmVtaWVzLnB1c2gobmV3IEVuZW15KHBvcywgc3ByaXRlLCBzKSk7XHJcbn07XHJcbi8qKlxyXG4gKiBBZGQgYm9udXMgdG8gYm9udXNlc1xyXG4gKiBAcGFyYW0gcG9zXHJcbiAqIEBwYXJhbSBzcHJpdGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgQ2FuIGJlOiBzcGVlZCwgc2xvdywgc21hbGwsIGJpZ1xyXG4gKi9cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZUJvbnVzID0gZnVuY3Rpb24gY3JlYXRlQm9udXMocG9zLCBzcHJpdGUsIHR5cGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5ib251c2VzLnB1c2gobmV3IEJvbnVzKHBvcywgc3ByaXRlLCB0eXBlKSk7XHJcbn07XHJcblxyXG5Nb2RlbC5jYWNoZSA9IG51bGw7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsOyIsInZhciBwdWJsaXNoZXIgPSB7XHJcbiAgICBzdWJzY3JpYmVyczoge30sXHJcbiAgICBvbjogZnVuY3Rpb24odHlwZSwgZm4pIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLnB1c2goZm4pO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZTogZnVuY3Rpb24odHlwZSwgZm4pIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoXCJ1bnN1YnNjcmliZVwiLCB0eXBlLCBmbik7XHJcbiAgICB9LFxyXG4gICAgdmlzaXRTdWJzY3JpYmVyczogZnVuY3Rpb24oYWN0aW9uLCB0eXBlLCBhcmcpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB2YXIgc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLFxyXG4gICAgICAgICAgICBpLFxyXG4gICAgICAgICAgICBtYXggPSBzdWJzY3JpYmVycy5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG1heDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGlmIChhY3Rpb24gPT09IFwicHVibGlzaFwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1tpXShhcmcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzW2ldID09PSBhcmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGlzaDogZnVuY3Rpb24odHlwZSwgcHVibGljYXRpb24pIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoXCJwdWJsaXNoXCIsIHR5cGUsIHB1YmxpY2F0aW9uKTtcclxuICAgIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIG1ha2VQdWJsaXNoZXIobykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgaTtcclxuICAgIGZvciAoaSBpbiBwdWJsaXNoZXIpIHtcclxuICAgICAgICBpZiAocHVibGlzaGVyLmhhc093blByb3BlcnR5KGkpICYmIHR5cGVvZiBwdWJsaXNoZXJbaV0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICBvW2ldID0gcHVibGlzaGVyW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG8uc3Vic2NyaWJlcnMgPSB7fTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMubWFrZVB1Ymxpc2hlciA9IG1ha2VQdWJsaXNoZXI7IiwidmFyIG1ha2VQdWJsaXNoZXIgPSByZXF1aXJlKFwiLi9wdWJsaXNoZXIuanNcIikubWFrZVB1Ymxpc2hlcjtcclxuXHJcbnZhciBpbWFnZXNDYWNoZSA9IHt9O1xyXG52YXIgYXVkaW9zQ2FjaGUgPSB7fTtcclxudmFyIHJlYWR5Q2FsbGJhY2tzID0gW107XHJcbnZhciByZXNvdXJjZXNDb3VudCA9IDA7XHJcbnZhciByZXNvdXJjZXNMb2FkZWQgPSAxOyAvLyAxIGZvciBiZXN0IHZpZXdcclxucmVhZHlDYWxsYmFja3MuZG9uZSA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gcHJvZ3Jlc3NJblBlcmNlbnQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKHJlc291cmNlc0xvYWRlZCAvIHJlc291cmNlc0NvdW50ICogMTAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hhbmdlTG9hZGluZygpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMucHVibGlzaChcImxvYWRpbmdDaGFuZ2VcIiwgcHJvZ3Jlc3NJblBlcmNlbnQoKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzUmVhZHkoKSB7XHJcbiAgICB2YXIgcmVhZHkgPSB0cnVlO1xyXG4gICAgZm9yICh2YXIgayBpbiBpbWFnZXNDYWNoZSkge1xyXG4gICAgICAgIGlmIChpbWFnZXNDYWNoZS5oYXNPd25Qcm9wZXJ0eShrKSAmJiAhaW1hZ2VzQ2FjaGVba10pIHtcclxuICAgICAgICAgICAgcmVhZHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBrIGluIGF1ZGlvc0NhY2hlKSB7XHJcbiAgICAgICAgaWYgKGF1ZGlvc0NhY2hlLmhhc093blByb3BlcnR5KGspICYmICFhdWRpb3NDYWNoZVtrXSkge1xyXG4gICAgICAgICAgICByZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZWFkeTtcclxufVxyXG5cclxuZnVuY3Rpb24gX2xvYWRJbWcodXJsKSB7XHJcbiAgICBpZiAoaW1hZ2VzQ2FjaGVbdXJsXSkge1xyXG4gICAgICAgIHJldHVybiBpbWFnZXNDYWNoZVt1cmxdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW1hZ2VzQ2FjaGVbdXJsXSA9IGltZztcclxuICAgICAgICAgICAgcmVzb3VyY2VzTG9hZGVkICs9IDE7XHJcbiAgICAgICAgICAgIGNoYW5nZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGlzUmVhZHkoKSkge1xyXG4gICAgICAgICAgICAgICAgcmVhZHlDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoZnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbWcuc3JjID0gdXJsO1xyXG4gICAgICAgIGltYWdlc0NhY2hlW3VybF0gPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gX2xvYWRBdWRpbyh1cmwpIHtcclxuICAgIGlmIChhdWRpb3NDYWNoZVt1cmxdKSB7XHJcbiAgICAgICAgcmV0dXJuIGF1ZGlvc0NhY2hlW3VybF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBhdWRpbyA9IG5ldyBBdWRpbygpO1xyXG4gICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoXCJjYW5wbGF5dGhyb3VnaFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghYXVkaW9zQ2FjaGVbdXJsXSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzTG9hZGVkICs9IDE7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXVkaW9zQ2FjaGVbdXJsXSA9IGF1ZGlvO1xyXG4gICAgICAgICAgICBpZiAoaXNSZWFkeSgpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlYWR5Q2FsbGJhY2tzLmRvbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFkeUNhbGxiYWNrcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZWFkeUNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGF1ZGlvLnNyYyA9IHVybDtcclxuICAgICAgICBhdWRpby5wcmVsb2FkID0gXCJhdXRvXCI7ZnVuY3Rpb24gZmFzdEJvbnVzRW5hYmxlKHBsYXllcikge1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9hdWRpby5sb2FkKCk7XHJcbiAgICAgICAgYXVkaW9zQ2FjaGVbdXJsXSA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBMb2FkIGltYWdlIGFuZCBhZGQgdGhlbSB0byBjYWNoZVxyXG4gKkBwYXJhbSB7KHN0cmluZ3xzdHJpbmdbXSl9IHVybE9mQXJyIEFycmF5IG9mIHVybHNcclxuICogQHNlZSBsb2FkUmVzb3VyY2VzXHJcbiAqL1xyXG5mdW5jdGlvbiBsb2FkSW1hZ2VzKHVybE9mQXJyKSB7XHJcbiAgICBpZiAodXJsT2ZBcnIgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgIHJlc291cmNlc0NvdW50ICs9IHVybE9mQXJyLmxlbmd0aDtcclxuICAgICAgICB1cmxPZkFyci5mb3JFYWNoKGZ1bmN0aW9uICh1cmwpIHtcclxuICAgICAgICAgICAgX2xvYWRJbWcodXJsKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzb3VyY2VzQ291bnQgKz0gMTtcclxuICAgICAgICBfbG9hZEltZyh1cmxPZkFycik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRBdWRpb3ModXJsT2ZBcnIpIHtcclxuICAgIGlmICh1cmxPZkFyciBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgcmVzb3VyY2VzQ291bnQgKz0gdXJsT2ZBcnIubGVuZ3RoO1xyXG4gICAgICAgIHVybE9mQXJyLmZvckVhY2goZnVuY3Rpb24gKHVybCkge1xyXG4gICAgICAgICAgICBfbG9hZEF1ZGlvKHVybCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc291cmNlc0NvdW50ICs9IDE7XHJcbiAgICAgICAgX2xvYWRBdWRpbyh1cmxPZkFycik7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEdldCByZXNvdXJjZSBmcm9tIGNhY2hlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcclxuICogQHJldHVybnMgIEltYWdlXHJcbiAqIEBzZWUgZ2V0UmVzb3VyY2VcclxuICovXHJcbmZ1bmN0aW9uIGdldEltZyh1cmwpIHtcclxuICAgIHJldHVybiBpbWFnZXNDYWNoZVt1cmxdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBdWRpbyh1cmwpIHtcclxuICAgIHJldHVybiBhdWRpb3NDYWNoZVt1cmxdO1xyXG59XHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb24gdG8gZnVuY3Rpb25zIHdoaWNoIHdpbGwgYmUgY2FsbGVkIHRoZW4gYWxsIHJlc291cmNlcyBsb2FkZWRcclxuICogQHBhcmFtIGZ1bmNcclxuICogQHNlZSBvblJlc291cmNlc1JlYWR5XHJcbiAqL1xyXG5mdW5jdGlvbiBvblJlYWR5KGZ1bmMpIHtcclxuICAgIHJlYWR5Q2FsbGJhY2tzLnB1c2goZnVuYyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgbG9hZEltYWdlczogbG9hZEltYWdlcyxcclxuICAgIGxvYWRBdWRpb3M6IGxvYWRBdWRpb3MsXHJcbiAgICBnZXRJbWc6IGdldEltZyxcclxuICAgIGdldEF1ZGlvOiBnZXRBdWRpbyxcclxuICAgIG9uUmVhZHk6IG9uUmVhZHksXHJcbiAgICBpc1JlYWR5OiBpc1JlYWR5LFxyXG4gICAgcHJvZ3Jlc3NJblBlcmNlbnQ6IHByb2dyZXNzSW5QZXJjZW50LFxyXG4gICAgYXVkaW9zOiBhdWRpb3NDYWNoZSxcclxuICAgIGltYWdlczogaW1hZ2VzQ2FjaGVcclxufTtcclxubWFrZVB1Ymxpc2hlcihtb2R1bGUuZXhwb3J0cyk7XHJcblxyXG4iLCJ2YXIgcmVzb3VyY2VzID0gcmVxdWlyZShcIi4vcmVzb3VyY2VzLmpzXCIpO1xyXG5cclxuLyoqXHJcbiAqIFNwcml0ZSBvZiB0ZXh0dXJlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcclxuICogQHBhcmFtIHtudW1iZXJbXX0gcG9zIFBvc2l0aW9uIGluIHNwcml0ZSBzaGVldFxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBzaXplIFNpemUgaW4gc3ByaXRlIHNoZWV0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBTcGVlZCBvZiBwbGF5aW5nIGFuaW1hdGlvblxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBmcmFtZXMgRnJhbWVzIG9mIGFuaW1hdGlvblxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGlyIERpcmVjdGlvbiBvbiBzcHJpdGUgc2hlZXRcclxuICogQHBhcmFtIHtib29sfSBvbmNlIENvdW50IG9mIHBsYXlpbmcgYW5pbWF0aW9uXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAc2VlIGNyZWF0ZVNwcml0ZVxyXG4gKiBAc2VlIGNyZWF0ZVNwcml0ZVxyXG4gKi9cclxuZnVuY3Rpb24gU3ByaXRlKHVybCwgcG9zLCBzaXplLCBzcGVlZCwgZnJhbWVzLCBkaXIsIG9uY2UpIHtcclxuICAgIHRoaXMucG9zID0gcG9zO1xyXG4gICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgdGhpcy5zcGVlZCA9IHR5cGVvZiBzcGVlZCA9PT0gXCJudW1iZXJcIiA/IHNwZWVkIDogMDtcclxuICAgIHRoaXMuZnJhbWVzID0gZnJhbWVzO1xyXG4gICAgdGhpcy5kaXIgPSBkaXIgfHwgXCJob3Jpem9udGFsXCI7XHJcbiAgICB0aGlzLm9uY2UgPSBvbmNlO1xyXG4gICAgdGhpcy5faW5kZXggPSAwO1xyXG59XHJcblxyXG5TcHJpdGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgdGhpcy5faW5kZXggKz0gdGhpcy5zcGVlZCAqIGR0O1xyXG59O1xyXG5TcHJpdGUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChjdHgpIHtcclxuICAgIHZhciBmcmFtZTtcclxuICAgIGlmICh0aGlzLnNwZWVkID4gMCkge1xyXG4gICAgICAgIHZhciBtYXggPSB0aGlzLmZyYW1lcy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIGlkeCA9IE1hdGguZmxvb3IodGhpcy5faW5kZXgpO1xyXG4gICAgICAgIGZyYW1lID0gdGhpcy5mcmFtZXNbaWR4ICUgbWF4XTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub25jZSAmJiBpZHggPj0gbWF4KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZyYW1lID0gMDtcclxuICAgIH1cclxuICAgIHZhciB4ID0gdGhpcy5wb3NbMF07XHJcbiAgICB2YXIgeSA9IHRoaXMucG9zWzFdO1xyXG5cclxuICAgIGlmICh0aGlzLmRpciA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XHJcbiAgICAgICAgeSArPSBmcmFtZSAqIHRoaXMuc2l6ZVsxXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeCArPSBmcmFtZSAqIHRoaXMuc2l6ZVswXTtcclxuICAgIH1cclxuXHJcbiAgICBjdHguZHJhd0ltYWdlKHJlc291cmNlcy5nZXRJbWcodGhpcy51cmwpLCB4LCB5LCB0aGlzLnNpemVbMF0sIHRoaXMuc2l6ZVsxXSwgMCwgMCwgdGhpcy5zaXplWzBdLCB0aGlzLnNpemVbMV0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7IiwidmFyIGNvcmUgPSByZXF1aXJlKFwiLi9jb3JlLmpzXCIpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnLmpzXCIpO1xyXG5cclxudmFyIGxhc3RUaW1lLFxyXG4gICAgaXNHYW1lT3ZlcixcclxuICAgIHNjb3JlLFxyXG4gICAgcHJlc3NlZCxcclxuICAgIHBsYXlTb3VuZCxcclxuICAgIGlzUGF1c2VkLFxyXG4gICAgYmdTb3VuZDtcclxudmFyIHZpZXdwb3J0ID0gY29yZS5nZXRWaWV3cG9ydCgpO1xyXG5cclxuZnVuY3Rpb24gY29sbGlkZXMoeCwgeSwgciwgYiwgeDIsIHkyLCByMiwgYjIpIHtcclxuICAgIHJldHVybiAociA+PSB4MiAmJiB4IDwgcjIgJiYgeSA8IGIyICYmIGIgPj0geTIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBib3hDb2xsaWRlcyhwb3MsIHNpemUsIHBvczIsIHNpemUyKSB7XHJcbiAgICByZXR1cm4gY29sbGlkZXMocG9zWzBdLCBwb3NbMV0sIHBvc1swXSArIHNpemVbMF0sIHBvc1sxXSArIHNpemVbMV0sXHJcbiAgICAgICAgcG9zMlswXSwgcG9zMlsxXSwgcG9zMlswXSArIHNpemUyWzBdLCBwb3MyWzFdICsgc2l6ZTJbMV0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldCgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5oaWRlR2FtZU92ZXIoKTtcclxuICAgIGlzR2FtZU92ZXIgPSBmYWxzZTtcclxuICAgIHNjb3JlID0gMDtcclxuXHJcbiAgICB2YXIgcGxheWVyU3ByaXRlID0gY29yZS5jcmVhdGVTcHJpdGUoXCJpbWcvcmVjdC5qcGdcIiwgWzAsIDBdLCBbMTAwLCAxMDBdLCAwLCBbMF0pO1xyXG4gICAgY29yZS5jcmVhdGVQbGF5ZXIoXHJcbiAgICAgICAgW3ZpZXdwb3J0LndpZHRoIC8gMiwgNTBdLFxyXG4gICAgICAgIHBsYXllclNwcml0ZVxyXG4gICAgKTtcclxuXHJcbiAgICB2YXIgYmdTcHJpdGUxID0gY29yZS5jcmVhdGVTcHJpdGUoXCJpbWcvYmxhY2suanBnXCIsIFswLCAwXSwgW3ZpZXdwb3J0LndpZHRoICogMywgdmlld3BvcnQuaGVpZ2h0XSwgMCk7XHJcbiAgICBjb3JlLmNyZWF0ZUJhY2tncm91bmQoXHJcbiAgICAgICAgW2JnU3ByaXRlMSwgYmdTcHJpdGUxXVxyXG4gICAgKTtcclxuXHJcbiAgICBjb3JlLmNsZWFyRW5lbWllcygpO1xyXG4gICAgY29yZS5jbGVhckJvbnVzZXMoKTtcclxuICAgIGNvcmUuY3JlYXRlRW5lbXkoXHJcbiAgICAgICAgWzEwMDAsIDQ1MF0sXHJcbiAgICAgICAgcGxheWVyU3ByaXRlLFxyXG4gICAgICAgIFwiYm90dG9tXCJcclxuICAgICk7XHJcbiAgICBjb3JlLmNyZWF0ZUVuZW15KFxyXG4gICAgICAgIFsyMDAwLCAxMDBdLFxyXG4gICAgICAgIHBsYXllclNwcml0ZSxcclxuICAgICAgICBcInRvcFwiXHJcbiAgICApO1xyXG5cclxuICAgIGNvcmUuY3JlYXRlQm9udXMoXHJcbiAgICAgICAgWzE1MDAsIDMwMF0sXHJcbiAgICAgICAgcGxheWVyU3ByaXRlLFxyXG4gICAgICAgIFwiZmFzdFwiXHJcbiAgICApO1xyXG4gICAgY29yZS5jcmVhdGVCb251cyhcclxuICAgICAgICBbMTgwMCwgMzAwXSxcclxuICAgICAgICBwbGF5ZXJTcHJpdGUsXHJcbiAgICAgICAgXCJzbG93XCJcclxuICAgIClcclxufVxyXG5cclxudmFyIHNjb3JlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlXCIpO1xyXG5cclxuZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgY29yZS5yZW5kZXJHYW1lT3ZlcigpO1xyXG4gICAgc2NvcmVFbC5pbm5lckhUTUwgPSBzY29yZTtcclxufVxyXG5cclxuXHJcbnZhciBiZyA9IGNvcmUuYmFja2dyb3VuZDtcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUJhY2tncm91bmQoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBjdXIgPSBiZy5jdXJyZW50U3ByaXRlLFxyXG4gICAgICAgICAgICBuZXh0ID0gYmcubmV4dFNwcml0ZTtcclxuICAgIHZhciBuZXdCZ1BvcyA9IGJnLnBvc2l0aW9uc1tjdXJdIC0gYmcuc3BlZWQgKiBkdCxcclxuICAgICAgICBuZXdSaWdodENvcm5lciA9IG5ld0JnUG9zICsgYmcuc3ByaXRlc1tjdXJdLnNpemVbMF07XHJcblxyXG4gICAgaWYgKG5ld1JpZ2h0Q29ybmVyIDwgY29uZmlnLndpZHRoKSB7XHJcbiAgICAgICAgaWYgKGJnLmlzT25lVGV4dHVyZSkge1xyXG4gICAgICAgICAgICBiZy5pc09uZVRleHR1cmUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1JpZ2h0Q29ybmVyID4gMCkge1xyXG4gICAgICAgICAgICBiZy5wb3NpdGlvbnNbY3VyXSA9IG5ld0JnUG9zO1xyXG4gICAgICAgICAgICBiZy5wb3NpdGlvbnNbbmV4dF0gPSBiZy5wb3NpdGlvbnNbbmV4dF0gLSBiZy5zcGVlZCAqIGR0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJnLnBvc2l0aW9uc1tjdXJdID0gY29uZmlnLndpZHRoO1xyXG4gICAgICAgICAgICBjdXIgPSBiZy5jdXJyZW50U3ByaXRlID0gbmV4dDtcclxuICAgICAgICAgICAgbmV4dCA9IGJnLm5leHRTcHJpdGUgPSAoY3VyICsgMSkgJSBiZy5zcHJpdGVzTGVuZ3RoO1xyXG4gICAgICAgICAgICBiZy5wb3NpdGlvbnNbY3VyXSA9IGJnLnBvc2l0aW9uc1tjdXJdIC0gYmcuc3BlZWQgKiBkdDtcclxuICAgICAgICAgICAgaWYgKGJnLnNwcml0ZXNbY3VyXS5zaXplWzBdIDw9IGNvbmZpZy53aWR0aCkgeyAgIC8vaWYgdGV4dHVyZSdzIHNpemUgZXF1YWwgd2luZG93IHdpZHRoXHJcbiAgICAgICAgICAgICAgICBiZy5wb3NpdGlvbnNbbmV4dF0gPSBiZy5wb3NpdGlvbnNbbmV4dF0gLSBiZy5zcGVlZCAqIGR0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYmcuaXNPbmVUZXh0dXJlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYmcucG9zaXRpb25zW2N1cl0gPSBuZXdCZ1BvcztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tDb2xpc2lvbnMocG9zKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBjb2xsaXNpb24gPSBbXSxcclxuICAgICAgICBzaXplID0gY29yZS5nZXRQbGF5ZXIoKS5zcHJpdGUuc2l6ZSxcclxuICAgICAgICBpLFxyXG4gICAgICAgIGVuZW1pZXMgPSBjb3JlLmdldEVuZW1pZXMoKSxcclxuICAgICAgICBib251c2VzID0gY29yZS5nZXRCb251c2VzKCk7XHJcblxyXG4gICAgaWYgKHBvc1sxXSA8IDApIHtcclxuICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJ0b3BcIn0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocG9zWzFdICsgc2l6ZVsxXSA+IGNvbmZpZy5mb3Jlc3RMaW5lKSB7XHJcbiAgICAgICAgY29sbGlzaW9uLnB1c2goe3R5cGU6IFwiZm9yZXN0XCJ9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChib3hDb2xsaWRlcyhwb3MsIHNpemUsIGVuZW1pZXNbaV0ucG9zLCBlbmVtaWVzW2ldLnNwcml0ZS5zaXplKSkge1xyXG4gICAgICAgICAgICBjb2xsaXNpb24ucHVzaCh7dHlwZTogXCJlbmVteVwiLCB0YXJnZXQ6IGVuZW1pZXNbaV19KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGJvbnVzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoYm94Q29sbGlkZXMocG9zLCBzaXplLCBib251c2VzW2ldLnBvcywgYm9udXNlc1tpXS5zcHJpdGUuc2l6ZSkpIHtcclxuICAgICAgICAgICAgY29sbGlzaW9uLnB1c2goe3R5cGU6IFwiYm9udXNcIiwgdGFyZ2V0OiBib251c2VzW2ldfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbGxpc2lvbjtcclxufVxyXG5cclxuZnVuY3Rpb24gZmFzdEFsbCgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIHBsYXllciA9IGNvcmUuZ2V0UGxheWVyKCk7XHJcbiAgICBpZiAocGxheWVyLmFjdGl2ZUJvbnVzZXNUaW1lLmZhc3QgPD0gMCkge1xyXG4gICAgICAgIHZhciB4U3BlZWQgPSBjb25maWcuZmFzdEJvbnVzU3BlZWQ7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgdmFyIGVuZW1pZXMgPSBjb3JlLmdldEVuZW1pZXMoKTtcclxuICAgICAgICB2YXIgYm9udXNlcyA9IGNvcmUuZ2V0Qm9udXNlcygpO1xyXG4gICAgICAgIGNvcmUuYmFja2dyb3VuZC5zcGVlZCAqPSB4U3BlZWQ7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZW5lbWllc1tpXS5zcGVlZCAqPSB4U3BlZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBib251c2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGJvbnVzZXNbaV0uc3BlZWQgKj0geFNwZWVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdW5GYXN0QWxsKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgeFNwZWVkID0gY29uZmlnLmZhc3RCb251c1NwZWVkO1xyXG4gICAgdmFyIGk7XHJcbiAgICB2YXIgZW5lbWllcyA9IGNvcmUuZ2V0RW5lbWllcygpO1xyXG4gICAgdmFyIGJvbnVzZXMgPSBjb3JlLmdldEJvbnVzZXMoKTtcclxuICAgIGNvcmUuYmFja2dyb3VuZC5zcGVlZCAvPSB4U3BlZWQ7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGVuZW1pZXNbaV0uc3BlZWQgLz0geFNwZWVkO1xyXG4gICAgfVxyXG4gICAgZm9yIChpID0gMDsgaSA8IGJvbnVzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBib251c2VzW2ldLnNwZWVkIC89IHhTcGVlZDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHNsb3dBbGwoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBwbGF5ZXIgPSBjb3JlLmdldFBsYXllcigpO1xyXG4gICAgaWYgKHBsYXllci5hY3RpdmVCb251c2VzVGltZS5zbG93IDw9IDApIHtcclxuICAgICAgICB2YXIgeFNwZWVkID0gY29uZmlnLnNsb3dCb251c1NwZWVkO1xyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIHZhciBlbmVtaWVzID0gY29yZS5nZXRFbmVtaWVzKCk7XHJcbiAgICAgICAgdmFyIGJvbnVzZXMgPSBjb3JlLmdldEJvbnVzZXMoKTtcclxuICAgICAgICBjb3JlLmJhY2tncm91bmQuc3BlZWQgKj0geFNwZWVkO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBlbmVtaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGVuZW1pZXNbaV0uc3BlZWQgKj0geFNwZWVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYm9udXNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBib251c2VzW2ldLnNwZWVkICo9IHhTcGVlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuU2xvd0FsbCgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIHhTcGVlZCA9IGNvbmZpZy5zbG93Qm9udXNTcGVlZDtcclxuICAgIHZhciBpO1xyXG4gICAgdmFyIGVuZW1pZXMgPSBjb3JlLmdldEVuZW1pZXMoKTtcclxuICAgIHZhciBib251c2VzID0gY29yZS5nZXRCb251c2VzKCk7XHJcbiAgICBjb3JlLmJhY2tncm91bmQuc3BlZWQgLz0geFNwZWVkO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZW1pZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBlbmVtaWVzW2ldLnNwZWVkIC89IHhTcGVlZDtcclxuICAgIH1cclxuICAgIGZvciAoaSA9IDA7IGkgPCBib251c2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYm9udXNlc1tpXS5zcGVlZCAvPSB4U3BlZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXRCb251cyh0eXBlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJmYXN0XCI6XHJcbiAgICAgICAgICAgIGZhc3RBbGwoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInNsb3dcIjpcclxuICAgICAgICAgICAgc2xvd0FsbCgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdW5kb0JvbnVzKHR5cGUpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcImZhc3RcIjpcclxuICAgICAgICAgICAgdW5GYXN0QWxsKCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJzbG93XCI6XHJcbiAgICAgICAgICAgIHVuU2xvd0FsbCgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVsZXRlQm9udXMoYm9udXMpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIGJvbnVzZXMgPSBjb3JlLmdldEJvbnVzZXMoKTtcclxuICAgIHZhciBpID0gMDtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBib251c2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGJvbnVzZXNbaV0gPT0gYm9udXMpIHtcclxuICAgICAgICAgICAgYm9udXNlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY29sbGlkZVBsYXllcihwb3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIHBsYXllciA9IGNvcmUuZ2V0UGxheWVyKCk7XHJcbiAgICB2YXIgY29sbGlzaW9uID0gY2hlY2tDb2xpc2lvbnMocG9zKSxcclxuICAgICAgICBpID0gMDtcclxuICAgIGlmIChjb2xsaXNpb24ubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGNvbGxpc2lvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHN3aXRjaCAoY29sbGlzaW9uW2ldLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInRvcFwiOlxyXG4gICAgICAgICAgICAgICAgcGxheWVyLnNwZWVkLnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLnBvc1sxXSA9IDA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImZvcmVzdFwiOlxyXG4gICAgICAgICAgICAgICAgZ2FtZU92ZXIoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBjYXNlIFwiZW5lbXlcIjpcclxuICAgICAgICAgICAgICAgIGdhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImJvbnVzXCI6XHJcbiAgICAgICAgICAgICAgICBpbml0Qm9udXMoY29sbGlzaW9uW2ldLnRhcmdldC50eXBlKTsgIC8vb3JkZXIgaXMgaW1wb3J0YW50XHJcbiAgICAgICAgICAgICAgICBjb2xsaXNpb25baV0udGFyZ2V0LmFjdGl2ZS5lbmFibGUocGxheWVyKTtcclxuICAgICAgICAgICAgICAgIGlmIChjb2xsaXNpb25baV0udGFyZ2V0LnR5cGUgaW4gcGxheWVyLmFjdGl2ZUJvbnVzZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuYWN0aXZlQm9udXNlc1tjb2xsaXNpb25baV0udGFyZ2V0LnR5cGVdID0gY29sbGlzaW9uW2ldLnRhcmdldDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlbGV0ZUJvbnVzKGNvbGxpc2lvbltpXS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUGxheWVyKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBpLFxyXG4gICAgICAgIHBsYXllciA9IGNvcmUuZ2V0UGxheWVyKCksXHJcbiAgICAgICAgYWN0aXZlQm9udXNlc1RpbWUgPSBwbGF5ZXIuYWN0aXZlQm9udXNlc1RpbWUsXHJcbiAgICAgICAgYWN0aXZlQm9udXNlcyA9IHBsYXllci5hY3RpdmVCb251c2VzO1xyXG4gICAgcGxheWVyLnNwcml0ZS51cGRhdGUoZHQpO1xyXG4gICAgcGxheWVyLnNwZWVkLnkgKz0gY29uZmlnLmdyYXZpdHkgKiBkdDtcclxuICAgIGlmIChwcmVzc2VkWyd1cCddKSB7XHJcbiAgICAgICAgcGxheWVyLnNwZWVkLnkgLT0gY29uZmlnLmJyZWF0aGVTcGVlZCAqIGR0O1xyXG4gICAgfVxyXG4gICAgdmFyIG1vdGlvbiA9IHBsYXllci5zcGVlZC55ICogZHQ7XHJcbiAgICB2YXIgbmV3UG9zID0gW3BsYXllci5wb3NbMF0sIHBsYXllci5wb3NbMV0gKyBtb3Rpb25dO1xyXG4gICAgaWYgKGNvbGxpZGVQbGF5ZXIobmV3UG9zKSkgeyAvL21vdmUgb3Igbm90IHRvIG1vdmVcclxuICAgICAgICBwbGF5ZXIucG9zID0gbmV3UG9zO1xyXG4gICAgfVxyXG4gICAgZm9yIChpIGluIGFjdGl2ZUJvbnVzZXMpIHtcclxuICAgICAgICBpZiAoYWN0aXZlQm9udXNlcy5oYXNPd25Qcm9wZXJ0eShpKSAmJiBhY3RpdmVCb251c2VzW2ldICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvbnVzZXNUaW1lW2ldIC09IGR0O1xyXG4gICAgICAgICAgICBpZiAoYWN0aXZlQm9udXNlc1RpbWVbaV0gPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuYWN0aXZlQm9udXNlc1tpXS5hY3RpdmUuZGlzYWJsZShwbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgdW5kb0JvbnVzKHBsYXllci5hY3RpdmVCb251c2VzW2ldLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLmFjdGl2ZUJvbnVzZXNbaV0gPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVFbmVtaWVzKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBlbmVtaWVzID0gY29yZS5nZXRFbmVtaWVzKCksXHJcbiAgICAgICAgaSxcclxuICAgICAgICBtb3Rpb247XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5lbWllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGVuZW1pZXNbaV0uc3ByaXRlLnVwZGF0ZShkdCk7XHJcbiAgICAgICAgbW90aW9uID0gZW5lbWllc1tpXS5zcGVlZCAqIGR0O1xyXG4gICAgICAgIGVuZW1pZXNbaV0ucG9zID0gW2VuZW1pZXNbaV0ucG9zWzBdIC0gbW90aW9uLCBlbmVtaWVzW2ldLnBvc1sxXV07XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUJvbnVzZXMoZHQpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIGJvbnVzZXMgPSBjb3JlLmdldEJvbnVzZXMoKSxcclxuICAgICAgICBpLFxyXG4gICAgICAgIG1vdGlvbjtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBib251c2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYm9udXNlc1tpXS5zcHJpdGUudXBkYXRlKGR0KTtcclxuICAgICAgICBtb3Rpb24gPSBib251c2VzW2ldLnNwZWVkICogZHQ7XHJcbiAgICAgICAgYm9udXNlc1tpXS5wb3MgPSBbYm9udXNlc1tpXS5wb3NbMF0gLSBtb3Rpb24sIGJvbnVzZXNbaV0ucG9zWzFdXTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKGR0KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmICghaXNHYW1lT3Zlcikge1xyXG4gICAgICAgIHVwZGF0ZUVuZW1pZXMoZHQpO1xyXG4gICAgICAgIHVwZGF0ZUJhY2tncm91bmQoZHQpO1xyXG4gICAgICAgIHVwZGF0ZVBsYXllcihkdCk7XHJcbiAgICAgICAgdXBkYXRlQm9udXNlcyhkdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5yZW5kZXIoKTtcclxuICAgIGNvcmUuc2V0U2NvcmUoc2NvcmUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgIHZhciBkdCA9IChub3cgLSBsYXN0VGltZSkgLyAxMDAwO1xyXG5cclxuICAgIHVwZGF0ZShkdCk7XHJcbiAgICByZW5kZXIoKTtcclxuXHJcbiAgICBsYXN0VGltZSA9IG5vdztcclxuICAgIGlmICghaXNQYXVzZWQpIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHByZXNzZWQgPSBjb3JlLmdldElucHV0KHdpbmRvdywgXCJrZXlib2FyZFwiKTtcclxuICAgIHJlc2V0KCk7XHJcbiAgICBsYXN0VGltZSA9IERhdGUubm93KCk7XHJcbiAgICBjb3JlLnNob3dFbGVtZW50KFwicGF1c2VcIik7XHJcbiAgICBtYWluKCk7XHJcblxyXG4gICAgLypmdW5jdGlvbiBoYWRubGVyKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKChuZXcgRGF0ZSkuZ2V0U2Vjb25kcygpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImN1cjogXCIgKyBiZy5jdXJyZW50U3ByaXRlICsgXCIgLSBwb3M6IFwiICsgYmcucG9zaXRpb25zW2JnLmN1cnJlbnRTcHJpdGVdKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm5leHQ6IFwiICsgYmcubmV4dFNwcml0ZSArIFwiIC0gcG9zOiBcIiArIGJnLnBvc2l0aW9uc1tiZy5uZXh0U3ByaXRlXSk7XHJcbiAgICB9XHJcbiAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoaGFkbmxlciwgMTAwMCk7Ki9cclxufVxyXG5cclxuY29yZS5sb2FkSW1hZ2VzKFtcclxuICAgIFwiaW1nL2JsYWNrLmpwZ1wiLFxyXG4gICAgXCJpbWcvcmVjdC5qcGdcIlxyXG5dKTtcclxuXHJcbi8qY29yZS5sb2FkQXVkaW9zKFtcclxuICAgIFwiYXVkaW8vNTAud2F2XCJcclxuXSk7Ki9cclxuXHJcbmZ1bmN0aW9uIHBhdXNlR2FtZSgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaXNQYXVzZWQgPSB0cnVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1blBhdXNlR2FtZSgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaXNQYXVzZWQgPSBmYWxzZTtcclxuICAgIGxhc3RUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgIG1haW4oKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYmdTb3VuZFN0YXJ0KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBiZ1NvdW5kLmN1cnJlbnRUaW1lID0gMDtcclxuICAgIGJnU291bmQucGxheSgpO1xyXG4gICAgaWYgKFwibG9vcFwiIGluIGJnU291bmQpIHtcclxuICAgICAgICBiZ1NvdW5kLmxvb3AgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBiZ1NvdW5kLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRlZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGJnU291bmQuY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICAgICAgICBiZ1NvdW5kLnBsYXkoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBtYWluTWVudSgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5zaG93RWxlbWVudChcIm1haW5cIik7XHJcbiAgICBjb3JlLmhpZGVFbGVtZW50KFwicHJvZ3Jlc3NcIik7XHJcbiAgICBjb3JlLmNob29zZU1lbnUoXCJtYWluXCIpO1xyXG4gICAgY29yZS5zaG93RWxlbWVudChcInNvdW5kXCIpO1xyXG4gICAgYmdTb3VuZFN0YXJ0KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlY29yZHNNZW51KCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVFbGVtZW50KFwibWFpblwiKTtcclxuICAgIGNvcmUuc2hvd0VsZW1lbnQoXCJyZWNvcmRzXCIpO1xyXG4gICAgY29yZS5jaG9vc2VNZW51KFwicmVjb3Jkc1wiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYmFja0Zyb21SZWNvcmRzKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBjb3JlLmhpZGVFbGVtZW50KFwicmVjb3Jkc1wiKTtcclxuICAgIGNvcmUuc2hvd0VsZW1lbnQoXCJtYWluXCIpO1xyXG4gICAgY29yZS51bkNob29zZU1lbnUoXCJyZWNvcmRzXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVkaXRzTWVudSgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5oaWRlRWxlbWVudChcIm1haW5cIik7XHJcbiAgICBjb3JlLnNob3dFbGVtZW50KFwiY3JlZGl0c1wiKTtcclxuICAgIGNvcmUuY2hvb3NlTWVudShcImNyZWRpdHNcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJhY2tGcm9tQ3JlZGl0cygpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5oaWRlRWxlbWVudChcImNyZWRpdHNcIik7XHJcbiAgICBjb3JlLnNob3dFbGVtZW50KFwibWFpblwiKTtcclxuICAgIGNvcmUudW5DaG9vc2VNZW51KFwiY3JlZGl0c1wiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYmFja1RvTWVudSgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5oaWRlR2FtZU92ZXIoKTtcclxuICAgIGNvcmUuaGlkZUVsZW1lbnQoXCJwYXVzZVwiKTtcclxuICAgIGNvcmUuc2hvd0VsZW1lbnQoXCJtZW51XCIpO1xyXG59XHJcbmZ1bmN0aW9uIGluaXRTb3VuZHMoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGJnU291bmQgPSBjb3JlLmdldEF1ZGlvKFwiYXVkaW8vNTAud2F2XCIpO1xyXG4gICAgcGxheVNvdW5kID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwbGF5U291bmRcIikgPT09IFwidHJ1ZVwiO1xyXG4gICAgaWYgKHBsYXlTb3VuZCkge1xyXG4gICAgICAgIGNvcmUuYWRkQ2xhc3MoXCJzb3VuZFwiLCBcInNvdW5kLW9uXCIpO1xyXG4gICAgICAgIGNvcmUucmVtb3ZlQ2xhc3MoXCJzb3VuZFwiLCBcInNvdW5kLW9mZlwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29yZS5hZGRDbGFzcyhcInNvdW5kXCIsIFwic291bmQtb2ZmXCIpO1xyXG4gICAgICAgIGNvcmUucmVtb3ZlQ2xhc3MoXCJzb3VuZFwiLCBcInNvdW5kLW9uXCIpO1xyXG4gICAgfVxyXG4gICAgY29yZS5zZXRTb3VuZE11dGVkKCFwbGF5U291bmQpO1xyXG59XHJcbi8vY29yZS5vblJlc291cmNlc1JlYWR5KGluaXRTb3VuZHMpO1xyXG5jb3JlLm9uUmVzb3VyY2VzUmVhZHkobWFpbk1lbnUpOyAvL29yZGVyIGlzIGltcG9ydGFudFxyXG5cclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwicGxheVwiLCBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5oaWRlRWxlbWVudChcIm1lbnVcIik7XHJcbiAgICBpbml0KCk7XHJcbn0pO1xyXG5cclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwicmVzdGFydFwiLCBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgY29yZS5oaWRlR2FtZU92ZXIoKTtcclxuICAgIHJlc2V0KCk7XHJcbn0pO1xyXG5cclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwic291bmRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmIChjb3JlLmhhc0NsYXNzKFwic291bmRcIiwgXCJzb3VuZC1vblwiKSkge1xyXG4gICAgICAgIGNvcmUucmVtb3ZlQ2xhc3MoXCJzb3VuZFwiLCBcInNvdW5kLW9uXCIpO1xyXG4gICAgICAgIGNvcmUuYWRkQ2xhc3MoXCJzb3VuZFwiLCBcInNvdW5kLW9mZlwiKTtcclxuICAgICAgICBwbGF5U291bmQgPSBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29yZS5yZW1vdmVDbGFzcyhcInNvdW5kXCIsIFwic291bmQtb2ZmXCIpO1xyXG4gICAgICAgIGNvcmUuYWRkQ2xhc3MoXCJzb3VuZFwiLCBcInNvdW5kLW9uXCIpO1xyXG4gICAgICAgIHBsYXlTb3VuZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInBsYXlTb3VuZFwiLCBwbGF5U291bmQpO1xyXG4gICAgY29yZS5zZXRTb3VuZE11dGVkKCFwbGF5U291bmQpO1xyXG59LCB0cnVlKTtcclxuXHJcbmNvcmUub25CdXR0b25DbGljayhcInBhdXNlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBpZiAoY29yZS5oYXNDbGFzcyhcInBhdXNlXCIsIFwicGF1c2Utb25cIikpIHtcclxuICAgICAgICBjb3JlLnJlbW92ZUNsYXNzKFwicGF1c2VcIiwgXCJwYXVzZS1vblwiKTtcclxuICAgICAgICBjb3JlLmFkZENsYXNzKFwicGF1c2VcIiwgXCJwYXVzZS1vZmZcIik7XHJcbiAgICAgICAgdW5QYXVzZUdhbWUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29yZS5yZW1vdmVDbGFzcyhcInBhdXNlXCIsIFwicGF1c2Utb2ZmXCIpO1xyXG4gICAgICAgIGNvcmUuYWRkQ2xhc3MoXCJwYXVzZVwiLCBcInBhdXNlLW9uXCIpO1xyXG4gICAgICAgIHBhdXNlR2FtZSgpO1xyXG4gICAgfVxyXG59LCB0cnVlKTtcclxuXHJcbmNvcmUub25CdXR0b25DbGljayhcImNyZWRpdHNcIiwgY3JlZGl0c01lbnUpO1xyXG5jb3JlLm9uQnV0dG9uQ2xpY2soXCJiYWNrRnJvbUNyZWRpdHNcIiwgYmFja0Zyb21DcmVkaXRzKTtcclxuY29yZS5vbkJ1dHRvbkNsaWNrKFwicmVjb3Jkc1wiLCByZWNvcmRzTWVudSk7XHJcbmNvcmUub25CdXR0b25DbGljayhcImJhY2tGcm9tUmVjb3Jkc1wiLCBiYWNrRnJvbVJlY29yZHMpO1xyXG5jb3JlLm9uQnV0dG9uQ2xpY2soXCJtZW51XCIsIGJhY2tUb01lbnUpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxufTsiXX0=
