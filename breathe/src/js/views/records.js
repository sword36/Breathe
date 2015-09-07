/**
 * Created by USER on 07.09.2015.
 */
var _ = require("underscore");
var Records = require("../collections/records");
var RecordView = require("../views/record");

var RecordsView = Backbone.View.extend({
    el: "#records",
    templateTableEl: document.querySelector("#tableTemplate"),
    templateTable: _.template(this.templateTableEl.value),

    events: {
        "click  #local"     : "",
        "click  #online"    : ""
    },

    initialize: function() {
        this.listenTo(Records, "reset", this.addAll);
        this.listenTo(Records, "add", this.addOne);
        this.listenTo(Records, "all", this.render);
        this.table = this.el.querySelector("#recordsTable");

        Records.fetch();
    },

    render: function() {
    },

    addOne: function(record) {
        var view = new RecordView({model: record});
        this.table.appendChild(view.render().el);
    }
});