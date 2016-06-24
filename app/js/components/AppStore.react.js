
import React, {Component} from 'react';

import AppBar from 'material-ui/AppBar';

import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';



// var MessageSection = require('./MessageSection.react');
// var ThreadSection = require('./ThreadSection.react');
// 

import NavigationStore from '../stores/NavigationStore';

import AppDirectory from './AppDirectory.react';

// var AppDirectory = require('./AppDirectory.react');
// var Install = require('./Install.react');



function getStateFromStores() {
  var navCurrent = NavigationStore.getCurrent();
  console.error("AppStore: Getting state from stores", navCurrent);
  return {
    nav: navCurrent,
    // thread: ThreadStore.getCurrent()
  };
}


class AppStore extends Component {
  constructor(props, context) {
    super(props, context);

    // this.handleRequestClose = this.handleRequestClose.bind(this);
    // this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = getStateFromStores();
  }

  // getInitialState() {
  //   return getStateFromStores();
  // }

  componentDidMount() {
    NavigationStore.addChangeListener(this._onChange);
    // MessageStore.addChangeListener(this._onChange);
    // ThreadStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() { 
    NavigationStore.removeChangeListener(this._onChange);
    // MessageStore.removeChangeListener(this._onChange);
    // ThreadStore.removeChangeListener(this._onChange);
  }
  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onChange() {
    console.log("Set state..");
    this.setState(getStateFromStores());
  }


  render() {


  	var mainElement = null;
    // console.error("render", this.state);

  	console.log("RENDER STATE", this.state);
  	if (this.state.nav === 'library') {
  		mainElement = <AppDirectory />;
  	}
  	// if (this.state.nav === 'install') {
  	// 	mainElement = <Install />;
  	// }

    return (
      <div>
      <AppBar
          title="UNINETT k8 AppStore"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
      <header>
        <div className="container">
          <a href="#" data-activates="nav-mobile" className="button-collapse top-nav waves-effect waves-light circle hide-on-large-only"><i className="material-icons">menu</i></a>
        </div>

        <div id="nav-mobile" className="side-nav fixed">
          <List>
            <ListItem primaryText="AppStore" leftIcon={<ContentInbox />} />
            <ListItem primaryText="Running Apps" leftIcon={<ActionGrade />} />
            <ListItem primaryText="Billing" leftIcon={<ContentSend />} />
            <ListItem primaryText="UH-Sky" leftIcon={<ActionGrade />} />
          </List>
        </div>



      </header>
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