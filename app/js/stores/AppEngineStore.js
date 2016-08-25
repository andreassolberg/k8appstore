
var
  AppLibraryStore = require('./AppLibraryStore'),
  Dispatcher = require('../dispatcher/AppStoreDispatcher'),
  Constants = require('../constants/Constants'),
  ChatMessageUtils = require('../utils/ChatMessageUtils'),
  EventEmitter = require('events').EventEmitter,
  API = require('../utils/API')

var assign = require('object-assign')

var ActionTypes = Constants.ActionTypes
var CHANGE_EVENT = 'change'

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

  getURL() {
    let url = null
    if (this.services && this.services.dns) {
      url = 'http://' + this.services.dns.hostname + '.' + this.services.dns.domain
    }
    return url
  }
}


function _addDeployment(item) {
  _deployments[item.id] = new Deployment(item)
}

function _addDeployments(items) {
  items.forEach((item) => {
    _addDeployment(item)
  })
}

function _removeDeployment(id) {
  delete _deployments[id]
}


var AppEngineStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback)
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },

  get: function(id) {
    return _deployments[id]
  },

  /**
   * @param {string} threadID
   */
  getAll: function() {
    return _deployments
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
      _addDeployment(action.deployment)
      AppEngineStore.emitChange()
      break

    case ActionTypes.RECEIVE_DEPLOYMENTS_ALL:
      _addDeployments(action.deployments)
      AppEngineStore.emitChange()
      break

    case ActionTypes.DEPLOY_DELETE_SUCCESS:
      _removeDeployment(action.deploymentId)
      AppEngineStore.emitChange()
      break

    case ActionTypes.RECEIVE_DEPLOYMENT_SUCCESS:

      AppEngineStore.emitChange()
      break

    default:

  }

});

module.exports = AppEngineStore
