
import React, {Component} from 'react';

import AppDirectoryItem from './AppDirectoryItem.react';
import AppLibraryStore from '../stores/AppLibraryStore';

import CardExampleWithoutAvatar from './CardExampleWithoutAvatar.react';
// var MessageStore = require('../stores/MessageStore');
// var ThreadStore = require('../stores/ThreadStore');

function getStateFromStores() {
  // console.log("Getting state from stores", AppLibraryStore.getAll());
  return {
    applications: AppLibraryStore.getAllList(),
    // thread: ThreadStore.getCurrent()
  };
}

function getAppItem(app) {
  return (
    <AppDirectoryItem
      key={app.id}
      app={app}
    />
  );
}

class AppListing extends Component {
  constructor(props, context) {
    super(props, context);

    // this.handleRequestClose = this.handleRequestClose.bind(this);
    // this.handleTouchTap = this.handleTouchTap.bind(this);
    this.state = getStateFromStores();
    this._onChange = this._onChange.bind(this);
  }


  componentDidMount() {
    this._scrollToBottom();
    AppLibraryStore.addChangeListener(this._onChange);
    // MessageStore.addChangeListener(this._onChange);
    // ThreadStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    AppLibraryStore.removeChangeListener(this._onChange);
    // MessageStore.removeChangeListener(this._onChange);
    // ThreadStore.removeChangeListener(this._onChange);
  }

  render() {
    console.log("Render, state", this.state);
    var appItems = this.state.applications.map(getAppItem);

    return (
      <div>

        <div className="container">
          <div className="row">

            <div className="col s12 m9 l10">
              <div id="appstore"  className="appstore">
                <div className="appdirectory" ref="appdirectory">
                  <div className="row">
                      {appItems}
                  </div>
                </div>
              </div>

              <div id="materialdesign" className="section scrollspy">
                <p className="caption">Created and designed by Google, Material Design is a design language that combines the classic principles of successful design
                  along with innovation and technology. Googles goal is to develop a system of design that allows for a unified user experience
                  across all their products on any platform.</p>
              </div>

              <div id="uhskyinfo" className="section scrollspy">
                <div className="row">
                  <h2 className="header">UH-sky</h2>
                  <p className="caption">UH-sky er et program i regi av UNINETT, finansiert av Kunnskapsdepartementet. Initiativet til UH-sky ble tatt av UNINETT i samarbeid med UiB, UiO, UiT Norges arktiske universitet og NTNU.</p>
                </div>
              </div>
            </div>

            <div className="col hide-on-small-only m3 l2">
              <div className="toc-wrapper">
                <div className="toc-wrapperInner">
                  <ul className="section table-of-contents">
                    <li><a href="#appstore">Applications</a></li>
                    <li><a href="#uhskyinfo">UH-sky</a></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    this._scrollToBottom();
  }

  _scrollToBottom() {
    // console.log("Scrolling to bottom, when component is mounted.");
    // var ul = this.refs.messageList.getDOMNode();
    // ul.scrollTop = ul.scrollHeight;
  }

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onChange() {
    this.setState(getStateFromStores());
  }

};

module.exports = AppListing;
