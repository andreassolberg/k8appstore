
var Dispatcher = require('../dispatcher/AppStoreDispatcher');
var Constants = require('../constants/Constants');

var AppEngineCreators = require('../actions/AppEngineCreators');

var ActionTypes = Constants.ActionTypes;

module.exports = {

  installApp: function(app) {
    // console.log("Install app", app)
    Dispatcher.dispatch({
      type: ActionTypes.INSTALL_APP,
      app: app
    });
  },

  installCancel: function(app) {
    // console.log("Install app", app)
    Dispatcher.dispatch({
      type: ActionTypes.INSTALL_CANCEL,
      app: app
    });
  },

  receiveCreatedApp: function(app) {
		// console.log("Install app", app)
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_CREATED_MESSAGE,
      app: app
    });
  }

};
