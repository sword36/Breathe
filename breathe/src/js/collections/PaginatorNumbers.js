/**
 * Created by USER on 12.09.2015.
 */
var Number = require("../models/number");

var PaginatorNumbers = Backbone.Collection.extend({
    model: Number,
    state: null,

    initialize: function() {
        this.listenTo(Backbone, "state:change", this.updateState);
    },

    updateState: function(state) {
        this.state = state;
        this.reset();
        for (var i = 0; i < state.totalPages; i++) {
            this.add({value: i + 1})
        }
    }
});

module.exports = PaginatorNumbers;