import React, {Component} from 'react';
import {Card, CardTitle, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import ActionDelete from 'material-ui/svg-icons/action/delete-forever';
import RaisedButton from 'material-ui/RaisedButton';
import API from '../utils/API'

class DeploymentItem extends Component {
  constructor(props, context) {
    super(props, context);

    this._actDelete = this._actDelete.bind(this);
    this._actConfigure = this._actConfigure.bind(this);

    this.state = null;
  }

  _actDelete(event, value) {
    API.deploymentDelete(this.props.deployment.id, this.props.token)
  }

  _actConfigure(event, value) {

    const path = "/deployments/" + this.props.deployment.id
    this.context.router.push(path)

  }

  render() {

    const style = {
      margin: 12,
    }

    var deployment = this.props.deployment
    var app = deployment.getApplication()
    var imageElement = null
    var url = deployment.getURL()
    var deploymentName = deployment.infrastructure

    if (app && app.thumbnail) {
      imageElement = (
        <CardMedia
        overlay={<CardTitle title={app.title} />}
        >
          <img src={app.thumbnail} />
        </CardMedia>
      );
    }

    var title = deployment.meta.title + ' (' + deployment.infrastructure + ')'

    if (app === null) {
      return (
        <Card>
          <CardHeader
            title={title}
            subtitle={deployment.meta.title}
            actAsExpander={true}
            showExpandableButton={true}
          />
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader
          title={title}
          subtitle={app.title}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          {imageElement}
          <p>Deployment ID <tt>{deployment.id}</tt> running on {deploymentName}</p>
          <p><a target="_blank" href={url}>{url}</a></p>
          <p>{app.descr}</p>
          <p>Price: {app.price} kr / mnd</p>
        </CardText>
        <CardActions expandable={true}>
          <RaisedButton label="Configure" primary={true} style={style} onMouseUp={this._actConfigure} />
          <RaisedButton label="Remove" secondary={true} style={style} onMouseUp={this._actDelete}
            icon={<ActionDelete  />}
            onMouseUp={this._actDelete}
            />
        </CardActions>
      </Card>
    );
  }

}

DeploymentItem.contextTypes = {
    router: function() { return React.PropTypes.func.isRequired }
}

export default DeploymentItem;
