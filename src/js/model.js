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