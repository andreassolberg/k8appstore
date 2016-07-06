"use strict"

var
  Dispatcher = require('../dispatcher/AppStoreDispatcher'),
  Constants = require('../constants/Constants')

var ActionTypes = Constants.ActionTypes;

var AppEngineCreators = {

  deploySetup: function(app) {

    Dispatcher.dispatch({
      type: ActionTypes.DEPLOY_SETUP_APP,
      app: app
    })

  },

  installApp: function(app) {

    // console.log("About to dispatch ActionTypes.INSTALL_APP", app)

    Dispatcher.dispatch({
      type: ActionTypes.INSTALL_APP,
      app: app
    })

    // return API.install(deploymentConfig)

  },

  installCancel: function() {

    Dispatcher.dispatch({
      type: ActionTypes.INSTALL_CANCEL
    })

  },

  receiveDeploymentSuccess(deployment) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_DEPLOYMENT_SUCCESS,
      deployment: deployment
    })
  },
  receiveDeploymentFailed(err) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_DEPLOYMENT_FAILED,
      error: deployments
    })
  },

  receiveDeploymentsAll: function(deployments) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_DEPLOYMENTS_ALL,
      deployments: deployments
    })
  },

  receiveCreatedApp: function(app) {

    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_CREATED_MESSAGE,
      app: app
    });
  }
}

;

module.exports = AppEngineCreators
