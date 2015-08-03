var config = require("./config.js");
var serialPort = require("serialport");
var SerialPort = serialPort.SerialPort;
serialPortStorageSingleton.onConnectCallbacks = [];
serialPortStorageSingleton.onErrorCallbacks = [];
serialPortStorageSingleton.isConnect = false;

function SerialPortStorage() {
    "use strict";
    this.portName = null;
    this.port = null;
    this.portsName = [];
    this.isReady = false;
    this.portsCount = 0;
    this.portsChecked = 0;

    var self = this;
    serialPort.list(function (err, ports) {
        ports.forEach(function(port) {
            self.portsCount++;
            this.portsName.push(port.comName.toString());
        }, self);
        self.portsName.forEach(function(portName) {
            this.checkPort(portName, setPortIfCorrect.bind(self, portName));
        }, self);
    });

    function setPortIfCorrect(portName, error, port) {
        this.portsChecked++;
        if (!error && port != null) {
            console.log("open");
            this.port = port;
            this.isReady = true;
            serialPortStorageSingleton.isConnect = true;
            serialPortStorageSingleton.onConnectCallbacks.forEach(function(func) {
                func();
            });
        } else
            if (this.portsChecked >= this.portsCount && !this.isReady) {
                console.log("No devices");
                localStorage.setItem("errorMessage", "Ошибка: невозможно найти устройство для дыхания. Попробуйте переподключить его.");
                serialPortStorageSingleton.onErrorCallbacks.forEach(function(func) {
                    func();
                })
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

serialPortStorageSingleton.onError = function(callback) {
    "use strict";
    serialPortStorageSingleton.onErrorCallbacks.push(callback);
};

SerialPortStorage.prototype.checkPort = function(portName, callback) {
    "use strict";
    var tempPort = new SerialPort(portName);
    tempPort.createTime = Date.now();
    var isCorrect = false;
    function handlePort() {
        if (isCorrect) {
            callback(null, tempPort);
        } else {
            if (tempPort.isOpen()) {
                tempPort.close();
            }
            callback(true, null);
        }
    }

    tempPort.on("error", function(error) {
        console.log(error + " - was catched");
        localStorage.setItem("errorMessage", "Ошибка: невозможно подключить устройство для дыхания. Попробуйте переподключить его.");
        serialPortStorageSingleton.onErrorCallbacks.forEach(function(func) {
            func();
        })
    });

    var timer = setTimeout(handlePort, config.timeoutToPortConnection);
    tempPort.on("open", function(error) {
        if (error) {
            callback(error);
        } else {
            tempPort.on("data", function(data) {
                if (!isCorrect) {
                    isCorrect = true;
                    console.log(Date.now() - tempPort.createTime);
                    handlePort();
                }
                clearTimeout(timer);
                tempPort.removeAllListeners(); //for break event "on data"
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