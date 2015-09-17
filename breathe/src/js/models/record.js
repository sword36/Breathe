/**
 * Created by USER on 07.09.2015.
 */
var Record = Backbone.Model.extend({
    default: {
        name: "",
        scores: 0,
        hostComputer: "",
        place: 1
    },

    parse: function(responce) {
        if (responce._id) {
            responce.id = responce._id;
        }
        return responce;
    }
});

module.exports = Record;