
var Dispatcher = require('../dispatcher/AppStoreDispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _infraOptions = {
	"ipnett": {
		"title": "IPnett",
		"descr": "",
		"disabled": true
	},
	"uhintern": {
		"title": "UH-intern IaaS",
		"descr": "",
		"disabled": true
	},
	"sigma": {
		"title": "Sigma sky",
		"descr": ""
	},
	"gke": {
		"title": "Google Cloud",
		"descr": ""
	}
}

const _domains = ["apps.uninett-labs.no", "daas.sigma.no"]

const _sizes =  {
	"tiny": {
		"title": "Tiny"
	},
	"small": {
		"title": "Small"
	},
	"medium": {
		"title": "Medium"
	},
	"large": {
		"title": "Large"
	},
	"xlarge": {
		"title": "X-Large"
	}
}

var _data = {
	"app": null,
	"infrastructure": "gke",
	"domain": "apps.uninett-labs.no",
	"size": "small"
};

var DeploymentOptionsStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

	getOptions: function() {
		return {
				"infrastructure": _infraOptions,
				"sizes": _sizes,
				"domains": _domains
		};
	},

  getData: function() {
    return _data;
  },

	getApp: function() {
		return _data.app;
	}

});

DeploymentOptionsStore.dispatchToken = Dispatcher.register(function(action) {
  // Dispatcher.waitFor([
  //   ThreadStore.dispatchToken,
  //   MessageStore.dispatchToken
  // ]);

  switch (action.type) {

    case ActionTypes.DEPLOY_SETUP_APP:
			// console.log("ActionTypes.INSTALL_APP setting", action.app);
      _data.app = action.app;
      // console.log("Installing app (deployment options store)", _data.app);

      DeploymentOptionsStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = DeploymentOptionsStore;
