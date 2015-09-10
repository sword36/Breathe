/**
 * Created by USER on 07.09.2015.
 */
global.Backbone = require("backbone");

require("backbone.paginator");
Backbone.LocalStorage = require("backbone.localstorage");
Backbone.ajax = require('./lib/backbone.nativeajax');
var RecordsView = require("./views/records");
var recordView = new RecordsView();
var RecordModel = require("./models/record");

function addRecord(bookData) {
    var record = recordView.collection.find(function(rec) {
        return rec.get("name") === bookData.name;
    });
    if (record != null) {
        if (bookData.scores > record.get("scores")) {
            record.save({scores: bookData.scores});
        }
    } else {
        //recordView.collection.create(new RecordModel(bookData));
        recordView.collection.fullCollection.create(bookData);
    }
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