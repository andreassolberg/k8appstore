import React, {Component, ReactPropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import DeploymentConfiguration from './DeploymentConfiguration.react'

// import DeploymentOptionsStore from '../stores/DeploymentOptionsStore'
import AppLibraryStore from '../stores/AppLibraryStore'
import AppEngineCreators from '../actions/AppEngineCreators'
import UserContextStore from '../stores/UserContextStore'

import API from '../utils/API'

function getStateFromStores(application) {
  return {
    // options: DeploymentOptionsStore.getOptions(),
		// data: DeploymentOptionsStore.getData()
  }
}


class Install extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = getStateFromStores(this.props.params.application)

		this._actInstallStart = this._actInstallStart.bind(this);
		this._actCancel = this._actCancel.bind(this);
		this._onChange = this._onChange.bind(this)

  }


  componentDidMount() {
    // DeploymentOptionsStore.addChangeListener(this._onChange)
    AppLibraryStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    // DeploymentOptionsStore.removeChangeListener(this._onChange)
    AppLibraryStore.removeChangeListener(this._onChange)
  }


  /**
   * Event handler for 'change' events coming from the store
   */
  _onChange() {
		// console.log("Not sure what to do. Updates on DeploymentOptionsStore..")
    // console.log()
    this.setState(getStateFromStores())
  }



	_actInstallStart() {

    let usercontext = UserContextStore.getContext()
    // console.log("User context is ", usercontext)
    if (!usercontext.authenticated) {
      throw new Error("Cannot deploy application when not authenticated")
    }

    let deploymentConfig = this.refs.dconfigurator.getUpdate()
		// if (deploymentConfig.services && deploymentConfig.services.dataporten) {
			deploymentConfig.services.dataporten = {
	      "token": usercontext.token.access_token
	    }
		// }



    // let app = AppLibraryStore.get(this.props.params.application)
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
    // AppEngineCreators.installApp(deploymentConfig)

    API.install(deploymentConfig)
      .then((deployment) => {
        const path = "/deployments/" + deployment.id
        this.context.router.push(path)
      })
      .catch((err) => {
        console.error("Error deploying app", err)
        // alert("Error deploying application...")
      })

	}

	_actCancel() {
    AppEngineCreators.installCancel()
	}

	render() {
		this.app = AppLibraryStore.get(this.props.params.application)
    if (!this.app) {
      return (
        <div>Loading...</div>
      )
    }
    var deploymentConfiguration = {
      "application": this.props.params.application,
      "meta": {

      },
      "services": {
        "dns": {}
      }
    }

		return (
			<div className="content">

				<div className="section">
          <h1>Installing new deployment of {this.app.title}</h1>

          <DeploymentConfiguration ref="dconfigurator" deploymentConfiguration={deploymentConfiguration} />

					<div>
							<RaisedButton label="Install" primary={true} onMouseUp={this._actInstallStart} />
		          <FlatButton label="Cancel" secondary={true} onMouseUp={this._actCancel} />
					</div>
        </div>

			</div>
		);
	}
}

Install.contextTypes = {
    router: function() { return React.PropTypes.func.isRequired }
}

export default Install;
