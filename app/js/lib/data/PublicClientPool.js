define(function(require, exports, module) {

    "use strict";

    var

        Controller = require('bower/feideconnectjs/src/controllers/Controller'),
        EventEmitter = require('bower/feideconnectjs/src/EventEmitter'),

        Client = require('../models/Client');


    var PublicClientPool = Controller.extend({
        "init": function(feideconnect) {

            var that = this;
            this.feideconnect = feideconnect;

            this.clients = {};
            this.mandatory = {};

            this._super();

            this.initLoad();

        },

        "initLoad": function() {
            var that = this;
            return Promise.all([
                this.loadClients(),
                this.loadMyMandatoryClients()
            ])
                .then(function() {
                    that.emit('clientsChange', that.clients);
                })
                .then(this.proxy("_initLoaded"));

        },

        "loadClients": function() {
            var that = this;
            return this.feideconnect.clientsPublicList()
                .then(function(clients) {
                    var i;
                    that.clients = {};
                    for (i = 0; i < clients.length; i++) {
                        that.clients[clients[i].id] = new Client(clients[i]);
                    }
                });

        },

        "loadMyMandatoryClients": function() {
            var that = this;
            return this.feideconnect.getMyMandatoryClients()
                .then(function(clients) {
                    // console.error("getMyMandatoryClients", clients);
                    var i;
                    that.mandatory = {};
                    for (i = 0; i < clients.length; i++) {
                        that.mandatory[clients[i].id] = new Client(clients[i]);
                    }
                });

        },

        "isMandatory": function(id) {
            return this.mandatory.hasOwnProperty(id);
        },

        "getView": function() {
            var items = [];
            for (var key in this.clients) {
                var x = this.clients[key];
                x.id = key;
                items.push(x.getView());
            }
            return items;

        },

        "getMandatoryClients": function() {
            return this.mandatory;
        },

        // "setClient": function(apigk) {
        //     this.apigks[apigk.id] = apigk;
        //     this.emit("clientsChange", this.apigks);
        // },
        "getClients": function() {
            return this.clients;
        },
        "getClient": function(id) {
            if (this.clients.hasOwnProperty(id)) {
                return this.clients[id];
            }
            return null;
        },
        "removeClient": function(id) {
            delete this.clients[id];
            // console.error("DELETE APIGK", id);
            this.emit("clientsChange", this.clients);
        }

    }).extend(EventEmitter);


    return PublicClientPool;

});