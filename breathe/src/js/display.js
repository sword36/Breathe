var config = require("./config.js");
//var core = require("./core.js"); //circular link
var model_ = require("./model.js");
var model = new model_();

function flipHorizontally(context, around) {
    context.translate(around, 0);
    context.scale(-1, 1);
    context.translate(-around, 0);
}
/**
 *
 * @constructor
 * @see display
 */
function CanvasDisplay() {
    "use strict";
    this.canvas = document.querySelector("#canvas");
    this.canvas.width = config.width;
    this.canvas.height = config.height;
    this.scoreEl = document.querySelector(".score");
    this.scoreEndEl = document.querySelector("#score");
    this.cx = this.canvas.getContext('2d');
    this.menu = document.querySelector("#menu");
    this.main = document.querySelector("#main");
    this.playButton = document.querySelector(".play");
    this.recordsButton = document.querySelector(".records");
    this.creditsButton = document.querySelector(".credits");
    this.quitButton = document.querySelector(".quit");
    this.menuButton = document.querySelector(".menu");
    this.restartButton = document.querySelector(".restart");
    this.backFromRecordsButton = document.querySelector("#records .back");
    this.backFromCreditsButton = document.querySelector("#credits .back");
    this.credits = document.querySelector("#credits");
    this.records = document.querySelector("#records");
    this.wrapperTable = document.querySelector("#wrapperTable");
    this.game_over = document.querySelector("#game-over");
    this.game_over_overlay = document.querySelector("#game-over-overlay");
    this.progress_bar = document.querySelector("#progress-bar");
    this.progress = document.querySelector("#progress");
    this.p = document.querySelector("#p");
    this.sound = document.querySelector(".sound");
    this.pause = document.querySelector(".pause");
    this.storageButtons = document.querySelector("#storageButtons");
    this.storageRadio = document.getElementsByName("storage");
    this.inputName = document.querySelector("#game-over input");
}

CanvasDisplay.prototype.clear = function() {
    "use strict";
    this.canvas.parentNode.removeChild(this.canvas);
};

CanvasDisplay.prototype.clearDisplay = function() {
    "use strict";
    this.cx.fillStyle = "rgb(52, 166, 251)";
    this.cx.fillRect(0, 0, config.width, config.height);
};

CanvasDisplay.prototype._render = function(enemy) {
    "use strict";
    this.cx.save();
    //var posX = enemy.pos[0] - enemy.sprite.size[0] / 2;
    //var posY = enemy.pos[1] - enemy.sprite.size[1] / 2;
    this.cx.translate(enemy.pos[0], enemy.pos[1]);
    enemy.sprite.render(this.cx);
    this.cx.restore();
};

var bg = model.background;
function moveBgSprite(index) {
    "use strict";
    this.cx.save();
    this.cx.translate(bg.positions[index], 0);
    bg.sprites[index].render(this.cx);
    this.cx.restore();
}
CanvasDisplay.prototype.renderBackground = function() {  //WTF?!
    "use strict";
    var move = moveBgSprite.bind(this);
    move(bg.currentSprite);
    if (!bg.isOneTexture) {
        move(bg.nextSprite);
    }
};

CanvasDisplay.prototype.renderEnemies = function() {
    "use strict";
    for (var i = 0; i < model.enemies.length; i++) {
        if (model.enemies[i].pos[0] <= config.width) {
            this._render(model.enemies[i]);
        }
    }
};

CanvasDisplay.prototype.renderBonuses = function() {
    "use strict";
    for (var i = 0; i < model.bonuses.length; i++) {
        if (model.bonuses[i].pos[0] <= config.width) {
            this._render(model.bonuses[i]);
        }
    }
};

CanvasDisplay.prototype.renderPlayer = function() {
    "use strict";
    this._render(model.player);
};
/**
 * Clear render, render background, render enemies, render player
 */
CanvasDisplay.prototype.render = function() {
    "use strict";
    this.clearDisplay();
    this.renderBackground();
    this.renderEnemies();
    this.renderBonuses();
    this.renderPlayer();
};

CanvasDisplay.prototype.showElement = function(el) {
    "use strict";
    if (el in this)
        this[el].style.display = 'block';
};


CanvasDisplay.prototype.hideElement = function(el) {
    "use strict";
    if (el in this)
        this[el].style.display = 'none';
};

CanvasDisplay.prototype.renderGameOver = function() {
    this.showElement("game_over");
    this.showElement("game_over_overlay");
    this.hideElement("scoreEl");
    this.hideElement("pause")
};

CanvasDisplay.prototype.hideGameOver = function() {
    "use strict";
    this.hideElement("game_over");
    this.hideElement("game_over_overlay");
    this.showElement("scoreEl");
    this.showElement("pause");
};

CanvasDisplay.prototype.setScore = function(score, finish) {
    "use strict";
    score = Math.floor(score);
    this.scoreEl.innerHTML = score.toString();
    if (finish)
        this.scoreEndEl.innerHTML = score.toString();
};

CanvasDisplay.prototype.setProgress = function(value) {
    "use strict";
    this.progress_bar.value = value;
    this.p.innerHTML = value + "%";
};

CanvasDisplay.prototype.chooseMenu = function(menuCase) {
    this.menu.classList.add(menuCase);
};

CanvasDisplay.prototype.unChooseMenu = function(menuCase) {
    this.menu.classList.remove(menuCase);
};

CanvasDisplay.prototype.onButtonClick = function(buttonName, handler, notButton, specialEvent) {
    "use strict";
    if (!notButton)
        buttonName += "Button";
    if (buttonName in this) {
        if (typeof specialEvent == "undefined")
            this[buttonName].addEventListener("click", handler);
        else {
            this[buttonName].addEventListener(specialEvent, handler);
        }
    }
};

CanvasDisplay.prototype.addClass = function(el, value) {
    "use strict";
    if (el in this) {
        this[el].classList.add(value);
    }
};

CanvasDisplay.prototype.removeClass = function(el, value) {
    "use strict";
    if (el in this) {
        this[el].classList.remove(value);
    }
};

CanvasDisplay.prototype.hasClass = function(el, value) {
    "use strict";
    if (el in this) {
        return this[el].classList.contains(value);
    }
};

CanvasDisplay.prototype.checkRadioButton = function(nameRadio) {
    "use strict";
    nameRadio += "Radio";
    if (nameRadio in this) {
        for (var i = 0; i < this[nameRadio].length; i++) {
            if (this[nameRadio][i].type == "radio" && this[nameRadio][i].checked) {
                return this[nameRadio][i].value;
            }
        }
    }
};

CanvasDisplay.prototype.drawRecords = function(records) {
    "use strict";
    this.wrapperTable.innerHTML = "";
    if (records) {
        var table = document.createElement("table");
        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            var row = document.createElement("tr");

            var placeTd = document.createElement("td");
            var placeText = document.createTextNode(record.place);
            placeTd.appendChild(placeText);

            var nameTd = document.createElement("td");
            var nameText= document.createTextNode(record.name);
            nameTd.appendChild(nameText);

            var scoreTd = document.createElement("td");
            var scoreText = document.createTextNode(record.scores);
            scoreTd.appendChild(scoreText);

            row.appendChild(placeTd);
            row.appendChild(nameTd);
            row.appendChild(scoreTd);
            table.appendChild(row);
        }
        this.wrapperTable.appendChild(table);
    }
};

CanvasDisplay.prototype.getName = function() {
    "use strict";
    if (this.inputName.value != null) {
        return this.inputName.value;
    } else {
        return null;
    }
};

CanvasDisplay.prototype.setName = function(name) {
    "use strict";
    this.inputName.value = name;
};

CanvasDisplay.prototype.focusEl = function(el) {
    "use strict";
    if (el in this) {
        this[el].focus();
    }
};

module.exports = {
    CanvasDisplay: CanvasDisplay
};