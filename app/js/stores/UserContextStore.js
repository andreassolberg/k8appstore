var Dispatcher = require('../dispatcher/AppStoreDispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';


var
  _auth = {
    "authenticated": false,
    "user": null,
    "groups": null
  }

var UserContextStore = assign({}, EventEmitter.prototype, {

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


  getContext: function() {
    return _auth;
  }

});

UserContextStore.dispatchToken = Dispatcher.register(function(action) {

  switch (action.type) {

    case ActionTypes.AUTHENTICATION_SUCCESS:

      _auth.authenticated = true
      _auth.user = action.user
      _auth.groups = action.groups
      UserContextStore.emitChange();
      break;

    default:
        // do nothing
  }


});

module.exports = UserContextStore;
