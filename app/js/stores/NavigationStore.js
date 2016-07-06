var Dispatcher = require('../dispatcher/AppStoreDispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _current = 'deployments';

var NavigationStore = assign({}, EventEmitter.prototype, {

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
    return _current;
  }

});

NavigationStore.dispatchToken = Dispatcher.register(function(action) {

  switch (action.type) {

    case ActionTypes.DEPLOY_SETUP_APP:

      if (_current !== 'install') {
        _current = 'install';
        NavigationStore.emitChange();
      }
      break;

    case ActionTypes.INSTALL_CANCEL:
      _current = 'library';
      NavigationStore.emitChange();
      break;

    case ActionTypes.RECEIVE_RAW_MESSAGES:
        NavigationStore.emitChange();
        break;

    default:
        // do nothing
  }


});

module.exports = NavigationStore;
