var AppStore = require('./components/AppStore.react');
var API = require('./utils/API');
var React = require('react');
window.React = React; // export for http://fb.me/react-devtools

// ChatExampleData.init(); // load example data into localstorage
API.getInitialLibrary();


React.render(
    <AppStore />,
    document.getElementById('react')
);
