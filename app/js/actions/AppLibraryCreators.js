
var Dispatcher = require('../dispatcher/AppStoreDispatcher');
var Constants = require('../constants/Constants');

var ActionTypes = Constants.ActionTypes;

module.exports = {

  receiveAll(apps) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_APPLIBRARY_ALL,
      apps: apps
    })
  },

  receiveCreatedApp(app) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_CREATED_MESSAGE,
      app: app
    })
  }

}
