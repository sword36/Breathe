/**
 * Created by USER on 07.09.2015.
 */
var _ = require("underscore");
var Records = require("../collections/records");
var RecordView = require("../views/record");
var NativeView = require("../lib/backbone.nativeview");

var RecordsView = NativeView.extend({
    el: document.querySelector("#records"),
    templateTableEl: document.querySelector("#tableTemplate"),
    templateTable: _.template(document.querySelector("#tableTemplate").innerHTML),

    events: {
        "click  #local"     : "checkRadio",
        "click  #online"    : "checkRadio"
    },

    storageMode: "local",  //local/online

    initialize: function() {
        this.collection = new Records();

        this.listenTo(this.collection, "reset", this.addAll);
        this.listenTo(this.collection, "add", this.addOne);
        this.listenTo(this.collection, "all", this.render);

        this.table = this.el.querySelector("#recordsTable");
        this.collection.getFirstPage({reset: true, fetch: true});
        this.render();
    },

    render: function() {
        this.addAll();
        console.log("render");
    },

    addOne: function(record) {
        var view = new RecordView({model: record});
        this.table.appendChild(view.render().el);
    },

    addAll: function() {
        this.table.innerHTML =
        "<tr>" +
        "<td>Место</td>" +
        "<td>Имя</td>" +
        "<td>Очки</td>" +
        "</tr>";
        this.collection.each(this.addOne, this);
    },

    checkRadio: function(e) {
        if (e.target.value != this.storageMode) {
            this.storageMode = e.target.value;
            this.collection.trigger("change:storageMode", this.storageMode);
        }
    }
});

module.exports = RecordsView;