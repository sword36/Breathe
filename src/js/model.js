module.exports.player = {};
module.exports.enemies = [];
module.exports.background = {};
module.exports.bonuses = [];
/**
 * Should be call once
 * @param pos
 * @param sprite
 * @returns player
 */
module.exports.createPlayer = function createPlayer(pos, sprite) {
    "use strict";
    module.exports.player.pos = pos || [0, 0];
    module.exports.player.sprite = sprite;
    return module.exports.player;
};

/**
 * Should be call once
 * @param pos
 * @param sprites
 * @returns background
 */
module.exports.createBackground = function createBackground(pos, sprites) {
    "use strict";
    module.exports.background.pos = pos || [0, 0];
    module.exports.background.sprites = sprites;
    module.exports.background.currentSprite = 0;
    module.exports.background.spritesLength = sprites.length || 1;
    return module.exports.background;
};
/**
 * Add enemie to enemies
 * @param pos
 * @param sprite
 */
module.exports.createEnemie = function createEnemie(pos, sprite) {
    "use strict";
    module.exports.enemies.push({
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
    module.exports.bonuses.push({
        pos: pos,
        sprite: sprite,
        type: type
    });
};