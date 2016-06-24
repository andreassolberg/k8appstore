
var AppLibraryCreators = require('../actions/AppLibraryCreators');



module.exports = {

  getInitialLibrary: function() {
    
    $.getJSON('/api/apps', function(data) {
      // console.error("Library is", data);
      AppLibraryCreators.receiveAll(data);

    });

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

};
