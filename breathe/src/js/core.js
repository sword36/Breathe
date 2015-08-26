var Sprite = require("./sprite.js");
var input = require("./input.js");
var resources = require("./resources.js");
var model_ = require("./model.js");
var display_ =  require("./display.js");
var TableOfRecords = require("./tableOfRecords.js");
var levelEditor = require("./levelEditor.js");
var config = require("./config.js");

var display = new display_.CanvasDisplay();
var model = new model_();
var tableOfRecords = new TableOfRecords();

function createSprite(url, pos, size, speed, sizeToDraw, frames, dir, once) {
    "use strict";
    return new Sprite(url, pos, size, speed, sizeToDraw, frames, dir, once);
}

function getViewport() {
    "use strict";
    return display.getViewport();
}

function setViewport(opt) {
    display.setViewport(opt);
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

function setScore(score, finish) {
    "use strict";
    display.setScore(score, finish);
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

function onButtonClick(buttonName, handler, notButton, specialEvent) {
    "use strict";
    display.onButtonClick(buttonName, handler, notButton, specialEvent);
}

function addEventToChildren(parent, childType, handler, specialEvent) {
    display.addEventToChildren(parent, childType, handler, specialEvent);
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

function checkRadioButton(nameRadio) {
    "use strict";
    return display.checkRadioButton(nameRadio);
}

function drawRecords(records, curName) {
    "use strict";
    display.drawRecords(records, curName);
}

function getName() {
    "use strict";
    return display.getName();
}

function setName(name) {
    "use strict";
    display.setName(name);
}

function focusEl(el) {
    "use strict";
    display.focusEl(el);
}

function closeWindow() {
    "use strict";
    display.close();
}

function setCheckedRadioButton(nameRadio, value) {
    "use strict";
    display.setCheckedRadioButton(nameRadio, value);
}

function showError(msg) {
    "use strict";
    display.showError(msg);
}

function hideError() {
    "use strict";
    display.hideError();
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

function createBackground(sprites, viewport) {
    "use strict";
    model.createBackground(sprites, viewport);
}

function createEnemy(pos, sprite, type) {
    "use strict";
    return model.createEnemy(pos, sprite, type);
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
    getAllAudio: resources.getAllAudio,
    onResourcesReady: resources.onReady,
    onResourceLoadingError: resources.onErrorLoading,
    onLevelLoaded: resources.onLevelLoaded,
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
    tableOfRecords: tableOfRecords,
    clearRender: clearDisplay,
    renderGameOver: renderGameOver,
    hideGameOver: hideGameOver,
    setScore: setScore,
    showElement: showElement,
    hideElement: hideElement,
    getViewport: getViewport,
    setViewport: setViewport,
    syncViewport: display.syncViewport.bind(display),
    chooseMenu: chooseMenu,
    unChooseMenu: unChooseMenu,
    onButtonClick: onButtonClick,
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    showError: showError,
    hideError: hideError,
    setSoundMuted: setSoundMuted,
    checkRadioButton: checkRadioButton,
    drawRecords: drawRecords,
    getName: getName,
    setName: setName,
    focusEl: focusEl,
    closeWindow: closeWindow,
    setCheckedRadioButton: setCheckedRadioButton,
    getMapObjects: levelEditor.getMapObjects,
    loadLevel: levelEditor.loadLevel,
    addEventToChildren: addEventToChildren
};

