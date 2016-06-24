
var Dispatcher = require('../dispatcher/AppStoreDispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';


var _data = {};

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

  getCurrent: function() {
    return _data;
  }

});

DeploymentOptionsStore.dispatchToken = Dispatcher.register(function(action) {
  // Dispatcher.waitFor([
  //   ThreadStore.dispatchToken,
  //   MessageStore.dispatchToken
  // ]);

  switch (action.type) {

    case ActionTypes.INSTALL_APP:

      _data.app = action.app;
      // console.log("Installing app (deployment options store)", _data.app);

      DeploymentOptionsStore.emitChange();      
      break;

    default:
      // do nothing
  }
});

module.exports = DeploymentOptionsStore;
