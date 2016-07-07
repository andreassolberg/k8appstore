
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
              <div id="appstore"  className="appstore">
                <div className="appdirectory" ref="appdirectory">
                  <div className="">
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
                <div className="">
                  <h2 className="header">UH-sky</h2>
                  <p className="caption">UH-sky er et program i regi av UNINETT, finansiert av Kunnskapsdepartementet. Initiativet til UH-sky ble tatt av UNINETT i samarbeid med UiB, UiO, UiT Norges arktiske universitet og NTNU.</p>
                </div>
              </div>
            </div>

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
