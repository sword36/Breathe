var config = require("./config.js");
if (localStorage.getItem("inputType") != null) {
    config.inputType = localStorage.getItem("inputType");
}
var core = require("./core.js");

var lastTime,
    isGameOver = true,
    isPausedByButton = false,
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

var win = gui.Window.get();
win.on("loaded", function() {
    "use strict";
    win.show();
});

win.on("blur", function() {
    "use strict";
    if (!isGameOver) {
        checkPauseOn();
    }
});

win.on("focus", function() {
    "use strict";
    if (!isGameOver && !isPausedByButton) {
        checkPauseOff();
    }
});

function createMapObject(sprites) {
    "use strict";
    var mapObjects;
    if (createMapObject.cache == null) {
        mapObjects = core.getMapObjects();
        createMapObject.cache = mapObjects;
    } else {
        mapObjects = createMapObject.cache;
    }

    for (var i = 0; i < mapObjects.length; i++) {
        var mapObject = mapObjects[i];
        if (mapObject.class == "enemy") {
            switch (mapObject.type) {
                case "bird":
                    core.createEnemy(mapObject.pos, sprites.bird, mapObject.type);
                    break;
                default : throw new Error("Wrong map object type");
            }
        } else if (mapObject.class == "bonus") {
            switch (mapObject.type) {
                case "big":
                    core.createBonus(mapObject.pos, sprites.big, mapObject.type);
                    break;
                case "small":
                    core.createBonus(mapObject.pos, sprites.small, mapObject.type);
                    break;
                case "fast":
                    core.createBonus(mapObject.pos, sprites.fast, mapObject.type);
                    break;
                case "slow":
                    core.createBonus(mapObject.pos, sprites.slow, mapObject.type);
                    break;
                default : throw new Error("Wrong map object type");
            }
        }
    }
}
createMapObject.cache = null;

function reset() {
    "use strict";
    core.hideGameOver();
    isGameOver = false;
    score = 0;


    var frame22 = [];
    for (var i = 0; i < 22; i++) {
        frame22.push(i);
    }

    var playerSprite = core.createSprite("img/sphereSpriteSheet.png", [0, 0], [184, 300], 16, [92, 150]);
    var birdSprite = core.createSprite("img/bird.png", [0, 0], [173, 138], 6, [100, 80], frame22);
    var bonusBigSprite = core.createSprite("img/bonuses.png", [0, 0], [254, 202], 1, [127, 102], [0]);
    var bonusSmallSprite = core.createSprite("img/bonuses.png", [0, 0], [254, 202], 1, [127, 102], [1]);
    var bonusFastSprite = core.createSprite("img/bonuses.png", [0, 0], [254, 202], 1, [127, 102], [2]);
    var bonusSlowSprite = core.createSprite("img/bonuses.png", [0, 0], [254, 202], 1, [127, 102], [3]);

    core.createPlayer(
        [viewport.width / 2 - playerSprite.sizeToDraw[0] / 2, 50],
        playerSprite
    );
    core.getPlayer().setState("float");

    var bgSprite1 = core.createSprite("img/fon1.jpg");
    var bgSprite2 = core.createSprite("img/fon2.jpg");
    core.createBackground(
        [bgSprite1, bgSprite2]
    );

    core.clearEnemies();
    core.clearBonuses();

    createMapObject({
        bird: birdSprite,
        big: bonusBigSprite,
        small: bonusSmallSprite,
        fast: bonusFastSprite,
        slow: bonusSlowSprite
    });
}

function gameOver() {
    "use strict";
    isGameOver = true;
    core.setScore(score, true);
    core.renderGameOver();
    var curName = core.tableOfRecords.getCurrentName();
    if (curName) {
        core.setName(curName);
    }
    core.focusEl("inputName");
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
        size = core.getPlayer().sprite.sizeToDraw,
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
        var sizeEnemy = [0, 0];
        var posEnemy = [0, 0];
        switch (enemies[i].type) {
            case "bird":
                sizeEnemy = [enemies[i].sprite.sizeToDraw[0], enemies[i].sprite.sizeToDraw[1] / 2];
                posEnemy = [enemies[i].pos[0], enemies[i].pos[1] +  sizeEnemy[1] / 2];
                break;
            default :
                sizeEnemy = enemies[i].sprite.sizeToDraw;
                posEnemy = enemies[i].pos;
        }

        if (boxCollides(pos, size, posEnemy, sizeEnemy)) {
            collision.push({type: "enemy", target: enemies[i]});
        }
    }

    for (i = 0; i < bonuses.length; i++) {
        if (boxCollides(pos, size, bonuses[i].pos, bonuses[i].sprite.sizeToDraw)) {
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

function increasePlayerSize() {
    "use strict";
    var player = core.getPlayer();
    if (player.activeBonusesTime.big <= 0) {
        var oldSize = player.sprite.sizeToDraw;
        player.sprite.sizeToDraw = [oldSize[0] * config.increaseBonusSize, oldSize[1] * config.increaseBonusSize];
        var newSize = player.sprite.sizeToDraw;
        player.pos[0] = player.pos[0] - (newSize[0] / 2 - oldSize[0] / 2);
        player.pos[1] = player.pos[1] - (newSize[1] / 2 - oldSize[1] / 2);
    }
}

function unIncreasePlayerSize() {
    "use strict";
    var player = core.getPlayer();
    var oldSize = player.sprite.sizeToDraw;
    player.sprite.sizeToDraw = [oldSize[0] / config.increaseBonusSize, oldSize[1] / config.increaseBonusSize];
    var newSize = player.sprite.sizeToDraw;
    player.pos[0] = player.pos[0] - (newSize[0] / 2 - oldSize[0] / 2);
    player.pos[1] = player.pos[1] - (newSize[1] / 2 - oldSize[1] / 2);
}

function decreasePlayerSize() {
    "use strict";
    var player = core.getPlayer();
    if (player.activeBonusesTime.small <= 0) {
        var oldSize = player.sprite.sizeToDraw;
        player.sprite.sizeToDraw = [oldSize[0] * config.decreaseBonusSize, oldSize[1] * config.decreaseBonusSize];
        var newSize = player.sprite.sizeToDraw;
        player.pos[0] = player.pos[0] - (newSize[0] / 2 - oldSize[0] / 2);
        player.pos[1] = player.pos[1] - (newSize[1] / 2 - oldSize[1] / 2);
    }
}

function unDecreasePlayerSize() {
    "use strict";
    var player = core.getPlayer();
    var oldSize = player.sprite.sizeToDraw;
    player.sprite.sizeToDraw = [oldSize[0] / config.decreaseBonusSize, oldSize[1] / config.decreaseBonusSize];
    var newSize = player.sprite.sizeToDraw;
    player.pos[0] = player.pos[0] - (newSize[0] / 2 - oldSize[0] / 2);
    player.pos[1] = player.pos[1] - (newSize[1] / 2 - oldSize[1] / 2);
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
        case "big":
            increasePlayerSize();
            break;
        case "small":
            decreasePlayerSize();
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
        case "big":
            unIncreasePlayerSize();
            break;
        case "small":
            unDecreasePlayerSize();
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
    if (player.speed.y < config.maxSpeed) {
        player.speed.y += config.gravity * dt;
    }
    if (config.inputType == "serialport") {
        if (pressed.breathe > config.lowerLimitOfBreathe) {
            console.log("UP");
            player.setState("up");
            if (player.speed.y > -config.maxSpeed) {
                player.speed.y -= config.breatheFactor * pressed.breathe * dt;
            }
        } else {
            player.setState("down");
            console.log("Down");
        }
    } else {
        if (pressed['up']) {
            player.speed.y -= config.breatheSpeed * dt;
            player.setState("up");
        } else {
            player.setState("down");
        }
    }
    var motion = player.speed.y * dt;
    var newPos = [player.pos[0], player.pos[1] + motion];
    if (collidePlayer(newPos)) { //move or not to move
        newPos = [player.pos[0], player.pos[1] + motion]; // for case of bonus "big"
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
        motionX,
        motionY;
    for (i = 0; i < bonuses.length; i++) {
        bonuses[i].sprite.update(dt);
        motionX = bonuses[i].speed * dt;
        bonuses[i].wave += config.bonusWaveSpeed * dt;
        motionY = Math.sin(bonuses[i].wave) * config.bonusWaveSize;
        bonuses[i].pos = [bonuses[i].pos[0] - motionX, bonuses[i].pos[1] + motionY];
    }
}

function update(dt) {
    "use strict";
    if (!isGameOver) {
        updateEnemies(dt);
        updateBackground(dt);
        updatePlayer(dt);
        updateBonuses(dt);
        score += bg.speed * dt * config.scoreRate;
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
    reset();
    lastTime = Date.now();
    core.showElement("pause");
    core.showElement("scoreEl");
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
    "img/fon1.jpg",
    "img/fon2.jpg",
    "img/sphereSpriteSheet.png",
    "img/bird.png",
    "img/bonuses.png"
]);

core.loadAudios([
    "audio/abc.ogg"
]);

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

function addNameToRecords() {
    "use strict";
    var name = core.getName();
    if (name) {
        core.tableOfRecords.setCurrentName(name);
        core.tableOfRecords.setRecord(name, score);
    }
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
    pressed = core.getInput();
}

function recordsMenu() {
    "use strict";
    var tableOfRecords = core.tableOfRecords;
    core.hideElement("main");
    core.showElement("records");
    core.chooseMenu("records");

    var records = tableOfRecords.getRecords(typeStorage);
    var curName = tableOfRecords.getCurrentName();
    core.drawRecords(records, curName);
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
    addNameToRecords();
    core.hideGameOver();
    core.hideElement("pause");
    core.hideElement("scoreEl");
    core.showElement("menu");
}
function initSounds() {
    "use strict";
    bgSound = core.getAudio("audio/abc.ogg");
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

function resetInput(type) {
    "use strict";
    localStorage.setItem("inputType", type);
    win.reloadDev();
}

core.onResourcesReady(initSounds);
core.onResourcesReady(mainMenu); //order is important
core.onResourceLoadingError(resetInput.bind(null, "keyboard"));

var errorOnLoading = localStorage.getItem("errorMessage");
if (errorOnLoading != null) {
    localStorage.removeItem("errorMessage");
    core.showError(errorOnLoading);
}

core.onButtonClick("play", function() {
    "use strict";
    core.hideElement("menu");
    init();
});

core.onButtonClick("restart", function() {
    "use strict";
    addNameToRecords();
    core.hideGameOver();
    reset();
});

core.onButtonClick("exit", function() {
    "use strict";
    core.closeWindow();
});

core.onButtonClick("closeError", function() {
    "use strict";
    core.hideError();
});

var typeStorage = "local";
core.onButtonClick("storageButtons", function() {
    var newStorageType = core.checkRadioButton("storage");
    if (typeStorage != newStorageType) {
        var records;
        typeStorage = newStorageType;
        var tableOfRecords = core.tableOfRecords;
        switch (typeStorage) {
            case "local":
                records = tableOfRecords.getRecords(typeStorage);
                core.drawRecords(records);
                break;
            case "online":
                records = [];
                core.drawRecords(records); //mocha
                break;
        }
    }
}, true, "change");

core.onButtonClick("inputButtons", function() {
    var newInputType = core.checkRadioButton("input");
    if (config.inputType != newInputType) {
        resetInput(newInputType);
    }
}, true, "change");

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

function checkPauseOff() {
    "use strict";
    if (core.hasClass("pause", "pause-on")) {
        core.removeClass("pause", "pause-on");
        core.addClass("pause", "pause-off");
        unPauseGame();
        isPausedByButton = false;
        return true;
    }
    return false;
}

function checkPauseOn() {
    "use strict";
    if (core.hasClass("pause", "pause-off")) {
        core.removeClass("pause", "pause-off");
        core.addClass("pause", "pause-on");
        pauseGame();
        return true;
    }
    return false;
}

function checkPause() {
    "use strict";
    isPausedByButton = true;
    if (!checkPauseOff()) {
        checkPauseOn();
    }
}

function openLink(e) {
    gui.Shell.openExternal(e.target.title);
}

core.onButtonClick("pause", checkPause, true);
core.onButtonClick("credits", creditsMenu);
core.onButtonClick("backFromCredits", backFromCredits);
core.onButtonClick("records", recordsMenu);
core.onButtonClick("backFromRecords", backFromRecords);
core.onButtonClick("menu", backToMenu);
core.addEventToChildren("creditsList", "SPAN", openLink);

core.setCheckedRadioButton("input", config.inputType);

module.exports = function() {
    "use strict";

};