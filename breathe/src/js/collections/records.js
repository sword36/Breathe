/**
 * Created by USER on 07.09.2015.
 */
var Record = require("../models/record");

var Records = Backbone.PageableCollection.extend({
    model: Record,
    mode: "client",
    queryParams: {
        order: "direction"
    },
    state: {
        sortKey: "scores",
        pageSize: 10
    }
});

module.exports = new Records();