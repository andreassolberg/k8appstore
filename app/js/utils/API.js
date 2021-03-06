var
  AppLibraryCreators = require('../actions/AppLibraryCreators'),
  AppEngineCreators = require('../actions/AppEngineCreators'),
  MiscCreators = require('../actions/MiscCreators'),

  requestraw = require('browser-request')

var baseURL = 'https://k8appengine.dataporten-api.no'

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

    API.authenticate()
      .then(API.getLibrary())
      .then(API.getDeployments())

  },

  getLibrary() {

    let opts = {
      "url": baseURL + '/applications',
      "json": true
    }
    arequest(opts)
      .then((data) => {
        AppLibraryCreators.receiveAll(data);
        console.log("DATA", data)

      })
      .catch((err) => {
        console.error("ERROR", err)
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
      .catch((err) => {
        console.error("ERROR", err)
      })
  },

  getDeploymentStatus(id) {
    let opts = {
      "url": baseURL + '/deployments/' + id + '/status',
      "json": true
    }

    return arequest(opts)
      // .then((data) => {
      //   // console.log("receiveDeploymentsAll", data)
      //   // console.log("AppEngineCreators", AppEngineCreators)
      //   // console.log("AppLibraryCreators", AppLibraryCreators)
      //   console.log("GOT DATA", data)
      //   return data
      // })
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

  update(deploymentConfig) {
    console.log("About to update", deploymentConfig)
    if (!deploymentConfig.id) {
      throw new Error("Cannot update deployment if identifier is unspecified.")
    }
    var opts = {
      "url": baseURL + '/deployments/' + deploymentConfig.id,
      "method": "PATCH",
      "json": deploymentConfig
    }
    return arequest(opts)
      .then((response, req) => {
        AppEngineCreators.receiveDeploymentSuccess(response);
        return response
      })
  },

  deploymentDelete(deploymentId, token) {
    var opts = {
      "url": baseURL + '/deployments/' + deploymentId + '?token=' + token,
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
