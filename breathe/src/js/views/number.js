/**
 * Created by USER on 12.09.2015.
 */
var _ = require("underscore");
var NativeView = require("../lib/backbone.nativeview");

var NumberView = NativeView.extend({
    tag: "li",
    template: _.template(document.querySelector("#numberTemplate").innerHTML)
});

module.exports = NumberView;