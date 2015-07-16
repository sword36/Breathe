var core = require("./core.js");
var config = require("./config.js");

var lastTime,
    isGameOver,
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

function reset() {
    "use strict";
    core.hideGameOver();
    isGameOver = false;
    score = 0;

    var playerSprite = core.createSprite("img/rect.jpg", [0, 0], [100, 100], 0, [0]);
    core.createPlayer(
        [viewport.width / 2, 50],
        playerSprite
    );

    var bgSprite1 = core.createSprite("img/black.jpg", [0, 0], [viewport.width * 3, viewport.height], 0);
    core.createBackground(
        [bgSprite1, bgSprite1]
    );

    core.enemies = [];
    core.bonuses = [];
    core.createEnemie(
        [1000, 300],
        playerSprite,
        "bottom"
    );
    core.createEnemie(
        [2000, 300],
        playerSprite,
        "top"
    );


}

var scoreEl = document.querySelector("#score");

function gameOver() {
    "use strict";
    isGameOver = true;
    core.renderGameOver();
    scoreEl.innerHTML = score;
}


var bg = core.background;

function updateBackground(dt) {
    "use strict";

    var cur = bg.currentSprite,
            next = bg.nextSprite;
    var newBgPos = bg.positions[cur] - config.backgroundSpeed * dt,
        newRightCorner = newBgPos + bg.sprites[cur].size[0];

    if (newRightCorner < config.width) {
        if (bg.isOneTexture) {
            bg.isOneTexture = false;
        }
        if (newRightCorner > 0) {
            bg.positions[cur] = newBgPos;
            bg.positions[next] = bg.positions[next] - config.backgroundSpeed * dt;
        } else {
            bg.positions[cur] = config.width;
            cur = bg.currentSprite = next;
            next = bg.nextSprite = (cur + 1) % bg.spritesLength;
            bg.positions[cur] = bg.positions[cur] - config.backgroundSpeed * dt;
            if (bg.sprites[cur].size[0] <= config.width) {   //if texture's size equal window width
                bg.positions[next] = bg.positions[next] - config.backgroundSpeed * dt;
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
        size = core.player.sprite.size,
        i,
        enemies = core.enemies,
        bonuses = core.bonuses;

    if (pos[1] < 0) {
        collision.push({type: "top"});
    }
    else if (pos[1] + size[1] > config.forestLine) {
        collision.push({type: "forest"});
    }

    for (i = 0; i < enemies.length; i++) {
        if (boxCollides(pos, size, enemies[i].pos, enemies[i].sprite.size)) {
            collision.push({type: "enemy", target: enemies[i]});
        }
    }

    for (i = 0; i < bonuses.length; i++) {
        if (boxCollides(pos, size, bonuses[i].pos, bonuses[i].sprite.size)) {
            collision.push({type: "bonus", target: bonuses[i]});
        }
    }
    return collision;
}

function collidePlayer(pos) {
    "use strict";
    var collision = checkColisions(pos),
        i = 0;
    if (collision.length === 0)
        return true;
    for (i = 0; i < collision.length; i++) {
        switch (collision[i].type) {
            case "top":
                core.player.speed.y = 0;
                core.player.pos[1] = 0;
                break;
            case "forest":
                gameOver();
                return true;
            case "enemy":
                gameOver();
                break;
            case "bonus":
                core.player.pos = pos;
                return true;
            default: return true;
        }
    }
    return false;
}

function updatePlayer(dt) {
    "use strict";
    core.player.sprite.update(dt);
    core.player.speed.y += config.gravity * dt;
    if (pressed['up']) {
        core.player.speed.y -= config.breatheSpeed * dt;
    }
    var motion = core.player.speed.y * dt;
    var newPos = [core.player.pos[0], core.player.pos[1] + motion];
    if (collidePlayer(newPos)) { //move or not to move
        core.player.pos = newPos;
    }
}

function updateEnities(dt) {
    "use strict";
    var enemies = core.enemies,
        i,
        motion;
    for (i = 0; i < enemies.length; i++) {
        enemies[i].sprite.update(dt);
        motion = enemies[i].speed * dt;
        enemies[i].pos = [enemies[i].pos[0] - motion, enemies[i].pos[1]];
    }
}

function update(dt) {
    "use strict";
    if (!isGameOver) {
        updateEnities(dt);
        updateBackground(dt);
        updatePlayer(dt);
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
    pressed = core.getInput(window, "keyboard");
    reset();
    lastTime = Date.now();
    core.showElement("pause");
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
    "img/black.jpg",
    "img/rect.jpg"
]);

core.loadAudios([
    "audio/Lordi.mp3"
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
}

function recordsMenu() {
    "use strict";
    core.hideElement("main");
    core.showElement("records");
    core.chooseMenu("records");
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
    core.hideGameOver();
    core.hideElement("pause");
    core.showElement("menu");
}
function initSounds() {
    "use strict";
    bgSound = core.getAudio("audio/Lordi.mp3");
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
core.onResourcesReady(initSounds);
core.onResourcesReady(mainMenu); //order is important

core.onButtonClick("play", function() {
    "use strict";
    core.hideElement("menu");
    init();
});

core.onButtonClick("restart", function() {
    "use strict";
    core.hideGameOver();
    reset();
});

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

core.onButtonClick("pause", function() {
    "use strict";
    if (core.hasClass("pause", "pause-on")) {
        core.removeClass("pause", "pause-on");
        core.addClass("pause", "pause-off");
        unPauseGame();
    } else {
        core.removeClass("pause", "pause-off");
        core.addClass("pause", "pause-on");
        pauseGame();
    }
}, true);

core.onButtonClick("credits", creditsMenu);
core.onButtonClick("backFromCredits", backFromCredits);
core.onButtonClick("records", recordsMenu);
core.onButtonClick("backFromRecords", backFromRecords);
core.onButtonClick("menu", backToMenu);

module.exports = function() {
    "use strict";

};