var config = require("./config.js");

var player = {},
    background = {},
    bonuses = [];
module.exports.enemies = [];
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
    background.nextSprite = 1;
    background.spritesLength = sprites.length;
    background.isOneTexture = true;
    for (var i = 0; i < sprites.length; i++) {
        if (i === 0) {
            background.positions[0] = 0;
        } else {
            background.positions[i] = config.width;
        }
    }
    return background;
};
/**
 * Add enemie to enemies
 * @param pos
 * @param sprite
 */
module.exports.createEnemie = function createEnemie(pos, sprite, type) {
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
    module.exports.enemies.push({
        pos: pos,
        sprite: sprite,
        speed: s
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
module.exports.bonuses = bonuses;
