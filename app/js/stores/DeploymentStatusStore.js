var
  Dispatcher = require('../dispatcher/AppStoreDispatcher'),
  Constants = require('../constants/Constants'),
  EventEmitter = require('events').EventEmitter,
  assign = require('object-assign'),

  ActionTypes = Constants.ActionTypes;

import API from '../utils/API'

var CHANGE_EVENT = 'change';
var _data = {}
var _id = null
var _secondsPoll = 3

var DeploymentStatusStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },


	start: function(id) {
    _id = id
    _data[id] = {}
    this.fetch()
    this.poll = setInterval(() => {
      this.fetch()
    }, _secondsPoll*1000)
	},

  fetch: function() {
    API.getDeploymentStatus(_id)
      .then((res) => {
        _data[_id] = res
        DeploymentStatusStore.emitChange();
      })
      .catch((err) => {
        console.error("Error fetching status", err)
      })
  },


	end: function() {
    clearInterval(this.poll)
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


  getStatus: function(id) {
    if (!_data[id]) {
      return {}
    }
    return _data[id];
  }

});

DeploymentStatusStore.dispatchToken = Dispatcher.register(function(action) {

  switch (action.type) {

    case ActionTypes.AUTHENTICATION_SUCCESS:

      // _auth.authenticated = true
      // _auth.user = action.user
      // _auth.groups = action.groups
      // _auth.token = action.token

      // console.log("AUTHENTICATION_SUCCESS", action)
      // DeploymentStatusStore.emitChange();
      break;

    default:
        // do nothing
  }


});




module.exports = DeploymentStatusStore;
