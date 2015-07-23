var Sprite = require("./sprite.js");
var input = require("./input.js");
var resources = require("./resources.js");
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

