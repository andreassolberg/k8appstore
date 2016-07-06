
var Dispatcher = require('../dispatcher/AppStoreDispatcher');
var Constants = require('../constants/Constants');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _applications = {};

function _addApps(apps) {
  apps.forEach(function(app) {
    if (!_applications[app.application]) {
      _applications[app.application] = app;
    }
  });
}

var AppLibraryStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function(id) {
    return _applications[id];
  },

  /**
   * @param {string} threadID
   */
  getAll: function() {
    // console.error("DATA", _applications);
    return _applications;
  },

  getAllList: function() {
    var list = [];
    for(var key in _applications) {
      list.push(_applications[key]);
    }
    return list;
  },

  getAllForCurrentThread: function() {
    // return this.getAllForThread(ThreadStore.getCurrentID());
  }

});

AppLibraryStore.dispatchToken = Dispatcher.register(function(action) {

  switch(action.type) {

    case ActionTypes.CLICK_THREAD:
      // Dispatcher.waitFor([ThreadStore.dispatchToken]);
      // _markAllInThreadRead(ThreadStore.getCurrentID());
      AppLibraryStore.emitChange();
      break;

    case ActionTypes.CREATE_MESSAGE:
      var message = ChatMessageUtils.getCreatedMessageData(
        action.text,
        action.currentThreadID
      );
      _applications[message.id] = message;
      AppLibraryStore.emitChange();
      break;

    case ActionTypes.RECEIVE_APPLIBRARY_ALL:
      // console.error("ActionTypes.RECEIVE_APPLIBRARY_ALL", ActionTypes.RECEIVE_APPLIBRARY_ALL, action);
      _addApps(action.apps);

      // Dispatcher.waitFor([ThreadStore.dispatchToken]);
      // _markAllInThreadRead(ThreadStore.getCurrentID());
      AppLibraryStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = AppLibraryStore;
