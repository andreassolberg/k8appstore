define(function(require, exports, module) {

	"use strict";

	// define.amd.dust = true;

	var
		$ = require('jquery'),
		dust = require('dust'),

		PublicClientPool = require('../data/PublicClientPool'),

		Pane = require('bower/feideconnectjs/src/controllers/Pane'),
		EventEmitter = require('bower/feideconnectjs/src/EventEmitter'),
		utils = require('bower/feideconnectjs/src/utils'),
		TemplateEngine = require('bower/feideconnectjs/src/TemplateEngine');

	var mainpagetemplate = require('text!templates/AuthzList.html');


	/*
	 * This controller controls 
	 */
	var MainPage = Pane.extend({

		"init": function(app, feideconnect) {

			var that = this;
			this.app = app;
			this.feideconnect = feideconnect;

			this.publicClientPool = new PublicClientPool(this.feideconnect);

			this._super();

			this.resources = null;

			// console.error("DUST", dust);
			this.template = new TemplateEngine(mainpagetemplate, this.app.dict);

			this.ebind("click", ".actRemoveAuthz", "actRemoveAuthz");
			this.ebind("click", ".actRemoveUser", "actRemoveUser");


			this.el.on("click", ".tabselector li", function(e) {
				if (e.preventDefault) {
					e.preventDefault();
				}
				e.stopPropagation();

				var tabid = $(e.currentTarget).data("tabid");
				that.selectTab(tabid);
				// console.error("SELECTING TAB", tabid);
			});

		},

		"selectTab": function(id) {

			var that = this;

			this.currentTab = id;

			this.el.find(".tabselector li").each(function(i, el) {
				if ($(el).data('tabid') === id) {
					$(el).addClass("active");
				} else {
					$(el).removeClass("active");
				}
			});

			this.el.find(".tabcontainer").children().hide();
			this.el.find("#" + id).show();

			this.setTabHashFragment(id);

			return false;

		},

		"setTabHashFragment": function(tabid) {
			this.app.setHash('/' + tabid);
		},

		"actRemoveUser": function(e) {
			e.preventDefault();

			return this.feideconnect.withdrawconsent()
				.then(function() {
					window.location.href = "https://auth.dataporten.no/logout";
				})

		},
		"actRemoveAuthz": function(e) {

			e.preventDefault();


			var container = $(e.currentTarget).closest(".authzClient");
			var clientid = container.data('clientid');
			// console.error("Removing", clientid);

			var that = this;
			this.feideconnect.authorizationsDelete(clientid)
				.then(function(userinfo) {
					that.initLoad()
						.then(function() {
							that.selectTab("tabApps");
						});
				});

		},



		"initLoad": function(tab) {
			// console.error("initload");
			var that = this;
			return this.feideconnect.getUserInfo()
				.then(function(userinfo) {
					that.userinfo = userinfo;
				})
				.then(function() {
					return that.publicClientPool.onLoaded();
				})
				.then(function() {
					return that.feideconnect.resources_owned()
						.then(function(resources) {
							that.resources = resources;
							// console.error("Resources", resources);
						})
				})
				.then(function() {
					return that.feideconnect.authorizationsList();
				})
				.then(function(data) {
					var i;
					var view = {
						"authz": data,
						"mandatory": [],
						"userinfo": that.userinfo.user,
						"resources": that.resources
					};
					view._config = that.feideconnect.getConfig();
					// view.clients = that.publicClientPool.getClients();

					for (i = 0; i < view.authz.length; i++) {
						if (!that.publicClientPool.isMandatory(view.authz[i].client.id)) {
							view.authz[i].clientinfo = that.publicClientPool.getClient(view.authz[i].client.id).getView();
						}
					}

					var mandatoryClients = that.publicClientPool.getMandatoryClients();
					// console.error("mandatoryClients", mandatoryClients);
					for(var key in mandatoryClients) {
						view.mandatory.push(mandatoryClients[key].getView());
					}

					// console.error("view", view);
					return that.template.render(that.el.empty(), view);
				})
				.then(function() {
					that.el.find('#listingClients').append(that.elClients);
					that.el.find('#listingAPIGKs').append(that.elAPIGKs);
					that.elClientsAttached = true;
					that.elAPIGKsAttached = true;
					that.templateLoaded = true;
					that.activate();
					that.selectTab(tab);
				})
				.then(this.proxy("_initLoaded"));



		}

	}).extend(EventEmitter);

	return MainPage;

});