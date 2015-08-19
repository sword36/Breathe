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
    var lastDataTime = 0;


    function checkDataTime() {
        if (Date.now() - lastDataTime > 1000) {
            console.log("No devices");
            localStorage.setItem("errorMessage", "Ошибка: соединение с устройством потеряно. Попробуйте переподключить его.");
            serialPortStorageSingleton.onErrorCallbacks.forEach(function(func) {
                func();
            });
        }
    }

    if (config.inputType === "serialport") {
        var serialPortStorageSingleton = require("./serialPortStorage.js");
        var serialPortStorage = serialPortStorageSingleton();

        var port = serialPortStorage.port;
        port.removeAllListeners();


        port.on('data', function(data) {
            lastDataTime = Date.now();
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
            //port.write("s");
        });

        var checkDataInterval = setInterval(checkDataTime, 1000);
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