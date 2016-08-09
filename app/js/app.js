import React from 'react'
import {render} from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'



// window.jso = new JSO({
//     providerID: "dataporten",
//     client_id: "75adc2bb-1800-4f1c-abe4-bb7da7080485",
//     redirect_uri: "http://127.0.0.1:3000/",
//     authorization: "https://auth.dataporten.no/oauth/authorization",
//     scopes: {}
// });

// console.log("=====> HASH", window.location.hash)
// window.jso.callback()
// console.log("=====^")

// console.log("=====> JSO")
// console.log(JSO)
// console.log("=====^")

import {Router, useRouterHistory} from 'react-router';
import {
  Route,
  Redirect,
  IndexRoute,
} from 'react-router';
import {createHashHistory} from 'history';

// React compontents
import AppDirectory from './components/AppDirectory.react'
import DeploymentList from './components/DeploymentList.react'
import Install from './components/Install.react'
import OAuthCallback from './components/OAuthCallback.react'

import AppEngineStore from './stores/AppEngineStore'

import MainPageLayout from './components/MainPageLayout.react'


import API from './utils/API'

window.React = React; // export for http://fb.me/react-devtools
API.init();
injectTapEventPlugin();

render(
	<Router
		history={useRouterHistory(createHashHistory)({queryKey: false})}
		onUpdate={() => window.scrollTo(0, 0)}
	>
		<Route path="/" component={MainPageLayout}>
			<IndexRoute component={AppDirectory} />
			<Route path="applications" component={AppDirectory} />
			<Redirect from="go" to="/applications" />
			<Route path="deployments" component={DeploymentList} />
			<Route path="install" component={Install} />
      <Route path="callback" component={OAuthCallback} />
		</Route>
  </Router>
,
	document.getElementById('react')
);
