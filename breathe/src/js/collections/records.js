/**
 * Created by USER on 07.09.2015.
 */
var Record = require("../models/record");

var Records = Backbone.PageableCollection.extend({
    model: Record,
    localStorage: new Backbone.LocalStorage("TestCollection"),
    mode: "client",
    queryParams: {

    },
    state: {
        sortKey: "scores",
        pageSize: 10
    },

    initialize: function() {
        this.on("change:storageMode", this.switchMode, this);
    },

    comparator: function (model) {
        return model.get("scores");
    },

    currentRecordID: null,
    getCurrentRecord: function() {
        if (this.currentRecordID != null) {
            return this.currentRecordID;
        } else {
            var currentRecordId = localStorage.getItem("currentRecordID");
            if (currentRecordId != null) {
                this.currentRecordId = currentRecordId;
                return currentRecordId;
            } else
                return null;
        }
    },
    setCurrentRecord: function(id) {
        "use strict";
        this.currentRecordID = id;
        localStorage.setItem("currentRecordID", id);
        this.trigger("change:currentRecordID");
    },

    switchMode: function(mode) {
        debugger;
    }
});

module.exports = Records;