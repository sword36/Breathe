var config = require("./config.js");

function Player() {
    "use strict";
    this.pos = [0, 0];
    this.sprite = null;
    this.speed = {x: 1, y: 0};
    this.activeBonusesTime = {
        fast: 0,
        slow: 0,
        big: 0,
        small: 0
    };
    this.activeBonuses = {
        fast: null,
        slow: null,
        big: null,
        small: null
    };

    this.state = null; //up, down, float, fly
    this.statesFrames = {};
    this.statesFrames.float = [0];
    this.statesFrames.up = [1, 2, 3];
    this.statesFrames.fly = [4, 5, 6, 7, 8];
    this.statesFrames.down = [9, 10, 11, 12];
    this.currentFrames = [];
}
function nextState(next) {
    "use strict";
    this.done = false;
    if (next in this.statesFrames) {
        this.state = next;
        this.currentFrames = this.statesFrames[this.state];
        this.sprite.setFrames(this.currentFrames, false);
    } else
        throw new Error("Wrong sprite next state");
}

Player.prototype.setState = function(state) {
    "use strict";
    if (state in this.statesFrames) {
        if (state != this.state) {
            if (this.state == "fly" && state == "up" || this.state == "float" && state == "down")
                return;
            this.state = state;
            this.currentFrames = this.statesFrames[this.state];
            if (state == "up") {
                this.sprite.setFrames(this.currentFrames, true, nextState.bind(this, "fly"));
            } else if (state == "down") {
                this.sprite.setFrames(this.currentFrames, true, nextState.bind(this, "float"));
            } else {
                this.sprite.setFrames(this.currentFrames, false);
            }
        }
    }
    else
        throw new Error("Wrong player state");
};

function Enemy(pos, sprite, speed, type) {
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
    if (type === undefined)
        this.type = "enemy";
    else
        this.type = type;

    this.state = null; //close, far, angry
    this.statesFrames = {};
    this.statesFrames.far = [0];
    this.statesFrames.close = [1, 2, 3, 4, 5];
    this.statesFrames.angry = [6, 7, 8, 9, 10, 11];
    this.statesFrames.getAway = [4, 3, 2, 1, 0];
    this.currentFrames = [];
}

Enemy.prototype.setState = function(state) {
    "use strict";
    if (state in this.statesFrames) {
        if (state != this.state) {
            if ((this.state == "angry" && state == "close") || (this.state == "far" && state == "getAway")) return;
            this.state = state;
            this.currentFrames = this.statesFrames[this.state];
            if (state == "close") {
                this.sprite.setFrames(this.currentFrames, true, nextState.bind(this, "angry"));
            } else if (state == "getAway") {
                this.sprite.setFrames(this.currentFrames, true, nextState.bind(this, "far"));
            } else {
                this.sprite.setFrames(this.currentFrames, false);
            }
        }
    }
    else
        throw new Error("Wrong player state");
};

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

    this.wave = Math.random() * Math.PI * 2;

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
        this.background = {};
        this.background.top = new Background();
        this.background.middle = new Background();
        this.background.down = new Background();
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
    this.player.sprite = sprite;
    this.player.speed = {x: 1, y: 0};
    this.player.activeBonusesTime = {
        fast: 0,
        slow: 0,
        big: 0,
        small: 0
    };
    this.player.activeBonuses = {
        fast: null,
        slow: null,
        big: null,
        small: null
    };
};

/**
 * Should be call once
 * @param sprites
 * @returns background
 */
Model.prototype.createBackground = function createBackground(sprites, viewport) { //2 min
    "use strict";
    for (var i in this.background) {
        if (this.background.hasOwnProperty(i)) {
            this.background[i].positions = [];
            this.background[i].sprites = sprites[i] ? sprites[i] : [];

            var j = 0; //for counting clouds sprites
            this.background[i].sprites.forEach(function(sprite) {
                switch (i) {
                    case "top":
                        sprite.sizeToDraw = [viewport[0] * 2, viewport[1]];
                        this.background[i].speed = config.backgroundSpeed * 0.7;

                        this.background[i].currentSprite = 0;
                        this.background[i].nextSprite = 1;
                        this.background[i].spritesLength = this.background[i].sprites.length;
                        this.background[i].isOneTexture = true;

                        for (var l = 0; l < this.background[i].sprites.length; l++) {
                            if (l === 0) {
                                this.background[i].positions[0] = 0;
                            } else {
                                this.background[i].positions[l] = config.width;
                            }
                        }
                        break;
                    case "middle":
                        sprite.sizeToDraw = [viewport[0] * 2, viewport[1]];
                        this.background[i].speed = config.backgroundSpeed;

                        this.background[i].currentSprite = 0;
                        this.background[i].nextSprite = 1;
                        this.background[i].spritesLength = this.background[i].sprites.length;
                        this.background[i].isOneTexture = true;

                        for (var l = 0; l < this.background[i].sprites.length; l++) {
                            if (l === 0) {
                                this.background[i].positions[0] = 0;
                            } else {
                                this.background[i].positions[l] = config.width;
                            }
                        }
                        break;
                    case "down":
                        sprite.sizeToDraw = [viewport[0] * 2, viewport[1]];

                        this.background[i].speed = config.backgroundSpeed * 1.3;
                        this.background[i].currentSprite = 0;
                        this.background[i].nextSprite = 1;
                        this.background[i].spritesLength = this.background[i].sprites.length;
                        this.background[i].isOneTexture = true;

                        for (var l = 0; l < this.background[i].sprites.length; l++) {
                            if (l === 0) {
                                this.background[i].positions[0] = 0;
                            } else {
                                this.background[i].positions[l] = config.width;
                            }
                        }
                        break;
                    default :
                        throw "Wrong type of background";
                }
                j++;
            }, this);
            j = 0;
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
            s = config.cloudSpeed;
            break;
        case "bird":
            s = config.birdSpeed;
            break;
        case "cloud":
            s = config.cloudSpeed;
            break;
        default:
            throw new Error("Wrong type of enemy");
    }

    var createdEnemy = new Enemy(pos, sprite, s, type);
    this.enemies.push(createdEnemy);
    return createdEnemy;
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