
var Dispatcher = require('../dispatcher/AppStoreDispatcher');
var Constants = require('../constants/Constants');

var ActionTypes = Constants.ActionTypes;

module.exports = {

  authenticationSuccess(user, group) {
    Dispatcher.dispatch({
      type: ActionTypes.AUTHENTICATION_SUCCESS,
      user: user,
      group: group
    })
  }

}
