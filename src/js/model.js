/**
 * Created by USER on 10.07.2015.
 */
var core = require("./core.js");

var player;
var enemies = [];
var background;
var bonuses = [];

function createPlayer(pos, sprite) {
    "use strict";
    player.pos = pos || [0, 0];
    player.sprite = sprite;
    return player;
}

function createBackground(pos, sprites) {
    "use strict";
    background.pos = pos || [0, 0];
    background.sprites = sprites;
    background.currentSprite = 0;
    background.spritesLength = sprites.length;
    return background;
}

function createEnemie(pos, sprite) {
    "use strict";
    enemies.push({
        pos: pos,
        sprite: sprite
    });
}

function createBonus(pos, sprite, type) {
    "use strict";
    bonuses.push({
        pos: pos,
        sprite: sprite,
        type: type
    });
}

module.exports = {
    player: player,
    enemies: enemies,
    background: background,
    bonuses: bonuses,
    createPlayer: createPlayer,
    createEnemie: createEnemie,
    createBonus: createBonus
};