/**
 * Created by USER on 07.09.2015.
 */
var Record = require("../models/record");
var config = require("../config");
var _ = require("underscore");

function prepareLocalToOnline(resp) {
    debugger;

    this.fullCollection.forEach(function(model) {
        var status = "notExist";
        resp.some(function(respModel) {
            if (respModel._id == model.id && respModel.hostComputer == model.get("hostComputer")) {
                if (respModel.scores < model.get("scores")) {
                    model.save({scores: model.get("scores")}, {
                        ajaxSync: true
                    });
                    status = "synced";
                    return true; //for break some
                } else {
                    status = "doesNotNeedSync"; //if scores does not increase
                    return false;
                }
            } else {
                status = "notExist";
                return false;
            }
        }, this);

        if (status == "notExist") {
            model.set("_id", model.get("id"));
            this.sync("create", model, {
                ajaxSync: true,
                url: config.serverUrl + "/api/records"
            })
        }
        /*var record = _.findWhere(resp, {_id: model.id});
        if (record) {
            if (record.hostComputer == resp.hostComputer && record.scores > resp.scores) {
                record.save({scores: resp.scores}, {
                    ajaxSync: true
                });
            }
        }*/
    }, this);

    /*resp.forEach(function(model) {
        var record = this.fullCollection.findWhere({id: model._id});
        if (record) {
            record.save({scores: resp.scores}, {
                ajaxSync: true
            });
        }
    }, this)*/
}

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
        this.listenTo(Backbone, "online", this.syncLocalWithOnline);


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

    syncLocalWithOnline: function() {
        if (Backbone.storageMode == "local") {
            debugger;
            this.sync("read", this, {
                ajaxSync: true,
                success: prepareLocalToOnline.bind(this)
            });
        }
    },

    switchStorageMode: function(mode) {
        if (mode == "online") {
            this.fullCollection.getFirstPage({reset: true, fetch: true});
        }
    }
});

module.exports = Records;