/**
 * Created by USER on 07.09.2015.
 */
global.Backbone = require("backbone");
debugger;

require("backbone.paginator");
Backbone.LocalStorage = require("backbone.localstorage");
Backbone.ajax = require('./lib/backbone.nativeajax');
var RecordsView = require("./views/records");
var recordView = new RecordsView();
