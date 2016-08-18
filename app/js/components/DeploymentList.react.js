
import React, {Component} from 'react';

import DeploymentItem from './DeploymentItem.react';
import AppEngineStore from '../stores/AppEngineStore';
import AppLibraryStore from '../stores/AppLibraryStore';

function getStateFromStores() {
  return {
    deployments: AppEngineStore.getAllList()
  }
}

function getAppItem(deployment) {
  return (
    <DeploymentItem
      key={deployment.id}
      deployment={deployment}
    />
  )
}

class DeploymentList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = getStateFromStores();
    this._onChange = this._onChange.bind(this);
  }


  componentDidMount() {
    this._scrollToBottom();
    AppEngineStore.addChangeListener(this._onChange);
    AppLibraryStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    AppEngineStore.removeChangeListener(this._onChange);
    AppLibraryStore.removeChangeListener(this._onChange);
  }

  render() {
    // console.log("Render, state", this.state);
    // console.log("Redering deployment list ", this.state)
    var appItems = this.state.deployments.map(getAppItem);

    return (
      <div>

        <div className="content">

            <div className="">

              <p>These applications are currently deployed:</p>

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

module.exports = DeploymentList;
