var config = require("./config.js");
var serialPort = require("serialport");
var SerialPort = serialPort.SerialPort;
serialPortStorageSingleton.onConnectCallbacks = [];
serialPortStorageSingleton.isConnect = false;

function SerialPortStorage() {
    "use strict";
    this.portName = null;
    this.port = null;
    this.portsName = [];
    this.isReady = false;

    var self = this;
    serialPort.list(function (err, ports) {
        ports.forEach(function(port) {
            this.portsName.push(port.comName.toString());
        }, self);
        debugger;
        self.portsName.forEach(function(portName) {
            this.checkPort(portName, setPortIfCorrect.bind(self, portName));
        }, self);
    });

    function setPortIfCorrect(portName, error, port) {
        if (!error && port != null) {
            debugger;

            this.port = port;
            this.isReady = true;
            serialPortStorageSingleton.isConnect = true;
            serialPortStorageSingleton.onConnectCallbacks.forEach(function(func) {
                func();
            });
        }
    }
}

SerialPortStorage.prototype.setPort = function(portName) { //deprecated
    "use strict";
    if (typeof portName !== "undefined") {
        this.portName = portName;
    }
    else {
        if (this.portsName.length > 0)
            this.portName = this.portsName[0];
        else
            this.portName = null;
    }
    if (this.port) {
        this.port.close();
    }
    this.port = new SerialPort(this.portName);
};

SerialPortStorage.prototype.getPorts = function() {
    "use strict";
    return this.portsName;
};

serialPortStorageSingleton.onConnect = function(callback) {
    "use strict";
    serialPortStorageSingleton.onConnectCallbacks.push(callback);
};

SerialPortStorage.prototype.checkPort = function(portName, callback) {
    "use strict";
    debugger;
    var tempPort = new SerialPort(portName);
    var isCorrect = false;
    function handlePort() {
        debugger;
        if (isCorrect) {
            callback(null, tempPort);
        } else {
            if (tempPort.isOpen()) {
                tempPort.close();
            }
            callback(true, null);
        }
    }
    tempPort.on("open", function(error) {
        if (error) {
            debugger;
            callback(error);
        } else {
            var timer = setTimeout(handlePort, config.timeoutToPortConnection);
            tempPort.on("data", function(data) {
                debugger;
                if (!isCorrect) {
                    isCorrect = true;
                    handlePort();
                }
                clearTimeout(timer);
                tempPort.removeAllListeners();
                //tempPort._events.data = null;
            });
        }
    });
};

function serialPortStorageSingleton() {
    "use strict";
    if ( typeof module.exports.storage === "undefined") {
        module.exports.storage = new SerialPortStorage();
        return module.exports.storage;
    } else {
        return module.exports.storage;
    }
}

module.exports = serialPortStorageSingleton;