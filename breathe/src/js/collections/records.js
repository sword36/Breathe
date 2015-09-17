/**
 * Created by USER on 07.09.2015.
 */
var Record = require("../models/record");
var config =require("../config");

var Records = Backbone.PageableCollection.extend({
    model: Record,
    url: config.serverUrl + "/api/records",
    localStorage: new Backbone.LocalStorage("TestCollection"),
    mode: "client",
    queryParams: {

    },
    state: {
        //sortKey: "scores",
        //order: 1,
        pageSize: 7
    },

    initialize: function() {
        this.on("change:storageMode", this.switchStorageMode, this);
        //this.on("change", this.sort, this);

        Backbone.currentRecordName = null; //not repeat at home!
        Backbone.getCurrentRecordName = function() {
            if (Backbone.currentRecordName != null) {
                return Backbone.currentRecordName;
            } else {
                var name = localStorage.getItem("currentRecordName");
                if (name != null) {
                    Backbone.currentRecordName = name;
                    return name;
                } else
                    return null;
            }
        };
        Backbone.setCurrentRecordName = function(name) {
            "use strict";
            if (name !== Backbone.currentRecordName) {
                Backbone.currentRecordName = name;
                localStorage.setItem("currentRecordName", name);
                Backbone.trigger("change:currentRecordName");
            }
        }
    },

    syncWith: function() {

    },

    switchStorageMode: function(mode) {
        if (mode == "online") {
            this.fullCollection.getFirstPage({reset: true, fetch: true});
        }
    }
});

module.exports = Records;