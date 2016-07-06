import React, {Component} from 'react'
import AppBar from 'material-ui/AppBar'
import {List, ListItem} from 'material-ui/List'

// Stores
import NavigationStore from '../stores/NavigationStore'
import DeploymentOptionsStore from '../stores/DeploymentOptionsStore'

// React compontents
import AppDirectory from './AppDirectory.react'
import DeploymentList from './DeploymentList.react'
import Install from './Install.react'

function getStateFromStores() {
	var navCurrent = NavigationStore.getCurrent();
	var app = DeploymentOptionsStore.getApp();
	return {
		nav: navCurrent,
		app: app
	}
}

class AppStore extends Component {
	constructor(props, context) {
		super(props, context);
		this._onChange = this._onChange.bind(this);
		this.state = getStateFromStores();
	}

	componentDidMount() {
		NavigationStore.addChangeListener(this._onChange);
		DeploymentOptionsStore.addChangeListener(this._onChange);
		// MessageStore.addChangeListener(this._onChange);
		// ThreadStore.addChangeListener(this._onChange);
	}

	componentWillUnmount() {
		NavigationStore.removeChangeListener(() => this._onChange);
		DeploymentOptionsStore.removeChangeListener(() => this._onChange);
		// MessageStore.removeChangeListener(this._onChange);
		// ThreadStore.removeChangeListener(this._onChange);
	}

	/**
	* Event handler for 'change' events coming from the stores
	*/
	_onChange() {
		// console.log("Set state..");
		this.setState(getStateFromStores());
	}

	render() {

		var mainElement = null;
		// console.error("render", this.state);

		// console.log("RENDER STATE", this.state);
		if (this.state.nav === 'library') {
			mainElement = <AppDirectory/>;
		}
		if (this.state.nav === 'install') {
			let app = this.state.app;
			mainElement = <Install app={app} />;
		}
		if (this.state.nav === 'deployments') {
			mainElement = <DeploymentList />;
		}

		return (
			<div className="mainContent">
				<AppBar title="UNINETT k8 AppStore" iconClassNameRight="muidocs-icon-navigation-expand-more"/>
				<main>
					{mainElement}
				</main>

				<footer className="page-footer">
					<div className="footer-copyright">
						<div className="container">
							UNINETT © 2016
							<a className="grey-text text-lighten-4 right" href="https://github.com/Dogfalo/materialize/blob/master/LICENSE">MIT License</a>
						</div>
					</div>
				</footer>
			</div>
		);
	}

};

export default AppStore;
