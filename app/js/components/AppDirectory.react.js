
import React, {Component} from 'react';

import AppDirectoryItem from './AppDirectoryItem.react';
import AppLibraryStore from '../stores/AppLibraryStore';

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
      key={app.application}
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
    // console.log("Render, state", this.state);
    var appItems = this.state.applications.map(getAppItem);

/*
<div className="">
  <div className="toc-wrapper">
    <div className="toc-wrapperInner">
      <ul className="section table-of-contents">
        <li><a href="#appstore">Applications</a></li>
        <li><a href="#uhskyinfo">UH-sky</a></li>
      </ul>
    </div>
  </div>
</div>
*/
    return (
      <div>

        <div className="content">

            <div className="">
              <div id="appstore"  className="appstore">
                <div className="appdirectory" ref="appdirectory">
                  <div className="">
                      {appItems}
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
