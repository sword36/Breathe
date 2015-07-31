global.window = window;
global.document = window.document;
global.Image = window.Image;
global.Audio = window.Audio;
global.requestAnimationFrame = window.requestAnimationFrame;
global.localStorage = window.localStorage;
global.gui = require("nw.gui");
var world = require("./src/js/world.js")();