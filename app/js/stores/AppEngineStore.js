
var
  AppLibraryStore = require('./AppLibraryStore'),
  Dispatcher = require('../dispatcher/AppStoreDispatcher'),
  Constants = require('../constants/Constants'),
  ChatMessageUtils = require('../utils/ChatMessageUtils'),
  EventEmitter = require('events').EventEmitter,
  API = require('../utils/API')

var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _deployments = {}


class Deployment {
  constructor(props) {
    for(let key in props) {
      this[key] = props[key]
    }
  }
  getApplication() {
    return AppLibraryStore.get(this.application)
  }
}


function _addDeployment(item) {
  _deployments[item.id] = new Deployment(item);
}

function _addDeployments(items) {
  items.forEach((item) => {
    _addDeployment(item)
  })
}


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
    return _deployments[id];
  },

  /**
   * @param {string} threadID
   */
  getAll: function() {
    return _deployments;
  },

  getAllList: function() {
    var list = [];
    for(var key in _deployments) {
      list.push(_deployments[key]);
    }
    return list;
  },

  getAllForCurrentThread: function() {
    // return this.getAllForThread(ThreadStore.getCurrentID());
  }

});

AppEngineStore.dispatchToken = Dispatcher.register(function(action) {


  switch(action.type) {

    case ActionTypes.RECEIVE_DEPLOYMENT_SUCCESS:
      _addApp(action.deployment);
      AppEngineStore.emitChange();
      break;

    case ActionTypes.RECEIVE_DEPLOYMENTS_ALL:
      _addDeployments(action.deployments);
      AppEngineStore.emitChange();
      break;

    case ActionTypes.INSTALL_APP:

      let deploymentConfig = action.deploymentConfig;

      API.install(deploymentConfig)
      break


    case ActionTypes.RECEIVE_DEPLOYMENT_SUCCESS:

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
