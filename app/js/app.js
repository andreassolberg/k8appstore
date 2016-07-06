import React from 'react'
import {render} from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import AppEngineStore from './stores/AppEngineStore'


import AppStore from './components/AppStore.react'
import MenuDrawer from './components/MenuDrawer.react'
import API from './utils/API'

window.React = React; // export for http://fb.me/react-devtools
API.init();
injectTapEventPlugin();

render(
	<MuiThemeProvider>
		<div>
			<MenuDrawer />
			<AppStore />
		</div>
	</MuiThemeProvider>,
	document.getElementById('react')
);
