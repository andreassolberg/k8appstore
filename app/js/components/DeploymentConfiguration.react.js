import React, {Component, ReactPropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// import DeploymentOptionsStore from '../stores/DeploymentOptionsStore'
import AppLibraryStore from '../stores/AppLibraryStore'
import AppEngineCreators from '../actions/AppEngineCreators'
import UserContextStore from '../stores/UserContextStore'


// function getStateFromStores(application) {
//   console.log("Get application ", application)
//   return {
//     options: DeploymentOptionsStore.getOptions(),
// 		data: DeploymentOptionsStore.getData()
//   }
// }



var _infraOptions = {
	"ipnett": {
		"title": "IPnett",
		"descr": ""
	},
	"uhintern": {
		"title": "UH-intern IaaS",
		"descr": ""
	},
	"sigma": {
		"title": "Sigma sky",
		"descr": ""
	},
	"gke": {
		"title": "Google Cloud",
		"descr": ""
	}
}

const _domains = ["apps.uninett-labs.no", "uhapps.no", "apps.sigma.no"]

const _sizes =  {
	"tiny": {
		"title": "Tiny (.2 core, 128M)"
	},
	"small": {
		"title": "Small (.5 core, 128M)"
	},
	"medium": {
		"title": "Medium (2x .5 core, 128M)"
	},
	"large": {
		"title": "Large (3x .5 core, 256M)"
	},
	"xlarge": {
		"title": "X-Large (3x 1 core, 256M)"
	}
}

var _data = {
	"app": null,
	"infrastructure": "gke",
	"domain": "apps.uninett-labs.no",
	"size": "small"
};


function getStateFromProps(props) {

}



class DeploymentConfiguration extends Component {

	constructor(props, context) {
		super(props, context)

		this.state = this._getInitialState()

		// this._actInstallStart = this._actInstallStart.bind(this)
		// this._actCancel = this._actCancel.bind(this)

		this._onChangeInfra = this._onChangeInfra.bind(this)
		this._onChangeSize = this._onChangeSize.bind(this)
		this._onChangeDomain = this._onChangeDomain.bind(this)

    this._onChangeTitle = this._onChangeTitle.bind(this)
    this._onChangeHostname = this._onChangeHostname.bind(this)
  }

  _getInitialState() {
    var state = {}

    state.application = this.props.deploymentConfiguration.application || null
    state.title = this.props.deploymentConfiguration.meta.title || ""

    state.size = this.props.deploymentConfiguration.size || "small"
    state.infrastructure = this.props.deploymentConfiguration.infrastructure || "gke"

    state.hostname = this.props.deploymentConfiguration.services.dns.hostname || ""
    state.domain = this.props.deploymentConfiguration.services.dns.domain || "apps.uninett-labs.no"
    return state
  }

  getUpdate() {

    var config = {};
		config.id = this.props.deploymentConfiguration.id
    config.application = this.props.deploymentConfiguration.application
    if (this.state.title !== this.props.deploymentConfiguration.meta.title) config.title = this.state.title

    if (this.state.size !== this.props.deploymentConfiguration.size) config.size = this.state.size
    if (this.state.infrastructure !== this.props.deploymentConfiguration.infrastructure) config.infrastructure = this.state.infrastructure

    if (this.state.hostname !== this.props.deploymentConfiguration.services.dns.hostname) config.services.dns.hostname = this.state.hostname
    if (this.state.domain !== this.props.deploymentConfiguration.services.dns.domain) config.services.dns.domain = this.state.domain

    return config

  }

  componentDidMount() {
    // this._scrollToBottom();
    // DeploymentOptionsStore.addChangeListener(this._onChange)
    AppLibraryStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    // DeploymentOptionsStore.removeChangeListener(this._onChange)
    AppLibraryStore.removeChangeListener(this._onChange)
  }

  _onChange() {
    // console.log("- changed.")
  }

	_onChangeInfra(event, value) {
		event.stopPropagation()
		this.state.infrastructure = event.target.value
		this.setState(this.state)
    // console.log("Change infra", JSON.stringify(this.state.data, undefined, 2))
	}
	_onChangeSize(event, value) {
		event.stopPropagation()
		this.state.size = event.target.value
		this.setState(this.state)
	}
	_onChangeDomain(event, index, value) {
		event.stopPropagation()
		// console.log("On change domain", event, index, value);
		this.state.domain = value
		this.setState(this.state)
	}

  _onChangeTitle(event, value) {
		event.stopPropagation()
    this.state.title = value
    this.setState(this.state)
  }

  _onChangeHostname(event, value) {
		event.stopPropagation()
    this.state.hostname = value
    this.setState(this.state)
  }

	// _actInstallStart() {
  //
  //   let usercontext = UserContextStore.getContext()
  //   console.log("User context is ", usercontext)
  //   if (!usercontext.authenticated) {
  //     throw new Error("Cannot deploy application when not authenticated")
  //   }
  //
  //   let app = AppLibraryStore.get(this.props.params.application)
  //   let deploymentConfig = {
  //     "application": app.application,
  //     "meta": {
  //       "title": this.state.data.title
  //     },
  //     "services": {
  //       "dns": {
  //         "hostname": this.state.data.hostname,
  //         "domain": this.state.data.domain
  //       },
  //       "dataporten": {
  //         "token": usercontext.token.access_token
  //       }
  //     },
  //     "infrastructure": this.state.data.infrastructure,
  //     "size": this.state.data.size,
  //     "admingroup": "fc:org:uninett.no"
  //   }
  //   console.error("About to install deployment", deploymentConfig)
  //   AppEngineCreators.installApp(deploymentConfig)
  //
	// }

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

    var deployment = this.props.deploymentConfiguration
		var app = AppLibraryStore.get(deployment.application)

    if (!app) {
      return (
        <div>Loading...</div>
      )
    }

		var appnameSuggestion = 'Andreas sin ' + app.title
		// console.log("App it is", app, this.state)

		var infraOptions = []
		for(let key in _infraOptions) {
			infraOptions.push(this.getIOption(key, _infraOptions[key]))
		}

		var sizeOptions = []
		for(let key in _sizes) {
			sizeOptions.push(this.getSizeOption(key, _sizes[key]))
		}

		var that = this;
		var domainOptions = _domains.map(function(x) {
			return that.getDomainOption(x)
		})

		// console.log("Render Install, state is", this.state);
    // console.log("Props", this.props)
    // console.log("State", this.state)


		return (
			<div className="content">
				<div className="">
					<form className="">

						<div className="section">
							<h2>Basic info</h2>

							<TextField
                value={this.state.title}
								fullWidth={true}
							  hintText={appnameSuggestion}
							  floatingLabelText="Title of this application instance"
                onChange={this._onChangeTitle}
							/>

							<TextField
							  floatingLabelText="Hostname"
                value={this.state.hostname}
                onChange={this._onChangeHostname}
							/>
							<SelectField value={this.state.domain} onChange={this._onChangeDomain}>
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
											<RadioButtonGroup name="infrastructureOption" defaultSelected={this.state.infrastructure} onChange={this._onChangeInfra}>
												{infraOptions}
											</RadioButtonGroup>

										</td>
										<td>
											<RadioButtonGroup name="sizeOption" defaultSelected={this.state.size} onChange={this._onChangeSize}>
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

					</form>
				</div>
			</div>
		);
	}
}



export default DeploymentConfiguration;
