var config = require("./config.js");

/**
 * @param window Global object
 * @param {string} type Can be:keyboard, medicine, smartphone
 * @returns Object which content info about pressed buttons
 * @see getInput
 */
function input() {    //type - keyboard, medicine, smartphone
    "use strict";
    var pressed = null;

    if (config.inputType === "serialport") {
        var SerialPortStorage = require("./serialPortStorage.js");
        var serialPortStorage = SerialPortStorage();

        var port = serialPortStorage.port;
        port.removeAllListeners();
        port.on('data', function(data) {
            data = data.toString();
            var splitDataAll = data.split("\r\n");
            var splitDataCur = splitDataAll[1];
            var pairOfCurData = splitDataCur.split("/");
            if (Array.isArray(pairOfCurData) && pairOfCurData.length > 1) {
                if (config.breatheChanel == "temperature") {
                    data = pairOfCurData[0]
                } else if (config.breatheChanel == "turbine") {
                    data = pairOfCurData[1];
                }
                console.log(data);
                pressed.breathe = data;
            }
        });

        port.on("disconnect", function(err) {
            debugger;
        });
        port.on("close", function(err) {
            debugger;
        });
        port.options.disconnectedCallback = function(err) {
            debugger;
        };
        debugger;
    }

    function handler(event) {
        if (codes.hasOwnProperty(event.keyCode)) {
            var down = event.type === "keydown";
            pressed[codes[event.keyCode]] = down;
            event.preventDefault();
        }
    }

    function clearAll() {
        for (var c in pressed) {
            if (pressed.hasOwnProperty(c))
                pressed[c] = false;
        }
    }

    if (!pressed) {
        pressed = Object.create(null);
        var codes = {38: "up"};
        window.addEventListener("keydown", handler);
        window.addEventListener("keyup", handler);
        window.addEventListener("blur", clearAll());
    }
    return pressed;
}

module.exports = input;