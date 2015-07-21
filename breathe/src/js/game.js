global.document = window.document;
global.Image = window.Image;
global.Audio = window.Audio;
global.reaquestAnimationTime = window.reaquestAnimationTime;
global.localStorage = window.localStorage;
console.log(process.versions["node-webkit"]);
var world = require("./src/js/world.js")();
var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("COM5", {

});