/**
 * Created by USER on 07.09.2015.
 */
global.Backbone = require("backbone");

require("./lib/backbone.paginator");
Backbone.LocalStorage = require("./lib/backbone.localstorage");
Backbone.ajax = require('./lib/backbone.nativeajax');

var RecordsView = require("./views/records");
var recordView = new RecordsView();

window.addEventListener("online", function() {
    Backbone.trigger("online");
});

window.addEventListener("offline", function() {
    Backbone.trigger("offline");
});

function doubleCreateSync(model) {
    Backbone.sync("create", model, {doubleSync: true});
}

/*
1.When new record added in onlineStorageMode it at first create in server, generated _id, send it to client and
in doubleCreateSync create new record in localStorage with same id like in server
2.When new record added in localStorageMode with available online connection or then online connection appears,
it at first create record in localStorage, after that 'online' event is triggered and it lead to syncLocalToOnline:
send request to server, when get response, compare it with local data and if it different (there is no such record in
server or scores in server less than in client) send second request for create/update to server. If create method:
in success callback delete old model from localStorage and create new, using _id from response from server. Make it
with silent options because we dont want to rerender all model because of changing id attribute.
 */

function addRecord(bookData) {
    var record = recordView.collection.fullCollection.find(function(rec) {
        return rec.get("name") === bookData.name;
    });
    if (record != null) {
        if (bookData.scores > record.get("scores")) {
            debugger;
            record.save({scores: bookData.scores}, {
                success: function() {
                    if (Backbone.storageMode == "local" && window.navigator.onLine === true) {
                        Backbone.trigger("online"); //to call syncLocalToOnline
                    }
                }
            });

        }
    } else {
        var opt = {};
        if (Backbone.storageMode == "online") {
            opt.success = doubleCreateSync;
        } else if (Backbone.storageMode == "local" && window.navigator.onLine === true) {
            opt.success = function() {Backbone.trigger("online");};//to call syncLocalToOnline
        }
        recordView.collection.fullCollection.create(bookData, opt);
    }
    recordView.updatePageState();
    /*recordView.collection.sync("update", recordView.collection);
    debugger;
    recordView.collection.models.sort();*/
}

function getCurrentRecordName() {
    return Backbone.getCurrentRecordName();
}

function setCurrentRecordName(name) {
    Backbone.setCurrentRecordName(name);
}

module.exports = {
    addRecord: addRecord,
    getCurrentRecordName: getCurrentRecordName,
    setCurrentRecordName: setCurrentRecordName
};