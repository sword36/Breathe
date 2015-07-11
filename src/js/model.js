var player = {};
var enemies = [];
var background = {};
var bonuses = [];
/**
 * Should be call once
 * @param pos
 * @param sprite
 * @returns player
 */
function createPlayer(pos, sprite) {
    "use strict";
    player.pos = pos || [0, 0];
    player.sprite = sprite;
    return player;
}

/**
 * Should be call once
 * @param pos
 * @param sprites
 * @returns background
 */
function createBackground(pos, sprites) {
    "use strict";
    background.pos = pos || [0, 0];
    background.sprites = sprites;
    background.currentSprite = 0;
    background.spritesLength = sprites.length;
    return background;
}
/**
 * Add enemie to enemies
 * @param pos
 * @param sprite
 */
function createEnemie(pos, sprite) {
    "use strict";
    enemies.push({
        pos: pos,
        sprite: sprite
    });
}
/**
 * Add bonus to bonuses
 * @param pos
 * @param sprite
 * @param {string} type Can be: speed, slow, small, big
 */
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
    createBonus: createBonus,
    createBackground: createBackground
};