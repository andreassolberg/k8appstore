var
  AppLibraryCreators = require('../actions/AppLibraryCreators'),
  AppEngineCreators = require('../actions/AppEngineCreators'),
  requestraw = require('browser-request')

var baseURL = 'http://localhost:8080'


let request = function(opts) {
  return new Promise(function(resolve, reject) {
    requestraw(opts, (err, result, body) => {
      if (err) {
        return reject(err)
      }
      return resolve(body, result)
    })
  })
}


var API = {

  init() {
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
      .then((response) => {
        console.log("Successfull response", response);
      })
      .catch((err) => {
        console.error("Error response", err);
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
