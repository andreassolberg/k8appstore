
var Dispatcher = require('../dispatcher/AppStoreDispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _infraOptions = {
	"ipnett": {
		"title": "IPnett",
		"descr": ""
	},
	"uhintern": {
		"title": "UH-intern IaaS",
		"descr": ""
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
		"title": "Tiny (.2 core, 128M)"
	},
	"small": {
		"title": "Small (.5 core, 128M)"
	},
	"medium": {
		"title": "Medium (2x .5 core, 128M)"
	},
	"large": {
		"title": "Large (3x .5 core, 256M)"
	},
	"xlarge": {
		"title": "X-Large (3x 1 core, 256M)"
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
