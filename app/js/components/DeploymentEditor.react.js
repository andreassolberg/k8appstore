import React, {Component, ReactPropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Tabs, Tab} from 'material-ui/Tabs';
// import {Card, CardTitle, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';

// import DeploymentOptionsStore from '../stores/DeploymentOptionsStore'
import AppEngineStore from '../stores/AppEngineStore'
import AppEngineCreators from '../actions/AppEngineCreators'
import UserContextStore from '../stores/UserContextStore'
import DeploymentStatusStore from '../stores/DeploymentStatusStore'

import DeploymentConfiguration from './DeploymentConfiguration.react'
import DeploymentStatus from './DeploymentStatus.react'

import API from '../utils/API'


function getStateFromStores() {
  return {
    // options: DeploymentOptionsStore.getOptions(),
		// data: DeploymentOptionsStore.getData(),
    usercontext: UserContextStore.getContext()
  };
}


class DeploymentEditor extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			"tabValue": "status"
		}
    this.dconfigurator = null

    this._actSaveChanges = this._actSaveChanges.bind(this)
		this._tabChange = this._tabChange.bind(this)
		this._onChange = this._onChange.bind(this)
		this._actReset = this._actReset.bind(this)
		this._actDelete = this._actDelete.bind(this)

  }

  componentWillMount() {
    // console.error("We are about to launch the DeploymentEditor...")
    // console.log("this.props.params.deployment", this.props.params.deployment)

  }

  componentDidMount() {
    // this._scrollToBottom();
    UserContextStore.addChangeListener(this._onChange)
    AppEngineStore.addChangeListener(this._onChange)
		DeploymentStatusStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    UserContextStore.removeChangeListener(this._onChange)
    AppEngineStore.removeChangeListener(this._onChange)
		DeploymentStatusStore.removeChangeListener(this._onChange)
  }



  /**
   * Event handler for 'change' events coming from the store
   */
	_onChange() {
		this.setState(getStateFromStores());
	}

	_actSaveChanges() {
    let usercontext = UserContextStore.getContext()
    if (!usercontext.authenticated) {
      throw new Error("Cannot deploy application when not authenticated")
    }

    let deploymentConfig = this.refs.dconfigurator.getUpdate()
		if (deploymentConfig.services && deploymentConfig.services.dataporten) {
			deploymentConfig.services.dataporten = {
	      "token": usercontext.token.access_token
	    }
		}

    // console.error("UPDATE IS", JSON.stringify(deploymentConfig, undefined, 2))

		API.update(deploymentConfig)
      .then((deployment) => {

				this.setState({
					"tabValue": "status"
				})

      })
      .catch((err) => {
        // console.error("Error deploying app", err)
        // alert("Error deploying application...")
      })


	}

	_actDelete() {
		// console.error("DELETE", this.props.params.deployment, this.state.usercontext.token.access_token)
		// return
		API.deploymentDelete(this.props.params.deployment, this.state.usercontext.token.access_token)
			.then(() => {
				const path = "/deployments/"
        this.context.router.push(path)
			})
	}

	_actReset() {
    // AppEngineCreators.installCancel()
    // console.error("RESET!")
	}

	_tabChange(value) {
		if (typeof value === 'string') {
			// console.log("tab change!", value)
			this.setState({
				"tabValue": value
			})
		}
	}

	render() {

    // console.error("We are rendering Install component", this.props.app )


		var deploymentConfiguration = AppEngineStore.get(this.props.params.deployment)

    // console.log("this.props.params.deployment", this.props.params.deployment, deploymentConfiguration)
		// console.log("STATE", JSON.stringify(this.state, undefined, 3))

    if (!deploymentConfiguration) {
      return (
        <div>Loading...</div>
      )
    }

		const styles = {
		  headline: {
		    fontSize: 24,
		    paddingTop: 16,
		    marginBottom: 12,
		    fontWeight: 400,
		  }
		}

		return (
			<Tabs
        value={this.state.tabValue}
        onChange={this._tabChange}
      >
				<Tab label="Status" value="status">
					<DeploymentStatus deploymentConfiguration={deploymentConfiguration} deploymentId={deploymentConfiguration.id} />
				</Tab>
				<Tab label="Configure deployment" value="configure" >
					<div>
						<p>Editing existing deployment {deploymentConfiguration.id}.</p>
	          <DeploymentConfiguration ref="dconfigurator" deploymentConfiguration={deploymentConfiguration} />
	          <div>
	              <RaisedButton label="Save changes" primary={true} onMouseUp={this._actSaveChanges} />
	              <FlatButton label="Reset" secondary={true} onMouseUp={this._actReset} />
	          </div>
					</div>
				</Tab>
				<Tab label="Application info" value="appinfo">
					<div>
						<p>Application {deploymentConfiguration.application}.</p>
					</div>
				</Tab>
				<Tab label="Delete" value="delete">
					<div>
						<p>Are you sure you would like to delete your installed application <strong>{deploymentConfiguration.application}</strong>,
							named <strong>{deploymentConfiguration.meta.title}</strong>?</p>
						<RaisedButton label="Delete your deployment" secondary={true} onMouseUp={this._actDelete} />
						<p></p>
					</div>
				</Tab>

      </Tabs>
		);
	}
}

DeploymentEditor.contextTypes = {
    router: function() { return React.PropTypes.func.isRequired }
}

// console.log("ReactPropTypes", ReactPropTypes);
// Install.propTypes = {
//     app: ReactPropTypes.object
// };

export default DeploymentEditor;
