var
  AppLibraryCreators = require('../actions/AppLibraryCreators'),
  AppEngineCreators = require('../actions/AppEngineCreators'),
  MiscCreators = require('../actions/MiscCreators'),

  requestraw = require('browser-request')

var baseURL = 'http://localhost:8080'

var token = null;

let request = function(opts) {

  return new Promise(function(resolve, reject) {
    requestraw(opts, (err, result, body) => {
      // console.log("Request ----- ");
      // console.log("opts", opts)
      // console.log("err", err)
      // console.log("result", result)
      // console.log("body", body)

      if (err) {
        return reject(err, result)
      }

      if (result.statusCode !== 200) {
        return reject(body, result)
      }

      return resolve(body, result)
    })
  })
}


let arequest = function(opts) {
  if (!opts.headers) {
    opts.headers = {}
  }
  opts.headers.Authorization = "Bearer " + token.access_token
  return request(opts)
}





var delayIt = function(ms) {
  return function(data) {
    return new Promise(function(resolve, reject) {
      setTimeout(() => {
        resolve(data)
      }, ms)
    })
  }
}

var API = {

  init() {

    API.getLibrary()
    API.authenticate()
      .then(API.getDeployments())

  },

  getLibrary() {

    let opts = {
      "url": baseURL + '/applications',
      "json": true
    }
    request(opts)
      .then((data) => {
        AppLibraryCreators.receiveAll(data);
      })

  },

  getDeployments() {

    let opts = {
      "url": baseURL + '/deployments',
      "json": true
    }

    arequest(opts)
      .then((data) => {
        // console.log("receiveDeploymentsAll", data)
        // console.log("AppEngineCreators", AppEngineCreators)
        // console.log("AppLibraryCreators", AppLibraryCreators)
        AppEngineCreators.receiveDeploymentsAll(data);
      })
  },

  install(deploymentConfig) {

    console.log("About to install", deploymentConfig)

    var opts = {
      "url": baseURL + '/deployments',
      "method": "POST",
      "json": deploymentConfig
    }
    return arequest(opts)
      .then((response, req) => {
        AppEngineCreators.receiveDeploymentSuccess(response);
        return response
      })
      // .catch((err) => {
      //   AppEngineCreators.receiveDeploymentFailed(err);
      // })
  },

  deploymentDelete(deploymentId) {
    var opts = {
      "url": baseURL + '/deployments/' + deploymentId,
      "method": "DELETE"
    }
    return arequest(opts)
      .then((response, req) => {
        AppEngineCreators.deleteDeploymentSuccess(deploymentId);
      })
      .catch((err) => {
        console.error("Error deleting app instance", err)
        // AppEngineCreators.receiveDeploymentFailed(err);
      })
  },

  authenticate() {

    let opts = {

    }
    return new Promise(function(resolve, reject) {

      window.jso.getToken((t) => {
        token = t;
        resolve()
      }, opts)
    })
    .then(function(t) {
      return Promise.all([
        API.getUserinfo(),
        API.getGroups()
      ])
    })
    .then((results) => {
      // console.log("RESULTS", results)
      MiscCreators.authenticationSuccess(...results, token)
    })

  },

  getUserinfo() {
    return arequest({
      "url": "https://auth.dataporten.no/userinfo",
      "json": true
    })
      .then((userinfo) => {
        // console.log("Userinfo", userinfo)
        return userinfo.user
      })
  },

  getGroups() {
    return arequest({
      "url": "https://groups-api.dataporten.no/groups/me/groups",
      "json": true
    })
      .then((groups) => {
        // console.log("Groups", groups)
        return groups
      })
  }

}

module.exports = API
