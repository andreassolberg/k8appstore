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

import DeploymentConfiguration from './DeploymentConfiguration.react'
import API from '../utils/API'


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
		this.state = {
			"tabValue": "status"
		}
    this.dconfigurator = null

    this._actSaveChanges = this._actSaveChanges.bind(this)
		this._tabChange = this._tabChange.bind(this)
		this._onChange = this._onChange.bind(this)
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
		if (deploymentConfig.services && deploymentConfig.services.dataporten) {
			deploymentConfig.services.dataporten = {
	      "token": usercontext.token.access_token
	    }
		}

    console.error("UPDATE IS", JSON.stringify(deploymentConfig, undefined, 2))

		API.update(deploymentConfig)
      .then((deployment) => {

        console.log("YAY1 updated!", deployment)
        // const path = "/deployments/" + deployment.id
        // this.context.router.push(path)
        console.log("YAY2")
      })
      .catch((err) => {
        console.error("Error deploying app", err)
        // alert("Error deploying application...")
      })


	}

	_actReset() {
    // AppEngineCreators.installCancel()
    console.error("RESET!")
	}

	_tabChange(value) {
		if (typeof value === 'string') {
			console.log("tab change!", value)
			this.setState({
				"tabValue": value
			})
		}
	}

	render() {

    // console.error("We are rendering Install component", this.props.app )


		var deploymentConfiguration = AppEngineStore.get(this.props.params.deployment)

    console.log("this.props.params.deployment", this.props.params.deployment, deploymentConfiguration)
		console.log("STATE", JSON.stringify(this.state, undefined, 3))

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
				<div>
					<p>
						This is another example of a controllable tab. Remember, if you
						use controllable Tabs, you need to give all of your tabs values or else
						you wont be able to select them.
					</p>
				</div>
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

      </Tabs>
		);
	}
}
// console.log("ReactPropTypes", ReactPropTypes);
// Install.propTypes = {
//     app: ReactPropTypes.object
// };

export default DeploymentEditor;
