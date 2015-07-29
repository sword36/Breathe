//polyfill for Array.prototype.findIndex
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}


function TableOfRecords() {
    "use strict";
    if (typeof localStorage.getItem("records") != "undefined" && localStorage.getItem("records") != null) {
        var recs = localStorage.getItem("records");
        this.records = JSON.parse(recs);
        this.localSynchronization = true;
    }
    else {
        this.records = [];
        this.localSynchronization = false;
    }
    this.onlineSynchronization = false;
    this.sorted = true;
    this.currentName = null;
}

TableOfRecords.prototype.sortRecords = function() {
    "use strict";
    if (!this.sorted) {
        this.records.sort(function(a, b) {
            return b.scores - a.scores;
        });
        for (var i = 0; i < this.records.length; i++) {
            this.records[i].place = i + 1;
        }
        this.sorted = true;
    }
};

TableOfRecords.prototype.setRecord = function(name, scores) {
    "use strict";
    scores = Math.floor(scores);
    var index = -1;
    if (this.records.length != 0) {
        index = this.records.findIndex(function(rec) {
            if (rec.name == name) {
                return true;
            }
        });
    }

    if (index == -1) {
        this.records.push({name: name, scores: scores, place: null});
    } else {
        if (scores > this.records[index].scores) {
            this.records[index].scores = scores;
        }
    }
    this.localSynchronization = false;
    this.onlineSynchronization = false;
    this.sorted = false;
    this.putToLocal();
};

TableOfRecords.prototype.getRecord = function(name) {
    "use strict";
    var index = this.records.findIndex(function(element) {
        if (element.name == name) {
            return true;
        }
    });
    if (index == -1) {
        return -1;
    } else {
        if (this.sorted) {
            return this.records[index];
        } else {
            return this.records[index];
        }
    }
};

TableOfRecords.prototype.putToLocal = function() {
    "use strict";
    this.sortRecords();
    var recs = JSON.stringify(this.records);
    localStorage.setItem("records", recs);
    this.localSynchronization = true;
};

TableOfRecords.prototype.takeFromLocal = function() {
    "use strict";
    var recs = localStorage.getItem("records");
    if (recs != null) {
        this.records = JSON.parse(recs);
        this.sortRecords();
    } else {
        this.records = [];
        this.sorted = true;
    }
    this.localSynchronization = true;
};

TableOfRecords.putToOnline = function() {
    "use strict";

};

TableOfRecords.prototype.takeFromOnline = function(callback) {
    "use strict";

};

TableOfRecords.prototype.getRecords = function(typeStorage, callback) {
    "use strict";
    this.sortRecords();

    switch (typeStorage) {
        case "local":
            if (this.localSynchronization) {
                return this.records;
            } else {
                this.takeFromLocal();
                return this.records;
            }
        case "online":
            if (this.onlineSynchronization) {
                return this.records;
            } else {
                this.takeFromOnline(callback);
            }
            break;
        default : throw new Error("Wrong type of storage: "  + typeStorage);
    }
};

TableOfRecords.prototype.setCurrentName = function(name) {
    "use strict";
    this.currentName = name;
    localStorage.setItem("currentName", name);
};

TableOfRecords.prototype.getCurrentName = function() {
    "use strict";
    if (this.currentName != null) {
        return this.currentName;
    } else {
        var curName = localStorage.getItem("currentName");
        if (curName != null) {
            this.currentName = curName;
            return curName;
        } else
            return null;
    }
};

module.exports = TableOfRecords;