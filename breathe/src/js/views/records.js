/**
 * Created by USER on 07.09.2015.
 */
var _ = require("underscore");
var Records = require("../collections/records");
var RecordView = require("../views/record");
var NativeView = require("../lib/backbone.nativeview");

var RecordsView = NativeView.extend({
    el: document.querySelector("#records"),
    templateTable: _.template(document.querySelector("#tableTemplate").innerHTML),
    currentPageEl: document.querySelector("#currentPage"),
    errorMessageEl: document.querySelector("#errorMessage"),

    events: {
        "click  #local"     : "checkRadio",
        "click  #online"    : "checkRadio",
        "click  #prevPage" : "prevPage",
        "click  #nextPage" : "nextPage",
        "click  #firstPage" : "firstPage",
        "click  #lastPage" : "lastPage"
    },



    initialize: function() {
        this.collection = new Records([]);
        Backbone.storageMode =  "local";  //local/online

        this.collection.fullCollection.comparator = function (a, b) {
            return a.get("scores") > b.get("scores") ? -1 : 1;
        };

        this.listenTo(this.collection.fullCollection, "reset", this.sortFull);
        this.listenTo(this.collection.fullCollection, "reset", this.render);
        this.listenTo(this.collection.fullCollection, "change", this.sortFull);
        this.listenTo(this.collection.fullCollection, "change", this.render);
        this.listenTo(this.collection, "reset", this.render);
        this.listenTo(Backbone, "change:currentRecordName", this.render);  //fixed bug with noupdated curent name in view

        this.listenTo(Backbone, "window:resize", this.resizeTable);

        this.table = this.el.querySelector("#recordsTable");
        this.collection.getFirstPage({
            reset: true,
            fetch: true,
            success: this.updatePageState.bind(this),
            error: this.showNetworkError.bind(this)
        });
        //this.updatePageState();
        //this.render();
    },

    resizeTable: function(newWidth, newHeight) {
        var tableHeight = 0;
        if (newWidth < 1025) {
            tableHeight = newHeight * 0.6;
        } else {
            tableHeight = newHeight * 0.68;
        }

        var rowCount = Math.floor(tableHeight / 35) - 2;
        this.collection.setPageSize(rowCount);
    },

    sortFull: function() {
        console.log("sort full");
        this.collection.fullCollection.sort();
        for (var i = 0; i < this.collection.fullCollection.models.length; i++) {
            var model = this.collection.fullCollection.models[i];
            model.set("place", i + 1, {silent: true});
        }
    },

    updatePageState: function() {
        var state = this.collection.state;
        var currentRecord = this.collection.fullCollection.findWhere({name: Backbone.getCurrentRecordName()});
        if (currentRecord) {
            var currentRecordPlace = currentRecord.get("place");
            var newPageNumber = Math.ceil(currentRecordPlace / state.pageSize);
            if (newPageNumber != state.currentPage) {
                this.collection.getPage(newPageNumber, {reset: true});
            }
        }
        this.currentPageEl.innerHTML = this.collection.state.currentPage;
    },

    render: function(e) {
        console.time("render");
        this.addAll();
        console.timeEnd("render");
        //console.log("render");
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
        for (var i = 0; i < this.collection.models.length; i++) {
            this.addOne(this.collection.models[i]);
        }
    },

    checkRadio: function(e) {
        if (e.target.value != Backbone.storageMode) {
            if (e.target.value == "online" && window.navigator.onLine != true) {
                e.preventDefault();
                this.showNetworkError();
                return;
            }
            Backbone.storageMode = e.target.value;
            //this.collection.trigger("change:storageMode", Backbone.storageMode);
            this.collection.getFirstPage({
                reset: true,
                fetch: true,
                success: this.updatePageState.bind(this),
                error: this.showNetworkError.bind(this)
            });
        }
    },

    prevPage: function() {
        if (this.collection.state.currentPage > 1) {
            console.log("prev page");
            this.collection.getPreviousPage({reset: true});
            this.currentPageEl.innerHTML = this.collection.state.currentPage;
        }
    },

    nextPage: function() {
        if (this.collection.state.currentPage < this.collection.state.totalPages) {
            console.log("next page");
            this.collection.getNextPage({reset: true});
            this.currentPageEl.innerHTML = this.collection.state.currentPage;
        }
    },

    firstPage: function() {
        console.log("first page");
        this.collection.getFirstPage({reset: true});
        this.currentPageEl.innerHTML = this.collection.state.currentPage;
    },

    lastPage: function() {
        console.log("last page");
        this.collection.getLastPage({reset: true});
        this.currentPageEl.innerHTML = this.collection.state.currentPage;
    },

    showNetworkError: function() {
        var msg = "Ошибка";
        if (arguments.length == 0) {
            msg = "Не удаётся подключиться к сети. Проверьте интернет соединение.";
        } else if (arguments[0].status != 404) { //xhr.status
            msg = "Не удаётся подключиться к базе. Попробуйте позднее.";
            Backbone.storageMode = "local";
            document.querySelector("#local").checked = true;
            document.querySelector("#online").checked = false;
        } else { //error 404
            console.log("error 404");
            return;
        }
        this.errorMessageEl.appendChild(document.createTextNode(msg));
        this.errorMessageEl.style.display = "block";
    }
});

module.exports = RecordsView;