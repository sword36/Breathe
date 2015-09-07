/**
 * Created by USER on 07.09.2015.
 */
var _ = require("underscore");

var RecordView = Backbone.View.extend({
    tagName: "tr",
    templateEl: document.querySelector("#recordTemplate"),
    template: _.template(this.templateEl.value),

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "destroy", this.remove);
    },

    render: function() {
        this.el.innerHTML = this.template(this.model.attributes);
        return this;
    }
});

module.exports = RecordView;