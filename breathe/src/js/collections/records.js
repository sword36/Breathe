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
        order: 1,
        pageSize: 5
    },

    initialize: function() {
        this.on("change:storageMode", this.switchStorageMode, this);
        this.on("change", this.sort, this);
    },

    currentRecordName: null,
    getCurrentRecordName: function() {
        if (this.currentRecordName != null) {
            return this.currentRecordName;
        } else {
            var name = localStorage.getItem("currentRecordName");
            if (name != null) {
                this.currentRecordName = name;
                return name;
            } else
                return null;
        }
    },
    setCurrentRecordName: function(name) {
        "use strict";
        if (name !== this.currentRecordName) {
            this.currentRecordName = name;
            localStorage.setItem("currentRecordName", name);
            this.trigger("change:currentRecordName");
        }
    },

    switchStorageMode: function(mode) {
    }
});

module.exports = Records;