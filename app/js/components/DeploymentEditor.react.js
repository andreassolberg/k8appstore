import React, {Component, ReactPropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// import DeploymentOptionsStore from '../stores/DeploymentOptionsStore'
import AppEngineStore from '../stores/AppEngineStore'
import AppEngineCreators from '../actions/AppEngineCreators'
import UserContextStore from '../stores/UserContextStore'

import DeploymentConfiguration from './DeploymentConfiguration.react'


// function getStateFromStores(application) {
//   // console.log("Getting state from stores", DeploymentOptionsStore.getOptions());
//   console.log("Get application ", application)
//   return {
//     options: DeploymentOptionsStore.getOptions(),
// 		data: DeploymentOptionsStore.getData()
//     // thread: ThreadStore.getCurrent()
//   };
// }


class DeploymentEditor extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {}
    this.dconfigurator = null

    this._actSaveChanges = this._actSaveChanges.bind(this)
		this._actReset = this._actReset.bind(this)


  }

  componentWillMount() {
    console.error("We are about to launch the DeploymentEditor...")
    console.log("this.props.params.deployment", this.props.params.deployment)

  }

  componentDidMount() {
    // this._scrollToBottom();
    // DeploymentOptionsStore.addChangeListener(this._onChange)
    AppEngineStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    // DeploymentOptionsStore.removeChangeListener(this._onChange)
    AppEngineStore.removeChangeListener(this._onChange)
  }



  /**
   * Event handler for 'change' events coming from the store
   */
  _onChange() {
		console.log("Not sure what to do. Updates on DeploymentOptionsStore..")
    console.log()
    // this.setState(getStateFromStores());
  }

	_actSaveChanges() {
    console.error("---")
    let usercontext = UserContextStore.getContext()
    console.log("User context is ", usercontext)
    if (!usercontext.authenticated) {
      throw new Error("Cannot deploy application when not authenticated")
    }

    let deploymentConfig = this.refs.dconfigurator.getUpdate()
    deploymentConfig.services.dataporten = {
      "token": usercontext.token.access_token
    }

    console.error("UPDATE IS", deploymentConfig)




    // let deploymentConfig = {
    //   "application": app.application,
    //   "meta": {
    //     "title": this.state.data.title
    //   },
    //   "services": {
    //     "dns": {
    //       "hostname": this.state.data.hostname,
    //       "domain": this.state.data.domain
    //     },
    //     "dataporten": {
    //       "token": usercontext.token.access_token
    //     }
    //   },
    //   "infrastructure": this.state.data.infrastructure,
    //   "size": this.state.data.size,
    //   "admingroup": "fc:org:uninett.no"
    // }
    console.error("About to install deployment", deploymentConfig)
    AppEngineCreators.updateApp(deploymentConfig)

	}

	_actReset() {
    // AppEngineCreators.installCancel()
    console.error("RESET!")
	}


	render() {

    // console.error("We are rendering Install component", this.props.app )


		var deploymentConfiguration = AppEngineStore.get(this.props.params.deployment)

    console.log("this.props.params.deployment", this.props.params.deployment, deploymentConfiguration)

    if (!deploymentConfiguration) {
      return (
        <div>Loading...</div>
      )
    }


		return (
	    <div>
          <p>Editing existing deployment {deploymentConfiguration.id}.</p>
          <DeploymentConfiguration ref="dconfigurator" deploymentConfiguration={deploymentConfiguration} />
          <div>
              <RaisedButton label="Save changes" primary={true} onMouseUp={this._actSaveChanges} />
              <FlatButton label="Reset" secondary={true} onMouseUp={this._actReset} />
          </div>
      </div>
		);
	}
}
// console.log("ReactPropTypes", ReactPropTypes);
// Install.propTypes = {
//     app: ReactPropTypes.object
// };

export default DeploymentEditor;
