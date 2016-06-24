"use strict";
	
var
	Negotiator = require('negotiator');

// var languageAliases = {
// 	'no': 'nb'
// };




var Lang = function(config) {
	this.config = config;
	this.languages = config.languages;
};
Lang.prototype.exists = function(lang) {
	for(var i = 0; i < this.languages.length; i++) {
		if (this.languages[i] === lang) {
			return true;
		}
	}
	return false;
};
Lang.prototype.getLanguages = function() {
	return this.languages;
};




var neg = function(languages) {


	return function(req, res, next) {
		var negotiator = new Negotiator(req);
		var selectedlang = negotiator.language(languages.getLanguages());

		if (req.cookies.lang && languages.exists(req.cookies.lang)) {
			selectedlang = req.cookies.lang; 
		}

		req.url = req.path + '.' + selectedlang;

		res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
		res.setHeader('Vary', 'Content-Language');
		res.setHeader('Content-Language', selectedlang);

		next();

	};

}




exports.Lang = Lang;
exports.neg = neg;

