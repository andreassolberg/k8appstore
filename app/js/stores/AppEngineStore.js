
var
  Dispatcher = require('../dispatcher/AppStoreDispatcher'),
  Constants = require('../constants/Constants'),
  ChatMessageUtils = require('../utils/ChatMessageUtils'),
  EventEmitter = require('events').EventEmitter,
  API = require('../utils/API')

var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _applications = {};

// function _addMessages(rawMessages) {
//   rawMessages.forEach(function(message) {
//     if (!_applications[message.id]) {
//       _applications[message.id] = ChatMessageUtils.convertRawMessage(
//         message,
//         ThreadStore.getCurrentID()
//       );
//     }
//   });
// }

// function _markAllInThreadRead(threadID) {
//   for (var id in _applications) {
//     if (_applications[id].threadID === threadID) {
//       _applications[id].isRead = true;
//     }
//   }
// }

var AppEngineStore = assign({}, EventEmitter.prototype, {

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
    return _applications;
  },

  getAllForCurrentThread: function() {
    // return this.getAllForThread(ThreadStore.getCurrentID());
  }

});

AppEngineStore.dispatchToken = Dispatcher.register(function(action) {


  switch(action.type) {

    case ActionTypes.INSTALL_APP:


      console.log("AppEngineStore triggered on ActionTypes.INSTALL_APP")
      let app = action.app
      let deploymentConfig = {
        "application": app.app.application,
        "meta": {
          "title": app.title
        },
        "services": {
          "dns": {
            "hostname": app.hostname,
            "domain": app.domain
          },
          "dataporten": {
            "token": "xxx"
          }
        },
        "infrastructure": app.infrastructure,
        "size": app.size,
        "admingroup": "fc:org:uninett.no"
      }

      API.install(deploymentConfig)
      break

      AppEngineStore.emitChange()
      break

    // case ActionTypes.CREATE_MESSAGE:
    //   var message = ChatMessageUtils.getCreatedMessageData(
    //     action.text,
    //     action.currentThreadID
    //   );
    //   _applications[message.id] = message;
    //   AppEngineStore.emitChange();
    //   break;
    //
    // case ActionTypes.RECEIVE_RAW_MESSAGES:
    //   // _addMessages(action.rawMessages);
    //   // Dispatcher.waitFor([ThreadStore.dispatchToken]);
    //   // _markAllInThreadRead(ThreadStore.getCurrentID());
    //   AppEngineStore.emitChange();
    //   break;

    default:
      // do nothing
  }

});

module.exports = AppEngineStore;
