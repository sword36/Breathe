//polyfill for Array.prototype.findIndex
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}

var config = require("./config.js");
//var core = require("./core.js"); //circular link
var model_ = require("./model.js");
var model = new model_();
var win = gui.Window.get();

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
    this.wrapper = document.querySelector(".wrapper");
    this.canvas.width = config.width = this.wrapper.clientWidth;
    this.canvas.height = config.height = this.wrapper.clientHeight;
    this.scoreEl = document.querySelector(".score");
    this.scoreEndEl = document.querySelector("#score");
    this.cx = this.canvas.getContext('2d');
    this.menu = document.querySelector("#menu");
    this.main = document.querySelector("#main");
    this.playButton = document.querySelector(".play");
    this.recordsButton = document.querySelector(".records");
    this.creditsButton = document.querySelector(".credits");
    this.exitButton = document.querySelector(".exit");
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
    this.fullScreen = document.querySelector(".fullScreen");
    this.storageButtons = document.querySelector("#storageButtons");
    this.inputButtons = document.querySelector("#inputButtons");
    this.storageRadio = document.getElementsByName("storage");
    this.inputRadio = document.getElementsByName("input");
    this.inputName = document.querySelector("#game-over input");
    this.errorMessage = document.querySelector("#errorMessage");
    this.errorName = document.querySelector("div.errorName");
    this.closeErrorButton = document.querySelector("#errorMessage .close");
    this.creditsList = document.querySelector("#credits ul");
    this.bonusBigIco = document.getElementsByClassName("bonusBig")[0];
    this.bonusSmallIco = document.getElementsByClassName("bonusSmall")[0];
    this.bonusFastIco = document.getElementsByClassName("bonusFast")[0];
    this.bonusSlowIco = document.getElementsByClassName("bonusSlow")[0];
}

CanvasDisplay.prototype.clear = function() {
    "use strict";
    this.canvas.parentNode.removeChild(this.canvas);
};

CanvasDisplay.prototype.clearDisplay = function() {
    "use strict";
    this.cx.fillStyle = "#89E3FB";
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

function moveBgSprite(bgItem, index) {
    "use strict";
    this.cx.save();
    var top = 0;
    if (bgItem == "forest") {
        top = config.height * config.forestTopScale;
    } else if (bgItem == "clouds") {
        top = config.height * config.cloudTopScale;
    }

    this.cx.translate(bg[bgItem].positions[index], top);
    bg[bgItem].sprites[index].render(this.cx);
    this.cx.restore();
}
CanvasDisplay.prototype.renderBackground = function() {  //WTF?!
    "use strict";
    var move = moveBgSprite.bind(this);
    var bgNames = ["clouds", "mountains", "forest"];
    for (var i = 0; i < 3; i++) {
        var curBg = bgNames[i];
        move(curBg, bg[curBg].currentSprite);
        if (!bg[curBg].isOneTexture) {
            move(curBg, bg[curBg].nextSprite);
        }
    }
};

CanvasDisplay.prototype.renderEnemies = function() {
    "use strict";
    for (var i = 0; i < model.enemies.length; i++) {
        if (model.enemies[i].pos[0] <= config.width + 100) {
            this._render(model.enemies[i]);
        }
    }
};

CanvasDisplay.prototype.renderBonuses = function() {
    "use strict";
    for (var i = 0; i < model.bonuses.length; i++) {
        if (model.bonuses[i].pos[0] <= config.width + 100) {
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

    if (config.debugSprite) {
        this.cx.fillStyle = "#000000";
        this.cx.beginPath();
        for (var i = 0; i < 7; i++) { //vertical line
            this.cx.moveTo(0, i * config.cellSize[1]);
            this.cx.lineTo(config.width, i * config.cellSize[1]);
        }
        for (var i = 0; i < 10; i++) {//horizontal
            this.cx.moveTo(i * config.cellSize[0], 0);
            this.cx.lineTo(i * config.cellSize[0], config.height);
        }
        this.cx.stroke();
    }
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
    score = Math.round(score);
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

var stack = [];
var foundedNode = [];
function findInChildren(parent, childType) {
    if (parent.tagName == childType) {
        foundedNode.push(parent);
    }
    if (parent.children.length != 0) {
        for (var i = 0; i < parent.children.length; i++) {
            stack.push(parent.children[i]);
        }
        while (stack.length != 0) {
            findInChildren(stack.pop(), childType);
        }
    }
}

CanvasDisplay.prototype.addEventToChildren = function(parent, childType, handler, specialEvent) {
    if (parent in this) {
        if (typeof  specialEvent == "undefined")
            specialEvent = "click";
        stack = [];
        foundedNode = [];
        findInChildren(this[parent], childType);
        foundedNode.forEach(function(node) {
            node.addEventListener(specialEvent, handler);
        })
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

CanvasDisplay.prototype.setCheckedRadioButton = function(nameRadio, value) {
    "use strict";
    nameRadio += "Radio";
    if (nameRadio in this) {
        for (var i = 0; i < this[nameRadio].length; i++) {
            if (this[nameRadio][i].type == "radio" && this[nameRadio][i].value == value) {
                this[nameRadio][i].checked = true;
                return;
            }
        }
    }
};

CanvasDisplay.prototype.drawRecords = function(records, curName) {
    "use strict";
    this.wrapperTable.innerHTML = "";
    if (records) {
        var table = document.createElement("table");

        //header
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var tdText1 = document.createTextNode("Место");
        td1.appendChild(tdText1);
        var td2 = document.createElement("td");
        var tdText2 = document.createTextNode("Имя");
        td2.appendChild(tdText2);
        var td3 = document.createElement("td");
        var tdText3 = document.createTextNode("Очки");
        td3.appendChild(tdText3);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        table.appendChild(tr);

        var curIndex = records.findIndex(function(rec) {
            return rec.name == curName;
        });

        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            var row = document.createElement("tr");
            if (i == curIndex) {
                row.classList.add("currentPlayer");
            }

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

CanvasDisplay.prototype.close = function() {
    "use strict";
    win.close();
};

CanvasDisplay.prototype.showError = function(errorText) {
    "use strict";
    this.errorMessage.appendChild(document.createTextNode(errorText));
    this.showElement("errorMessage");
    this.showElement("game_over_overlay");
};

CanvasDisplay.prototype.hideError = function() {
    "use strict";
    var errMes = this.errorMessage;
    errMes.removeChild(errMes.childNodes[errMes.childNodes.length - 1]);
    this.hideElement("errorMessage");
    this.hideElement("game_over_overlay");
};

CanvasDisplay.prototype.getViewport = function() {
    return {
        width: this.canvas.width,
        height: this.canvas.height
    }
};

CanvasDisplay.prototype.setViewport = function(opt) {
    this.canvas.width = opt.width;
    this.canvas.height = opt.height;
};

CanvasDisplay.prototype.syncViewport = function () {
    this.canvas.width = config.width = this.wrapper.clientWidth;
    this.canvas.height = config.height =  this.wrapper.clientHeight;
};

module.exports = {
    CanvasDisplay: CanvasDisplay
};