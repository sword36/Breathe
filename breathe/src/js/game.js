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
serialPort.on("open", function () {
    console.log('open');
    serialPort.on('data', function(data) {
        console.log('data received: ' + data);
    });
});