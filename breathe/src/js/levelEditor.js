/**
 * Created by USER on 31.07.2015.
 */
var config = require("./config.js");
var levelPlan = [
    "                                 ",
    "                e F              ",
    "                                 ",
    "                                 ",
    "              b                  ",
    "                                 ",
    "0         1024      2048      3  "
];

var legend = {
    "b": {class: "bonus", type: "big"},
    "s": {class: "bonus", type: "small"},
    "F": {class: "bonus", type: "fast"},
    "S": {class: "bonus", type: "slow"},
    "e": {class: "enemy", type: "bird"}
};

function getMapObjects() {
    "use strict";
    var mapObjects = [];
    var width = levelPlan[0].length;
    for (var y = 0; y < 6; y++) {
        for (var x = 0; x < width; x++) {
            if (levelPlan[y][x] !== " " && levelPlan[y][x] in legend) {
                var mapObject = legend[levelPlan[y][x]];
                mapObject.pos = [x * config.cellWidth, y * config.cellHeight];
                mapObjects.push(mapObject);
            }
        }
    }
    return mapObjects;
}

module.exports.getMapObjects = getMapObjects;