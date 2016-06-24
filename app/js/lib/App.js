define(function(require, exports, module) {

	"use strict";

	// define.amd.dust = true;
	var
		$ = require('jquery'),
		FeideConnect = require('bower/feideconnectjs/src/FeideConnect').FeideConnect,
		AppController = require('bower/feideconnectjs/src/controllers/AppController'),
		MainPage = require('./controllers/MainPage'),
		PaneController = require('bower/feideconnectjs/src/controllers/PaneController'),
		LanguageController = require('bower/feideconnectjs/src/controllers/LanguageController'),
		utils = require('bower/feideconnectjs/src/utils'),
		dust = require('dust'),
		Dictionary = require('bower/feideconnectjs/src/Dictionary'),

		rawconfig = require('text!../../etc/config.js');

	var jQuery = $;

	require('bootstrap');
	require('es6-promise').polyfill();

	var tmpHeader = require('text!templates/header.html');
	var tmpFooter = require('text!templates/footer.html');


	/**
	 * Here is what happens when the page loads:
	 *
	 * Check for existing authentication.
	 * When authenticated setup clientpool.
	 * After that, check routing...
	 * Load frontpage
	 * 
	 * 
	 */

	// console.error("LOADING DUST", dust);

	var App = AppController.extend({

		"init": function() {
			var that = this;

			this.config = JSON.parse(rawconfig);
			this.feideconnect = new FeideConnect(this.config);

			this.dict = new Dictionary();

			dust.loadSource(dust.compile(tmpHeader, "header"));
			dust.loadSource(dust.compile(tmpFooter, "footer"));

			// Call contructor of the AppController(). Takes no parameters.
			this._super();

			this.languageselector = new LanguageController(this);
			this.pc = new PaneController(this.el.find('#panecontainer'));
			this.mainpage = new MainPage(this, this.feideconnect);
			this.pc.add(this.mainpage);

			this.draw();

			this.setupRoute(/^\/([a-zA-Z0-9_\-:.]+)?$/, "routeMainlisting");


			// this.pc.debug();
			this.route(true);


			this.el.on("click", ".login", function(e) {
				e.preventDefault();
				that.feideconnect.authenticate();
			});

			this.el.on("click", "#logout", function(e) {
				e.preventDefault();
				that.feideconnect.logout();
				var c = that.feideconnect.getConfig();
				var url = c.apis.auth + '/logout';
				window.location = url;

			});


			this.feideconnect.on("stateChange", function(authenticated, user) {
				that.onLoaded()
					.then(function() {
						var _config = that.feideconnect.getConfig();
						var profilephoto = _config.apis.core + '/userinfo/v1/user/media/' + user.profilephoto;
						// console.error("Profile url iu s", profilephoto);

						if (authenticated) {
							$("body").addClass("stateLoggedIn");
							$("body").removeClass("stateLoggedOut");

							$("#username").empty().text(user.name);
							$("#profilephoto").html('<img style="margin-top: -28px; max-height: 48px; max-width: 48px; border: 0px solid #b6b6b6; border-radius: 32px; box-shadow: 1px 1px 4px #aaa;" src="' + profilephoto + '" alt="Profile photo" />');

							$(".loader-hideOnLoad").hide();
							$(".loader-showOnLoad").show();
						} else {
							$("body").removeClass("stateLoggedIn");
							$("body").addClass("stateLoggedOut");

							$(".loader-hideOnLoad").show();
							$(".loader-showOnLoad").hide();
						}
					});

			});



		},

		/**
		 * A draw function that draws the header and footer template.
		 * Supports promises
		 * @return {[type]} [description]
		 */
		"draw": function() {
			var that = this;


			var view = {
				"_": that.dict.get()
			};
			view._config = that.feideconnect.getConfig();
			// console.error("Config", view._config);

			this.loaded = false;
			return Promise.all([
				new Promise(function(resolve, reject) {
					dust.render("header", view, function(err, out) {
						if (err) {
							return reject(err);
						}
						that.el.find("#header").append(out);
						resolve();
					});
				}),
				new Promise(function(resolve, reject) {
					dust.render("footer", view, function(err, out) {
						if (err) {
							return reject(err);
						}
						that.el.find("#footer").append(out);
						resolve();
					});
				})
			]).then(function() {
				that.loaded = true;
				that.el.find("#navcontainer").append(that.languageselector.el);
				if (that._onloadedCallback && typeof that._onloadedCallback === 'function') {
					that._onloadedCallback();
				}
			});
		},


		"onLoaded": function() {
			var that = this;
			return new Promise(function(resolve, reject) {
				if (that.loaded) {
					resolve();
				} else {
					that._onloadedCallback = resolve;
				}
			});
		},



		"setErrorMessage": function(title, type, msg) {

			var that = this;
			type = (type ? type : "danger");

			// console.error("Error ", title, type, typeof msg, msg);

			var pmsg = '';
			if (typeof msg === 'object' && msg.hasOwnProperty("message")) {
				pmsg = '<p>' + utils.escape(msg.message, false).replace("\n", "<br />") + '</p>';
			} else if (typeof msg === 'string') {
				pmsg = '<p>' + utils.escape(msg, false).replace("\n", "<br />") + '</p>';
			}

			var str = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
				' <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				(title ? '<strong>' + utils.escape(title, false).replace("\n", "<br />") + '</strong>' : '') +
				pmsg +
				'</div>';

			if (this.hasOwnProperty("errorClearCallback")) {
				clearTimeout(this.errorClearCallback);
			}

			this.errorClearCallback = setTimeout(function() {
				$("#errorcontainer").empty();
			}, 10000);

			$("#errorcontainer").empty().append(str);

		},



		"routeMainlisting": function(tab) {
			// console.log("ABOUT");
			if (!tab) {
				tab = 'tabMe';
				this.setHash('/tabMe');
			}
			
			this.mainpage.initLoad(tab);
		}



	});


	return App;
});