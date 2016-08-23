import React, {Component, ReactPropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import DeploymentOptionsStore from '../stores/DeploymentOptionsStore'
import AppLibraryStore from '../stores/AppLibraryStore'
import AppEngineCreators from '../actions/AppEngineCreators'
import UserContextStore from '../stores/UserContextStore'

import API from '../utils/API'

function getStateFromStores(application) {
  // console.log("Getting state from stores", DeploymentOptionsStore.getOptions());
  console.log("Get application ", application)
  return {
    options: DeploymentOptionsStore.getOptions(),
		data: DeploymentOptionsStore.getData()
    // thread: ThreadStore.getCurrent()
  };
}


class Install extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = getStateFromStores(this.props.params.application)

		this._actInstallStart = this._actInstallStart.bind(this);
		this._actCancel = this._actCancel.bind(this);

		this._onChange = this._onChange.bind(this);
		this._onChangeInfra = this._onChangeInfra.bind(this);
		this._onChangeSize = this._onChangeSize.bind(this);
		this._onChangeDomain = this._onChangeDomain.bind(this);

    this._onChangeTitle = this._onChangeTitle.bind(this);
    this._onChangeHostname = this._onChangeHostname.bind(this);
  }


  componentDidMount() {
    // this._scrollToBottom();
    DeploymentOptionsStore.addChangeListener(this._onChange)
    AppLibraryStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    DeploymentOptionsStore.removeChangeListener(this._onChange)
    AppLibraryStore.removeChangeListener(this._onChange)
  }


  /**
   * Event handler for 'change' events coming from the store
   */
  _onChange() {
		console.log("Not sure what to do. Updates on DeploymentOptionsStore..")
    console.log()
    // this.setState(getStateFromStores());
  }

	_onChangeInfra(event, value) {
		this.state.data.infrastructure = event.target.value
		this.setState(this.state)
    // console.log("Change infra", JSON.stringify(this.state.data, undefined, 2))
	}
	_onChangeSize(event, value) {
		this.state.data.size = event.target.value
		this.setState(this.state)
	}
	_onChangeDomain(event, index, value) {
		// console.log("On change domain", event, index, value);
		this.state.data.domain = value
		this.setState(this.state)
	}

  _onChangeTitle(event, value) {
    this.state.data.title = value
    this.setState(this.state)
  }

  _onChangeHostname(event, value) {
    this.state.data.hostname = value
    this.setState(this.state)
  }

	_actInstallStart() {

    let usercontext = UserContextStore.getContext()
    console.log("User context is ", usercontext)
    if (!usercontext.authenticated) {
      throw new Error("Cannot deploy application when not authenticated")
    }

    let app = AppLibraryStore.get(this.props.params.application)
    let deploymentConfig = {
      "application": app.application,
      "meta": {
        "title": this.state.data.title
      },
      "services": {
        "dns": {
          "hostname": this.state.data.hostname,
          "domain": this.state.data.domain
        },
        "dataporten": {
          "token": usercontext.token.access_token
        }
      },
      "infrastructure": this.state.data.infrastructure,
      "size": this.state.data.size,
      "admingroup": "fc:org:uninett.no"
    }
    console.error("About to install deployment", deploymentConfig)
    // AppEngineCreators.installApp(deploymentConfig)

    API.install(deploymentConfig)
      .then((deployment) => {

        console.log("YAY1", deployment)
        const path = "/deployments/" + deployment.id
        this.context.router.push(path)
        console.log("YAY2")
      })
      .catch((err) => {
        console.error("Error deploying app", err)
        // alert("Error deploying application...")
      })

	}

	_actCancel() {
    AppEngineCreators.installCancel()
	}

	getIOption(key, infra) {
		return (
			<RadioButton
				key={key}
				value={key}
				label={infra.title}
				/>
		);
	}

	getSizeOption(key, infra) {
		return (
			<RadioButton
				key={key}
				value={key}
				label={infra.title}
				/>
		);
	}

	getDomainOption(domain) {
		var td = "." + domain;
		return <MenuItem key={domain} value={domain} primaryText={td} />;
	}

	render() {

    // console.error("We are rendering Install component", this.props.app )

		var app = AppLibraryStore.get(this.props.params.application)

    if (!app) {
      return (
        <div>Loading...</div>
      )
    }

		var appnameSuggestion = 'Min ' + app.title
		// console.log("App it is", app, this.state)

		var infraOptions = []
		for(let key in this.state.options.infrastructure) {
			infraOptions.push(this.getIOption(key, this.state.options.infrastructure[key]))
		}

		var sizeOptions = []
		for(let key in this.state.options.sizes) {
			sizeOptions.push(this.getSizeOption(key, this.state.options.sizes[key]))
		}

		var that = this;
		var domainOptions = this.state.options.domains.map(function(x) {
			return that.getDomainOption(x)
		})

		// console.log("Render Install, state is", this.state);


		return (
			<div className="content">
				<div className="">
					<form className="">

						<div className="section">
              <h1>Installing new deployment of {app.title}</h1>


							<TextField
                value={this.state.data.title}
								fullWidth={true}
							  hintText={appnameSuggestion}
							  floatingLabelText="Title of this application instance"
                onChange={this._onChangeTitle}
							/>

							<TextField
							  floatingLabelText="Hostname"
                value={this.state.data.hostname}
                onChange={this._onChangeHostname}
							/>
							<SelectField value={this.state.data.domain} onChange={this._onChangeDomain}>
			          {domainOptions}
			        </SelectField>
						</div>

						<div className="section">

							<h2>Infrastructure</h2>
							<p>Choose on which Cloud infrastructure platform to deploy the application:</p>

							<table className="tableFullWidth">
								<tbody>
									<tr>
										<td>
											<RadioButtonGroup name="infrastructureOption" defaultSelected={this.state.data.infrastructure} onChange={this._onChangeInfra}>
												{infraOptions}
											</RadioButtonGroup>

										</td>
										<td>
											<RadioButtonGroup name="sizeOption" defaultSelected={this.state.data.size} onChange={this._onChangeSize}>
												{sizeOptions}
											</RadioButtonGroup>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div className="section">
							<h2>Authentication and access control</h2>
							<p></p>
						</div>

						<div className="section well">
							<h3>Pricing</h3>
							<p>199 kr / mnd</p>
						</div>

						<div>
								<RaisedButton label="Install" primary={true} onMouseUp={this._actInstallStart} />
			          <FlatButton label="Cancel" secondary={true} onMouseUp={this._actCancel} />
						</div>


					</form>
				</div>
			</div>
		);
	}
}

Install.contextTypes = {
    router: function() { return React.PropTypes.func.isRequired }
}

export default Install;
