import React, {Component, ReactPropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import DeploymentOptionsStore from '../stores/DeploymentOptionsStore';
import AppEngineCreators from '../actions/AppEngineCreators';


function getStateFromStores() {
  // console.log("Getting state from stores", DeploymentOptionsStore.getOptions());
  return {
    options: DeploymentOptionsStore.getOptions(),
		data: DeploymentOptionsStore.getData()
    // thread: ThreadStore.getCurrent()
  };
}

class Install extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = getStateFromStores();

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
    DeploymentOptionsStore.addChangeListener(this._onChange);
    // MessageStore.addChangeListener(this._onChange);
    // ThreadStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    DeploymentOptionsStore.removeChangeListener(this._onChange);
    // MessageStore.removeChangeListener(this._onChange);
    // ThreadStore.removeChangeListener(this._onChange);
  }


  /**
   * Event handler for 'change' events coming from the store
   */
  _onChange() {
		console.error("Not sure what to do. Updates on DeploymentOptionsStore..")
    console.log()
    // this.setState(getStateFromStores());
  }

	_onChangeInfra(event, value) {
		this.state.data.infrastructure = event.target.value
		this.setState(this.state)
    console.log("Change infra", JSON.stringify(this.state.data, undefined, 2))
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
    AppEngineCreators.installApp(this.state.data)
		console.log("Install _actInstallStart")
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
		var app = this.props.app

		var appnameSuggestion = 'Andreas sin ' + app.title
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

		console.log("Render Install, state is", this.state);


		return (
			<div className="content">
				<div className="">
					<form className="">

						<div className="section">
							<h2>Basic info</h2>

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
// console.log("ReactPropTypes", ReactPropTypes);
// Install.propTypes = {
//     app: ReactPropTypes.object
// };

export default Install;
