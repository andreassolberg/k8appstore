import React from 'react';
import {render} from 'react-dom';

import AppStore from './components/AppStore.react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

var API = require('./utils/API');

window.React = React; // export for http://fb.me/react-devtools

// ChatExampleData.init(); // load example data into localstorage
API.getInitialLibrary();



injectTapEventPlugin();


render(
	<MuiThemeProvider>
		<AppStore />
	</MuiThemeProvider>,
	document.getElementById('react')
);
