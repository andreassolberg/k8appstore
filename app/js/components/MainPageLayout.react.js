import React, {Component} from 'react'


// Material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import {List, ListItem} from 'material-ui/List'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

// Local components
import MenuDrawer from './MenuDrawer.react'

// Stores
import NavigationStore from '../stores/NavigationStore'
import DeploymentOptionsStore from '../stores/DeploymentOptionsStore'
import UserContextStore from '../stores/UserContextStore'


function getStateFromStores() {
	var navCurrent = NavigationStore.getCurrent()
	var app = DeploymentOptionsStore.getApp()
	var usercontext = UserContextStore.getContext()
	return {
		nav: navCurrent,
		app: app,
		usercontext: usercontext
	}
}

class MainPageLayout extends Component {
	constructor(props, context) {
		super(props, context);
		this._onChange = this._onChange.bind(this);
		this.state = getStateFromStores();
	}

	componentDidMount() {
		UserContextStore.addChangeListener(this._onChange);
		NavigationStore.addChangeListener(this._onChange);
		DeploymentOptionsStore.addChangeListener(this._onChange);
		// MessageStore.addChangeListener(this._onChange);
		// ThreadStore.addChangeListener(this._onChange);
	}

	componentWillUnmount() {
		UserContextStore.removeChangeListener(() => this._onChange);
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

		// var mainElement = null;
		// // console.error("render", this.state);
    //
		// // console.log("RENDER STATE", this.state);
		// if (this.state.nav === 'library') {
		// 	mainElement = <AppDirectory/>;
		// }
		// if (this.state.nav === 'install') {
		// 	let app = this.state.app;
		// 	mainElement = <Install app={app} />;
		// }
		// if (this.state.nav === 'deployments') {
		// 	mainElement = <DeploymentList />;
		// }
		// muidocs-icon-navigation-expand-more


		var authMenu = null
		var iconButton = null;

		// iconButton = (
		// 	<IconButton touch={true}>
		// 		<p>BLah</p>
		// 		<NavigationExpandMoreIcon />
		// 	</IconButton>
		// )

		if (this.state.usercontext.authenticated) {
			iconButton = (
				<FlatButton
		      label={this.state.usercontext.user.name}
					labelPosition="before"
		      secondary={false}
		      icon={<NavigationExpandMoreIcon />}
		    />
			)
			authMenu = (
				<IconMenu
					anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
					iconButtonElement={iconButton}
				>
					<MenuItem primaryText="My profile" />
					<MenuItem primaryText="Logout" />
				</IconMenu>
			)

		}

		return (
  		<MuiThemeProvider>
  			<div>
  				<MenuDrawer />
  				<div className="mainContent">
  					<AppBar
  						title="UNINETT k8 AppStore"
  						iconElementRight={authMenu}
  						/>
  					<main>
  						{this.props.children}
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
  			</div>
  		</MuiThemeProvider>
		)
	}

}

export default MainPageLayout;
