"use strict"

var
  Dispatcher = require('../dispatcher/AppStoreDispatcher'),
  Constants = require('../constants/Constants')

var ActionTypes = Constants.ActionTypes;

var AppEngineCreators = {

  deploySetup: function(app) {

    Dispatcher.dispatch({
      app,
      type: ActionTypes.DEPLOY_SETUP_APP
    })

  },

  deployDelete: function(deploymentId) {
    Dispatcher.dispatch({
      deploymentId,
      type: ActionTypes.DEPLOY_DELETE
    })
  },

  deleteDeploymentSuccess: function(deploymentId) {
    Dispatcher.dispatch({
      deploymentId,
      type: ActionTypes.DEPLOY_DELETE_SUCCESS
    })
  },

  installApp: function(app) {
    Dispatcher.dispatch({
      app,
      type: ActionTypes.INSTALL_APP
    })
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
