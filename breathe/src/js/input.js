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
        debugger;

        var SerialPortStorage = require("./serialPortStorage.js");
        var serialPortStorage = SerialPortStorage();

        var port = serialPortStorage.port;
        port.on('data', function(data) {
            data = data.toString();
            pressed.breathe = data;
        });
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