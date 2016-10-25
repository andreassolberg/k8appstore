import React, {Component, ReactPropTypes} from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';

import assign from 'object-assign';

import DeploymentStatusStore from '../stores/DeploymentStatusStore'

import moment from 'moment'

var _data = {
};

class DeploymentConfiguration extends Component {

	constructor(props, context) {
		super(props, context)

		this.state = this._getInitialState()
		this._onChange = this._onChange.bind(this);
		// this._actInstallStart = this._actInstallStart.bind(this)
  }

  _getInitialState() {
    var state = {
			"status": {}
		}
    return state
  }


  getUpdate() {
    var config = {};
    return config
  }

  componentDidMount() {
    DeploymentStatusStore.addChangeListener(this._onChange)
		DeploymentStatusStore.start(this.props.deploymentConfiguration.id)
  }

  componentWillUnmount() {
    DeploymentStatusStore.removeChangeListener(this._onChange)
		DeploymentStatusStore.end()
  }

  _onChange() {
		this.setState({
			"status": DeploymentStatusStore.getStatus(this.props.deploymentConfiguration.id)
		})
  }

	getPhase(phase) {

		let style = {
			margin: "3px",
			backgroundColor: "#85CC63"
		}
		let styleOff = {
			margin: "3px"
		}
		if (phase === 'Running') {
			return (
				<Chip
          style={style}
        >
          {phase}
        </Chip>
			)
		}
		return (
			<Chip style={styleOff} >{phase}</Chip>
		)
	}

	getConditions(conditions) {

		let styleOff = {
			margin: "1px",
			display: 'inline-block',
			padding: "3px"
		}
		let style = assign({}, styleOff, {
			backgroundColor: "#85CC63",
		})
		let istyle = {
			fontSize: "10px",
		}

		return conditions.map((c) => {
			if (c.status === 'True') {
				return (
					<Paper style={style} zDepth={1}  >
						{c.type}
					</Paper>
				)
			}
			return (
				<Chip style={styleOff} >{c.type}</Chip>
			)
		})
	}

/*
<TableHeaderColumn>Phase</TableHeaderColumn>
<TableHeaderColumn>ID</TableHeaderColumn>
<TableHeaderColumn>Conditions</TableHeaderColumn>
<TableHeaderColumn>Started</TableHeaderColumn>
*/
	getTableRowPod(pod) {

		let phase = this.getPhase(pod.status.phase)
		let cond = this.getConditions(pod.status.conditions)
		let s1 = {

		}
		let s2 = {

		}
		let s3 = {

		}
		let s4 = {

		}
		let st = moment(pod.status.startTime)
		console.log("TIME", pod.status.startTime, st.fromNow())

		return (
			<TableRow>
				<TableRowColumn style={s1}>{phase}</TableRowColumn>
				<TableRowColumn style={s2}>{pod.metadata.name}</TableRowColumn>
				<TableRowColumn style={s3}>{cond}</TableRowColumn>
				<TableRowColumn style={s4}>{st.fromNow()}</TableRowColumn>
			</TableRow>
		)

	}


	render() {
		// console.log("STAtUS", this.state)

		var url = this.props.deploymentConfiguration.getURL()
		var ds = null
		let styleX = {
			height: 100,
		  width: 100,
		  margin: 20,
		  textAlign: 'center',
		  display: 'inline-block',
			"backgroundColor": "#4C991D",
			paddingTop: "30px"
		}
		let styleH = {
			"marginTop": "30px",
			"fontSize": "35pt"
		}
		let style2 = assign({}, styleX, {
			"backgroundColor": "#8BCC64"
		})
		let style3 = assign({}, styleX, {
			"backgroundColor": "#FFFD96"
		})
		let style4 = assign({}, styleX, {
			"backgroundColor": "#96D0F7"
		})

		if(this.state.status.deployment) {
			ds = (
			  <div>
					<Paper style={styleX} zDepth={2} circle={true} >
						<span style={styleH}>{this.state.status.deployment.status.availableReplicas}</span><br />
						<span>Available</span>
					</Paper>
					<Paper style={style2} zDepth={2} circle={true} >
						<span style={styleH}>{this.state.status.deployment.status.updatedReplicas}</span><br />
						<span>Updated</span>
					</Paper>
			    <Paper style={style3} zDepth={2} circle={true} >
						<span style={styleH}>{this.state.status.deployment.status.replicas}</span><br />
						<span>Replicas</span>
					</Paper>
					<Paper style={style4} zDepth={2} circle={true} >
						<span style={styleH}>{this.state.status.deployment.status.observedGeneration}</span><br />
						<span>Generation</span>
					</Paper>
			  </div>
			)
		}


		let ps = null

		if(this.state.status.pods) {

			let rows = this.state.status.pods.map((pod) => {
				return this.getTableRowPod(pod)
			})

			ps = (
				<Table selectable={false}>
			    <TableHeader
						displaySelectAll={false}
						adjustForCheckbox={false}
					>
			      <TableRow>
			        <TableHeaderColumn>Status</TableHeaderColumn>
			        <TableHeaderColumn>ID</TableHeaderColumn>
							<TableHeaderColumn>Conditions</TableHeaderColumn>
			        <TableHeaderColumn>Started</TableHeaderColumn>
			      </TableRow>
			    </TableHeader>
			    <TableBody
					displayRowCheckbox={false}
					>
						{rows}
			    </TableBody>
			  </Table>
			)


		}




		return (
			<div className="content">
				<div className="">
					<h1>{this.props.deploymentConfiguration.meta.title}</h1>
					<h3>{this.props.deploymentConfiguration.application}</h3>

					<p><a target="_blank" href={url}>{url}</a></p>

					{ds}
					{ps}

				</div>
			</div>
		);
	}
}



export default DeploymentConfiguration;
