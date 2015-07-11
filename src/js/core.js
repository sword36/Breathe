var resources = require("./resources.js");
var Sprite = require("./sprite.js");
var input = require(".input.js");
var model = require("./model.js");
var display = new require("./display.js")();
var config = require("./config");

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
    render: display.render,
    clearRender: display.clear,
    renderGameOver: display.renderGameOver,
    hideGameOver: display.hideGameOver,
    setScore: display.setScore,
    getViewport: getViewport
};

