var
  AppLibraryCreators = require('../actions/AppLibraryCreators'),
  AppEngineCreators = require('../actions/AppEngineCreators'),
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



var jso = new JSO({
    providerID: "dataporten",
    client_id: "75adc2bb-1800-4f1c-abe4-bb7da7080485",
    redirect_uri: "http://127.0.0.1:3000/",
    authorization: "https://auth.dataporten.no/oauth/authorization",
    scopes: {}
});

jso.callback();

var API = {

  init() {

    API.authenticate()
    API.getLibrary()
    API.getDeployments()

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

    request(opts)
      .then((data) => {
        // console.log("receiveDeploymentsAll", data)
        // console.log("AppEngineCreators", AppEngineCreators)
        // console.log("AppLibraryCreators", AppLibraryCreators)
        AppEngineCreators.receiveDeploymentsAll(data);
      })
  },

  install(app) {
    var opts = {
      "url": baseURL + '/deployments',
      "method": "POST",
      "json": app
    }
    return request(opts)
      .then((response, req) => {
        // console.log("Successfull response", response);
        // console.log("Full requeset", req)

        AppEngineCreators.receiveDeploymentSuccess(response);
      })
      .catch((err) => {
        // console.error("Error response", err);
        AppEngineCreators.receiveDeploymentFailed(err);
      })
  },

  authenticate() {

    let opts = {

    }
    return jso.getToken(opts)
      .then(function(t) {
  			console.log("I got the token: ", t);
        token = t;

        API.getUserinfo()
        API.getGroups()
  		});

  },


  getUserinfo() {
    arequest({
      "url": "https://auth.dataporten.no/userinfo"
    })
      .then((userinfo) => {
        console.log("Userinfo", userinfo)
      })
  },

  getGroups() {
    arequest({
      "url": "https://groups-api.dataporten.no/groups/me/groups"
    })
      .then((groups) => {
        console.log("Groups", groups)
      })
  }

  // createMessage: function(message, threadName) {
  //   // simulate writing to a database
  //   var rawMessages = JSON.parse(localStorage.getItem('messages'));
  //   var timestamp = Date.now();
  //   var id = 'm_' + timestamp;
  //   var threadID = message.threadID || ('t_' + Date.now());
  //   var createdMessage = {
  //     id: id,
  //     threadID: threadID,
  //     threadName: threadName,
  //     authorName: message.authorName,
  //     text: message.text,
  //     timestamp: timestamp
  //   };
  //   rawMessages.push(createdMessage);
  //   localStorage.setItem('messages', JSON.stringify(rawMessages));

  //   // simulate success callback
  //   setTimeout(function() {
  //     AppLibraryCreators.receiveCreatedMessage(createdMessage);
  //   }, 0);
  // }

}

module.exports = API
