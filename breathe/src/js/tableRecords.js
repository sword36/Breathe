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
function addRecord(bookData) {
    var record = recordView.collection.fullCollection.find(function(rec) {
        return rec.get("name") === bookData.name;
    });
    if (record != null) {
        if (bookData.scores > record.get("scores")) {
            record.save({scores: bookData.scores});
        }
    } else {
        //recordView.collection.create(new RecordModel(bookData));
        var opt = {};
        if (Backbone.storageMode == "online") {
            opt.success = doubleCreateSync;
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