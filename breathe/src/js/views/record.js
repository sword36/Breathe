/**
 * Created by USER on 07.09.2015.
 */
var _ = require("underscore");
var NativeView = require("../lib/backbone.nativeview");

var RecordView = NativeView.extend({
    tagName: "tr",
    template: _.template(document.querySelector("#recordTemplate").innerHTML),

    initialize: function() {
    },

    render: function() {
        var isCurrent = Backbone.getCurrentRecordName() == this.model.get("name");

        var attr = {
            name: this.model.attributes.name,
            scores: Math.round(this.model.attributes.scores),
            place: this.model.attributes.place
        };

        this.el.innerHTML = this.template(attr);
        if (isCurrent) {
            this.el.classList.add("currentPlayer");
        }
        return this;
    }
});

module.exports = RecordView;