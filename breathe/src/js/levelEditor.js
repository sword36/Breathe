/**
 * Created by USER on 31.07.2015.
 */
var config = require("./config.js");
var fs = require("fs");

var levelPlan = [];

function parseTxtToLevel(data, level, callback) {
    var text = data.toString();
    var lines = text.split("\n");
    for (var i = 0; i < config.lineCountInLevel; i++) {
        level[i] = lines[i];
    }
    callback();
}

function loadLevel(callback) {
    fs.readFile("src/levels/level1.txt", function(err, data) {
        if (err) {
            levelPlan = [
                "                         e                               e ",
                "            e                    F   e           b         ",
                "            c                                              ",
                "                         s              S   e              ",
                "         S                     e                   e     s ",
                "                                                           ",
                "0         1024      2048      3         4         5        "
            ];
            throw err;
        } else {
            parseTxtToLevel(data, levelPlan, callback);
        }
    });
}

var legend = {
    "b": {class: "bonus", type: "big"},
    "s": {class: "bonus", type: "small"},
    "F": {class: "bonus", type: "fast"},
    "S": {class: "bonus", type: "slow"},
    "e": {class: "enemy", type: "bird"},
    "c": {class: "enemy", type: "cloud"}
};

function MapObject(legend, x, y) {
    this.class = legend.class;
    this.type = legend.type;
    this.pos = [x * config.cellWidth, y * config.cellHeight];
}

function getMapObjects() {
    "use strict";
    var mapObjects = [];
    var width = levelPlan[0].length;
    var mapObject;
    for (var y = 0; y < config.lineCountInLevel; y++) {
        for (var x = 0; x < width; x++) {
            if (levelPlan[y][x] !== " " && levelPlan[y][x] in legend) {
                mapObject = new MapObject(legend[levelPlan[y][x]], x, y);
                mapObjects.push(mapObject);
                mapObject = null;
            }
        }
    }
    return mapObjects;
}

module.exports.getMapObjects = getMapObjects;
module.exports.loadLevel = loadLevel;