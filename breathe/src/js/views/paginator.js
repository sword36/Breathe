/**
 * Created by USER on 09.09.2015.
 */
var _ = require("underscore");
var NativeView = require("../lib/backbone.nativeview");
var PaginatorNumbers = require("../collections/PaginatorNumbers");

var PaginatorView = NativeView.extend({
    el: document.querySelector("#paginator"),
    events: {
        "click  a" : "switchNumPage"
    },

    initialize: function() {
        this.collection = new PaginatorNumbers([], {
            comparator: function(number) {
                return number.get("value");
            }
        })
    },

    switchNumPage: function(e) {
        var val = e.target.innerText;
        debugger;
    },

    render: function() {

    }
});

module.exports = PaginatorView;