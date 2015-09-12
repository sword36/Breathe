/**
 * Created by USER on 07.09.2015.
 */
var _ = require("underscore");
var NativeView = require("../lib/backbone.nativeview");

var RecordView = NativeView.extend({
    tagName: "tr",
    template: _.template(document.querySelector("#recordTemplate").innerHTML),

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "destroy", this.remove);
    },

    render: function() {
        var isCurrent = Backbone.getCurrentRecordName() == this.model.get("name");

        this.el.innerHTML = this.template(this.model.attributes);
        if (isCurrent) {
            this.el.classList.add("currentPlayer");
        }
        return this;
    }
});

module.exports = RecordView;