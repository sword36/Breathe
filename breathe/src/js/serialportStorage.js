var config = require("./config.js");
var serialPort = require("serialport");
var SerialPort = serialPort.SerialPort;
serialPortStorageSingleton.onConnectCallbacks = [];
serialPortStorageSingleton.onErrorCallbacks = [];
serialPortStorageSingleton.isConnect = false;

function checkPortsForArduino(ports) {
    for (var i = 0; i < ports.length; i++) {
        if (ports[i].manufacturer.indexOf("arduino") != -1) {
            return ports[i];
        }
    }
    return null;
}

function SerialPortStorage() {
    "use strict";
    this.portName = null;
    this.port = null;
    this.ports = null;
    this.portsName = [];
    this.isReady = false;
    this.portsCount = 0;
    this.portsChecked = 0;

    var self = this;
    serialPort.list(function (err, ports) {
        self.ports = ports;
        var arduinoPort = checkPortsForArduino(ports);
        if (arduinoPort) {
            self.checkPort(arduinoPort.comName.toString(), setPortIfCorrect.bind(self, arduinoPort.comName.toString()));
        } else {
            checkAnotherPorts.call(self, ports);
        }
    });

    function checkAnotherPorts(ports) {
        ports.forEach(function(port) {
            this.portsCount++;
            this.portsName.push(port.comName.toString());
        }, this);
        this.portsName.forEach(function(portName) {
            this.checkPort(portName, setPortIfCorrect.bind(this, portName));
        }, this);
    }

    function setPortIfCorrectArduino(portName, error, port) {
        if (!error && port != null) {
            console.log("open");
            this.ports = null;
            this.port = port;
            this.isReady = true;
            serialPortStorageSingleton.isConnect = true;
            serialPortStorageSingleton.onConnectCallbacks.forEach(function(func) {
                func();
            });
        } else {
            checkAnotherPorts.call(this, this.ports);
        }
    }

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